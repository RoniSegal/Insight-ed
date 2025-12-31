import { APIRequestContext } from '@playwright/test';

/**
 * API helpers for E2E test setup and teardown
 * These helpers interact with the backend API to prepare test data
 */

const API_BASE_URL = process.env.PLAYWRIGHT_API_URL || 'http://localhost:4000/api/v1';

/**
 * Create test student via API
 * @param request Playwright API request context
 * @param authToken JWT token for authentication
 * @param studentData Student data
 */
export async function createTestStudent(
  request: APIRequestContext,
  authToken: string,
  studentData: {
    firstName: string;
    lastName: string;
    studentId: string;
    classId: string;
  }
) {
  const response = await request.post(`${API_BASE_URL}/students`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
    data: studentData,
  });

  if (!response.ok()) {
    throw new Error(`Failed to create test student: ${response.status()}`);
  }

  return await response.json();
}

/**
 * Delete test student via API
 * @param request Playwright API request context
 * @param authToken JWT token for authentication
 * @param studentId Student ID to delete
 */
export async function deleteTestStudent(
  request: APIRequestContext,
  authToken: string,
  studentId: string
) {
  const response = await request.delete(`${API_BASE_URL}/students/${studentId}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok() && response.status() !== 404) {
    throw new Error(`Failed to delete test student: ${response.status()}`);
  }
}

/**
 * Create test class via API
 * @param request Playwright API request context
 * @param authToken JWT token for authentication
 * @param classData Class data
 */
export async function createTestClass(
  request: APIRequestContext,
  authToken: string,
  classData: {
    name: string;
    gradeLevel: number;
    schoolYear: string;
    schoolId: string;
  }
) {
  const response = await request.post(`${API_BASE_URL}/classes`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
    data: classData,
  });

  if (!response.ok()) {
    throw new Error(`Failed to create test class: ${response.status()}`);
  }

  return await response.json();
}

/**
 * Delete test class via API
 * @param request Playwright API request context
 * @param authToken JWT token for authentication
 * @param classId Class ID to delete
 */
export async function deleteTestClass(
  request: APIRequestContext,
  authToken: string,
  classId: string
) {
  const response = await request.delete(`${API_BASE_URL}/classes/${classId}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (!response.ok() && response.status() !== 404) {
    throw new Error(`Failed to delete test class: ${response.status()}`);
  }
}

/**
 * Start analysis session via API
 * @param request Playwright API request context
 * @param authToken JWT token for authentication
 * @param studentId Student ID to analyze
 */
export async function startAnalysisSession(
  request: APIRequestContext,
  authToken: string,
  studentId: string
) {
  const response = await request.post(`${API_BASE_URL}/analysis/start`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
    data: { studentId },
  });

  if (!response.ok()) {
    throw new Error(`Failed to start analysis session: ${response.status()}`);
  }

  return await response.json();
}

/**
 * Health check - verify backend is running
 * @param request Playwright API request context
 */
export async function healthCheck(request: APIRequestContext): Promise<boolean> {
  try {
    const response = await request.get(`${API_BASE_URL}/health`);
    return response.ok();
  } catch (error) {
    return false;
  }
}

/**
 * Cleanup test data - delete all test entities
 * @param request Playwright API request context
 * @param authToken JWT token for authentication
 * @param entityIds Object containing IDs of entities to delete
 */
export async function cleanupTestData(
  request: APIRequestContext,
  authToken: string,
  entityIds: {
    students?: string[];
    classes?: string[];
    analyses?: string[];
  }
) {
  // Delete students
  if (entityIds.students) {
    for (const studentId of entityIds.students) {
      await deleteTestStudent(request, authToken, studentId);
    }
  }

  // Delete classes
  if (entityIds.classes) {
    for (const classId of entityIds.classes) {
      await deleteTestClass(request, authToken, classId);
    }
  }

  // Delete analyses (if needed in the future)
  if (entityIds.analyses) {
    for (const analysisId of entityIds.analyses) {
      await request.delete(`${API_BASE_URL}/analysis/${analysisId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
    }
  }
}
