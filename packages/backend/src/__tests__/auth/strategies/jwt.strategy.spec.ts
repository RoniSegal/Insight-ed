import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient, UserRole } from '@prisma/client';

import { JwtStrategy } from '../../../auth/strategies/jwt.strategy';
import { createMockPrismaClient, MockPrismaClient } from '../../mocks/prisma.mock';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let prisma: MockPrismaClient;

  const originalEnv = process.env;

  beforeAll(() => {
    process.env = {
      ...originalEnv,
      JWT_ACCESS_SECRET: 'test-access-secret',
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  beforeEach(async () => {
    prisma = createMockPrismaClient();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: PrismaClient,
          useValue: prisma,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return user object when user exists and is active', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        role: UserRole.TEACHER,
        schoolId: 'school-123',
        isActive: true,
        school: {
          id: 'school-123',
          name: 'Test School',
          code: 'TEST',
        },
      };

      prisma.user.findUnique.mockResolvedValue(mockUser as any);

      const payload = {
        sub: 'user-123',
        email: 'test@example.com',
        role: UserRole.TEACHER,
        schoolId: 'school-123',
      };

      const result = await strategy.validate(payload);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-123' },
        include: { school: true },
      });

      expect(result).toEqual({
        userId: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
        schoolId: mockUser.schoolId,
        school: mockUser.school,
      });
    });

    it('should throw UnauthorizedException when user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      const payload = {
        sub: 'user-123',
        email: 'test@example.com',
        role: UserRole.TEACHER,
      };

      await expect(strategy.validate(payload)).rejects.toThrow(UnauthorizedException);
      await expect(strategy.validate(payload)).rejects.toThrow('User not found or inactive');
    });

    it('should throw UnauthorizedException when user is inactive', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        role: UserRole.TEACHER,
        schoolId: 'school-123',
        isActive: false,
        school: {
          id: 'school-123',
          name: 'Test School',
        },
      };

      prisma.user.findUnique.mockResolvedValue(mockUser as any);

      const payload = {
        sub: 'user-123',
        email: 'test@example.com',
        role: UserRole.TEACHER,
      };

      await expect(strategy.validate(payload)).rejects.toThrow(UnauthorizedException);
      await expect(strategy.validate(payload)).rejects.toThrow('User not found or inactive');
    });
  });
});
