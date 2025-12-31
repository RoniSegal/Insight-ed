import { Page } from '@playwright/test';

/**
 * Base Page Object Model
 * All page objects should extend this class to inherit common functionality
 */
export abstract class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to the page
   * @param path Relative path from base URL
   */
  async goto(path: string): Promise<void> {
    await this.page.goto(path);
  }

  /**
   * Get page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Wait for page to be loaded
   */
  async waitForLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Take screenshot
   * @param name Screenshot name
   */
  async screenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `test-results/screenshots/${name}.png`, fullPage: true });
  }

  /**
   * Check if element is visible
   * @param selector Element selector
   */
  async isVisible(selector: string): Promise<boolean> {
    try {
      return await this.page.locator(selector).isVisible();
    } catch {
      return false;
    }
  }

  /**
   * Wait for element to be visible
   * @param selector Element selector
   * @param timeout Timeout in milliseconds
   */
  async waitForElement(selector: string, timeout: number = 5000): Promise<void> {
    await this.page.waitForSelector(selector, { state: 'visible', timeout });
  }

  /**
   * Click element with text
   * @param text Text to find
   */
  async clickByText(text: string): Promise<void> {
    await this.page.getByText(text).click();
  }

  /**
   * Click button by role and name
   * @param name Button name/label
   */
  async clickButton(name: string | RegExp): Promise<void> {
    await this.page.getByRole('button', { name }).click();
  }

  /**
   * Fill input by label
   * @param label Input label
   * @param value Value to fill
   */
  async fillByLabel(label: string | RegExp, value: string): Promise<void> {
    await this.page.getByLabel(label).fill(value);
  }

  /**
   * Get error message
   */
  async getErrorMessage(): Promise<string | null> {
    const errorElement = this.page.locator('[role="alert"], .error-message, [data-testid="error"]');
    if (await errorElement.isVisible()) {
      return await errorElement.textContent();
    }
    return null;
  }

  /**
   * Get success message
   */
  async getSuccessMessage(): Promise<string | null> {
    const successElement = this.page.locator('[role="status"], .success-message, [data-testid="success"]');
    if (await successElement.isVisible()) {
      return await successElement.textContent();
    }
    return null;
  }

  /**
   * Wait for navigation
   * @param urlPattern URL pattern to wait for
   */
  async waitForNavigation(urlPattern: string | RegExp): Promise<void> {
    await this.page.waitForURL(urlPattern);
  }
}
