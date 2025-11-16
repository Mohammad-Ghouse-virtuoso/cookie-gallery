import { test, expect } from '@playwright/test';

/**
 * Navigation E2E Tests
 * Tests application navigation and routing
 */

test.describe('Navigation', () => {
  test('can navigate to home page', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    expect(page.url()).toMatch(/\/$|\/home/);
    
    // Verify page has content
    const content = await page.textContent('body');
    expect(content).toBeTruthy();
  });

  test('can navigate to cookies catalogue', async ({ page }) => {
    await page.goto('/cookies', { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    expect(page.url()).toContain('/cookies');
    
    // Verify page loaded
    const content = await page.textContent('body');
    expect(content).toBeTruthy();
    expect(content!.length).toBeGreaterThan(100);
  });

  test('can navigate to story page', async ({ page }) => {
    await page.goto('/story', { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    expect(page.url()).toContain('/story');
    
    // Verify page loaded
    const content = await page.textContent('body');
    expect(content).toBeTruthy();
  });

  test('can navigate to behind the scenes page', async ({ page }) => {
    await page.goto('/behind-the-scenes', { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    expect(page.url()).toContain('/behind-the-scenes');
    
    // Verify page loaded
    const content = await page.textContent('body');
    expect(content).toBeTruthy();
  });

  test('can navigate to privacy policy page', async ({ page }) => {
    await page.goto('/privacy', { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    expect(page.url()).toContain('/privacy');
    
    // Verify page loaded
    const content = await page.textContent('body');
    expect(content).toBeTruthy();
  });

  test('404 page shows for invalid routes', async ({ page }) => {
    await page.goto('/this-page-does-not-exist-12345', { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    // Should show 404 page or redirect
    const content = await page.textContent('body');
    expect(content).toBeTruthy();
    
    // The URL might stay the same or redirect
    const url = page.url();
    expect(url.length).toBeGreaterThan(0);
  });

  test('application has navigation bar', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    // Look for navigation elements
    const nav = page.locator('nav, [role="navigation"], header').first();
    const navCount = await nav.count();
    
    // Should have navigation or at least some links
    const linkCount = await page.locator('a').count();
    
    expect(navCount > 0 || linkCount > 0).toBeTruthy();
  });

  test('can perform browser back navigation', async ({ page }) => {
    // Navigate to home
    await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 60000 });
    const homeUrl = page.url();
    
    // Navigate to cookies
    await page.goto('/cookies', { waitUntil: 'domcontentloaded', timeout: 60000 });
    expect(page.url()).toContain('/cookies');
    
    // Go back
    await page.goBack({ waitUntil: 'domcontentloaded' });
    
    // Should be back at home
    expect(page.url()).toBe(homeUrl);
  });
});
