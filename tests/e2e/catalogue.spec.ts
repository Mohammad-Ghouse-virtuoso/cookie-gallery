import { test, expect } from '@playwright/test';

test.describe('Cookie Catalogue', () => {
  test('should show catalogue page structure', async ({ page }) => {
    // Navigate to cookies catalogue
    await page.goto('/cookies');
    
    // Verify page loads
    await expect(page).toHaveTitle(/Cookie Gallery/);
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should be accessible from signin page', async ({ page }) => {
    await page.goto('/signin');
    
    // Check that sign-in page is loaded
    await expect(page).toHaveURL(/signin/);
    
    // Verify page content exists
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('product detail page should load', async ({ page }) => {
    // Try to access a product detail page
    await page.goto('/product/choc-chip');
    
    // Page should load
    await expect(page).toHaveTitle(/Cookie Gallery/);
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});
