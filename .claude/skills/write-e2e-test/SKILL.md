---
name: write-e2e-test
description: Systematically write new Playwright E2E tests from planning through implementation. Use when the user asks to "write an e2e test", "create e2e tests", "add e2e test for [feature]", or mentions testing a feature with Playwright. Covers test planning, implementation verification and test validation.
hooks:
  PostToolUse:
    - matcher: "Edit|Write"
      statusMessage: "Running lint checks..."
      hooks:
        - type: command
          command: "$CLAUDE_PROJECT_DIR/.claude/hooks/lint-e2e.sh"
---

# E2E Test Writing Skill

This skill guides you through writing robust, maintainable Playwright E2E tests with proper validation and self-checking.

## Prerequisites

Before starting, read the e2e testing guidelines:

```bash
view tests/AGENTS.md
```

## Workflow

### 1. Define Test Requirements

**Understand the feature**:
- Identify what needs to be tested
- List the specific test cases to write
- Determine test scope and validation points

**IMPORTANT**: Always ask clarifying questions about the test scope and where to validate.

**Example questions**:
- "Should this test be part of [spec file name] or a new spec file?"
- "Here's a list of suggested test cases - please select which ones you want to write"
- "Should I test both success and error cases?"
- "Should the test validate UI state, API responses, or both?"
- "Are there any edge cases or error scenarios to cover?"

This is an important phase as aligning on the requirements will lead to a better plan.

---

### 2. Verify Implementation Details

**Check actual implementation** to understand:

**Frontend components**:
```bash
view src/components/[feature-path]
```
- Identify UI elements, form fields, interactive elements
- Check for proper accessibility attributes (labels, roles, ARIA, test-id)
- Note data-testid attributes if they exist
- Observe user interaction flow

**Accessibility check**: If implementation lacks proper labels, roles, or ARIA attributes, inform the user and suggest fixes before writing tests.

**API endpoints** (REST):
```bash
view src/api/[feature-name].ts
# or
view src/services/[feature-name].ts
```
- Understand data flow and API endpoints
- Identify request/response structure
- Note down relevant API calls that need to be waited on using `page.waitForResponse()`

**Optional: Setup initial state via API calls**:
```bash
view tests/fixtures/api.ts
```
- Understand how to setup initial state via API calls
- Extend the `api` fixture with custom methods for setting up state if needed
- Check existing API helper methods

**Visual regression setup** (if applicable):
```bash
view tests/fixtures/visual.ts
```
- Check existing visual testing utilities
- Understand screenshot naming conventions
- Review viewport configurations

---

### 3. Get User Approval

**Present test plan** to user:
- List the specific tests you'll write
- Explain what each test will cover
- Note which APIs will be mocked/waited on
- Confirm approach aligns with their needs

**Wait for approval** before proceeding to implementation.

---

### 4. Implement the Test

**Location**: `tests/e2e/[feature-name]/`

**Test structure**:
- Use Gherkin steps (Given, When, Then) in comments for clarity
- Set up initial state via API calls when possible
- Use proper locator strategy (role > label > testId > text)
- Group related tests in descriptive `describe` blocks
- Keep tests parallelizable (no shared state between tests)

**Locator strategy priority**:
1. `getByRole()` - Preferred for accessibility
2. `getByLabel()` - For form fields
3. `getByTestId()` - When semantic queries aren't possible
4. `getByText()` - For unique text content
5. `getByPlaceholder()` - For inputs without labels
6. Avoid `page.locator()` with CSS/XPath unless absolutely necessary

**API interactions**:
- Use `page.waitForResponse()` for all critical API calls
- Mock API responses when testing error states
- Use fixtures for complex API setup

**Visual regression**:
- Use `await expect(page).toHaveScreenshot('feature-name.png')` for visual tests
- Ensure consistent viewport sizes
- Mask dynamic content (dates, IDs, animations)

---

### 5. Run Test in Isolation

**Run the test in isolation multiple times** to verify stability:

```bash
npx playwright test -g "should [test title]" --repeat-each=3 --reporter=line
```

**If test fails**:
- Analyze the error output
- Fix the issue
- Rerun the test
- Repeat until test passes consistently

**Common issues**:
- Incorrect locators (check actual DOM attributes)
- Missing waits for API requests
- Timing issues (avoid `waitForTimeout`, use proper assertions)
- Visual regression differences (check screenshot diffs)
- Test data conflicts (ensure proper cleanup)

---

### 6. Final Checklist

Before completing, verify:

- [ ] Test follows Gherkin structure (Given, When, Then)
- [ ] Initial state set up via API calls where applicable
- [ ] Relevant API requests are waited on using `page.waitForResponse()`
- [ ] Locators use proper strategy (role > label > testId > text)
- [ ] Avoid `page.locator()` with CSS selectors - use getBy methods with options instead
- [ ] Test runs in isolation successfully (3+ times)
- [ ] No `waitForTimeout()` or `networkidle` usage
- [ ] Test is inside descriptive `describe` block
- [ ] Test can run in parallel with other tests
- [ ] Visual regression tests have proper masking for dynamic content
- [ ] API mocks are properly cleaned up after test
- [ ] Test title is clear and descriptive (starts with "should")

---

## Examples

### Good locator patterns:
```typescript
// ✅ Using role
await page.getByRole('button', { name: 'Submit' }).click();

// ✅ Using label for form fields
await page.getByLabel('Email address').fill('test@example.com');

// ✅ Using testId when semantic queries aren't possible
await page.getByTestId('user-profile-menu').click();

// ✅ Using options instead of chaining
await page.getByRole('row', { name: 'John Doe' }).getByRole('button', { name: 'Edit' }).click();
```

### Bad locator patterns:
```typescript
// ❌ Using CSS selectors
await page.locator('.btn-primary').click();

// ❌ Using XPath
await page.locator('//button[@class="submit"]').click();

// ❌ Chaining locators unnecessarily
await page.locator('form').locator('button').first().click();
```

### API waiting pattern:
```typescript
// ✅ Wait for API response
const responsePromise = page.waitForResponse(response => 
  response.url().includes('/api/users') && response.status() === 200
);
await page.getByRole('button', { name: 'Load Users' }).click();
await responsePromise;
```

### Visual regression pattern:
```typescript
// ✅ Visual regression with masking
await expect(page).toHaveScreenshot('dashboard.png', {
  mask: [page.getByTestId('timestamp'), page.getByTestId('user-id')],
  maxDiffPixels: 100
});
```
