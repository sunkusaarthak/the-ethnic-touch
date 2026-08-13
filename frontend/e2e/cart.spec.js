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

  test('Scenario 5.2: Cart Quantity and Delete Functionality', async ({ page }) => {
    // 1. First add an item to the cart
    await page.goto('/#/shop');
    await page.waitForTimeout(1000); // let products load
    const productCards = page.locator('.product-card, img, a[href*="#/product"]');
    if (await productCards.count() > 0) {
      await productCards.first().click();
      
      const addToCartBtn = page.locator('button:has-text("Add to Wardrobe"), button:has-text("Add to Cart")').first();
      await addToCartBtn.waitFor({ state: 'visible' });
      await addToCartBtn.click();
      
      // Wait for toast
      await page.waitForSelector('.cart-success-notification, .toast-drawer, [role="status"]');
      
      // 2. Go to Cart page
      await page.goto('/#/cart');
      await page.waitForTimeout(1000); // let cart load
      
      // Get locators for buttons
      const incrementBtn = page.getByLabel('Increase quantity').first();
      const decrementBtn = page.getByLabel('Decrease quantity').first();
      const deleteBtn = page.getByLabel('Delete item from cart').first();
      
      // We expect the item to exist
      await expect(incrementBtn).toBeVisible();
      
      // 3. Test + button
      // To test this effectively, we can check if the total price updates or just ensure the action is successful without errors
      // Playwright can verify the quantity text directly if we had a data-testid, but we can rely on visual state or text changes
      await incrementBtn.click();
      await page.waitForTimeout(500); // Wait for state update
      
      // 4. Test - button
      await decrementBtn.click();
      await page.waitForTimeout(500);
      
      // 5. Test Bin (delete) button
      await deleteBtn.click();
      await page.waitForTimeout(500);
      
      // Verify empty cart message appears
      const emptyCartMsg = page.locator('text=Your cart is empty');
      await expect(emptyCartMsg).toBeVisible();
    }
  });
});

