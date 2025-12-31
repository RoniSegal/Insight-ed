import { execSync, spawn } from 'child_process';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@growth-engine/shared';

/**
 * Global E2E Test Setup
 * Runs once before all tests
 * - Starts Docker containers (PostgreSQL, Redis, MailHog)
 * - Starts NestJS backend server
 * - Runs database migrations
 * - Seeds test database with fixture data
 */

const DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgresql://postgres:postgres@localhost:5434/growth_engine?schema=public';
const BACKEND_URL = 'http://localhost:4000/api/v1';

// Store backend process reference for cleanup
let backendProcess: any = null;

async function globalSetup() {
  console.log('\n🚀 Starting E2E Test Environment Setup...\n');

  try {
    // Step 1: Start Docker containers
    console.log('📦 Starting Docker containers...');
    try {
      execSync('docker-compose up -d', {
        stdio: 'inherit',
        cwd: process.cwd() + '/../../', // Root of monorepo
      });
      console.log('✅ Docker containers started\n');
    } catch (error) {
      console.log('⚠️  Docker containers may already be running\n');
    }

    // Step 2: Wait for PostgreSQL to be ready
    console.log('⏳ Waiting for PostgreSQL to be ready...');
    await waitForPostgres();
    console.log('✅ PostgreSQL is ready\n');

    // Step 3: Run database migrations
    console.log('🗄️  Running database migrations...');
    execSync(`DATABASE_URL="${DATABASE_URL}" npx prisma migrate deploy`, {
      stdio: 'inherit',
      cwd: process.cwd() + '/../backend',
    });
    console.log('✅ Database migrations complete\n');

    // Step 4: Start backend server
    console.log('🚀 Starting NestJS backend...');
    await startBackendServer();
    console.log('✅ Backend server started\n');

    // Step 5: Seed test database
    console.log('🌱 Seeding test database...');
    await seedTestDatabase();
    console.log('✅ Test database seeded\n');

    console.log('🎉 E2E Test Environment Ready!\n');
  } catch (error) {
    console.error('❌ Failed to setup E2E test environment:', error);
    throw error;
  }
}

/**
 * Start NestJS backend server
 */
async function startBackendServer(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Kill any existing process on port 4000
    try {
      execSync('lsof -ti:4000 | xargs kill -9', { stdio: 'ignore' });
    } catch (error) {
      // No process on port 4000, continue
    }

    // Start backend server
    backendProcess = spawn('npm', ['run', 'start:dev'], {
      cwd: process.cwd() + '/../backend',
      detached: true,
      stdio: 'ignore',
    });

    // Don't keep the process alive
    backendProcess.unref();

    // Wait for backend to be ready
    let retries = 0;
    const maxRetries = 30;
    const checkBackend = setInterval(async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/health`);
        if (response.ok) {
          clearInterval(checkBackend);
          resolve();
        }
      } catch (error) {
        retries++;
        if (retries >= maxRetries) {
          clearInterval(checkBackend);
          reject(new Error('Backend failed to start'));
        }
      }
    }, 1000);
  });
}

/**
 * Wait for PostgreSQL to be ready
 */
async function waitForPostgres(maxRetries = 30): Promise<void> {
  const prisma = new PrismaClient({
    datasources: { db: { url: DATABASE_URL } },
  });

  for (let i = 0; i < maxRetries; i++) {
    try {
      await prisma.$connect();
      await prisma.$disconnect();
      return;
    } catch (error) {
      if (i === maxRetries - 1) {
        throw new Error('PostgreSQL failed to start');
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

/**
 * Seed test database with fixture data
 */
async function seedTestDatabase(): Promise<void> {
  const prisma = new PrismaClient({
    datasources: { db: { url: DATABASE_URL } },
  });

  try {
    await prisma.$connect();

    // Clear existing data (in reverse order of dependencies)
    console.log('  🧹 Cleaning existing test data...');
    await prisma.passwordResetToken.deleteMany();
    await prisma.auditLog.deleteMany();
    await prisma.user.deleteMany();
    await prisma.school.deleteMany();

    // Create test school
    console.log('  🏫 Creating test school...');
    const school = await prisma.school.create({
      data: {
        name: 'Test School',
        code: 'TEST001',
        address: '123 Test St',
        phone: '555-0100',
        email: 'admin@testschool.com',
        principal: 'Test Principal',
        settings: {},
      },
    });

    // Create test users
    console.log('  👥 Creating test users...');
    const passwordHash = await bcrypt.hash('Test123!', 12);

    const teacher = await prisma.user.create({
      data: {
        email: 'teacher@example.com',
        passwordHash,
        firstName: 'Test',
        lastName: 'Teacher',
        role: UserRole.TEACHER,
        schoolId: school.id,
        isActive: true,
        emailVerified: true,
        phone: '555-0101',
        settings: {},
      },
    });

    const principal = await prisma.user.create({
      data: {
        email: 'principal@example.com',
        passwordHash,
        firstName: 'Test',
        lastName: 'Principal',
        role: UserRole.PRINCIPAL,
        schoolId: school.id,
        isActive: true,
        emailVerified: true,
        phone: '555-0102',
        settings: {},
      },
    });

    const admin = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        passwordHash,
        firstName: 'Test',
        lastName: 'Admin',
        role: UserRole.ADMIN,
        schoolId: school.id,
        isActive: true,
        emailVerified: true,
        phone: '555-0103',
        settings: {},
      },
    });

    console.log(`  ✅ Created 3 test users (teacher, principal, admin)`);
    console.log(`  📧 All users password: Test123!`);

    // Log test credentials for reference
    console.log('\n  📋 Test Credentials:');
    console.log(`     Teacher:   teacher@example.com / Test123!`);
    console.log(`     Principal: principal@example.com / Test123!`);
    console.log(`     Admin:     admin@example.com / Test123!\n`);
  } finally {
    await prisma.$disconnect();
  }
}

export default globalSetup;
