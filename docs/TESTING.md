# Testing Guide

This document describes the testing strategy and practices for the Growth Engine application.

## Table of Contents

- [Testing Strategy](#testing-strategy)
- [Test Types](#test-types)
- [E2E Testing with Playwright](#e2e-testing-with-playwright)
- [Running Tests](#running-tests)
- [Writing E2E Tests](#writing-e2e-tests)
- [Debugging Tests](#debugging-tests)
- [Test Data Management](#test-data-management)
- [Best Practices](#best-practices)

---

## Testing Strategy

Growth Engine follows a comprehensive testing strategy:

1. **Unit Tests** - Test individual functions and components in isolation
2. **Integration Tests** - Test how modules work together
3. **E2E Tests** - Test complete user flows from frontend to backend
4. **API Tests** - Test backend endpoints directly

### Testing Pyramid

```
         /\
        /  \  E2E Tests (few, critical flows)
       /    \
      /------\ Integration Tests (moderate coverage)
     /        \
    /----------\ Unit Tests (high coverage, fast)
```

---

## Test Types

### Unit Tests

- **Location**: `packages/*/src/**/*.test.ts`
- **Framework**: Jest
- **Run**: `npm test`
- **Coverage**: `npm run test:coverage`

Unit tests focus on individual functions, utilities, and React components.

### Integration Tests

- **Location**: `packages/backend/src/**/*.integration.test.ts`
- **Framework**: Jest with test database
- **Run**: `npm run test:integration`

Integration tests verify API endpoints, database operations, and service interactions.

### E2E Tests

- **Location**: `packages/frontend/e2e/`
- **Framework**: Playwright
- **Run**: `npm run test:e2e`

E2E tests verify complete user flows across frontend and backend.

---

## E2E Testing with Playwright

### Overview

Playwright is our E2E testing framework, chosen for:

- **Multi-browser support**: Chromium, Firefox, WebKit
- **Auto-wait**: Automatically waits for elements to be ready
- **Reliable**: Built-in retry and wait mechanisms
- **Fast**: Parallel execution and efficient browser automation
- **Developer-friendly**: Great debugging tools and UI mode

### Project Structure

```
packages/frontend/e2e/
├── fixtures/           # Test utilities and helpers
│   ├── auth.ts        # Authentication helpers
│   └── api.ts         # API helpers for setup/teardown
├── pages/             # Page Object Models
│   ├── BasePage.ts    # Base page class
│   ├── LoginPage.ts   # Login page model
│   ├── DashboardPage.ts
│   └── index.ts       # Exports
├── tests/             # Test files
│   ├── smoke.spec.ts  # Smoke tests
│   └── auth.spec.ts   # Authentication tests
└── playwright.config.ts  # Playwright configuration
```

### Configuration

Playwright is configured in `packages/frontend/playwright.config.ts`:

- **5 browsers**: Desktop Chrome, Firefox, Safari + Mobile Chrome, Safari
- **Parallel execution**: Tests run in parallel for speed
- **Automatic retries**: Failed tests retry 2 times in CI
- **Screenshots & videos**: Captured automatically on failure
- **Base URL**: Configurable via `PLAYWRIGHT_BASE_URL` environment variable

---

## Running Tests

### Prerequisites

```bash
# Install dependencies (includes Playwright)
npm install

# Install Playwright browsers (first time only)
npx playwright install --with-deps
```

### Local Development

```bash
# Run all E2E tests (headless)
npm run test:e2e

# Run with UI mode (interactive)
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed

# Run specific test file
npx playwright test e2e/tests/auth.spec.ts

# Run tests matching a pattern
npx playwright test --grep "login"

# Run in debug mode
npm run test:e2e:debug
```

### CI/CD

E2E tests run automatically in GitHub Actions on:

- Every pull request to `main`
- Triggered manually via workflow dispatch

See `.github/workflows/e2e.yml` for the CI configuration.

### Test Reports

After tests run, view the HTML report:

```bash
npx playwright show-report
```

Reports include:

- Test results with pass/fail status
- Screenshots of failures
- Videos of failed tests
- Network activity
- Console logs

---

## Writing E2E Tests

### Page Object Model (POM) Pattern

We use the Page Object Model pattern to keep tests maintainable.

#### Creating a Page Object

1. **Extend `BasePage`**:

```typescript
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class StudentPage extends BasePage {
  // Locators
  readonly studentNameInput: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    super(page);
    this.studentNameInput = page.getByLabel(/student name/i);
    this.saveButton = page.getByRole('button', { name: /save/i });
  }

  // Actions
  async navigate(): Promise<void> {
    await this.goto('/students');
  }

  async createStudent(name: string): Promise<void> {
    await this.studentNameInput.fill(name);
    await this.saveButton.click();
  }
}
```

2. **Export from `pages/index.ts`**:

```typescript
export { StudentPage } from './StudentPage';
```

#### Writing Tests with Page Objects

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage, StudentPage } from '../pages';
import { loginAsTeacher } from '../fixtures/auth';

test.describe('Student Management', () => {
  test('should create a new student', async ({ page }) => {
    // Setup: Login
    await loginAsTeacher(page);

    // Navigate to students page
    const studentPage = new StudentPage(page);
    await studentPage.navigate();

    // Create student
    await studentPage.createStudent('John Doe');

    // Verify student appears
    await expect(page.getByText('John Doe')).toBeVisible();
  });
});
```

### Authentication Helpers

Use authentication helpers from `fixtures/auth.ts`:

```typescript
import { loginAsTeacher, loginAsPrincipal, logout } from '../fixtures/auth';

test('teacher can access dashboard', async ({ page }) => {
  // Login as teacher
  await loginAsTeacher(page);

  // Navigate to dashboard
  await page.goto('/dashboard');

  // Assertions...
});
```

### API Helpers for Test Data

Use API helpers to create/cleanup test data:

```typescript
import { createTestStudent, deleteTestStudent, cleanupTestData } from '../fixtures/api';

test('should display student details', async ({ page, request }) => {
  // Get auth token
  const authToken = await getAuthToken(page);

  // Create test student via API
  const student = await createTestStudent(request, authToken, {
    firstName: 'Jane',
    lastName: 'Smith',
    studentId: 'S12345',
    classId: 'class-id',
  });

  // Run test...

  // Cleanup
  await deleteTestStudent(request, authToken, student.id);
});
```

---

## Debugging Tests

### Playwright Inspector

Debug tests step-by-step:

```bash
npm run test:e2e:debug
```

This opens Playwright Inspector where you can:

- Step through test actions
- Inspect locators
- View console logs
- See network requests

### UI Mode

Run tests interactively:

```bash
npm run test:e2e:ui
```

UI mode provides:

- Visual test execution
- Time-travel debugging
- Watch mode for file changes
- Trace viewer

### Codegen (Record Tests)

Generate tests by recording browser interactions:

```bash
npm run test:e2e:codegen
```

This opens a browser where Playwright records your actions and generates test code.

### VS Code Extension

Install the [Playwright VS Code extension](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright) for:

- Run tests from editor
- Debug tests with breakpoints
- View test results inline
- Pick locators visually

### Screenshots and Videos

Tests automatically capture:

- **Screenshots**: On failure only
- **Videos**: On failure only
- **Traces**: On first retry

Find artifacts in `packages/frontend/test-results/`.

---

## Test Data Management

### Principles

1. **Isolation**: Each test should create its own data
2. **Cleanup**: Always clean up test data after the test
3. **Idempotency**: Tests should be runnable multiple times
4. **Realistic**: Use data that resembles production

### Strategies

#### 1. Setup/Teardown with API

```typescript
test('student analysis flow', async ({ page, request }) => {
  let studentId: string;
  const authToken = await getAuthToken(page);

  // Setup: Create test data
  test.beforeAll(async () => {
    const student = await createTestStudent(request, authToken, { ... });
    studentId = student.id;
  });

  // Test...

  // Teardown: Cleanup
  test.afterAll(async () => {
    await deleteTestStudent(request, authToken, studentId);
  });
});
```

#### 2. Database Seeding

For tests requiring many fixtures, use Prisma seeding:

```typescript
// In beforeAll
await prisma.$executeRaw`TRUNCATE TABLE students CASCADE`;
await prisma.student.createMany({ data: [...] });
```

#### 3. Test Users

Predefined test users are available in `fixtures/auth.ts`:

- `TEST_USERS.teacher` - Standard teacher account
- `TEST_USERS.principal` - Principal account
- `TEST_USERS.admin` - Admin account

These users are seeded in the database via `packages/backend/prisma/seed.ts`.

---

## Best Practices

### 1. Use Semantic Locators

**Good**:

```typescript
page.getByRole('button', { name: 'Submit' });
page.getByLabel('Email');
page.getByText('Welcome');
```

**Bad**:

```typescript
page.locator('#submit-btn'); // Fragile
page.locator('.email-input'); // Brittle
```

### 2. Wait for Elements

Playwright auto-waits, but sometimes you need explicit waits:

```typescript
// Wait for element
await page.waitForSelector('[data-testid="student-card"]');

// Wait for navigation
await page.waitForURL(/\/dashboard/);

// Wait for network idle
await page.waitForLoadState('networkidle');
```

### 3. Avoid Hard-Coded Waits

**Bad**:

```typescript
await page.waitForTimeout(5000); // Flaky
```

**Good**:

```typescript
await page.waitForSelector('.loaded');
await expect(page.getByText('Loaded')).toBeVisible();
```

### 4. Test One Thing at a Time

Keep tests focused on a single behavior:

```typescript
// Good
test('should login successfully', async ({ page }) => { ... });
test('should show error for invalid password', async ({ page }) => { ... });

// Bad
test('should login and create student and analyze', async ({ page }) => { ... });
```

### 5. Use Descriptive Test Names

```typescript
// Good
test('should display validation error when email is empty');

// Bad
test('test1');
```

### 6. Clean Up After Tests

Always clean up test data:

```typescript
test.afterEach(async ({ request }) => {
  await cleanupTestData(request, authToken, { students: [...] });
});
```

### 7. Handle Localization

Support Hebrew (RTL) and English tests:

```typescript
page.getByLabel(/email|דוא"ל/i); // Matches both English and Hebrew
page.getByRole('button', { name: /submit|שלח/i });
```

### 8. Use Test IDs Sparingly

Only when semantic locators aren't sufficient:

```typescript
// Use semantic locators first
page.getByRole('button', { name: 'Delete' });

// Use test IDs when needed
page.locator('[data-testid="delete-student-btn"]');
```

### 9. Group Related Tests

```typescript
test.describe('Student Management', () => {
  test.describe('Create Student', () => {
    test('should create student with valid data', ...);
    test('should show error with invalid data', ...);
  });

  test.describe('Delete Student', () => {
    test('should delete student', ...);
    test('should show confirmation dialog', ...);
  });
});
```

### 10. Use Fixtures for Reusable Setup

Create custom fixtures for complex setup:

```typescript
// In fixtures/index.ts
export const authenticatedPage = test.extend({
  page: async ({ page }, use) => {
    await loginAsTeacher(page);
    await use(page);
  },
});

// In tests
authenticatedPage('should access dashboard', async ({ page }) => {
  // Page is already authenticated
});
```

---

## Critical User Flows to Test

### Priority 1 (P0)

1. **Teacher Analysis Workflow**:
   - Login → Select student → Start analysis → Complete conversation → View results

2. **Authentication**:
   - Email/password login
   - SSO login
   - Logout
   - Session persistence

### Priority 2 (P1)

3. **Principal Dashboard**:
   - View all classes
   - Filter by teacher/class
   - View student trends
   - Export reports

4. **Student Management**:
   - Create student
   - Edit student
   - Delete student
   - View student history

### Priority 3 (P2)

5. **Search and Filtering**:
   - Search students by name
   - Filter by class
   - Filter by grade level

6. **Analysis Results**:
   - View analysis details
   - Export analysis PDF
   - Share analysis

---

## Continuous Improvement

### Adding New Tests

When implementing a new feature:

1. Write E2E test for the happy path
2. Write E2E tests for error cases
3. Add unit tests for complex logic
4. Update this document if new patterns emerge

### Reviewing Test Failures

When tests fail in CI:

1. Check the test report for screenshots/videos
2. Run the test locally to reproduce
3. Fix the test OR fix the bug
4. Add additional tests to prevent regression

### Performance

Monitor test execution time:

- E2E suite should complete in < 10 minutes
- Individual tests should finish in < 30 seconds
- Use parallelization to keep tests fast

---

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Locators Guide](https://playwright.dev/docs/locators)
- [Assertions](https://playwright.dev/docs/test-assertions)
- [VS Code Extension](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)

---

**Last Updated**: 2025-12-30
**Maintained By**: E2E Test Engineer
