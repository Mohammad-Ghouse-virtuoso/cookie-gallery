import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check if the page title contains Cookie Gallery
    await expect(page).toHaveTitle(/Cookie Gallery/i);
  });

  test('can navigate to cookie catalogue directly', async ({ page }) => {
    // Navigate directly to the catalogue
    await page.goto('/cookies');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Verify we're on the cookies page
    await expect(page).toHaveURL('/cookies');
    
    // Verify the catalogue page loaded
    await expect(page.getByRole('heading', { name: 'Cookie Catalogue' })).toBeVisible();
  });

  test('navigation bar is visible on all pages', async ({ page }) => {
    // Test on homepage
    await page.goto('/');
    await expect(page.locator('nav, header').first()).toBeVisible();
    
    // Test on catalogue page
    await page.goto('/cookies');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('nav, header').first()).toBeVisible();
  });
});
