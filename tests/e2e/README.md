# E2E Tests for Cookie Gallery

This directory contains End-to-End (E2E) tests for the Cookie Gallery application using Playwright.

## Overview

The E2E tests validate critical user journeys through the application, ensuring that the entire system works correctly from the user's perspective.

## Test Coverage

### 1. Authentication Flow (`authentication.spec.ts`)

- Sign-in page loading and structure
- Sign-out page functionality
- Redirect behavior for protected routes
- Page asset loading

### 2. Home Page (`home.spec.ts`)

- Home page accessibility
- Navigation bar visibility
- Protected route redirects

### 3. Cookie Catalogue (`catalogue.spec.ts`)

- Catalogue page structure
- Product browsing
- Product detail page access

### 4. Checkout Flow (`checkout.spec.ts`)

- Checkout page authentication
- Cart functionality
- Payment status page
- Order success page

### 5. Navigation & Routing (`navigation.spec.ts`)

- Route protection
- Page navigation
- 404 handling
- Story and informational pages

## Running E2E Tests

### Prerequisites

1. Install dependencies:

   ```bash
   npm install
   ```

2. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

### Run Tests

```bash
# Run all E2E tests (headless)
npm run test:e2e

# Run tests with UI mode (interactive)
npm run test:e2e:ui

# Run tests in headed mode (see browser)
npm run test:e2e:headed

# View test report
npm run test:e2e:report
```

### Run Specific Test Files

```bash
# Run only authentication tests
npx playwright test authentication.spec.ts

# Run only checkout tests
npx playwright test checkout.spec.ts
```

## Test Structure

Each test file follows this structure:

```typescript
import { test, expect } from "@playwright/test";

test.describe("Feature Name", () => {
  test("should do something", async ({ page }) => {
    // Test implementation
  });
});
```

## Important Notes

### Authentication

- Most routes in the Cookie Gallery app are protected and require Firebase authentication
- Current E2E tests verify redirect behavior but don't perform actual authentication
- To test authenticated flows, you would need to:
  1. Set up Firebase test credentials
  2. Implement authentication helper functions
  3. Use Playwright's state management to persist auth sessions

### Environment Requirements

- Tests expect the dev server to run on `http://localhost:5173`
- The dev server is automatically started by Playwright's `webServer` configuration
- Backend server on `http://localhost:5000` should be running for full functionality

## Configuration

The E2E tests are configured in `playwright.config.ts` at the project root.

Key configuration options:

- **testDir**: `./tests/e2e`
- **baseURL**: `http://localhost:5173`
- **Browser**: Chromium (Desktop Chrome)
- **Retries**: 2 on CI, 0 locally
- **Screenshots**: On failure only
- **Traces**: On first retry

## CI/CD Integration

To run E2E tests in CI/CD:

```yaml
- name: Install Playwright Browsers
  run: npx playwright install --with-deps chromium

- name: Run E2E Tests
  run: npm run test:e2e
```

## Debugging Tests

### Debug Mode

```bash
# Run in debug mode
npx playwright test --debug

# Debug specific test
npx playwright test authentication.spec.ts --debug
```

### View Traces

When a test fails, Playwright captures a trace. View it with:

```bash
npx playwright show-trace trace.zip
```

## Future Enhancements

- [ ] Add authentication helper to test authenticated flows
- [ ] Add tests for add-to-cart functionality
- [ ] Add tests for payment flow (with mock payment provider)
- [ ] Add visual regression tests
- [ ] Add mobile viewport tests
- [ ] Add cross-browser testing (Firefox, Safari)

## Maintenance

When adding new features:

1. Create corresponding E2E tests
2. Follow existing test patterns
3. Update this README with new test coverage
4. Ensure tests are independent and can run in any order
