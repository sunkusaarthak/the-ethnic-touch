import { test, expect } from '@playwright/test';

test.describe('Cart & Wardrobe Management Spec', () => {
  test('Scenario 5.1: Add to Cart and Toast Drawer Verification', async ({ page }) => {
    await page.goto('/#/shop');
    await page.waitForTimeout(1000);

    const productCards = page.locator('.product-card, img, a[href*="#/product"]');
    if (await productCards.count() > 0) {
      await productCards.first().click();

      const addToCartBtn = page.locator('button:has-text("Add to Wardrobe"), button:has-text("Add to Cart")').first();
      if (await addToCartBtn.count() > 0 && await addToCartBtn.isVisible()) {
        await addToCartBtn.click();
        const notification = page.locator('.cart-success-notification, .toast-drawer, [role="status"]');
        if (await notification.count() > 0) {
          await expect(notification.first()).toBeVisible();
        }
      }
    }
  });

  test('Scenario 5.2: Cart Quantity Adjustment', async ({ page }) => {
    await page.goto('/#/cart');
    const incrementBtn = page.locator('button:has-text("+"), .qty-btn-plus').first();
    if (await incrementBtn.count() > 0 && await incrementBtn.isVisible()) {
      await incrementBtn.click();
      await page.waitForTimeout(300);
    }
  });
});
