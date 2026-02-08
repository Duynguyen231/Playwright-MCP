# Agent Instructions - E2E Tests

This file contains specific instructions for AI agents working on E2E tests.

## Test Directory Structure

```
tests/
├── e2e/                      # Test specs organized by feature
│   ├── auth/
│   │   ├── login.spec.ts
│   │   └── registration.spec.ts
│   ├── dashboard/
│   │   └── overview.spec.ts
│   └── shared/               # Shared test utilities
├── fixtures/                 # Custom fixtures
│   ├── api.ts               # API setup helpers
│   ├── visual.ts            # Visual testing utilities
│   └── test-data.ts         # Test data generators
└── AGENTS.md                # This file
```

## Test Scope

Our E2E tests cover:
- **User workflows** - Complete user journeys through the application
- **Critical paths** - Features that users rely on daily
- **Integration points** - API interactions, external services
- **Visual regression** - UI consistency across changes

We do NOT test:
- Unit-level logic (covered by unit tests)
- Backend implementation details
- Every possible edge case (focus on common scenarios)

## Testing Conventions

### Test File Naming
- Use `.spec.ts` extension for all test files
- Name files after the feature being tested: `feature-name.spec.ts`
- Keep test files focused on a single feature or workflow

### Test Structure
```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup that runs before each test
  });

  test('should perform expected behavior', async ({ page }) => {
    // Given - Set up initial state
    // When - Perform action
    // Then - Assert expected outcome
  });
});
```

### Test Titles
- Start with "should" or describe the behavior
- Be specific and descriptive
- Good: "should display error message when email is invalid"
- Bad: "test login", "error handling"

### Gherkin Comments
Use Given/When/Then comments to structure test logic:
```typescript
test('should login successfully with valid credentials', async ({ page, api }) => {
  // Given: User is on login page
  await page.goto('/login');
  
  // When: User enters valid credentials and submits
  await page.getByLabel('Email').fill('user@example.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Sign In' }).click();
  
  // Then: User is redirected to dashboard
  await expect(page).toHaveURL('/dashboard');
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});
```

## Locator Strategy

