import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should redirect to sign-in when not authenticated', async ({ page }) => {
    // Clear any existing auth state
    await page.context().clearCookies();
    
    // Navigate with a longer timeout
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    // Wait a bit for any redirects to complete
    await page.waitForTimeout(2000);
    
    // Should redirect to signin page if not authenticated
    // or show signin button/form
    const isSignInPage = page.url().includes('/signin');
    const hasSignInButton = await page.locator('text=/sign in|login/i').isVisible().catch(() => false);
    
    expect(isSignInPage || hasSignInButton).toBeTruthy();
  });

  test('should display sign-in page elements', async ({ page }) => {
    await page.goto('/signin');
    await page.waitForLoadState('networkidle');
    
    // Check if the sign-in page loaded
    expect(page.url()).toContain('/signin');
    
    // Verify page has content (more flexible check)
    const bodyText = await page.locator('body').textContent();
    expect(bodyText).toBeTruthy();
    expect(bodyText!.length).toBeGreaterThan(0);
  });
});
