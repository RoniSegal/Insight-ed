import { PrismaClient } from '@prisma/client';
import { UserRole } from '@growth-engine/shared';

/**
 * Database fixtures for E2E tests
 * Provides utilities to create and clean up test data with isolation
 */

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5434/growth_engine?schema=public';

// Singleton Prisma client for tests
let prismaClient: PrismaClient | null = null;

export function getPrismaClient(): PrismaClient {
  if (!prismaClient) {
    prismaClient = new PrismaClient({
      datasources: { db: { url: DATABASE_URL } },
    });
  }
  return prismaClient;
}

/**
 * Test data tracker - keeps track of created entities for cleanup
 */
class TestDataTracker {
  private createdUsers: string[] = [];
  private createdSchools: string[] = [];
  private createdStudents: string[] = [];
  private createdClasses: string[] = [];

  track(type: 'user' | 'school' | 'student' | 'class', id: string) {
    switch (type) {
      case 'user':
        this.createdUsers.push(id);
        break;
      case 'school':
        this.createdSchools.push(id);
        break;
      case 'student':
        this.createdStudents.push(id);
        break;
      case 'class':
        this.createdClasses.push(id);
        break;
    }
  }

  async cleanup() {
    const prisma = getPrismaClient();

    // Delete in reverse order of dependencies
    if (this.createdUsers.length > 0) {
      await prisma.user.deleteMany({
        where: { id: { in: this.createdUsers } },
      });
      this.createdUsers = [];
    }

    if (this.createdStudents.length > 0) {
      // Students will be deleted when we implement student model
      this.createdStudents = [];
    }

    if (this.createdClasses.length > 0) {
      // Classes will be deleted when we implement class model
      this.createdClasses = [];
    }

    if (this.createdSchools.length > 0) {
      await prisma.school.deleteMany({
        where: { id: { in: this.createdSchools } },
      });
      this.createdSchools = [];
    }
  }

  reset() {
    this.createdUsers = [];
    this.createdSchools = [];
    this.createdStudents = [];
    this.createdClasses = [];
  }
}

// Global tracker instance
export const testDataTracker = new TestDataTracker();

/**
 * Get default test school (created in global setup)
 */
export async function getTestSchool() {
  const prisma = getPrismaClient();
  return await prisma.school.findFirst({
    where: { code: 'TEST001' },
  });
}

/**
 * Get test user by email
 */
export async function getTestUser(email: string) {
  const prisma = getPrismaClient();
  return await prisma.user.findUnique({
    where: { email },
  });
}

/**
 * Get test teacher
 */
export async function getTestTeacher() {
  return await getTestUser('teacher@example.com');
}

/**
 * Get test principal
 */
export async function getTestPrincipal() {
  return await getTestUser('principal@example.com');
}

/**
 * Get test admin
 */
export async function getTestAdmin() {
  return await getTestUser('admin@example.com');
}

/**
 * Create a test user (will be tracked for cleanup)
 */
export async function createTestUser(data: {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  password?: string;
}) {
  const prisma = getPrismaClient();
  const bcrypt = require('bcrypt');

  const school = await getTestSchool();
  if (!school) {
    throw new Error('Test school not found. Run global setup first.');
  }

  const passwordHash = await bcrypt.hash(data.password || 'Test123!', 12);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
      schoolId: school.id,
      isActive: true,
      emailVerified: true,
      settings: {},
    },
  });

  testDataTracker.track('user', user.id);
  return user;
}

/**
 * Create a test school (will be tracked for cleanup)
 */
export async function createTestSchool(data: {
  name: string;
  code: string;
  principal?: string;
}) {
  const prisma = getPrismaClient();

  const school = await prisma.school.create({
    data: {
      name: data.name,
      code: data.code,
      address: '123 Test St',
      phone: '555-0100',
      email: `admin@${data.code.toLowerCase()}.com`,
      principal: data.principal || 'Test Principal',
      settings: {},
    },
  });

  testDataTracker.track('school', school.id);
  return school;
}

/**
 * Clean up all tracked test data
 * Call this in afterEach() hooks
 */
export async function cleanupTestData() {
  await testDataTracker.cleanup();
}

/**
 * Reset tracker without cleanup
 * Useful if you want to keep data but stop tracking
 */
export function resetTestDataTracker() {
  testDataTracker.reset();
}

/**
 * Disconnect Prisma client
 * Call this in global teardown
 */
export async function disconnectPrisma() {
  if (prismaClient) {
    await prismaClient.$disconnect();
    prismaClient = null;
  }
}
