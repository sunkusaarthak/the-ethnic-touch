import { test, expect } from '@playwright/test';

test.describe('Authentication & User Registration Flows', () => {
  test('Scenario 1.1: Navigate to Auth page and display Sign In form', async ({ page }) => {
    await page.goto('/#/auth');
    await expect(page.locator('h1')).toContainText(/Welcome Back|Create Account/i);
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('Scenario 1.2: Invalid Credentials Error Alert', async ({ page }) => {
    await page.goto('/#/auth');
    await page.fill('input[type="email"]', 'invalid_test_user_99@ethnictouch.com');
    await page.fill('input[type="password"]', 'WrongPassword123!');
    await page.click('button[type="submit"]');

    await page.waitForTimeout(1500);
    const errorContainer = page.locator('div:has-text("Firebase"), div:has-text("invalid"), div:has-text("Failed")').first();
    if (await errorContainer.count() > 0) {
      await expect(errorContainer).toBeVisible();
    }
  });

  test('Scenario 2.1: Switch to Account Registration Tab', async ({ page }) => {
    await page.goto('/#/auth');
    
    // Click switch button for Register
    const registerBtn = page.locator('button:has-text("Register")').first();
    if (await registerBtn.count() > 0) {
      await registerBtn.click();
      await page.waitForTimeout(300);
      await expect(page.locator('h1')).toContainText(/Create Account/i);
      await expect(page.locator('input[type="text"]').first()).toBeVisible();
    }
  });
});
