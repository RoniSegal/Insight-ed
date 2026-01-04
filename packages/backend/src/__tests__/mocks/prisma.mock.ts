export const createMockPrismaClient = () => ({
  user: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  school: {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  passwordResetToken: {
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  auditLog: {
    create: jest.fn(),
  },
  $connect: jest.fn(),
  $disconnect: jest.fn(),
});

export type MockPrismaClient = ReturnType<typeof createMockPrismaClient>;
