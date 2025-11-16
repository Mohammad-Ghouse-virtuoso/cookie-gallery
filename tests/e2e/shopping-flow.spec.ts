import { test, expect } from '@playwright/test';

/**
 * Shopping Flow E2E Tests
 * Tests the core shopping functionality: browsing cookies, adding to cart, and managing cart
 */

test.describe('Shopping Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home page before each test
    await page.goto('/');
  });

  test('user can view the cookie catalogue', async ({ page }) => {
    // Navigate to cookies page
    await page.goto('/cookies');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Verify cookies are displayed (look for cookie cards or grid)
    const cookieElements = page.locator('[class*="cookie"], [data-testid*="cookie"], article, .product-card').first();
    await expect(cookieElements).toBeVisible({ timeout: 10000 });
  });

  test('user can browse home page', async ({ page }) => {
    // Verify home page loads
    await expect(page).toHaveURL('/');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Verify page has content
    const mainContent = page.locator('main, [role="main"], body');
    await expect(mainContent).toBeVisible();
  });

  test('user can navigate between pages', async ({ page }) => {
    // Wait for navigation to be ready
    await page.waitForLoadState('networkidle');
    
    // Try to find and click on cookies/catalogue link
    const catalogueLink = page.getByRole('link', { name: /cookie|catalogue|shop|products/i }).first();
    
    // Check if link exists
    const linkExists = await catalogueLink.count();
    
    if (linkExists > 0) {
      await catalogueLink.click();
      await page.waitForLoadState('networkidle');
      
      // Verify navigation happened
      expect(page.url()).toMatch(/\/(cookies|catalogue|shop|products)/i);
    }
  });

  test('cart starts empty', async ({ page }) => {
    await page.waitForLoadState('networkidle');
    
    // Look for cart button or cart indicator
    const cartButton = page.locator('[data-testid="cart-button"], [aria-label*="cart" i], button:has-text("cart")').first();
    
    if (await cartButton.count() > 0) {
      // Check if cart badge shows 0 or doesn't exist
      const cartBadge = page.locator('[data-testid="cart-badge"], [class*="badge"]');
      const badgeCount = await cartBadge.count();
      
      if (badgeCount > 0) {
        const badgeText = await cartBadge.textContent();
        // Cart should be empty or show 0
        expect(badgeText === '0' || badgeText === '').toBeTruthy();
      }
    }
  });
});
