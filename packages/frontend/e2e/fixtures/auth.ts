import { Page } from '@playwright/test';
import { UserRole } from '@growth-engine/shared';

/**
 * Authentication helpers for E2E tests
 * These helpers simulate user login and authentication flows
 */

export interface TestUser {
  email: string;
  password: string;
  role: UserRole;
}

/**
 * Default test users for different roles
 * These users are created in global-setup.ts with password: Test123!
 */
export const TEST_USERS = {
  teacher: {
    email: 'teacher@example.com',
    password: 'Test123!',
    role: UserRole.TEACHER,
  },
  principal: {
    email: 'principal@example.com',
    password: 'Test123!',
    role: UserRole.PRINCIPAL,
  },
  admin: {
    email: 'admin@example.com',
    password: 'Test123!',
    role: UserRole.ADMIN,
  },
} as const;

/**
 * Login helper - navigates to login page and authenticates user
 * @param page Playwright page instance
 * @param user User credentials to login with
 */
export async function login(page: Page, user: TestUser): Promise<void> {
  await page.goto('/login');

  // Fill in login form using IDs for reliable selection
  await page.locator('#email').fill(user.email);
  await page.locator('#password').fill(user.password);

  // Submit form
  await page.getByRole('button', { name: /sign in|התחבר/i }).click();

  // Wait for navigation to complete
  await page.waitForURL(/\/(students|dashboard|home)/);

  // Verify login was successful by checking for logout button
  await page.getByRole('button', { name: /logout|log out|התנתק/i }).waitFor({ state: 'visible', timeout: 5000 });
}

/**
 * Login as teacher - convenience method
 */
export async function loginAsTeacher(page: Page): Promise<void> {
  await login(page, TEST_USERS.teacher);
}

/**
 * Login as principal - convenience method
 */
export async function loginAsPrincipal(page: Page): Promise<void> {
  await login(page, TEST_USERS.principal);
}

/**
 * Login as admin - convenience method
 */
export async function loginAsAdmin(page: Page): Promise<void> {
  await login(page, TEST_USERS.admin);
}

/**
 * Logout helper - clicks logout button and verifies redirection
 * @param page Playwright page instance
 */
export async function logout(page: Page): Promise<void> {
  // Click logout button directly (no need to open menu in current implementation)
  await page.getByRole('button', { name: /logout|log out|התנתק/i }).click();

  // Wait for redirect to login page
  await page.waitForURL(/\/login/);
}

/**
 * Get auth token from localStorage (for API calls)
 * @param page Playwright page instance
 * @returns Auth token or null
 */
export async function getAuthToken(page: Page): Promise<string | null> {
  return await page.evaluate(() => {
    return localStorage.getItem('authToken');
  });
}

/**
 * Set auth token in localStorage (for direct authentication)
 * @param page Playwright page instance
 * @param token JWT token
 */
export async function setAuthToken(page: Page, token: string): Promise<void> {
  await page.evaluate((authToken) => {
    localStorage.setItem('authToken', authToken);
  }, token);
}

/**
 * Clear auth state (logout without UI interaction)
 * @param page Playwright page instance
 */
export async function clearAuthState(page: Page): Promise<void> {
  // Navigate to home page first to ensure context is available
  await page.goto('/');

  //Clear localStorage
  await page.evaluate(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  });
}