**Priority order** (use the highest available):
1. **Role-based** - `getByRole('button', { name: 'Submit' })`
2. **Label-based** - `getByLabel('Email address')`
3. **Test ID** - `getByTestId('user-menu')` (when semantic queries aren't possible)
4. **Text-based** - `getByText('Welcome back')` (for unique text)
5. **Placeholder** - `getByPlaceholder('Enter your email')`

**Never use**:
- CSS class selectors (`.btn-primary`)
- Complex CSS selectors (`div > button.active`)
- XPath expressions
- nth-child or positional selectors

**Use options instead of chaining**:
```typescript
// ✅ Good - using options
await page.getByRole('row', { name: 'John Doe' })
  .getByRole('button', { name: 'Edit' })
  .click();

// ❌ Bad - chaining with locator
await page.locator('table').locator('tr').first().locator('button').click();
```

## API Interaction Patterns

### Waiting for API Responses
```typescript
// Wait for specific API call
const responsePromise = page.waitForResponse(
  response => response.url().includes('/api/users') && response.status() === 200
);
await page.getByRole('button', { name: 'Load Data' }).click();
const response = await responsePromise;
```

### Setting Up State via API
```typescript
test('should display user profile', async ({ page, api }) => {
  // Given: User exists in database
  const user = await api.createUser({
    email: 'test@example.com',
    name: 'Test User'
  });
  
  // When: User navigates to profile
  await page.goto(`/profile/${user.id}`);
  
  // Then: Profile is displayed
  await expect(page.getByRole('heading', { name: 'Test User' })).toBeVisible();
});
```

### API Fixture Usage
Extend the `api` fixture in `tests/fixtures/api.ts` for reusable API helpers:
```typescript
export const api = base.extend({
  createUser: async ({ request }, use) => {
    const users = [];
    await use(async (userData) => {
      const response = await request.post('/api/users', { data: userData });
      const user = await response.json();
      users.push(user.id);
      return user;
    });
    // Cleanup
    for (const userId of users) {
      await request.delete(`/api/users/${userId}`);
    }
  }
});
```

## Visual Regression Testing

### When to Use Visual Tests
- UI components with complex styling
- Layout consistency across viewports
- Charts, graphs, and data visualizations
- Color schemes and themes

### Visual Test Pattern
```typescript
test('should render dashboard correctly', async ({ page }) => {
  await page.goto('/dashboard');
  
  // Wait for content to load
  await page.waitForLoadState('networkidle');
  
  // Mask dynamic content
  await expect(page).toHaveScreenshot('dashboard.png', {
    mask: [
      page.getByTestId('current-time'),
      page.getByTestId('session-id')
    ],
    maxDiffPixels: 100
  });
});
```

### Screenshot Naming Convention
- Use descriptive names: `feature-state.png`
- Examples: `login-form.png`, `dashboard-empty.png`, `modal-error.png`

### Handling Dynamic Content
Always mask:
- Timestamps and dates
- User IDs and session tokens
- Animated elements
- Loading spinners
- Random data (unless testing randomness)

## Common Patterns

### Waiting for Elements
```typescript
// ✅ Good - explicit assertion
await expect(page.getByRole('heading', { name: 'Welcome' })).toBeVisible();

// ✅ Good - wait for specific state
await page.getByRole('button', { name: 'Submit' }).waitFor({ state: 'enabled' });

// ❌ Bad - arbitrary timeout
await page.waitForTimeout(2000);

// ❌ Bad - networkidle is flaky
await page.waitForLoadState('networkidle');
```

### Form Interactions
```typescript
// Fill and submit a form
await page.getByLabel('Email').fill('user@example.com');
await page.getByLabel('Password').fill('password123');
await page.getByRole('button', { name: 'Sign In' }).click();

// Wait for submission to complete
await expect(page).toHaveURL('/dashboard');
```

### Testing Error States
```typescript
test('should display error when API fails', async ({ page }) => {
  // Mock API failure
  await page.route('**/api/users', route => 
    route.fulfill({ status: 500, body: 'Server Error' })
  );
  
  await page.goto('/users');
  
  await expect(page.getByRole('alert'))
    .toContainText('Failed to load users');
});
```

### Test Data Management
```typescript
// Use fixture for complex test data
import { generateUser } from '../fixtures/test-data';

test('should create user profile', async ({ page }) => {
  const user = generateUser();
  // ... rest of test
});
```

## Best Practices

### DO
✅ Keep tests independent and parallelizable
✅ Use meaningful test descriptions
✅ Test from the user's perspective
✅ Clean up test data after each test
✅ Use proper assertions with meaningful messages
✅ Group related tests in `describe` blocks
✅ Set up state via API when possible (faster)

### DON'T
❌ Share state between tests
❌ Use arbitrary `waitForTimeout()`
❌ Test implementation details
❌ Use fragile CSS selectors
❌ Create overly complex test scenarios
❌ Skip cleanup operations
❌ Rely on execution order

## Debugging Failed Tests

1. **Check the error message** - Read the actual vs expected
2. **Look at screenshots** - Check `test-results/` for failure screenshots
3. **Run in headed mode** - `npx playwright test --headed`
4. **Use debug mode** - `npx playwright test --debug`
5. **Check API responses** - Look for network errors in trace
6. **Verify test data** - Ensure setup completed successfully

## Performance Considerations

- **Setup via API** is faster than UI-based setup
- **Reuse browser contexts** when possible
- **Avoid unnecessary page loads**
- **Run tests in parallel** (default in Playwright)
- **Use fixtures** for expensive setup operations

## Common Anti-Patterns to Avoid

```typescript
// ❌ Don't use CSS selectors
await page.locator('.submit-button').click();

// ❌ Don't use waitForTimeout
await page.waitForTimeout(3000);

// ❌ Don't use networkidle (it's flaky)
await page.waitForLoadState('networkidle');

// ❌ Don't chain locators unnecessarily
await page.locator('form').locator('input').first().fill('text');

// ❌ Don't test implementation details
expect(component.state.isLoading).toBe(false);

// ❌ Don't share state between tests
let sharedUser; // This will cause issues in parallel execution
```

## When in Doubt

1. Check existing test files for patterns
2. Refer to Playwright documentation
3. Ask for clarification on test scope
4. Keep it simple - the simplest working solution is usually best
