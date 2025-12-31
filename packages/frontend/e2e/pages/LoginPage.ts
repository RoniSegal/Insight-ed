import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Login Page Object Model
 * Represents the authentication/login page
 */
export class LoginPage extends BasePage {
  // Locators
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly forgotPasswordLink: Locator;
  readonly ssoButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize locators - using IDs for more reliable selection
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');
    this.signInButton = page.getByRole('button', { name: /sign in|התחבר/i });
    this.forgotPasswordLink = page.getByRole('link', { name: /forgot password|שכח.*סיסמ/i });
    // SSO button - use first() since there are multiple SSO buttons (Google, Microsoft)
    this.ssoButton = page.getByRole('button', { name: /google|microsoft/i }).first();
    // Error message - exclude Next.js router announcer, target actual error div
    this.errorMessage = page.locator('.text-red-700').first();
  }

  /**
   * Navigate to login page
   */
  async navigate(): Promise<void> {
    await this.goto('/login');
    await this.waitForLoad();
  }

  /**
   * Fill email input
   * @param email Email address
   */
  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  /**
   * Fill password input
   * @param password Password
   */
  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  /**
   * Click sign in button
   */
  async clickSignIn(): Promise<void> {
    await this.signInButton.click();
  }

  /**
   * Complete login flow
   * @param email Email address
   * @param password Password
   */
  async login(email: string, password: string): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.clickSignIn();
  }

  /**
   * Click forgot password link
   */
  async clickForgotPassword(): Promise<void> {
    await this.forgotPasswordLink.click();
  }

  /**
   * Click SSO sign in button
   */
  async clickSSOSignIn(): Promise<void> {
    await this.ssoButton.click();
  }

  /**
   * Get error message text
   */
  async getError(): Promise<string | null> {
    if (await this.errorMessage.isVisible()) {
      return await this.errorMessage.textContent();
    }
    return null;
  }

  /**
   * Check if login form is visible
   */
  async isLoginFormVisible(): Promise<boolean> {
    return (await this.emailInput.isVisible()) && (await this.passwordInput.isVisible());
  }

  /**
   * Wait for redirect after successful login
   * @param expectedPath Expected path after login (default: dashboard)
   */
  async waitForLoginSuccess(expectedPath: string | RegExp = /\/(dashboard|home)/): Promise<void> {
    await this.waitForNavigation(expectedPath);
  }
}
