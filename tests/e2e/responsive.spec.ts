import { test, expect } from '@playwright/test';

/**
 * Responsive Design E2E Tests
 * Tests that the application works on different screen sizes
 */

test.describe('Responsive Design', () => {
  test('desktop viewport renders correctly', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    // Verify page loads
    const content = await page.textContent('body');
    expect(content).toBeTruthy();
    expect(content!.length).toBeGreaterThan(0);
  });

  test('tablet viewport renders correctly', async ({ page }) => {
    // Set tablet viewport (iPad)
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    // Verify page loads
    const content = await page.textContent('body');
    expect(content).toBeTruthy();
    expect(content!.length).toBeGreaterThan(0);
  });

  test('mobile viewport renders correctly', async ({ page }) => {
    // Set mobile viewport (iPhone 13)
    await page.setViewportSize({ width: 390, height: 844 });
    
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    // Verify page loads
    const content = await page.textContent('body');
    expect(content).toBeTruthy();
    expect(content!.length).toBeGreaterThan(0);
  });

  test('cookies page is responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    
    await page.goto('/cookies', { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    // Verify cookies page loads on mobile
    expect(page.url()).toContain('/cookies');
    
    const content = await page.textContent('body');
    expect(content).toBeTruthy();
  });

  test('checkout page is responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    
    await page.goto('/checkout', { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    // Should load (either checkout or signin)
    const url = page.url();
    expect(url).toMatch(/checkout|signin/i);
    
    const content = await page.textContent('body');
    expect(content).toBeTruthy();
  });

  test('signin page is responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    
    await page.goto('/signin', { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    expect(page.url()).toContain('/signin');
    
    const content = await page.textContent('body');
    expect(content).toBeTruthy();
  });
});
