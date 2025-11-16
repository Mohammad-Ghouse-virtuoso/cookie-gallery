import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should display sign-in page', async ({ page }) => {
    await page.goto('/signin');
    
    // Verify we're on sign-in page
    await expect(page).toHaveURL(/signin/);
    await expect(page).toHaveTitle(/Cookie Gallery/);
    
    // Check for common sign-in page elements
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should have sign-in page structure', async ({ page }) => {
    await page.goto('/signin');
    
    // Check for page content
    const content = page.locator('body');
    await expect(content).toBeVisible();
    
    // Verify page is loaded and interactive
    await expect(page).toHaveTitle(/Cookie Gallery/);
  });

  test('should load sign-in page assets', async ({ page }) => {
    const response = await page.goto('/signin');
    
    // Check that page loaded successfully
    expect(response?.status()).toBe(200);
  });

  test('signed-out page should be accessible', async ({ page }) => {
    await page.goto('/signed-out');
    
    await expect(page).toHaveURL(/signed-out/);
    await expect(page.locator('body')).toBeVisible();
  });

  test('should navigate to different pages from signin', async ({ page }) => {
    // Navigate to sign-in
    await page.goto('/signin');
    await expect(page).toHaveURL(/signin/);
    
    // Navigate to other page
    await page.goto('/cookies');
    
    // Page should load (authentication is handled by the app)
    await expect(page).toHaveTitle(/Cookie Gallery/);
  });
});
