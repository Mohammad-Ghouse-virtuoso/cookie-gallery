import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load home page successfully', async ({ page }) => {
    // Navigate to home page
    await page.goto('/');
    
    // Check if page loaded
    await expect(page).toHaveTitle(/Cookie Gallery/);
    
    // Check for page content
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should load sign-in page', async ({ page }) => {
    await page.goto('/signin');
    
    // Verify we're on the sign-in page
    await expect(page).toHaveURL(/signin/);
    await expect(page).toHaveTitle(/Cookie Gallery/);
  });

  test('should load cookies catalogue page', async ({ page }) => {
    // Navigate to cookies catalogue
    await page.goto('/cookies');
    
    // Page should load (may require auth but doesn't redirect immediately)
    await expect(page).toHaveTitle(/Cookie Gallery/);
  });
});
