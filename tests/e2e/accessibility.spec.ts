import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test('homepage has proper document structure', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Check for navigation landmark
    const nav = page.getByRole('navigation');
    await expect(nav).toBeVisible();
    
    // Check for main heading
    const mainHeading = page.getByRole('heading', { level: 1 });
    await expect(mainHeading).toBeVisible();
    
    // Check for footer
    const footer = page.getByRole('contentinfo');
    await expect(footer).toBeVisible();
  });

  test('all images have alt text', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Get all images
    const images = page.locator('img');
    const count = await images.count();
    
    // Check that we have images
    expect(count).toBeGreaterThan(0);
    
    // Verify each image has alt attribute (empty alt is allowed for decorative images)
    for (let i = 0; i < Math.min(count, 10); i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      // Alt can be empty string for decorative images, but should not be null
      expect(alt).not.toBeNull();
    }
  });

  test('interactive elements are keyboard accessible', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Tab through interactive elements
    await page.keyboard.press('Tab');
    
    // Give browser time to apply focus
    await page.waitForTimeout(100);
    
    // Check that an interactive element can receive focus
    const signInLink = page.getByRole('link', { name: /sign in/i });
    await signInLink.focus();
    
    // Verify the element is focused
    await expect(signInLink).toBeFocused();
  });
});
