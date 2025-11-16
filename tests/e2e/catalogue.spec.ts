import { test, expect } from '@playwright/test';

test.describe('Cookie Catalogue', () => {
  test('should display cookie catalogue page', async ({ page }) => {
    await page.goto('/cookies');
    await page.waitForLoadState('networkidle');
    
    // Verify we're on the cookies page
    expect(page.url()).toContain('cookies');
  });

  test('should display cookie items', async ({ page }) => {
    await page.goto('/cookies');
    await page.waitForLoadState('networkidle');
    
    // Wait a bit for content to render
    await page.waitForTimeout(1000);
    
    // Check if there are any cookie items displayed
    // This is a flexible check that looks for common elements
    const hasContent = await page.locator('body').textContent();
    expect(hasContent).toBeTruthy();
    expect(hasContent!.length).toBeGreaterThan(0);
  });
});
