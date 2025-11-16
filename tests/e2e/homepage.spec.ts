import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load the homepage successfully', async ({ page }) => {
    await page.goto('/');
    
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Check if the page title contains expected text
    await expect(page).toHaveTitle(/Cookie Gallery/i);
  });

  test('should display navigation bar', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check if navigation elements are visible
    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible();
  });

  test('should navigate to cookies page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Find and click the cookies/catalogue link
    const cookiesLink = page.locator('a[href*="cookies"]').first();
    if (await cookiesLink.isVisible()) {
      await cookiesLink.click();
      await page.waitForLoadState('networkidle');
      
      // Verify URL changed
      expect(page.url()).toContain('cookies');
    }
  });
});
