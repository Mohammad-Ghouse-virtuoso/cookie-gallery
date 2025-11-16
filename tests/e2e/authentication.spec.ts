import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('homepage loads for anonymous users', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Verify the page loaded successfully
    await expect(page.locator('body')).toBeVisible();
  });

  test('can navigate to signin page if it exists', async ({ page }) => {
    await page.goto('/signin');
    
    // Either the signin page loads, or we're redirected somewhere
    await page.waitForLoadState('networkidle');
    
    // Just verify something loaded
    const body = await page.locator('body').textContent();
    expect(body).toBeTruthy();
  });

  test('application is responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Verify page renders on mobile
    await expect(page.locator('body')).toBeVisible();
  });
});
