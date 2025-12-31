import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Dashboard Page Object Model
 * Represents the main dashboard page (both teacher and principal)
 */
export class DashboardPage extends BasePage {
  // Locators
  readonly userMenu: Locator;
  readonly logoutButton: Locator;
  readonly pageTitle: Locator;
  readonly searchInput: Locator;
  readonly studentsGrid: Locator;
  readonly classSelector: Locator;
  readonly newAnalysisButton: Locator;

  constructor(page: Page) {
    super(page);

    // Initialize locators
    this.userMenu = page.locator('[data-testid="user-menu"]');
    this.logoutButton = page.getByRole('button', { name: /logout|log out|התנתק/i });
    this.pageTitle = page.locator('h1, [data-testid="page-title"]');
    this.searchInput = page.getByPlaceholder(/search|חיפוש/i);
    this.studentsGrid = page.locator('[data-testid="students-grid"]');
    this.classSelector = page.locator('[data-testid="class-selector"]');
    this.newAnalysisButton = page.getByRole('button', { name: /new analysis|ניתוח חדש/i });
  }

  /**
   * Navigate to dashboard
   */
  async navigate(): Promise<void> {
    await this.goto('/dashboard');
    await this.waitForLoad();
  }

  /**
   * Open user menu
   */
  async openUserMenu(): Promise<void> {
    await this.userMenu.click();
  }

  /**
   * Click logout
   */
  async logout(): Promise<void> {
    // Click logout button and wait for navigation
    // The logout triggers an immediate window.location.href redirect
    await Promise.all([
      this.page.waitForURL(/\/login/, { timeout: 10000 }),
      this.logoutButton.click(),
    ]);
  }

  /**
   * Get page title text
   */
  async getPageTitle(): Promise<string | null> {
    if (await this.pageTitle.isVisible()) {
      return await this.pageTitle.textContent();
    }
    return null;
  }

  /**
   * Search for student
   * @param query Search query
   */
  async searchStudent(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.page.waitForTimeout(500); // Wait for debounce
  }

  /**
   * Select class from dropdown
   * @param className Class name to select
   */
  async selectClass(className: string): Promise<void> {
    await this.classSelector.click();
    await this.page.getByRole('option', { name: className }).click();
  }

  /**
   * Click on student card
   * @param studentName Student name
   */
  async clickStudent(studentName: string): Promise<void> {
    await this.page
      .locator('[data-testid="student-card"]')
      .filter({ hasText: studentName })
      .click();
  }

  /**
   * Start new analysis
   * @param studentName Student name
   */
  async startNewAnalysis(studentName: string): Promise<void> {
    await this.clickStudent(studentName);
    await this.newAnalysisButton.click();
  }

  /**
   * Get student count
   */
  async getStudentCount(): Promise<number> {
    const students = await this.page.locator('[data-testid="student-card"]').all();
    return students.length;
  }

  /**
   * Check if user menu is visible (user is authenticated)
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      // Check for logout button as evidence of authentication
      await this.logoutButton.waitFor({ state: 'visible', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get user name from menu
   */
  async getUserName(): Promise<string | null> {
    if (await this.userMenu.isVisible()) {
      return await this.userMenu.textContent();
    }
    return null;
  }
}
