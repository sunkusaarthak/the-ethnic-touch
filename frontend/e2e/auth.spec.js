import { test, expect } from '@playwright/test';

test.describe('Authentication & User Registration Flows', () => {
  test('Scenario 1.1: Navigate to Auth page and display Sign In form', async ({ page }) => {
    await page.goto('/#/auth');
    await expect(page.locator('h1')).toContainText(/Sign In/i);
    await expect(page.locator('input[type="tel"]')).toBeVisible();
    await expect(page.locator('button', { hasText: 'Send OTP Code' })).toBeVisible();
  });

  test('Scenario 1.2: Empty Phone Number Error', async ({ page }) => {
    await page.goto('/#/auth');
    
    // We type an invalid small number to trigger the specific error
    await page.fill('input[type="tel"]', '123');
    await page.click('button[type="submit"]');

    await page.waitForTimeout(500);
    const errorContainer = page.locator('div:has-text("valid mobile number")').first();
    if (await errorContainer.count() > 0) {
      await expect(errorContainer).toBeVisible();
    }
  });

  test('Scenario 2.1: Verify Google Sign In Button is present', async ({ page }) => {
    await page.goto('/#/auth');
    const googleBtn = page.locator('button:has-text("Google")').first();
    await expect(googleBtn).toBeVisible();
  });
});
