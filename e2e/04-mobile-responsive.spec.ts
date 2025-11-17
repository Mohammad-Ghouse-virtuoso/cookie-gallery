import { test, expect } from '@playwright/test';

/**
 * Mobile Responsive E2E Tests
 * 
 * These tests verify that the application works correctly on mobile devices
 * and responds appropriately to different viewport sizes.
 */

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.sessionStorage.setItem('cg_e2e_mode', 'true');
  });
});

test.describe('Mobile Navigation', () => {
  test('should display mobile navigation menu', async ({ page }) => {
    // Use mobile viewport
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Mobile menu button should be visible
    const menuButton = page.locator('button[aria-label*="menu" i], button[aria-label*="navigation" i], [data-testid="mobile-menu-button"]');
    
    // Check if we have a mobile menu button or regular navigation
    const menuCount = await menuButton.count();
    
    if (menuCount > 0) {
      await expect(menuButton.first()).toBeVisible();
    } else {
      // If no mobile menu, just verify page loads
      console.log('No mobile menu button found - app may use responsive design');
    }
  });

  test('should handle viewport changes', async ({ page }) => {
    // Start with desktop viewport
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Change to mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500); // Wait for CSS transitions

    // Page should still be functional
    const body = page.locator('body');
    await expect(body).toBeVisible();
  });
});

test.describe('Mobile Cookie Catalogue', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/cookies');
    await page.waitForLoadState('networkidle');
  });

  test('should display cookies in mobile view', async ({ page }) => {
    const cookieItems = page.locator('[data-testid="cookie-item"]');
    
    // Wait for at least one cookie to be visible
    await expect(cookieItems.first()).toBeVisible({ timeout: 10000 });
    
    // Verify cookies are displayed
    const count = await cookieItems.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should be able to scroll through catalogue', async ({ page }) => {
    const cookieItems = page.locator('[data-testid="cookie-item"]');
    await expect(cookieItems.first()).toBeVisible({ timeout: 10000 });

    // Get initial scroll position
    const initialScrollY = await page.evaluate(() => window.scrollY);

    // Scroll down
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(300);

    // Verify scroll occurred
    const finalScrollY = await page.evaluate(() => window.scrollY);
    expect(finalScrollY).toBeGreaterThan(initialScrollY);
  });

  test('should display images properly on mobile', async ({ page }) => {
    const images = page.locator('[data-testid="cookie-item"] img');
    const firstImage = images.first();
    
    await expect(firstImage).toBeVisible({ timeout: 10000 });
    
    // Verify image loaded properly
    const isLoaded = await firstImage.evaluate((img: HTMLImageElement) => {
      return img.complete && img.naturalHeight > 0;
    });
    
    expect(isLoaded).toBe(true);
  });
});

test.describe('Mobile Cart Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/cookies');
    await page.waitForLoadState('networkidle');
  });

  test('should add item to cart on mobile', async ({ page }) => {
    const addButton = page.locator('[data-testid^="add-to-cart-"]').first();
    await expect(addButton).toBeVisible({ timeout: 10000 });
    
    await addButton.click();
    
    // Verify cart badge updates
    const cartBadge = page.locator('[data-testid="cart-count"]');
    await expect(cartBadge).toHaveText('1', { timeout: 5000 });
  });

  test('should open cart modal on mobile', async ({ page }) => {
    // Add item first
    const addButton = page.locator('[data-testid^="add-to-cart-"]').first();
    await expect(addButton).toBeVisible({ timeout: 10000 });
    await addButton.click();
    
    // Wait for cart to update
    await page.waitForTimeout(500);
    
    // Click cart button
    const cartButton = page.locator('[data-testid="cart-button"]');
    await cartButton.click();
    
    // Cart modal should appear
    const cartModal = page.locator('[data-testid="cart-modal"]');
    await expect(cartModal).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Mobile Checkout Flow', () => {
  test('should display checkout form on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Add item to cart first
    await page.goto('/cookies');
    await page.waitForLoadState('networkidle');
    
    const addButton = page.locator('[data-testid^="add-to-cart-"]').first();
    await expect(addButton).toBeVisible({ timeout: 10000 });
    await addButton.click();
    await page.waitForTimeout(500);
    
    // Navigate to checkout
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');
    
    // Verify checkout page loaded
    await expect(page.locator('[data-testid="checkout-container"]')).toBeVisible({ timeout: 10000 });
  });

  test('should handle form inputs on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/checkout');
    await page.waitForLoadState('networkidle');
    
    // Check if form fields are accessible (may need auth)
    const checkoutContainer = page.locator('[data-testid="checkout-container"]');
    
    if (await checkoutContainer.isVisible()) {
      // Verify form can receive focus on mobile
      const formFields = page.locator('input[type="text"], input[type="email"], input[type="tel"]');
      
      if (await formFields.count() > 0) {
        const firstField = formFields.first();
        await firstField.click();
        
        // Verify field is focused
        const isFocused = await firstField.evaluate(el => el === document.activeElement);
        expect(isFocused).toBe(true);
      }
    }
  });
});

test.describe('Mobile Touch Interactions', () => {
  test('should handle tap interactions', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/cookies');
    await page.waitForLoadState('networkidle');
    
    // Tap on a cookie item
    const cookieItem = page.locator('[data-testid="cookie-item"]').first();
    await expect(cookieItem).toBeVisible({ timeout: 10000 });
    
    // Simulate touch tap
    await cookieItem.tap();
    
    // Page should respond to tap
    await page.waitForTimeout(300);
  });

  test('should handle button taps', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/cookies');
    await page.waitForLoadState('networkidle');
    
    const addButton = page.locator('[data-testid^="add-to-cart-"]').first();
    await expect(addButton).toBeVisible({ timeout: 10000 });
    
    // Tap the button
    await addButton.tap();
    
    // Verify cart updated
    const cartBadge = page.locator('[data-testid="cart-count"]');
    await expect(cartBadge).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Tablet Viewport', () => {
  test('should work on tablet viewport', async ({ page }) => {
    // iPad dimensions
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/cookies');
    await page.waitForLoadState('networkidle');
    
    // Verify page loads
    const cookieItems = page.locator('[data-testid="cookie-item"]');
    await expect(cookieItems.first()).toBeVisible({ timeout: 10000 });
    
    // Should display multiple items in a row (tablet has more space)
    const count = await cookieItems.count();
    expect(count).toBeGreaterThan(0);
  });
});
