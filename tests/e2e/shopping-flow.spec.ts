import { test, expect } from '@playwright/test';

test.describe('Shopping Flow', () => {
  test('user can browse homepage and see cookie gallery', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Check for main heading
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    
    // Verify page title
    expect(await page.title()).toContain('Cookie Gallery');
  });

  test('user can see best sellers section', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Check for Best Sellers heading
    const bestSellersHeading = page.getByRole('heading', { name: /best sellers/i });
    await expect(bestSellersHeading).toBeVisible();
  });

  test('user can navigate through cookie carousel', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Wait for carousel buttons to be visible
    const carouselButtons = page.getByRole('button', { name: /go to slide/i });
    await expect(carouselButtons.first()).toBeVisible();
    
    // Verify multiple cookie slides exist
    const slideButtons = await carouselButtons.count();
    expect(slideButtons).toBeGreaterThan(1);
  });

  test('user can navigate to cookies catalogue', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Find and click the explore catalogue link
    const catalogueLink = page.getByRole('link', { name: /explore.*catalogue/i });
    await expect(catalogueLink).toBeVisible();
    
    // Click to navigate to cookies page
    await catalogueLink.click();
    
    // Verify navigation
    await expect(page).toHaveURL(/\/cookies/);
  });
});
