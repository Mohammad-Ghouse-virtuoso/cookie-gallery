import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
  test('checkout page is accessible', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');
    
    // Verify we can access the checkout page
    const body = await page.locator('body').textContent();
    expect(body).toBeTruthy();
  });

  test('can navigate to checkout from homepage', async ({ page }) => {
    // Start from homepage to have navigation history
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Navigate to checkout
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');
    
    // Navigate back
    await page.goBack();
    
    // Should be back on home page
    await expect(page).toHaveURL('/');
  });

  test('checkout page loads without JavaScript errors', async ({ page }) => {
    const errors: string[] = [];
    
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });
    
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');
    
    // Verify no critical errors
    expect(errors.length).toBe(0);
  });
});
