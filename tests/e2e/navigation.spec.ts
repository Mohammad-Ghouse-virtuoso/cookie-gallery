import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('user can navigate to sign in page', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Click Sign In link
    const signInLink = page.getByRole('link', { name: /sign in/i });
    await expect(signInLink).toBeVisible();
    await signInLink.click();
    
    // Verify navigation to sign in page
    await expect(page).toHaveURL(/\/signin/);
  });

  test('user can navigate to home from signin page', async ({ page }) => {
    await page.goto('/signin', { waitUntil: 'domcontentloaded' });
    
    // On signin page, click the "Go to Home" button 
    const homeButton = page.getByRole('button', { name: /go to home/i });
    await expect(homeButton).toBeVisible();
    await homeButton.click();
    
    // Verify navigation to home page - app navigates to /home
    await expect(page).toHaveURL('/home');
    
    // Verify we're on the homepage by checking for the main heading
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('footer links are visible and functional', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    
    // Scroll to footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    
    // Check for footer links
    const checkoutLink = page.getByRole('link', { name: /^checkout$/i });
    await expect(checkoutLink).toBeVisible();
    
    const storyLink = page.getByRole('link', { name: /^story$/i });
    await expect(storyLink).toBeVisible();
  });
});
