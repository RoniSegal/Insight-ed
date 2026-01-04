import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient, User, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly jwtService: JwtService
  ) {}

  /**
   * Register new user with email/password
   */
  async register(registerDto: RegisterDto): Promise<{ user: Partial<User>; message: string }> {
    const { email, password, firstName, lastName, phone, schoolCode, role } = registerDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password (12 rounds as per architecture)
    const passwordHash = await bcrypt.hash(password, 12);

    // Determine school (simplified - would need school lookup logic)
    const schoolId = await this.determineSchoolFromCode(schoolCode);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        phone,
        role: role || UserRole.TEACHER,
        schoolId,
        authProvider: 'EMAIL',
        emailVerified: false, // Requires email verification
        isActive: true,
      },
    });

    // TODO: Send verification email

    // Log audit event
    await this.logAuthEvent(user.id, 'USER_REGISTERED', { email, role: user.role });

    return {
      user: this.sanitizeUser(user),
      message: 'Registration successful. Please check your email to verify your account.',
    };
  }

  /**
   * Login with email/password
   */
  async login(
    loginDto: LoginDto
  ): Promise<{ accessToken: string; refreshToken: string; user: Partial<User> }> {
    const { email, password } = loginDto;

    // Check failed login attempts (account lockout)
    await this.checkAccountLockout(email);

    // Find user
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !user.passwordHash) {
      await this.recordFailedLoginAttempt(email);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      await this.recordFailedLoginAttempt(email);
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if account is active
    if (!user.isActive) {
      throw new UnauthorizedException('Account has been deactivated');
    }

    // Check if email is verified
    if (!user.emailVerified) {
      throw new UnauthorizedException('Please verify your email before logging in');
    }

    // Clear failed login attempts
    await this.clearFailedLoginAttempts(email);

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Generate JWT tokens
    const accessToken = this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);

    // Log successful login
    await this.logAuthEvent(user.id, 'USER_LOGIN', { email, authMethod: 'email' });

    return {
      accessToken,
      refreshToken,
      user: this.sanitizeUser(user),
    };
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      // Verify refresh token
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      // Find user
      const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });

      if (!user || !user.isActive) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Generate new access token
      const accessToken = this.generateAccessToken(user);

      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  /**
   * Logout - blacklist tokens (future: use Redis)
   */
  async logout(userId: string): Promise<{ message: string }> {
    // TODO: Blacklist tokens in Redis
    // For now, client-side token removal is sufficient

    // Log logout event
    await this.logAuthEvent(userId, 'USER_LOGOUT', {});

    return { message: 'Logged out successfully' };
  }

  /**
   * Forgot password - send reset email
   */
  async forgotPassword(email: string): Promise<{ message: string }> {
    // Always return success to prevent email enumeration
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (user) {
      // Generate secure reset token
      const resetToken = this.generateSecureToken();
      const tokenHash = await bcrypt.hash(resetToken, 10);

      // Store token in database (1-hour expiration)
      await this.prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        },
      });

      // TODO: Send password reset email with token

      // Log event
      await this.logAuthEvent(user.id, 'PASSWORD_RESET_REQUESTED', { email });
    }

    return {
      message: 'If an account with that email exists, a password reset link has been sent.',
    };
  }

  /**
   * Reset password using token
   */
  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    // Find valid, unused token
    const resetTokens = await this.prisma.passwordResetToken.findMany({
      where: {
        usedAt: null,
        expiresAt: { gte: new Date() },
      },
      include: { user: true },
    });

    // Verify token hash
    let validToken = null;
    for (const tokenRecord of resetTokens) {
      const isValid = await bcrypt.compare(token, tokenRecord.tokenHash);
      if (isValid) {
        validToken = tokenRecord;
        break;
      }
    }

    if (!validToken) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 12);

    // Update user password
    await this.prisma.user.update({
      where: { id: validToken.userId },
      data: { passwordHash },
    });

    // Mark token as used
    await this.prisma.passwordResetToken.update({
      where: { id: validToken.id },
      data: { usedAt: new Date() },
    });

    // TODO: Invalidate all existing sessions/refresh tokens

    // Log event
    await this.logAuthEvent(validToken.userId, 'PASSWORD_RESET_COMPLETED', {});

    return { message: 'Password reset successful. You can now login with your new password.' };
  }

  /**
   * Handle OAuth login (Google/Microsoft)
   */
  async handleOAuthLogin(profile: any, provider: 'GOOGLE' | 'MICROSOFT'): Promise<User> {
    const email = profile.emails[0].value;
    const firstName = profile.name?.givenName || profile.displayName;
    const lastName = profile.name?.familyName || '';
    const avatar = profile.photos?.[0]?.value;
    const providerId = profile.id;

    // Find or create user
    let user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Create new user via SSO
      const schoolId = await this.determineSchoolFromEmail(email);

      user = await this.prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          avatar,
          authProvider: provider,
          providerId,
          role: UserRole.TEACHER, // Default role
          emailVerified: true, // OAuth emails are pre-verified
          schoolId,
          isActive: true,
        },
      });

      await this.logAuthEvent(user.id, 'USER_REGISTERED_SSO', { provider, email });
    } else if (!user.providerId) {
      // Link SSO to existing email/password account
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          providerId,
          authProvider: provider,
          emailVerified: true,
        },
      });
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    await this.logAuthEvent(user.id, 'USER_LOGIN_SSO', { provider, email });

    return user;
  }

  /**
   * Generate JWT access token (15-min expiration)
   */
  private generateAccessToken(user: User): string {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      schoolId: user.schoolId,
    };

    return this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });
  }

  /**
   * Generate JWT refresh token (7-day expiration)
   */
  private async generateRefreshToken(user: User): Promise<string> {
    const payload = {
      sub: user.id,
      type: 'refresh',
    };

    return this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });
  }

  /**
   * Generate cryptographically secure token
   */
  private generateSecureToken(): string {
    return require('crypto').randomBytes(32).toString('hex');
  }

  /**
   * Determine school from email domain
   */
  private async determineSchoolFromEmail(_email: string): Promise<string> {
    // TODO: Implement school lookup by email domain
    // For now, return a default school
    const defaultSchool = await this.prisma.school.findFirst();
    if (!defaultSchool) {
      throw new BadRequestException('No school found. Please contact administrator.');
    }
    return defaultSchool.id;
  }

  /**
   * Determine school from school code
   */
  private async determineSchoolFromCode(code?: string): Promise<string> {
    if (!code) {
      return this.determineSchoolFromEmail('default@example.com');
    }

    const school = await this.prisma.school.findUnique({ where: { code } });
    if (!school) {
      throw new BadRequestException('Invalid school code');
    }

    return school.id;
  }

  /**
   * Check account lockout (5 failed attempts)
   */
  private async checkAccountLockout(_email: string): Promise<void> {
    // TODO: Implement Redis-based rate limiting
    // For MVP, this would be implemented with Redis counters
    // Key: `login_attempts:${email}`
    // Increment on failed login, expire in 15 minutes
    // Lock account if > 5 attempts
  }

  /**
   * Record failed login attempt
   */
  private async recordFailedLoginAttempt(email: string): Promise<void> {
    // TODO: Implement with Redis
    await this.logAuthEvent(null, 'FAILED_LOGIN_ATTEMPT', { email });
  }

  /**
   * Clear failed login attempts
   */
  private async clearFailedLoginAttempts(_email: string): Promise<void> {
    // TODO: Implement with Redis
    // Delete key: `login_attempts:${email}`
  }

  /**
   * Log authentication event to audit log
   */
  private async logAuthEvent(userId: string | null, action: string, details: any): Promise<void> {
    // Map auth actions to AuditAction enum values
    const actionMap: Record<string, string> = {
      USER_REGISTERED: 'CREATE',
      USER_REGISTERED_SSO: 'CREATE',
      USER_LOGIN: 'LOGIN',
      USER_LOGIN_SSO: 'LOGIN',
      USER_LOGOUT: 'LOGOUT',
      FAILED_LOGIN_ATTEMPT: 'READ',
      PASSWORD_RESET_REQUESTED: 'UPDATE',
      PASSWORD_RESET_COMPLETED: 'UPDATE',
    };

    const auditAction = actionMap[action] || 'READ';

    await this.prisma.auditLog.create({
      data: {
        userId,
        action: auditAction as any,
        resource: 'User',
        resourceId: userId,
        metadata: { ...details, originalAction: action },
      },
    });
  }

  /**
   * Remove sensitive fields from user object
   */
  private sanitizeUser(user: User): Partial<User> {
    const { passwordHash: _passwordHash, providerId: _providerId, ...safeUser } = user;
    return safeUser;
  }
}
