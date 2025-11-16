import { test, expect } from '@playwright/test';

test.describe('Shopping Flow', () => {
  test('user can browse cookies and add to cart', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
    
    // Wait for cookies to load
    await expect(
      page.locator('[data-testid="cookie-card"]').first()
    ).toBeVisible({ timeout: 10000 });
    
    // Click on a cookie card
    await page.locator('[data-testid="cookie-card"]').first().click();
    
    // Verify modal opens
    await expect(page.locator('[role="dialog"]')).toBeVisible();
    
    // Add to cart
    await page.click('button:has-text("Add to Cart")');
    
    // Verify cart badge updates
    await expect(page.locator('[data-testid="cart-badge"]'))
      .toContainText('1', { timeout: 5000 });
    
    // Close modal
    await page.keyboard.press('Escape');
    
    // Verify modal closes
    await expect(page.locator('[role="dialog"]')).not.toBeVisible();
  });

  test('user can view cart and update quantities', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Add item to cart
    await page.locator('[data-testid="cookie-card"]').first().click();
    await page.click('button:has-text("Add to Cart")');
    await page.keyboard.press('Escape');
    
    // Open cart
    await page.click('[data-testid="cart-button"]');
    
    // Verify cart modal is visible
    await expect(page.locator('[data-testid="cart-modal"]')).toBeVisible();
    
    // Verify cart has items
    await expect(page.locator('[data-testid="cart-item"]')).toHaveCount(1);
  });
});
