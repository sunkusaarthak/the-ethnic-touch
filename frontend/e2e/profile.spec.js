import { test, expect } from '@playwright/test';

test.describe('Customer Profile & Address Book Spec', () => {
  test('Scenario 7.1: Profile Page Navigation', async ({ page }) => {
    await page.goto('/#/profile');
    await expect(page).toHaveURL(/.*#\/profile/);
    await expect(page.locator('h1')).toBeVisible();
  });
});
