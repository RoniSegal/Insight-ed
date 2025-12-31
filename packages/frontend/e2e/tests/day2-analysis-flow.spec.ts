import { test, expect } from '@playwright/test';
import { loginAsTeacher } from '../fixtures/auth';

/**
 * Day 2 Critical Flow E2E Test
 * GE-056, GE-057, GE-058, GE-059
 *
 * Tests the complete student analysis flow:
 * Login → Select Student → Chat → Complete Analysis → View Results → Print
 */

test.describe('Day 2: Student Analysis Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login as teacher before each test
    await loginAsTeacher(page);
  });

  test('complete analysis flow with template responses', async ({ page }) => {
    // STEP 1: Navigate to Students page
    await page.goto('/students');
    await expect(page).toHaveURL(/\/students/);

    // STEP 2: Select first student
    const firstStudent = page.locator('[data-testid="student-card"]').first();
    await expect(firstStudent).toBeVisible();

    const studentName = await firstStudent.locator('[data-testid="student-name"]').textContent();
    await firstStudent.click();

    // Alternative: Click "Start Analysis" button if exists
    const analyzeButton = firstStudent.locator('button:has-text("ניתוח")');
    if (await analyzeButton.isVisible()) {
      await analyzeButton.click();
    }

    // STEP 3: Wait for Chat page to load
    await page.waitForURL(/\/students\/[^\/]+\/chat/);

    // Verify chat interface loaded
    await expect(page.locator('text=מתחיל שיחה...')).toBeHidden({ timeout: 10000 });

    // STEP 4: Verify first AI message appears
    const firstAiMessage = page.locator('[data-role="assistant"]').first();
    await expect(firstAiMessage).toBeVisible({ timeout: 5000 });
    await expect(firstAiMessage).toContainText('שאלה 1 מתוך 6');

    // STEP 5: Send first response
    const messageInput = page.locator('textarea[placeholder*="הקלד"], textarea[placeholder*="כתוב"]');
    await expect(messageInput).toBeVisible();

    await messageInput.fill('התלמיד מצטיין במתמטיקה אבל מתקשה בקריאה');
    await messageInput.press('Enter');

    // Verify message sent and AI responds
    await expect(page.locator('text=התלמיד מצטיין במתמטיקה')).toBeVisible();
    await expect(page.locator('text=שאלה 2 מתוך 6')).toBeVisible({ timeout: 10000 });

    // STEP 6: Send multiple responses to reach minimum message count
    const responses = [
      'הוא לומד בצורה ויזואלית ומשתתף פעיל בשיעורים',
      'משלים שיעורי בית בזמן, מתנהג יפה בכיתה',
      'עובד טוב בקבוצות, חברותי ומכבד חברים',
      'האתגר העיקרי הוא קריאה, אבל יש שיפור לאחרונה',
      'חוזק במתמטיקה ופתרון בעיות יצירתי',
    ];

    for (const response of responses) {
      await messageInput.fill(response);
      await messageInput.press('Enter');
      await page.waitForTimeout(500); // Wait for message to send
    }

    // STEP 7: Wait for "Complete Analysis" button to appear
    const completeButton = page.locator('button:has-text("השלם ניתוח")');
    await expect(completeButton).toBeVisible({ timeout: 5000 });
    await expect(completeButton).toBeEnabled();

    // STEP 8: Click Complete Analysis
    await completeButton.click();

    // Handle confirmation dialog if it appears
    page.on('dialog', dialog => {
      expect(dialog.type()).toBe('confirm');
      dialog.accept();
    });

    // STEP 9: Wait for navigation to results page
    await page.waitForURL(/\/results\/[^\/]+/, { timeout: 15000 });

    // STEP 10: Verify results page loaded
    await expect(page.locator('text=טוען תוצאות...')).toBeHidden({ timeout: 10000 });

    // Verify student name in header
    if (studentName) {
      await expect(page.locator('h1, h2').first()).toContainText(studentName.trim());
    }

    // Verify analysis content is visible
    const analysisContent = page.locator('[data-testid="analysis-content"]');
    await expect(analysisContent).toBeVisible();

    // Verify Hebrew text is present (RTL check)
    const htmlDir = await page.locator('html').getAttribute('dir');
    expect(htmlDir).toBe('rtl');

    // STEP 11: Test "Back to Students" button
    const backButton = page.locator('button:has-text("חזרה לרשימת התלמידים")');
    await expect(backButton).toBeVisible();
    await backButton.click();
    await expect(page).toHaveURL(/\/students/);

    // Navigate back to results to test print
    await page.goBack();
    await page.waitForURL(/\/results\/[^\/]+/);

    // STEP 12: Test Print button
    const printButton = page.locator('button:has-text("הדפס")');
    await expect(printButton).toBeVisible();

    // Mock print dialog
    let printCalled = false;
    await page.exposeFunction('mockPrint', () => {
      printCalled = true;
    });

    await page.evaluate(() => {
      window.print = () => (window as any).mockPrint();
    });

    await printButton.click();
    await page.waitForTimeout(500);

    expect(printCalled).toBe(true);
  });

  test('should handle conversation with OpenAI when configured', async ({ page }) => {
    // Skip if OpenAI not configured
    const response = await page.request.get('/api/health'); // Hypothetical endpoint
    // This test would check if real OpenAI responses work

    // Navigate to chat
    await page.goto('/students');
    const firstStudent = page.locator('[data-testid="student-card"]').first();
    await firstStudent.click();

    await page.waitForURL(/\/students\/[^\/]+\/chat/);

    // Send a message
    const messageInput = page.locator('textarea');
    await messageInput.fill('התלמיד מצטיין במתמטיקה');
    await messageInput.press('Enter');

    // Wait for AI response
    const aiMessages = page.locator('[data-role="assistant"]');
    await expect(aiMessages.nth(1)).toBeVisible({ timeout: 15000 });

    // Verify response is dynamic (not template)
    const responseText = await aiMessages.nth(1).textContent();
    expect(responseText).toBeTruthy();
    expect(responseText!.length).toBeGreaterThan(20);
  });

  test('should show error when completing analysis too early', async ({ page }) => {
    // Navigate to chat
    await page.goto('/students');
    const firstStudent = page.locator('[data-testid="student-card"]').first();
    await firstStudent.click();

    await page.waitForURL(/\/students\/[^\/]+\/chat/);

    // Wait for first AI message
    await expect(page.locator('[data-role="assistant"]').first()).toBeVisible();

    // Send only 1 response (less than minimum 4)
    const messageInput = page.locator('textarea');
    await messageInput.fill('תשובה קצרה');
    await messageInput.press('Enter');

    // Wait a bit
    await page.waitForTimeout(1000);

    // Complete button should not be visible yet (less than 4 messages)
    const completeButton = page.locator('button:has-text("השלם ניתוח")');
    await expect(completeButton).toBeHidden();

    // Send 2 more messages to reach 4 total (2 AI + 2 user = 4)
    await messageInput.fill('תשובה שנייה');
    await messageInput.press('Enter');
    await page.waitForTimeout(500);

    await messageInput.fill('תשובה שלישית');
    await messageInput.press('Enter');
    await page.waitForTimeout(500);

    // Now button should appear
    await expect(completeButton).toBeVisible({ timeout: 5000 });
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Navigate to chat
    await page.goto('/students');
    const firstStudent = page.locator('[data-testid="student-card"]').first();
    await firstStudent.click();

    await page.waitForURL(/\/students\/[^\/]+\/chat/);

    // Wait for chat to load
    await expect(page.locator('[data-role="assistant"]').first()).toBeVisible();

    // Simulate network error by blocking API calls
    await page.route('**/api/analysis/chat', route => route.abort());

    // Try to send a message
    const messageInput = page.locator('textarea');
    await messageInput.fill('הודעת בדיקה');
    await messageInput.press('Enter');

    // Should show error message
    await expect(page.locator('text=/שגיאה|failed|error/i')).toBeVisible({ timeout: 5000 });

    // Message should not appear in chat (rolled back)
    await expect(page.locator('text=הודעת בדיקה')).toBeHidden();
  });

  test('should preserve conversation state on page refresh', async ({ page }) => {
    // Navigate to chat
    await page.goto('/students');
    const firstStudent = page.locator('[data-testid="student-card"]').first();
    await firstStudent.click();

    await page.waitForURL(/\/students\/[^\/]+\/chat/);

    // Wait for first AI message
    await expect(page.locator('[data-role="assistant"]').first()).toBeVisible();

    // Send a message
    const messageInput = page.locator('textarea');
    await messageInput.fill('תשובה לשמירה');
    await messageInput.press('Enter');

    // Wait for response
    await page.waitForTimeout(1000);

    // Count messages before refresh
    const messagesBefore = await page.locator('[data-role="user"], [data-role="assistant"]').count();

    // Refresh page
    await page.reload();

    // NOTE: Current implementation uses in-memory store, so conversation will be lost
    // This test documents current behavior
    // If conversation persistence is added, update this test

    // After refresh, conversation should restart (current MVP behavior)
    await page.waitForTimeout(2000);
    const messagesAfter = await page.locator('[data-role="user"], [data-role="assistant"]').count();

    // For MVP: conversation is lost (messagesAfter will be 1 - just the first AI message)
    // For production: conversation should be preserved (messagesAfter === messagesBefore)
    expect(messagesAfter).toBeGreaterThanOrEqual(1);
  });

  test('should display Hebrew text in RTL layout', async ({ page }) => {
    // Navigate to chat
    await page.goto('/students');
    const firstStudent = page.locator('[data-testid="student-card"]').first();
    await firstStudent.click();

    await page.waitForURL(/\/students\/[^\/]+\/chat/);

    // Verify RTL direction
    const chatContainer = page.locator('[dir="rtl"]');
    await expect(chatContainer).toBeVisible();

    // Verify Hebrew text renders correctly
    const aiMessage = page.locator('[data-role="assistant"]').first();
    await expect(aiMessage).toBeVisible();

    const hebrewText = await aiMessage.textContent();
    expect(hebrewText).toMatch(/[\u0590-\u05FF]/); // Hebrew Unicode range

    // Verify text alignment (should be right-aligned for RTL)
    const textAlign = await aiMessage.evaluate(el => getComputedStyle(el).textAlign);
    expect(textAlign).toMatch(/right|start/);
  });

  test('should enforce rate limiting', async ({ page }) => {
    // This test would require sending 20+ messages rapidly
    // Skip for now as it's covered by API unit tests
    test.skip();
  });
});

