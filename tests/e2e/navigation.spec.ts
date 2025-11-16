import { test, expect } from '@playwright/test';

test.describe('Navigation and Routing', () => {
  test('should navigate to story page', async ({ page }) => {
    await page.goto('/story');
    
    // Page should load
    await expect(page).toHaveTitle(/Cookie Gallery/);
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should navigate to behind the scenes page', async ({ page }) => {
    await page.goto('/behind-the-scenes');
    
    // Page should load
    await expect(page).toHaveTitle(/Cookie Gallery/);
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should navigate to privacy policy page', async ({ page }) => {
    await page.goto('/privacy');
    
    // Page should load
    await expect(page).toHaveTitle(/Cookie Gallery/);
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should navigate to golden season page', async ({ page }) => {
    await page.goto('/golden-season');
    
    // Page should load
    await expect(page).toHaveTitle(/Cookie Gallery/);
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should handle 404 not found page', async ({ page }) => {
    await page.goto('/this-route-does-not-exist');
    
    // Should show a page (404 or redirect)
    await expect(page).toHaveTitle(/Cookie Gallery/);
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should navigate between pages', async ({ page }) => {
    // Test navigation between different pages
    const routes = ['/', '/cookies', '/story', '/privacy'];
    
    for (const route of routes) {
      await page.goto(route);
      await expect(page).toHaveTitle(/Cookie Gallery/);
      const body = page.locator('body');
      await expect(body).toBeVisible();
    }
  });

  test('signed-out page should be accessible', async ({ page }) => {
    await page.goto('/signed-out');
    
    // This is an unprotected route
    await expect(page).toHaveURL(/signed-out/);
    await expect(page.locator('body')).toBeVisible();
  });
});
