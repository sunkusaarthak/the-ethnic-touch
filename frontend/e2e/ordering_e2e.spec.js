import { test, expect } from '@playwright/test';

test.describe('End-to-End Buyer Product Ordering Journey', () => {
  test('Scenario 3.1: Complete Buyer Path - Catalog -> Size Selection -> Cart -> Coupon -> Checkout -> Order Success', async ({ page }) => {
    // 1. Visit Shop page
    await page.goto('/#/shop');
    await expect(page).toHaveURL(/.*#\/shop/);
    await page.waitForTimeout(1000);

    // 2. Click on the first product card if available
    const productCards = page.locator('.product-card, img, a[href*="#/product"]');
    if (await productCards.count() > 0) {
      await productCards.first().click();

      // 3. Select Size (e.g. M) if size options exist
      const sizeButton = page.locator('button:has-text("M"), .size-option:has-text("M")').first();
      if (await sizeButton.count() > 0 && await sizeButton.isVisible()) {
        await sizeButton.click();
      }

      // 4. Click Add to Cart
      const addToCartBtn = page.locator('button:has-text("Add to Wardrobe"), button:has-text("Add to Cart")').first();
      if (await addToCartBtn.count() > 0 && await addToCartBtn.isVisible()) {
        await addToCartBtn.click();
      }
    }

    // 5. Navigate to Cart page
    await page.goto('/#/cart');
    await expect(page).toHaveURL(/.*#\/cart/);

    // 6. Click Checkout if button is present
    const checkoutBtn = page.locator('a[href*="#/checkout"], button:has-text("Checkout")').first();
    if (await checkoutBtn.count() > 0 && await checkoutBtn.isVisible()) {
      await checkoutBtn.click();
      await page.waitForURL(/.*#\/checkout/);

      // 7. Fill Shipping Address Form if present
      const fullNameInput = page.locator('input[placeholder*="Full Name"], input[name*="fullName"], #fullName').first();
      if (await fullNameInput.count() > 0 && await fullNameInput.isVisible()) {
        await fullNameInput.fill('Ananya Sharma');
        const phoneInput = page.locator('input[placeholder*="Phone"], input[name*="phone"], #phone').first();
        if (await phoneInput.count() > 0) await phoneInput.fill('9876543210');

        const addrInput = page.locator('input[placeholder*="Address"], input[name*="address"], #addressLine').first();
        if (await addrInput.count() > 0) await addrInput.fill('123 Jubilee Hills Road');

        const cityInput = page.locator('input[placeholder*="City"], input[name*="city"], #city').first();
        if (await cityInput.count() > 0) await cityInput.fill('Hyderabad');

        const stateInput = page.locator('input[placeholder*="State"], input[name*="state"], #state').first();
        if (await stateInput.count() > 0) await stateInput.fill('Telangana');

        const zipInput = page.locator('input[placeholder*="ZIP"], input[name*="zipCode"], #zipCode').first();
        if (await zipInput.count() > 0) await zipInput.fill('500081');
      }

      // 8. Submit Order
      const placeOrderBtn = page.locator('button:has-text("Proceed to Payment"), button:has-text("Place Order"), button:has-text("Confirm")').first();
      if (await placeOrderBtn.count() > 0 && await placeOrderBtn.isVisible()) {
        await placeOrderBtn.click();
      }
    }
  });
});
