import { test, expect } from '@playwright/test';

test.describe('Shopping Flow', () => {
  test('user can browse cookies in the catalogue', async ({ page }) => {
    // Navigate to cookie catalogue
    await page.goto('/cookies');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Check if catalogue title is visible
    await expect(page.getByRole('heading', { name: 'Cookie Catalogue' })).toBeVisible();
    
    // Wait for cookie cards to load (using the article element with class)
    const cookieCards = page.locator('article.cookie-card');
    await expect(cookieCards.first()).toBeVisible({ timeout: 10000 });
    
    // Verify multiple cookies are displayed
    const count = await cookieCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('user can add cookies to cart using quantity controls', async ({ page }) => {
    // Navigate to cookie catalogue
    await page.goto('/cookies');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Find the first cookie card
    const firstCard = page.locator('article.cookie-card').first();
    await expect(firstCard).toBeVisible();
    
    // Find the increase quantity button (+ button)
    const increaseButton = firstCard.locator('button[aria-label*="Increase quantity"]');
    
    // Click to add one cookie
    await increaseButton.click();
    
    // Verify quantity is updated to 1
    await expect(firstCard.locator('span[aria-live="polite"]')).toHaveText('1');
    
    // Click again to add another
    await increaseButton.click();
    
    // Verify quantity is updated to 2
    await expect(firstCard.locator('span[aria-live="polite"]')).toHaveText('2');
  });

  test('user can view cookie details button', async ({ page }) => {
    // Navigate to cookie catalogue
    await page.goto('/cookies');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Find the first cookie card
    const firstCard = page.locator('article.cookie-card').first();
    await expect(firstCard).toBeVisible();
    
    // Verify the "View Details" button exists and is clickable
    const detailsButton = firstCard.locator('button:has-text("View Details")');
    await expect(detailsButton).toBeVisible();
    await expect(detailsButton).toBeEnabled();
  });
});
