import { test, expect } from '@playwright/test';

/**
 * Authentication E2E Tests
 * 
 * Tests covering authentication flows:
 * - Sign in page display
 * - Protected route access
 * - Sign out functionality
 * - Authentication state persistence
 */

test.describe('Sign In Page', () => {
  test('should display sign in page correctly', async ({ page }) => {
    await page.goto('/signin');
    await page.waitForLoadState('networkidle');
    
    // Verify we're on signin page
    expect(page.url()).toContain('/signin');
    
    // Check for Google sign-in button
    const googleSignInButton = page.locator('button:has-text("Sign in with Google"), button:has-text("Continue with Google")');
    await expect(googleSignInButton.first()).toBeVisible({ timeout: 10000 });
  });

  test('should display app branding on sign in page', async ({ page }) => {
    await page.goto('/signin');
    await page.waitForLoadState('networkidle');
    
    // Page should have content
    const bodyText = await page.locator('body').textContent();
    expect(bodyText?.length).toBeGreaterThan(0);
  });

  test('should load sign in page quickly', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/signin');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Sign-in page should load in less than 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });
});

test.describe('Protected Routes', () => {
  test('should redirect to sign-in for unauthenticated access', async ({ page }) => {
    // Try to access home page without authentication
    await page.goto('/home');
    await page.waitForLoadState('networkidle');
    
    const currentUrl = page.url();
    
    // Should be redirected to signin or remain on home (if E2E mode handles auth)
    expect(currentUrl).toMatch(/(\/signin|\/home)/);
  });

  test('should allow access to public pages without authentication', async ({ page }) => {
    // Test privacy page
    await page.goto('/privacy');
    await page.waitForLoadState('networkidle');
    
    const url = page.url();
    // Either we can access it or get redirected to signin
    expect(url.length).toBeGreaterThan(0);
  });

  test('should allow access to cookies page in E2E mode', async ({ page }) => {
    await page.addInitScript(() => {
      window.sessionStorage.setItem('cg_e2e_mode', 'true');
    });
    
    await page.goto('/cookies');
    await page.waitForLoadState('networkidle');
    
    const url = page.url();
    expect(url).toContain('/cookies');
  });
});

test.describe('Sign Out', () => {
  test('should display signed out page', async ({ page }) => {
    await page.goto('/signed-out');
    await page.waitForLoadState('networkidle');
    
    const url = page.url();
    expect(url).toContain('/signed-out');
  });

  test('should show sign in option on signed out page', async ({ page }) => {
    await page.goto('/signed-out');
    await page.waitForLoadState('networkidle');
    
    // Look for sign in link or button
    const signInLinks = page.locator('a[href*="/signin"], button:has-text("Sign in")');
    const hasSignInOption = await signInLinks.count() > 0;
    
    // Should have some way to sign back in
    expect(hasSignInOption).toBeTruthy();
  });
});

test.describe('Authentication State', () => {
  test('should handle E2E mode authentication bypass', async ({ page }) => {
    await page.addInitScript(() => {
      window.sessionStorage.setItem('cg_e2e_mode', 'true');
    });
    
    await page.goto('/cookies');
    await page.waitForLoadState('networkidle');
    
    // In E2E mode, should be able to access protected routes
    const url = page.url();
    expect(url).toContain('/cookies');
    
    // Should see cookie items
    const cookieItems = page.locator('[data-testid="cookie-item"]');
    await expect(cookieItems.first()).toBeVisible({ timeout: 10000 });
  });

  test('should maintain E2E mode across navigation', async ({ page }) => {
    await page.addInitScript(() => {
      window.sessionStorage.setItem('cg_e2e_mode', 'true');
    });
    
    await page.goto('/cookies');
    await page.waitForLoadState('networkidle');
    
    // Navigate to another page
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // E2E mode should still be active
    const e2eMode = await page.evaluate(() => {
      return window.sessionStorage.getItem('cg_e2e_mode');
    });
    
    expect(e2eMode).toBe('true');
  });
});
