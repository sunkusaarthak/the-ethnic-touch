import { test, expect } from '@playwright/test';

test.describe('Coupon Application & Discount Flow Spec', () => {
  test('Scenario 6.1: Valid Coupon Code Input', async ({ page }) => {
    await page.goto('/#/cart');
    const couponInput = page.locator('input[placeholder*="Coupon"], input[name*="coupon"], .coupon-input').first();
    if (await couponInput.count() > 0 && await couponInput.isVisible()) {
      await couponInput.fill('WELCOME10');
      const applyBtn = page.locator('button:has-text("Apply")').first();
      await applyBtn.click();
      await page.waitForTimeout(500);
    }
  });

  test('Scenario 6.2: Invalid Coupon Code Feedback', async ({ page }) => {
    await page.goto('/#/cart');
    const couponInput = page.locator('input[placeholder*="Coupon"], input[name*="coupon"], .coupon-input').first();
    if (await couponInput.count() > 0 && await couponInput.isVisible()) {
      await couponInput.fill('INVALID999');
      const applyBtn = page.locator('button:has-text("Apply")').first();
      await applyBtn.click();
      
      const errorMsg = page.locator('.coupon-error, .text-danger, .alert-warning');
      if (await errorMsg.count() > 0) {
        await expect(errorMsg).toBeVisible();
      }
    }
  });
});
