import { test, expect } from '@playwright/test';

/**
 * Mobile Responsive E2E Tests
 * 
 * Tests covering mobile-specific functionality and responsive behavior:
 * - Mobile viewport rendering
 * - Touch interactions
 * - Mobile navigation
 * - Responsive layout
 */

// Helper to enable E2E mode
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.sessionStorage.setItem('cg_e2e_mode', 'true');
  });
});

test.describe('Mobile Viewport - Cookies Page', () => {
  test('should display cookies page on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 390, height: 844 }); // iPhone 12 size
    await page.goto('/cookies');
    await page.waitForLoadState('networkidle');
    
    const cookieItems = page.locator('[data-testid="cookie-item"]');
    await expect(cookieItems.first()).toBeVisible({ timeout: 10000 });
    
    expect(await cookieItems.count()).toBeGreaterThan(0);
  });

  test('should handle touch interactions for adding to cart', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/cookies');
    await page.waitForLoadState('networkidle');
    
    const addButton = page.locator('[data-testid^="add-to-cart-"]').first();
    await expect(addButton).toBeVisible({ timeout: 10000 });
    
    // Tap (click) to add to cart
    await addButton.tap();
    
    // Verify cart badge appears
    const cartBadge = page.locator('[data-testid="cart-count"]');
    await expect(cartBadge).toHaveText('1', { timeout: 5000 });
  });

  test('should open cart preview modal on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/cookies');
    await page.waitForLoadState('networkidle');
    
    // Add item first
    const addButton = page.locator('[data-testid^="add-to-cart-"]').first();
    await addButton.tap();
    await expect(page.locator('[data-testid="cart-count"]')).toHaveText('1');
    
    // Open cart modal
    await page.locator('[data-testid="cart-button"]').tap();
    
    // Verify modal is visible
    await expect(page.locator('[data-testid="cart-modal"]')).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Mobile Viewport - Checkout Flow', () => {
  test('should navigate to checkout on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/cookies');
    await page.waitForLoadState('networkidle');
    
    // Add item
    const addButton = page.locator('[data-testid^="add-to-cart-"]').first();
    await addButton.tap();
    await expect(page.locator('[data-testid="cart-count"]')).toHaveText('1');
    
    // Open cart and go to checkout
    await page.locator('[data-testid="cart-button"]').tap();
    await expect(page.locator('[data-testid="cart-modal"]')).toBeVisible();
    
    await page.locator('[data-testid="cart-preview-checkout"]').tap();
    await page.waitForURL(/\/checkout/);
    
    expect(page.url()).toContain('/checkout');
  });

  test('should display checkout page on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/cookies');
    await page.waitForLoadState('networkidle');
    
    // Add item and navigate to checkout
    const addButton = page.locator('[data-testid^="add-to-cart-"]').first();
    await addButton.tap();
    await expect(page.locator('[data-testid="cart-count"]')).toHaveText('1');
    
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');
    
    // Verify checkout page loads
    await expect(page.locator('[data-testid="checkout-container"]')).toBeVisible();
  });
});

test.describe('Tablet Viewport', () => {
  test('should display cookies page on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 }); // iPad Pro size
    await page.goto('/cookies');
    await page.waitForLoadState('networkidle');
    
    const cookieItems = page.locator('[data-testid="cookie-item"]');
    await expect(cookieItems.first()).toBeVisible({ timeout: 10000 });
    
    // Should have multiple items visible
    expect(await cookieItems.count()).toBeGreaterThan(2);
  });

  test('should handle cart interactions on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 1366 });
    await page.goto('/cookies');
    await page.waitForLoadState('networkidle');
    
    const addButton = page.locator('[data-testid^="add-to-cart-"]').first();
    await addButton.click();
    
    await expect(page.locator('[data-testid="cart-count"]')).toHaveText('1');
    
    // Open cart
    await page.click('[data-testid="cart-button"]');
    await expect(page.locator('[data-testid="cart-modal"]')).toBeVisible();
  });
});

test.describe('Responsive Layout', () => {
  test('should adapt layout for small screens', async ({ page }) => {
    // Set small mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.addInitScript(() => {
      window.sessionStorage.setItem('cg_e2e_mode', 'true');
    });
    
    await page.goto('/cookies');
    await page.waitForLoadState('networkidle');
    
    // Page should load without horizontal scroll
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    
    // Allow small difference for scrollbar
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 20);
  });

  test('should adapt layout for large screens', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    await page.addInitScript(() => {
      window.sessionStorage.setItem('cg_e2e_mode', 'true');
    });
    
    await page.goto('/cookies');
    await page.waitForLoadState('networkidle');
    
    // Should display multiple items in a row
    const cookieItems = page.locator('[data-testid="cookie-item"]');
    await expect(cookieItems.first()).toBeVisible();
    
    expect(await cookieItems.count()).toBeGreaterThan(0);
  });
});
