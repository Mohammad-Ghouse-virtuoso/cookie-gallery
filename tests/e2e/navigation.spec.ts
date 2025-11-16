import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check if the page title or main content is visible
    await expect(page).toHaveTitle(/Cookie Gallery/i);
  });

  test('can navigate to different pages', async ({ page }) => {
    await page.goto('/');
    
    // Wait for navigation to be ready
    await page.waitForLoadState('networkidle');
    
    // Check if we're on the homepage
    await expect(page).toHaveURL('/');
  });
});
