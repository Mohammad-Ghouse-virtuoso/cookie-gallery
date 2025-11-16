# E2E Test Files Overview

**Last Updated:** November 16, 2025  
**Framework:** Playwright v1.56.1  
**Total Test Files:** 3  
**Total Tests:** 10

---

## Test File Structure

```
tests/e2e/
├── shopping-flow.spec.ts      (4 tests)
├── navigation.spec.ts          (3 tests)
└── accessibility.spec.ts       (3 tests)
```

---

## 1. shopping-flow.spec.ts

**Purpose:** Tests core shopping and browsing functionality

**Tests:**

1. `user can browse homepage and see cookie gallery` - Verifies homepage loads correctly
2. `user can see best sellers section` - Checks Best Sellers section visibility
3. `user can navigate through cookie carousel` - Tests carousel/slider functionality
4. `user can navigate to cookies catalogue` - Verifies navigation to full catalogue

**Key Coverage:**

- Homepage rendering
- Cookie carousel/swiper
- Catalogue navigation
- Content visibility

**Lines of Code:** ~53

---

## 2. navigation.spec.ts

**Purpose:** Tests navigation between pages and user flows

**Tests:**

1. `user can navigate to sign in page` - Tests sign in navigation from homepage
2. `user can navigate to home from signin page` - Tests return to home
3. `footer links are visible and functional` - Verifies footer navigation

**Key Coverage:**

- Page-to-page navigation
- Sign in flow entry
- Footer link visibility
- Navigation consistency

**Lines of Code:** ~42

---

## 3. accessibility.spec.ts

**Purpose:** Tests accessibility features and standards compliance

**Tests:**

1. `homepage has proper document structure` - Verifies semantic HTML structure
2. `all images have alt text` - Checks image accessibility
3. `interactive elements are keyboard accessible` - Tests keyboard navigation

**Key Coverage:**

- Semantic HTML (nav, contentinfo, headings)
- ARIA compliance
- Keyboard accessibility
- Image alt attributes

**Lines of Code:** ~50

---

## Configuration Files

### playwright.config.ts

**Purpose:** Playwright test configuration
**Key Settings:**

- Test directory: `./tests/e2e`
- Base URL: `http://localhost:5173`
- Browser: Chromium
- Auto-start dev server
- Screenshots on failure
- Trace on retry

**Lines of Code:** 31

---

## Test Execution

### Run All Tests

```bash
npm run test:e2e
```

### Run Specific File

```bash
npx playwright test shopping-flow.spec.ts
npx playwright test navigation.spec.ts
npx playwright test accessibility.spec.ts
```

### Run in Different Modes

```bash
# UI Mode (interactive)
npm run test:e2e:ui

# Headed mode (visible browser)
npm run test:e2e:headed

# Debug mode
npx playwright test --debug
```

---

## Test Patterns Used

### 1. Role-Based Selectors (Recommended)

```typescript
page.getByRole("heading", { name: /best sellers/i });
page.getByRole("link", { name: /sign in/i });
page.getByRole("button", { name: /go to home/i });
```

### 2. Test Structure

```typescript
test.describe("Feature Name", () => {
  test("specific user action", async ({ page }) => {
    // Arrange
    await page.goto("/");

    // Act
    const element = page.getByRole("...");
    await element.click();

    // Assert
    await expect(page).toHaveURL("...");
  });
});
```

### 3. Wait Strategies

```typescript
// Prefer domcontentloaded for faster tests
await page.goto("/", { waitUntil: "domcontentloaded" });

// Use explicit waits for dynamic content
await expect(element).toBeVisible();
```

---

## Test Coverage by Feature

| Feature       | Tests | Files                        |
| ------------- | ----- | ---------------------------- |
| Homepage      | 3     | shopping-flow, accessibility |
| Navigation    | 4     | shopping-flow, navigation    |
| Accessibility | 3     | accessibility                |
| Sign In       | 1     | navigation                   |
| Footer        | 1     | navigation                   |
| Carousel      | 1     | shopping-flow                |

---

## Dependencies

```json
{
  "@playwright/test": "^1.56.1"
}
```

---

## CI/CD Integration

Tests are configured to run in CI with:

- 2 retries on failure
- Single worker for consistency
- Screenshot capture on failure
- Trace recording on retry

---

## Maintenance Notes

### When to Update Tests

1. **UI Changes**: Update selectors if button text or structure changes
2. **New Features**: Add new test files for major features
3. **Bug Fixes**: Add regression tests for fixed bugs
4. **Route Changes**: Update URL expectations if routes change

### Best Practices

1. Use semantic role-based selectors
2. Avoid brittle CSS class selectors
3. Test user flows, not implementation details
4. Keep tests independent and isolated
5. Use meaningful test descriptions
6. Document complex test logic

---

## Quick Reference

**Total Test Coverage:**

- ✅ Homepage rendering
- ✅ Navigation flows
- ✅ Accessibility basics
- ⏳ Cart operations (future)
- ⏳ Checkout flow (future)
- ⏳ Authentication (future)
- ⏳ Mobile responsive (future)

**Status:** All 10 tests passing ✅