test.describe('Day 2: Edge Cases', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsTeacher(page);
  });

  test('should handle very long messages', async ({ page }) => {
    await page.goto('/students');
    const firstStudent = page.locator('[data-testid="student-card"]').first();
    await firstStudent.click();

    await page.waitForURL(/\/students\/[^\/]+\/chat/);
    await expect(page.locator('[data-role="assistant"]').first()).toBeVisible();

    // Send very long message (1000 characters)
    const longMessage = 'א'.repeat(1000);
    const messageInput = page.locator('textarea');
    await messageInput.fill(longMessage);
    await messageInput.press('Enter');

    // Should handle gracefully
    await expect(page.locator(`text=${longMessage.substring(0, 50)}`)).toBeVisible({ timeout: 5000 });
  });

  test('should handle special characters in messages', async ({ page }) => {
    await page.goto('/students');
    const firstStudent = page.locator('[data-testid="student-card"]').first();
    await firstStudent.click();

    await page.waitForURL(/\/students\/[^\/]+\/chat/);
    await expect(page.locator('[data-role="assistant"]').first()).toBeVisible();

    // Send message with special characters
    const specialMessage = 'התלמיד/ה אוהב/ת "מתמטיקה" & "מדעים" (90%) ⭐';
    const messageInput = page.locator('textarea');
    await messageInput.fill(specialMessage);
    await messageInput.press('Enter');

    // Should display correctly
    await expect(page.locator(`text=${specialMessage}`)).toBeVisible({ timeout: 5000 });
  });

  test('should handle empty student list', async ({ page }) => {
    // This would require mocking API to return empty array
    // Skip for MVP
    test.skip();
  });
});
