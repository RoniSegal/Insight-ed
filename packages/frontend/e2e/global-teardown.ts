import { PrismaClient } from '@prisma/client';

/**
 * Global E2E Test Teardown
 * Runs once after all tests complete
 * - Cleans up test database
 * - Optionally stops Docker containers
 */

const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5434/growth_engine?schema=public';

async function globalTeardown() {
  console.log('\n🧹 Starting E2E Test Environment Cleanup...\n');

  try {
    // Clean up test database
    console.log('🗑️  Cleaning up test database...');
    const prisma = new PrismaClient({
      datasources: { db: { url: DATABASE_URL } },
    });

    try {
      await prisma.$connect();

      // Clear all test data (in reverse order of dependencies)
      await prisma.passwordResetToken.deleteMany();
      await prisma.auditLog.deleteMany();
      await prisma.user.deleteMany();
      await prisma.school.deleteMany();

      console.log('✅ Test database cleaned\n');
    } finally {
      await prisma.$disconnect();
    }

    // Note: We don't stop Docker containers here because:
    // 1. Backend might still be running for development
    // 2. Faster to reuse containers for next test run
    // 3. User can manually stop with: docker-compose down

    console.log('✅ E2E Test Environment Cleanup Complete!\n');
  } catch (error) {
    console.error('❌ Failed to cleanup E2E test environment:', error);
    // Don't throw - cleanup failures shouldn't fail the test run
  }
}

export default globalTeardown;
