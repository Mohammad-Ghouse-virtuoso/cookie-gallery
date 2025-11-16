import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate to story page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const storyLink = page.locator('a[href*="story"]').first();
    if (await storyLink.isVisible()) {
      await storyLink.click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain('story');
    }
  });

  test('should navigate to privacy policy page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const privacyLink = page.locator('a[href*="privacy"]').first();
    if (await privacyLink.isVisible()) {
      await privacyLink.click();
      await page.waitForLoadState('networkidle');
      expect(page.url()).toContain('privacy');
    }
  });

  test('should handle 404 for non-existent routes', async ({ page }) => {
    await page.goto('/non-existent-route');
    await page.waitForLoadState('networkidle');
    
    // Should either redirect or show 404 page
    const is404 = await page.locator('text=/404|not found/i').isVisible().catch(() => false);
    const isRedirect = page.url().includes('/signin') || page.url() === '/';
    
    expect(is404 || isRedirect).toBeTruthy();
  });
});
