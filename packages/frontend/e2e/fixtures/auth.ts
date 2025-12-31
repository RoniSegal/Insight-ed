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
  // Navigate and wait for page to be fully loaded to ensure form handlers are attached
  await page.goto('/login', { waitUntil: 'networkidle' });

  // Wait for login form to be ready
  await page.locator('#email').waitFor({ state: 'visible', timeout: 5000 });

  // Fill in login form using IDs for reliable selection
  await page.locator('#email').fill(user.email);
  await page.locator('#password').fill(user.password);

  // Submit form and wait for navigation
  await Promise.all([
    page.waitForURL(/\/(students|dashboard|home)/, { timeout: 15000 }),
    page.getByRole('button', { name: /sign in|התחבר/i }).click(),
  ]);

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
  // Click logout button and wait for navigation
  // The logout triggers an immediate window.location.href redirect, which removes the button from DOM
  // So we need to wait for navigation to start before the click completes
  await Promise.all([
    page.waitForURL(/\/login/, { timeout: 10000 }),
    page.getByRole('button', { name: /logout|log out|התנתק/i }).click(),
  ]);
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
  await page.goto('/', { waitUntil: 'domcontentloaded' });

  // Clear localStorage (use the actual storage keys)
  await page.evaluate(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('auth-storage');
  });
}
