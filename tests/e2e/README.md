# E2E Tests - Cookie Gallery

This directory contains End-to-End (E2E) tests for the Cookie Gallery application using Playwright.

## 📋 Overview

E2E tests simulate real user interactions with the application, testing complete user journeys from start to finish. These tests run in real browsers and validate that all parts of the application work together correctly.

## 🏗️ Structure

```
tests/e2e/
├── fixtures/
│   └── test-data.ts          # Shared test data (users, addresses, etc.)
├── shopping-flow.spec.ts      # Shopping cart and catalogue tests
├── checkout-flow.spec.ts      # Checkout process tests
├── authentication.spec.ts     # Sign in/out and auth tests
└── README.md                  # This file
```

## 🚀 Running Tests

### Prerequisites

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Playwright browsers (if not already installed):
   ```bash
   npx playwright install
   ```

### Run All Tests

```bash
# Run all E2E tests in headless mode
npm run test:e2e

# Run with browser UI visible
npm run test:e2e:headed

# Run in debug mode (step through tests)
npm run test:e2e:debug

# Run with Playwright UI mode (interactive)
npm run test:e2e:ui
```

### Run Specific Tests

```bash
# Run only shopping flow tests
npx playwright test shopping-flow

# Run only checkout tests
npx playwright test checkout-flow

# Run only authentication tests
npx playwright test authentication

# Run a specific test by name
npx playwright test -g "user can view the cookie catalogue"
```

### Run on Specific Browsers

```bash
# Run on Chromium only
npx playwright test --project=chromium

# Run on Firefox only
npx playwright test --project=firefox

# Run on WebKit (Safari) only
npx playwright test --project=webkit

# Run on mobile Chrome
npx playwright test --project=mobile-chrome

# Run on mobile Safari
npx playwright test --project=mobile-safari
```

## 📊 Test Reports

After running tests, view the HTML report:

```bash
npm run test:e2e:report
```

This opens an interactive report showing:
- Test results (passed/failed)
- Screenshots of failures
- Video recordings of failures
- Test traces for debugging

## 🧪 Test Coverage

### Shopping Flow Tests (`shopping-flow.spec.ts`)
- ✅ View cookie catalogue
- ✅ Browse home page
- ✅ Navigate between pages
- ✅ Verify cart starts empty

### Checkout Flow Tests (`checkout-flow.spec.ts`)
- ✅ Checkout requires authentication
- ✅ Checkout page loads
- ✅ Access checkout from navigation

### Authentication Tests (`authentication.spec.ts`)
- ✅ Signin page loads correctly
- ✅ Signin form has required fields
- ✅ Protected routes redirect to signin
- ✅ Access signin from home
- ✅ Signout page is accessible

## 🔧 Configuration

Test configuration is in `playwright.config.ts` at the project root.

Key settings:
- **Base URL**: `http://localhost:5173`
- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- **Retries**: 2 retries on CI, 0 locally
- **Screenshots**: Captured on failure
- **Videos**: Recorded on failure
- **Traces**: Captured on first retry

## 📝 Writing New Tests

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    // Navigate to page
    await page.goto('/');
    
    // Interact with elements
    await page.click('button');
    
    // Assert expectations
    await expect(page.locator('h1')).toContainText('Expected Text');
  });
});
```

### Best Practices

1. **Use Data Test IDs**: Add `data-testid` attributes to components for stable selectors
   ```typescript
   await page.click('[data-testid="add-to-cart"]');
   ```

2. **Wait for Network**: Use `waitForLoadState` to ensure page is ready
   ```typescript
   await page.waitForLoadState('networkidle');
   ```

3. **Use Role-Based Selectors**: Prefer accessible selectors
   ```typescript
   await page.getByRole('button', { name: 'Add to Cart' }).click();
   ```

4. **Independent Tests**: Each test should work standalone
   ```typescript
   test.beforeEach(async ({ page }) => {
     // Setup for each test
     await page.goto('/');
   });
   ```

5. **Use Fixtures**: Share common test data
   ```typescript
   import { testUser } from './fixtures/test-data';
   ```

## 🐛 Debugging Tests

### View Test in Browser

```bash
npm run test:e2e:headed
```

### Step Through Test

```bash
npm run test:e2e:debug
```

### Use Playwright Inspector

```bash
npx playwright test --debug
```

### View Test Trace

1. Run tests with trace enabled (default on retry)
2. Open trace viewer:
   ```bash
   npx playwright show-trace trace.zip
   ```

### Console Logs

Add logging in tests:
```typescript
console.log('Current URL:', page.url());
```

## 🔍 Selectors Guide

### Recommended Selector Priority

1. **Data Test IDs** (most stable)
   ```typescript
   page.locator('[data-testid="cart-button"]')
   ```

2. **Role-Based** (accessible and semantic)
   ```typescript
   page.getByRole('button', { name: 'Add to Cart' })
   page.getByRole('link', { name: /cookie/i })
   ```

3. **Text Content** (good for unique text)
   ```typescript
   page.locator('text=Add to Cart')
   page.getByText('Welcome')
   ```

4. **CSS Selectors** (use as last resort)
   ```typescript
   page.locator('button.btn-primary')
   ```

### Avoid

- ❌ Long CSS selector chains
- ❌ XPath selectors (hard to read)
- ❌ Class names with random suffixes (from CSS-in-JS)

## 🎯 Adding New Test Scenarios

### To Add Shopping Tests

Edit `shopping-flow.spec.ts`:
```typescript
test('user can add item to cart', async ({ page }) => {
  // Your test implementation
});
```

### To Add Checkout Tests

Edit `checkout-flow.spec.ts`:
```typescript
test('checkout form validates email', async ({ page }) => {
  // Your test implementation
});
```

### To Add Auth Tests

Edit `authentication.spec.ts`:
```typescript
test('user can sign in with valid credentials', async ({ page }) => {
  // Your test implementation
});
```

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [Writing Tests Guide](https://playwright.dev/docs/writing-tests)

## 🤝 Contributing

When adding new tests:

1. Follow the existing test structure
2. Use descriptive test names
3. Add comments for complex logic
4. Ensure tests are independent
5. Update this README if adding new test files
6. Run tests locally before committing

## 📞 Support

If you encounter issues:

1. Check the HTML report: `npm run test:e2e:report`
2. Run in debug mode: `npm run test:e2e:debug`
3. Check Playwright logs in `test-results/`
4. Review screenshots/videos in `test-results/`
