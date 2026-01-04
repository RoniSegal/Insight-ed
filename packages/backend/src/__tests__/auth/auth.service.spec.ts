import { UserRole } from '@growth-engine/shared';
import {
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

import { AuthService } from '../../auth/auth.service';
import { LoginDto } from '../../auth/dto/login.dto';
import { RegisterDto } from '../../auth/dto/register.dto';
import { createMockPrismaClient, MockPrismaClient } from '../mocks/prisma.mock';

// Mock bcrypt
jest.mock('bcrypt');

// Mock crypto
jest.mock('crypto', () => {
  const actualCrypto = jest.requireActual('crypto');
  return {
    ...actualCrypto,
    randomBytes: jest.fn().mockReturnValue({
      toString: jest.fn().mockReturnValue('mock-secure-token-123456789'),
    }),
  };
});

describe('AuthService', () => {
  let service: AuthService;
  let prisma: MockPrismaClient;
  let jwtService: JwtService;

  const originalEnv = process.env;

  beforeAll(() => {
    process.env = {
      ...originalEnv,
      JWT_ACCESS_SECRET: 'test-access-secret',
      JWT_REFRESH_SECRET: 'test-refresh-secret',
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  beforeEach(async () => {
    prisma = createMockPrismaClient();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaClient,
          useValue: prisma,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const registerDto: RegisterDto = {
      email: 'test@example.com',
      password: 'Test@1234',
      firstName: 'John',
      lastName: 'Doe',
      phone: '1234567890',
      schoolCode: 'SCHOOL1',
      role: UserRole.TEACHER,
    };

    it('should successfully register a new user', async () => {
      const mockSchool = {
        id: 'school-123',
        name: 'Test School',
        code: 'SCHOOL1',
      };

      const mockUser = {
        id: 'user-123',
        email: registerDto.email,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        phone: registerDto.phone,
        role: UserRole.TEACHER,
        schoolId: mockSchool.id,
        passwordHash: 'hashed-password',
        authProvider: 'EMAIL',
        emailVerified: false,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prisma.user.findUnique.mockResolvedValue(null);
      prisma.school.findUnique.mockResolvedValue(mockSchool as any);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
      prisma.user.create.mockResolvedValue(mockUser as any);
      prisma.auditLog.create.mockResolvedValue({} as any);

      const result = await service.register(registerDto);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 12);
      expect(prisma.school.findUnique).toHaveBeenCalledWith({
        where: { code: registerDto.schoolCode },
      });
      expect(prisma.user.create).toHaveBeenCalled();
      expect(prisma.auditLog.create).toHaveBeenCalled();

      expect(result).toEqual({
        user: expect.not.objectContaining({
          passwordHash: expect.anything(),
          providerId: expect.anything(),
        }),
        message: 'Registration successful. Please check your email to verify your account.',
      });
    });

    it('should throw ConflictException if user already exists', async () => {
      const existingUser = {
        id: 'user-123',
        email: registerDto.email,
      };

      prisma.user.findUnique.mockResolvedValue(existingUser as any);

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
      await expect(service.register(registerDto)).rejects.toThrow(
        'User with this email already exists'
      );
    });

    it('should throw BadRequestException if school code is invalid', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.school.findUnique.mockResolvedValue(null);

      await expect(service.register(registerDto)).rejects.toThrow(BadRequestException);
      await expect(service.register(registerDto)).rejects.toThrow('Invalid school code');
    });

    it('should use default school when no school code provided', async () => {
      const registerDtoNoSchool = { ...registerDto, schoolCode: undefined };
      const mockSchool = {
        id: 'school-default',
        name: 'Default School',
      };

      const mockUser = {
        id: 'user-123',
        email: registerDto.email,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        role: UserRole.TEACHER,
        schoolId: mockSchool.id,
        passwordHash: 'hashed-password',
        authProvider: 'EMAIL',
        emailVerified: false,
        isActive: true,
      };

      prisma.user.findUnique.mockResolvedValue(null);
      prisma.school.findFirst.mockResolvedValue(mockSchool as any);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
      prisma.user.create.mockResolvedValue(mockUser as any);
      prisma.auditLog.create.mockResolvedValue({} as any);

      const result = await service.register(registerDtoNoSchool);

      expect(prisma.school.findFirst).toHaveBeenCalled();
      expect(result.user).toBeDefined();
    });

    it('should throw BadRequestException if no default school exists', async () => {
      const registerDtoNoSchool = { ...registerDto, schoolCode: undefined };

      prisma.user.findUnique.mockResolvedValue(null);
      prisma.school.findFirst.mockResolvedValue(null);

      await expect(service.register(registerDtoNoSchool)).rejects.toThrow(BadRequestException);
      await expect(service.register(registerDtoNoSchool)).rejects.toThrow(
        'No school found. Please contact administrator.'
      );
    });

    it('should default to TEACHER role if not specified', async () => {
      const registerDtoNoRole = { ...registerDto, role: undefined };
      const mockSchool = { id: 'school-123', code: 'SCHOOL1' };
      const mockUser = {
        id: 'user-123',
        email: registerDto.email,
        role: UserRole.TEACHER,
        schoolId: mockSchool.id,
        passwordHash: 'hashed-password',
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        authProvider: 'EMAIL',
        emailVerified: false,
        isActive: true,
      };

      prisma.user.findUnique.mockResolvedValue(null);
      prisma.school.findUnique.mockResolvedValue(mockSchool as any);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
      prisma.user.create.mockResolvedValue(mockUser as any);
      prisma.auditLog.create.mockResolvedValue({} as any);

      await service.register(registerDtoNoRole);

      expect(prisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            role: UserRole.TEACHER,
          }),
        })
      );
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'Test@1234',
    };

    const mockUser = {
      id: 'user-123',
      email: loginDto.email,
      passwordHash: 'hashed-password',
      firstName: 'John',
      lastName: 'Doe',
      role: UserRole.TEACHER,
      schoolId: 'school-123',
      isActive: true,
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should successfully login with valid credentials', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      prisma.user.update.mockResolvedValue(mockUser as any);
      prisma.auditLog.create.mockResolvedValue({} as any);
      (jwtService.sign as jest.Mock).mockReturnValue('mock-token');

      const result = await service.login(loginDto);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(loginDto.password, mockUser.passwordHash);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: { lastLoginAt: expect.any(Date) },
      });

      expect(result).toEqual({
        accessToken: 'mock-token',
        refreshToken: 'mock-token',
        user: expect.not.objectContaining({
          passwordHash: expect.anything(),
        }),
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.auditLog.create.mockResolvedValue({} as any);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      await expect(service.login(loginDto)).rejects.toThrow('Invalid credentials');
      expect(prisma.auditLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            metadata: expect.objectContaining({
              originalAction: 'FAILED_LOGIN_ATTEMPT',
            }),
          }),
        })
      );
    });

    it('should throw UnauthorizedException if user has no password hash', async () => {
      const userNoPassword = { ...mockUser, passwordHash: null };
      prisma.user.findUnique.mockResolvedValue(userNoPassword as any);
      prisma.auditLog.create.mockResolvedValue({} as any);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      await expect(service.login(loginDto)).rejects.toThrow('Invalid credentials');
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      prisma.user.findUnique.mockResolvedValue(mockUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      prisma.auditLog.create.mockResolvedValue({} as any);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      await expect(service.login(loginDto)).rejects.toThrow('Invalid credentials');
    });

    it('should throw UnauthorizedException if account is inactive', async () => {
      const inactiveUser = { ...mockUser, isActive: false };
      prisma.user.findUnique.mockResolvedValue(inactiveUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      await expect(service.login(loginDto)).rejects.toThrow('Account has been deactivated');
    });

    it('should throw UnauthorizedException if email is not verified', async () => {
      const unverifiedUser = { ...mockUser, emailVerified: false };
      prisma.user.findUnique.mockResolvedValue(unverifiedUser as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      await expect(service.login(loginDto)).rejects.toThrow(
        'Please verify your email before logging in'
      );
    });
  });

  describe('refreshAccessToken', () => {
    it('should return new access token for valid refresh token', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        role: UserRole.TEACHER,
        schoolId: 'school-123',
        isActive: true,
      };

      const verifyMock = (jwtService.verify as jest.Mock).mockReturnValue({ sub: 'user-123' });
      prisma.user.findUnique.mockResolvedValue(mockUser as any);
      (jwtService.sign as jest.Mock).mockReturnValue('new-access-token');

      const result = await service.refreshAccessToken('valid-refresh-token');

      expect(verifyMock).toHaveBeenCalledWith('valid-refresh-token', {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-123' },
      });
      expect(result).toEqual({
        accessToken: 'new-access-token',
      });
    });

    it('should throw UnauthorizedException if token verification fails', async () => {
      (jwtService.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(service.refreshAccessToken('invalid-token')).rejects.toThrow(
        UnauthorizedException
      );
      await expect(service.refreshAccessToken('invalid-token')).rejects.toThrow(
        'Invalid or expired refresh token'
      );
    });

    it('should throw UnauthorizedException if user not found', async () => {
      (jwtService.verify as jest.Mock).mockReturnValue({ sub: 'user-123' });
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.refreshAccessToken('valid-token')).rejects.toThrow(
        UnauthorizedException
      );
    });

    it('should throw UnauthorizedException if user is inactive', async () => {
      const inactiveUser = {
        id: 'user-123',
        isActive: false,
      };

      (jwtService.verify as jest.Mock).mockReturnValue({ sub: 'user-123' });
      prisma.user.findUnique.mockResolvedValue(inactiveUser as any);

      await expect(service.refreshAccessToken('valid-token')).rejects.toThrow(
        UnauthorizedException
      );
    });
  });

  describe('logout', () => {
    it('should successfully logout user', async () => {
      prisma.auditLog.create.mockResolvedValue({} as any);

      const result = await service.logout('user-123');

      expect(prisma.auditLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: 'user-123',
            metadata: expect.objectContaining({
              originalAction: 'USER_LOGOUT',
            }),
          }),
        })
      );
      expect(result).toEqual({
        message: 'Logged out successfully',
      });
    });
  });

  describe('forgotPassword', () => {
    it('should create reset token and return success message when user exists', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
      };

      prisma.user.findUnique.mockResolvedValue(mockUser as any);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-token');
      prisma.passwordResetToken.create.mockResolvedValue({} as any);
      prisma.auditLog.create.mockResolvedValue({} as any);

      const result = await service.forgotPassword('test@example.com');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(bcrypt.hash).toHaveBeenCalled();
      expect(prisma.passwordResetToken.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: mockUser.id,
            tokenHash: 'hashed-token',
            expiresAt: expect.any(Date),
          }),
        })
      );
      expect(result).toEqual({
        message: 'If an account with that email exists, a password reset link has been sent.',
      });
    });

    it('should return success message even when user does not exist (prevent enumeration)', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      const result = await service.forgotPassword('nonexistent@example.com');

      expect(result).toEqual({
        message: 'If an account with that email exists, a password reset link has been sent.',
      });
      expect(prisma.passwordResetToken.create).not.toHaveBeenCalled();
    });
  });

  describe('resetPassword', () => {
    it('should successfully reset password with valid token', async () => {
      const mockTokenRecord = {
        id: 'token-123',
        userId: 'user-123',
        tokenHash: 'hashed-token',
        usedAt: null,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        user: {
          id: 'user-123',
          email: 'test@example.com',
        },
      };

      prisma.passwordResetToken.findMany.mockResolvedValue([mockTokenRecord] as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('new-hashed-password');
      prisma.user.update.mockResolvedValue({} as any);
      prisma.passwordResetToken.update.mockResolvedValue({} as any);
      prisma.auditLog.create.mockResolvedValue({} as any);

      const result = await service.resetPassword('valid-token', 'NewPass@123');

      expect(prisma.passwordResetToken.findMany).toHaveBeenCalledWith({
        where: {
          usedAt: null,
          expiresAt: { gte: expect.any(Date) },
        },
        include: { user: true },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith('valid-token', 'hashed-token');
      expect(bcrypt.hash).toHaveBeenCalledWith('NewPass@123', 12);
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        data: { passwordHash: 'new-hashed-password' },
      });
      expect(prisma.passwordResetToken.update).toHaveBeenCalledWith({
        where: { id: 'token-123' },
        data: { usedAt: expect.any(Date) },
      });
      expect(result).toEqual({
        message: 'Password reset successful. You can now login with your new password.',
      });
    });

    it('should throw BadRequestException if no valid token found', async () => {
      prisma.passwordResetToken.findMany.mockResolvedValue([]);

      await expect(service.resetPassword('invalid-token', 'NewPass@123')).rejects.toThrow(
        BadRequestException
      );
      await expect(service.resetPassword('invalid-token', 'NewPass@123')).rejects.toThrow(
        'Invalid or expired reset token'
      );
    });

    it('should throw BadRequestException if token hash does not match', async () => {
      const mockTokenRecord = {
        id: 'token-123',
        userId: 'user-123',
        tokenHash: 'hashed-token',
        usedAt: null,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        user: {
          id: 'user-123',
          email: 'test@example.com',
        },
      };

      prisma.passwordResetToken.findMany.mockResolvedValue([mockTokenRecord] as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.resetPassword('wrong-token', 'NewPass@123')).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe('handleOAuthLogin', () => {
    const mockProfile = {
      id: 'google-123',
      emails: [{ value: 'test@example.com' }],
      name: {
        givenName: 'John',
        familyName: 'Doe',
      },
      displayName: 'John Doe',
      photos: [{ value: 'https://avatar.url' }],
    };

    it('should create new user for first-time OAuth login', async () => {
      const mockSchool = {
        id: 'school-123',
        name: 'Test School',
      };

      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        avatar: 'https://avatar.url',
        authProvider: 'GOOGLE',
        providerId: 'google-123',
        role: UserRole.TEACHER,
        emailVerified: true,
        schoolId: 'school-123',
        isActive: true,
      };

      prisma.user.findUnique.mockResolvedValue(null);
      prisma.school.findFirst.mockResolvedValue(mockSchool as any);
      prisma.user.create.mockResolvedValue(mockUser as any);
      prisma.user.update.mockResolvedValue(mockUser as any);
      prisma.auditLog.create.mockResolvedValue({} as any);

      const result = await service.handleOAuthLogin(mockProfile, 'GOOGLE');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(prisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            email: 'test@example.com',
            firstName: 'John',
            lastName: 'Doe',
            avatar: 'https://avatar.url',
            authProvider: 'GOOGLE',
            providerId: 'google-123',
            emailVerified: true,
          }),
        })
      );
      expect(result).toEqual(mockUser);
    });

    it('should link OAuth to existing email/password account', async () => {
      const existingUser = {
        id: 'user-123',
        email: 'test@example.com',
        providerId: null,
        authProvider: 'EMAIL',
      };

      const updatedUser = {
        ...existingUser,
        providerId: 'google-123',
        authProvider: 'GOOGLE',
        emailVerified: true,
      };

      prisma.user.findUnique.mockResolvedValue(existingUser as any);
      prisma.user.update
        .mockResolvedValueOnce(updatedUser as any)
        .mockResolvedValueOnce(updatedUser as any);
      prisma.auditLog.create.mockResolvedValue({} as any);

      const result = await service.handleOAuthLogin(mockProfile, 'GOOGLE');

      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'user-123' },
          data: expect.objectContaining({
            providerId: 'google-123',
            authProvider: 'GOOGLE',
            emailVerified: true,
          }),
        })
      );
      expect(result.providerId).toBe('google-123');
    });

    it('should update last login for returning OAuth user', async () => {
      const existingOAuthUser = {
        id: 'user-123',
        email: 'test@example.com',
        providerId: 'google-123',
        authProvider: 'GOOGLE',
      };

      prisma.user.findUnique.mockResolvedValue(existingOAuthUser as any);
      prisma.user.update.mockResolvedValue(existingOAuthUser as any);
      prisma.auditLog.create.mockResolvedValue({} as any);

      await service.handleOAuthLogin(mockProfile, 'GOOGLE');

      expect(prisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'user-123' },
          data: expect.objectContaining({
            lastLoginAt: expect.any(Date),
          }),
        })
      );
    });

    it('should handle profile with displayName only', async () => {
      const profileWithDisplayName = {
        id: 'google-123',
        emails: [{ value: 'test@example.com' }],
        displayName: 'John Doe',
        photos: [{ value: 'https://avatar.url' }],
      };

      const mockSchool = { id: 'school-123' };
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        firstName: 'John Doe',
        lastName: '',
      };

      prisma.user.findUnique.mockResolvedValue(null);
      prisma.school.findFirst.mockResolvedValue(mockSchool as any);
      prisma.user.create.mockResolvedValue(mockUser as any);
      prisma.user.update.mockResolvedValue(mockUser as any);
      prisma.auditLog.create.mockResolvedValue({} as any);

      await service.handleOAuthLogin(profileWithDisplayName, 'GOOGLE');

      expect(prisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            firstName: 'John Doe',
            lastName: '',
          }),
        })
      );
    });

    it('should work with MICROSOFT provider', async () => {
      const mockSchool = { id: 'school-123' };
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        authProvider: 'MICROSOFT',
      };

      prisma.user.findUnique.mockResolvedValue(null);
      prisma.school.findFirst.mockResolvedValue(mockSchool as any);
      prisma.user.create.mockResolvedValue(mockUser as any);
      prisma.user.update.mockResolvedValue(mockUser as any);
      prisma.auditLog.create.mockResolvedValue({} as any);

      await service.handleOAuthLogin(mockProfile, 'MICROSOFT');

      expect(prisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            authProvider: 'MICROSOFT',
          }),
        })
      );
    });
  });
});
