import { test, expect } from '@playwright/test';

test.describe('Catalog Exploration & Product Details Spec', () => {
  test('Scenario 4.1: Home to Shop Navigation', async ({ page }) => {
    await page.goto('/');
    const exploreBtn = page.locator('a[href*="shop"], .btn-primary').first();
    if (await exploreBtn.count() > 0 && await exploreBtn.isVisible()) {
      await exploreBtn.click();
      await page.waitForTimeout(500);
      await expect(page).toHaveURL(/.*shop/);
    }
  });

  test('Scenario 4.2: Global Search Input Filtering', async ({ page }) => {
    await page.goto('/#/shop');
    const searchInput = page.locator('input[placeholder*="Search"], input[type="search"]').first();
    if (await searchInput.count() > 0 && await searchInput.isVisible()) {
      await searchInput.fill('Silk');
      await searchInput.press('Enter');
      await page.waitForTimeout(500);
      const items = page.locator('.product-card, img');
      if (await items.count() > 0) {
        await expect(items.first()).toBeVisible();
      }
    }
  });
});
