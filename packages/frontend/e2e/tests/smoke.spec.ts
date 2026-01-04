import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages';
import { healthCheck } from '../fixtures/api';

/**
 * Smoke Tests
 * Basic tests to verify the application is running and accessible
 */

test.describe('Smoke Tests', () => {
  test.describe.configure({ mode: 'parallel' });

  test('should load the login page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();

    // Verify page loaded
    await expect(page).toHaveURL(/\/login/);

    // Verify login form is visible
    expect(await loginPage.isLoginFormVisible()).toBe(true);

    // Verify essential elements are present
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.signInButton).toBeVisible();
  });

  test('should have correct page title', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();

    const title = await loginPage.getTitle();
    expect(title).toContain('Growth Engine');
  });

  test('should display login form in Hebrew (RTL)', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();

    // Verify RTL direction
    const htmlDir = await page.locator('html').getAttribute('dir');
    expect(htmlDir).toBe('rtl');

    // Verify Hebrew language
    const htmlLang = await page.locator('html').getAttribute('lang');
    expect(htmlLang).toBe('he');
  });

  test('should have responsive design for mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    const loginPage = new LoginPage(page);
    await loginPage.navigate();

    // Verify form is still visible and usable on mobile
    expect(await loginPage.isLoginFormVisible()).toBe(true);
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.signInButton).toBeVisible();
  });

  test('backend health check should pass', async ({ request }) => {
    const isHealthy = await healthCheck(request);
    expect(isHealthy).toBe(true);
  });

  test('should handle navigation to non-existent route', async ({ page }) => {
    await page.goto('/this-route-does-not-exist');

    // Should show 404 page or redirect to home/login
    const url = page.url();
    const has404 = await page
      .locator('text=/404|not found/i')
      .isVisible()
      .catch(() => false);
    const isRedirected = url.includes('/login') || url.includes('/home');

    expect(has404 || isRedirected).toBe(true);
  });

  test('should load static assets (CSS, JS)', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Track failed requests
    const failedRequests: string[] = [];
    page.on('requestfailed', (request) => {
      failedRequests.push(request.url());
    });

    await loginPage.navigate();
    await loginPage.waitForLoad();

    // Verify no critical assets failed to load
    const criticalFailures = failedRequests.filter(
      (url) => url.includes('.js') || url.includes('.css') || url.includes('_next')
    );

    expect(criticalFailures).toHaveLength(0);
  });

  test('should have proper meta tags for SEO', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();

    // Check for viewport meta tag
    const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
    expect(viewport).toBeTruthy();

    // Check for charset
    const charset = await page.locator('meta[charset]').count();
    expect(charset).toBeGreaterThan(0);
  });
});
