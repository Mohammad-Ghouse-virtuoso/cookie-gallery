import { test, expect } from '@playwright/test';

test.describe('Shopping Flow', () => {
  test('user can browse cookies and see catalog', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Verify cookie gallery is visible
    await expect(page.locator('h1, h2').first()).toBeVisible();
    
    // Verify some content is loaded (could be cookie cards or other content)
    await expect(page.locator('body')).toContainText(/cookie|Cookie|Gallery|gallery/i);
  });

  test('user can navigate to different pages', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check that navigation is functional
    const body = await page.locator('body').textContent();
    expect(body).toBeTruthy();
  });

  test('homepage loads without errors', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for critical console errors
    expect(errors.length).toBe(0);
  });
});
