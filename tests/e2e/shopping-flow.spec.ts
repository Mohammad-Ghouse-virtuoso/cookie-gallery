import { test, expect } from '@playwright/test';

/**
 * Shopping Flow E2E Tests
 * 
 * Comprehensive tests covering the entire shopping journey:
 * - Browse products
 * - Add items to cart
 * - Update quantities
 * - Remove items
 * - Cart persistence
 */

// Helper to enable E2E mode
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.sessionStorage.setItem('cg_e2e_mode', 'true');
  });
});

test.describe('Browse Products', () => {
  test('should display cookie catalogue with multiple items', async ({ page }) => {
    await page.goto('/cookies');
    await page.waitForLoadState('networkidle');
    
    const cookieItems = page.locator('[data-testid="cookie-item"]');
    await expect(cookieItems.first()).toBeVisible({ timeout: 10000 });
    
    const itemCount = await cookieItems.count();
    expect(itemCount).toBeGreaterThan(3);
  });

  test('should display product information correctly', async ({ page }) => {
    await page.goto('/cookies');
    await page.waitForLoadState('networkidle');
    
    const firstCookie = page.locator('[data-testid="cookie-item"]').first();
    await expect(firstCookie).toBeVisible();
    
    // Check for image
    await expect(firstCookie.locator('img')).toBeVisible();
    
    // Check for price
    await expect(firstCookie.locator('text=/₹/')).toBeVisible();
    
    // Check for add to cart button
    await expect(firstCookie.locator('[data-testid^="add-to-cart-"]')).toBeVisible();
  });

  test('should navigate to product detail page', async ({ page }) => {
    await page.goto('/cookies');
    await page.waitForLoadState('networkidle');
    
    const viewDetailsButton = page.locator('button:has-text("View Details")').first();
    await expect(viewDetailsButton).toBeVisible({ timeout: 10000 });
    
    await viewDetailsButton.click();
    await page.waitForURL(/\/product\//);
    
    // Verify we're on product detail page
    await expect(page.locator('h1, h2, [data-testid="product-title"]').first()).toBeVisible();
  });
});

test.describe('Add to Cart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cookies');
    await page.waitForLoadState('networkidle');
  });

  test('should add single item to cart', async ({ page }) => {
    const addButton = page.locator('[data-testid^="add-to-cart-"]').first();
    await expect(addButton).toBeVisible({ timeout: 10000 });
    
    await addButton.click();
    
    // Verify cart badge shows 1 item
    const cartBadge = page.locator('[data-testid="cart-count"]');
    await expect(cartBadge).toHaveText('1', { timeout: 5000 });
  });

  test('should add multiple different items to cart', async ({ page }) => {
    const addButtons = page.locator('[data-testid^="add-to-cart-"]');
    
    // Add first item
    await addButtons.nth(0).click();
    await expect(page.locator('[data-testid="cart-count"]')).toHaveText('1');
    
    // Add second item
    await addButtons.nth(1).click();
    await expect(page.locator('[data-testid="cart-count"]')).toHaveText('2');
    
    // Add third item
    await addButtons.nth(2).click();
    await expect(page.locator('[data-testid="cart-count"]')).toHaveText('3');
  });

  test('should persist cart items in session storage', async ({ page }) => {
    const addButton = page.locator('[data-testid^="add-to-cart-"]').first();
    await addButton.click();
    
    // Wait for cart badge
    await expect(page.locator('[data-testid="cart-count"]')).toHaveText('1');
    
    // Check session storage
    const cartData = await page.evaluate(() => {
      return window.sessionStorage.getItem('cg-e2e-cart');
    });
    
    expect(cartData).not.toBeNull();
    const cart = JSON.parse(cartData as string);
    expect(cart).not.toBeNull();
  });
});

test.describe('Update Cart Quantities', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cookies');
    await page.waitForLoadState('networkidle');
    
    // Add an item to cart
    const addButton = page.locator('[data-testid^="add-to-cart-"]').first();
    await addButton.click();
    await expect(page.locator('[data-testid="cart-count"]')).toHaveText('1');
  });

  test('should increase item quantity from cart preview', async ({ page }) => {
    // Open cart preview
    await page.click('[data-testid="cart-button"]');
    await expect(page.locator('[data-testid="cart-modal"]')).toBeVisible({ timeout: 5000 });
    
    // Increment quantity
    const incrementButton = page.locator('[data-testid^="cart-preview-increment-"]').first();
    await incrementButton.click();
    
    // Verify quantity updated
    const quantityDisplay = page.locator('[data-testid^="cart-preview-quantity-"]').first();
    await expect(quantityDisplay).toHaveText('2');
    
    // Verify cart badge updated
    await expect(page.locator('[data-testid="cart-count"]')).toHaveText('2');
  });

  test('should decrease item quantity from cart preview', async ({ page }) => {
    // Open cart preview and add one more
    await page.click('[data-testid="cart-button"]');
    await expect(page.locator('[data-testid="cart-modal"]')).toBeVisible();
    
    const incrementButton = page.locator('[data-testid^="cart-preview-increment-"]').first();
    await incrementButton.click();
    await expect(page.locator('[data-testid="cart-count"]')).toHaveText('2');
    
    // Now decrease
    const decrementButton = page.locator('[data-testid^="cart-preview-decrement-"]').first();
    await decrementButton.click();
    
    // Verify quantity decreased
    const quantityDisplay = page.locator('[data-testid^="cart-preview-quantity-"]').first();
    await expect(quantityDisplay).toHaveText('1');
    await expect(page.locator('[data-testid="cart-count"]')).toHaveText('1');
  });
});

test.describe('Remove Items from Cart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/cookies');
    await page.waitForLoadState('networkidle');
    
    // Add an item to cart
    const addButton = page.locator('[data-testid^="add-to-cart-"]').first();
    await addButton.click();
    await expect(page.locator('[data-testid="cart-count"]')).toHaveText('1');
  });

  test('should remove item by decreasing quantity to zero', async ({ page }) => {
    // Open cart preview
    await page.click('[data-testid="cart-button"]');
    await expect(page.locator('[data-testid="cart-modal"]')).toBeVisible();
    
    // Decrement to remove
    const decrementButton = page.locator('[data-testid^="cart-preview-decrement-"]').first();
    await decrementButton.click();
    
    // Verify cart is empty
    await expect(page.locator('[data-testid="cart-preview-empty"]')).toBeVisible();
    await expect(page.locator('[data-testid="cart-count"]')).toHaveCount(0);
  });

  test('should show empty cart message when all items removed', async ({ page }) => {
    // Open cart and remove item
    await page.click('[data-testid="cart-button"]');
    await expect(page.locator('[data-testid="cart-modal"]')).toBeVisible();
    
    const decrementButton = page.locator('[data-testid^="cart-preview-decrement-"]').first();
    await decrementButton.click();
    
    // Verify empty cart message
    const emptyMessage = page.locator('[data-testid="cart-preview-empty"]');
    await expect(emptyMessage).toBeVisible();
    await expect(emptyMessage).toContainText(/empty/i);
  });
});
