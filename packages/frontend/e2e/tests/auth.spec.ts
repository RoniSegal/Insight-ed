import { test, expect } from '@playwright/test';
import { LoginPage, DashboardPage } from '../pages';
import {
  TEST_USERS,
  loginAsTeacher,
  loginAsPrincipal,
  logout,
  clearAuthState,
} from '../fixtures/auth';

/**
 * Authentication Flow Tests
 * Tests for login, logout, and authentication flows
 */

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Clear auth state before each test
    await clearAuthState(page);
  });

  test('should login as teacher successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Navigate to login page
    await loginPage.navigate();

    // Fill credentials and submit
    await loginPage.login(TEST_USERS.teacher.email, TEST_USERS.teacher.password);

    // Wait for redirect to dashboard
    await loginPage.waitForLoginSuccess();

    // Verify user is authenticated
    expect(await dashboardPage.isAuthenticated()).toBe(true);

    // Verify URL is dashboard
    await expect(page).toHaveURL(/\/(dashboard|home)/);
  });

  test('should login as principal successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.navigate();
    await loginPage.login(TEST_USERS.principal.email, TEST_USERS.principal.password);
    await loginPage.waitForLoginSuccess();

    expect(await dashboardPage.isAuthenticated()).toBe(true);
    await expect(page).toHaveURL(/\/(dashboard|home)/);
  });

  test('should show error for invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.login('invalid@example.com', 'wrongpassword');

    // Wait a bit for error to appear
    await page.waitForTimeout(1000);

    // Should show error message
    const error = await loginPage.getError();
    expect(error).toBeTruthy();
    expect(error).toMatch(/invalid|incorrect|failed|שגוי/i);

    // Should still be on login page
    await expect(page).toHaveURL(/\/login/);
  });

  test('should show validation error for empty fields', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigate();
    await loginPage.clickSignIn(); // Submit without filling fields

    // Should show validation errors (either browser validation or custom)
    const emailValid = await loginPage.emailInput.evaluate(
      (el: HTMLInputElement) => el.validity.valid
    );
    const passwordValid = await loginPage.passwordInput.evaluate(
      (el: HTMLInputElement) => el.validity.valid
    );

    expect(emailValid || passwordValid).toBe(false);
  });

  test('should logout successfully', async ({ page }) => {
    const dashboardPage = new DashboardPage(page);

    // Login first using helper
    await loginAsTeacher(page);

    // Verify authenticated
    expect(await dashboardPage.isAuthenticated()).toBe(true);

    // Logout
    await logout(page);

    // Should redirect to login page
    await expect(page).toHaveURL(/\/login/);
  });

  test('complete login and logout flow', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Step 1: Navigate to login
    await loginPage.navigate();
    expect(await loginPage.isLoginFormVisible()).toBe(true);

    // Step 2: Login
    await loginPage.login(TEST_USERS.teacher.email, TEST_USERS.teacher.password);
    await loginPage.waitForLoginSuccess();

    // Step 3: Verify authenticated
    await dashboardPage.navigate();
    expect(await dashboardPage.isAuthenticated()).toBe(true);

    // Step 4: Logout
    await dashboardPage.logout();

    // Step 5: Verify redirected to login
    await expect(page).toHaveURL(/\/login/);
    expect(await loginPage.isLoginFormVisible()).toBe(true);
  });

  test('should prevent access to dashboard when not authenticated', async ({ page }) => {
    // Clear any existing auth
    await clearAuthState(page);

    // Try to access dashboard directly
    await page.goto('/dashboard');

    // Should redirect to login
    await page.waitForURL(/\/login/, { timeout: 5000 });
    await expect(page).toHaveURL(/\/login/);
  });

  test('should persist session after page reload', async ({ page }) => {
    // Login
    await loginAsTeacher(page);

    // Reload page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Should still be authenticated
    const dashboardPage = new DashboardPage(page);
    expect(await dashboardPage.isAuthenticated()).toBe(true);
  });

  test('should show forgot password link', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();

    // Verify forgot password link is visible
    await expect(loginPage.forgotPasswordLink).toBeVisible();

    // Click forgot password
    await loginPage.clickForgotPassword();

    // Should navigate to password reset page
    await expect(page).toHaveURL(/\/forgot-password|\/reset-password/);
  });

  test('should support SSO login option', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();

    // Verify SSO button is visible
    const ssoVisible = await loginPage.ssoButton.isVisible();

    if (ssoVisible) {
      // SSO is enabled - verify button works
      await expect(loginPage.ssoButton).toBeEnabled();
    }
  });

  test('should handle concurrent logins from different roles', async ({ browser }) => {
    // Create two contexts (like two different users/browsers)
    const teacherContext = await browser.newContext();
    const principalContext = await browser.newContext();

    const teacherPage = await teacherContext.newPage();
    const principalPage = await principalContext.newPage();

    // Login as teacher in first context
    await loginAsTeacher(teacherPage);
    const teacherDashboard = new DashboardPage(teacherPage);
    expect(await teacherDashboard.isAuthenticated()).toBe(true);

    // Login as principal in second context
    await loginAsPrincipal(principalPage);
    const principalDashboard = new DashboardPage(principalPage);
    expect(await principalDashboard.isAuthenticated()).toBe(true);

    // Both should remain authenticated
    expect(await teacherDashboard.isAuthenticated()).toBe(true);
    expect(await principalDashboard.isAuthenticated()).toBe(true);

    // Cleanup
    await teacherContext.close();
    await principalContext.close();
  });
});
