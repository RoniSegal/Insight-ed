import { Test, TestingModule } from '@nestjs/testing';
import { UserRole } from '@growth-engine/shared';

import { AuthController } from '../../auth/auth.controller';
import { AuthService } from '../../auth/auth.service';
import { ForgotPasswordDto } from '../../auth/dto/forgot-password.dto';
import { LoginDto } from '../../auth/dto/login.dto';
import { RefreshTokenDto } from '../../auth/dto/refresh-token.dto';
import { RegisterDto } from '../../auth/dto/register.dto';
import { ResetPasswordDto } from '../../auth/dto/reset-password.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    refreshAccessToken: jest.fn(),
    logout: jest.fn(),
    forgotPassword: jest.fn(),
    resetPassword: jest.fn(),
    generateAccessToken: jest.fn(),
    generateRefreshToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should call authService.register with registerDto', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'Test@1234',
        firstName: 'John',
        lastName: 'Doe',
        phone: '1234567890',
        schoolCode: 'SCHOOL1',
        role: UserRole.TEACHER,
      };

      const expectedResult = {
        user: {
          id: 'user-123',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
        },
        message: 'Registration successful. Please check your email to verify your account.',
      };

      mockAuthService.register.mockResolvedValue(expectedResult);

      const result = await controller.register(registerDto);

      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('login', () => {
    it('should call authService.login with loginDto', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'Test@1234',
      };

      const expectedResult = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: {
          id: 'user-123',
          email: 'test@example.com',
        },
      };

      mockAuthService.login.mockResolvedValue(expectedResult);

      const result = await controller.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('refreshToken', () => {
    it('should call authService.refreshAccessToken with refresh token', async () => {
      const refreshTokenDto: RefreshTokenDto = {
        refreshToken: 'refresh-token',
      };

      const expectedResult = {
        accessToken: 'new-access-token',
      };

      mockAuthService.refreshAccessToken.mockResolvedValue(expectedResult);

      const result = await controller.refreshToken(refreshTokenDto);

      expect(authService.refreshAccessToken).toHaveBeenCalledWith('refresh-token');
      expect(result).toEqual(expectedResult);
    });
  });

  describe('logout', () => {
    it('should call authService.logout with userId from current user', async () => {
      const mockUser = {
        userId: 'user-123',
        email: 'test@example.com',
        role: UserRole.TEACHER,
      };

      const expectedResult = {
        message: 'Logged out successfully',
      };

      mockAuthService.logout.mockResolvedValue(expectedResult);

      const result = await controller.logout(mockUser);

      expect(authService.logout).toHaveBeenCalledWith('user-123');
      expect(result).toEqual(expectedResult);
    });
  });

  describe('forgotPassword', () => {
    it('should call authService.forgotPassword with email', async () => {
      const forgotPasswordDto: ForgotPasswordDto = {
        email: 'test@example.com',
      };

      const expectedResult = {
        message: 'If an account with that email exists, a password reset link has been sent.',
      };

      mockAuthService.forgotPassword.mockResolvedValue(expectedResult);

      const result = await controller.forgotPassword(forgotPasswordDto);

      expect(authService.forgotPassword).toHaveBeenCalledWith('test@example.com');
      expect(result).toEqual(expectedResult);
    });
  });

  describe('resetPassword', () => {
    it('should call authService.resetPassword with token and new password', async () => {
      const resetPasswordDto: ResetPasswordDto = {
        token: 'reset-token',
        newPassword: 'NewPass@123',
      };

      const expectedResult = {
        message: 'Password reset successful. You can now login with your new password.',
      };

      mockAuthService.resetPassword.mockResolvedValue(expectedResult);

      const result = await controller.resetPassword(resetPasswordDto);

      expect(authService.resetPassword).toHaveBeenCalledWith('reset-token', 'NewPass@123');
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user from request', async () => {
      const mockUser = {
        userId: 'user-123',
        email: 'test@example.com',
        role: UserRole.TEACHER,
        schoolId: 'school-123',
      };

      const result = await controller.getCurrentUser(mockUser);

      expect(result).toEqual({ user: mockUser });
    });
  });

  describe('googleAuth', () => {
    it('should initiate Google OAuth flow', async () => {
      const result = await controller.googleAuth();
      expect(result).toBeUndefined();
    });
  });

  describe('googleAuthCallback', () => {
    it('should handle Google OAuth callback and redirect with tokens', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        role: UserRole.TEACHER,
        schoolId: 'school-123',
      };

      const mockReq = {
        user: mockUser,
      };

      const mockRes = {
        redirect: jest.fn(),
      };

      const originalEnv = process.env;
      process.env = {
        ...originalEnv,
        FRONTEND_URL: 'http://localhost:3000',
      };

      mockAuthService.generateAccessToken.mockReturnValue('access-token');
      mockAuthService.generateRefreshToken.mockResolvedValue('refresh-token');

      await controller.googleAuthCallback(mockReq, mockRes);

      expect(mockAuthService.generateAccessToken).toHaveBeenCalledWith(mockUser);
      expect(mockAuthService.generateRefreshToken).toHaveBeenCalledWith(mockUser);
      expect(mockRes.redirect).toHaveBeenCalledWith(
        'http://localhost:3000/auth/callback?accessToken=access-token&refreshToken=refresh-token'
      );

      process.env = originalEnv;
    });

    it('should handle missing FRONTEND_URL environment variable', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
      };

      const mockReq = {
        user: mockUser,
      };

      const mockRes = {
        redirect: jest.fn(),
      };

      const originalEnv = process.env;
      process.env = {
        ...originalEnv,
      };
      delete process.env.FRONTEND_URL;

      mockAuthService.generateAccessToken.mockReturnValue('access-token');
      mockAuthService.generateRefreshToken.mockResolvedValue('refresh-token');

      await controller.googleAuthCallback(mockReq, mockRes);

      expect(mockRes.redirect).toHaveBeenCalledWith(
        'undefined/auth/callback?accessToken=access-token&refreshToken=refresh-token'
      );

      process.env = originalEnv;
    });
  });
});
