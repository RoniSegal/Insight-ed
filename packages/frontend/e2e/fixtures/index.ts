/**
 * E2E Test Fixtures
 * Centralized exports for all test fixtures and utilities
 */

export * from './auth';
// Export api fixtures (has cleanupTestData for API-based cleanup)
export {
  createTestStudent,
  deleteTestStudent,
  createTestClass,
  deleteTestClass,
  startAnalysisSession,
  healthCheck,
  cleanupTestData as cleanupTestDataApi,
} from './api';
// Export database fixtures (has cleanupTestData for direct DB cleanup)
export {
  getPrismaClient,
  testDataTracker,
  getTestSchool,
  getTestUser,
  getTestTeacher,
  getTestPrincipal,
  getTestAdmin,
  createTestUser,
  createTestSchool,
  cleanupTestData,
  resetTestDataTracker,
  disconnectPrisma,
} from './database';
