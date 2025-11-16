import { test, expect } from '@playwright/test';

test.describe('Checkout Flow', () => {
  test('checkout page should load', async ({ page }) => {
    // Try to access checkout page
    await page.goto('/checkout');
    
    // Page should load
    await expect(page).toHaveTitle(/Cookie Gallery/);
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('should have checkout page structure', async ({ page }) => {
    // Navigate to checkout
    await page.goto('/checkout');
    
    // Verify page loads
    await expect(page).toHaveTitle(/Cookie Gallery/);
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('payment status page should be accessible', async ({ page }) => {
    // Navigate to payment status page
    await page.goto('/payment-status');
    
    // Page should load
    await expect(page).toHaveTitle(/Cookie Gallery/);
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });

  test('order success page should load', async ({ page }) => {
    // Order success page is unprotected in the routes
    await page.goto('/order-success');
    
    // Should not redirect
    await expect(page).toHaveURL(/order-success/);
    
    // Verify page loads
    await expect(page.locator('body')).toBeVisible();
  });
});
