---
name: auth-global-setup
description: Configure Playwright Global Setup for pre-test authentication. Use when the user asks to "set up global auth", "implement authentication setup", "avoid repeated login in tests", or "optimize test authentication". Covers global setup configuration, token storage, and test authentication integration.
hooks:
  PostToolUse:
    - matcher: "Edit|Write"
      statusMessage: "Validating auth configuration..."
      hooks:
        - type: command
          command: "$CLAUDE_PROJECT_DIR/.claude/hooks/lint-config.sh"
---

# Global Setup Authentication Skill

This skill guides you through implementing Playwright Global Setup for handling authentication as pre-test configuration instead of repeated test steps. This eliminates unnecessary login requests and API latency.

## Problem Statement

Without Global Setup:

- Each test executes login steps independently
- 100 tests = 100 login API calls + latency
- Tests are slower and consume unnecessary resources
- Authentication logic is scattered across test files

With Global Setup:

- Login happens once before test workers spin up
- Token/storage state stored globally (process.env or JSON)
- Tests start already authenticated, ready to validate
- Cleaner, faster, more efficient test architecture

---

## Prerequisites

Before starting, read the e2e testing guidelines:

```bash
view tests/AGENTS.md
```

Understand current authentication approach:

```bash
view tests/fixtures/api.ts
view tests/e2e/[feature-name]/[test-file].spec.ts
```

---

## Workflow

### 1. Audit Current Authentication

**Inventory login implementations**:

- Find all login/authentication steps in test files
- Count how many tests execute login
- Identify different user roles/accounts used
- Note API endpoints used for authentication

**Example audit questions**:

- How many test files contain login steps?
- What API endpoints are used for authentication?
- What user roles need to be authenticated?
- Where is authentication state stored (localStorage, cookies, sessionStorage)?
- Are there multiple authentication methods (password, OAuth, API token)?

---

### 2. Plan Global Setup Architecture

**Identify authentication strategies needed**:

- List each user role that needs pre-authentication
- Define what needs to be stored (auth token, storage state, API credentials)
- Determine storage mechanism (process.env, JSON file, or both)
- Plan for test worker parallelization

**Example structure**:

```
Global Setup
├── Admin User Authentication
│   ├── Login via API
│   ├── Store: process.env.ACCESS_TOKEN_ADMIN
│   └── Store: .auth/admin.json (storage state)
├── Customer User Authentication
│   ├── Login via API
│   ├── Store: process.env.ACCESS_TOKEN_CUSTOMER
│   └── Store: .auth/customer.json (storage state)
└── Guest Authentication (if needed)
    └── Store: Limited permissions token
```

---

### 3. Get User Approval

**Present implementation plan**:

- List the Global Setup projects to create
- Explain token/storage state storage strategy
- Show how tests will consume authentication
- Confirm approach aligns with architecture
- Verify all user roles are covered

**Wait for approval** before proceeding to implementation.

---

### 4. Create Global Setup Configuration

**Update `playwright.config.ts`**:

```typescript
// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",

  // Define setup projects that run before tests
  projects: [
    {
      name: "setup-auth",
      testMatch: "**/*.setup.ts",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      dependencies: ["setup-auth"], // Depends on setup-auth
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
      dependencies: ["setup-auth"],
    },
  ],

  globalSetup: require.resolve("./tests/fixtures/global-setup.ts"),
});
```

**Key points**:

- Create a setup project (`setup-auth`) that runs before dependent projects
- Use `dependencies` to establish run order
- Setup projects run once per test worker pool

---

### 5. Implement Global Setup File

**Create `tests/fixtures/global-setup.ts`**:

```typescript
import { chromium, FullConfig } from "@playwright/test";

async function globalSetup(config: FullConfig) {
  // Create separate setup context for authentication
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Admin user authentication
    await authenticateUser(page, {
      email: process.env.ADMIN_EMAIL!,
      password: process.env.ADMIN_PASSWORD!,
      role: "ADMIN",
    });

    // Customer user authentication (if needed)
    await authenticateUser(page, {
      email: process.env.CUSTOMER_EMAIL!,
      password: process.env.CUSTOMER_PASSWORD!,
      role: "CUSTOMER",
    });

    console.log("✅ Global setup: Authentication completed");
  } catch (error) {
    console.error("❌ Global setup failed:", error);
    throw error;
  } finally {
    await context.close();
    await browser.close();
  }
}

async function authenticateUser(
  page: any,
  credentials: { email: string; password: string; role: "ADMIN" | "CUSTOMER" },
) {
  // Navigate to login
  await page.goto("http://localhost:3000/login");

  // Execute login
  await page.getByLabel("Email").fill(credentials.email);
  await page.getByLabel("Password").fill(credentials.password);

  const responsePromise = page.waitForResponse(
    (response) =>
      response.url().includes("/api/auth/login") && response.status() === 200,
  );
  await page.getByRole("button", { name: "Sign In" }).click();
  const response = await responsePromise;

  // Extract and store token
  const data = await response.json();
  const token = data.accessToken;

  // Store in process.env
  process.env[`ACCESS_TOKEN_${credentials.role}`] = token;

  // Store storage state for browser context
  await context.storageState({
    path: `.auth/${credentials.role.toLowerCase()}.json`,
  });
}

export default globalSetup;
```

---

### 6. Create Setup Spec File

**Create `tests/e2e/auth.setup.ts`**:

This file serves as the trigger for Global Setup execution:

```typescript
import { test, expect } from "@playwright/test";

test.describe("Global Auth Setup", () => {
  test("should execute global authentication", async ({}) => {
    // This test exists to trigger setup execution
    // Actual setup happens in global-setup.ts
    expect(process.env.ACCESS_TOKEN_ADMIN).toBeTruthy();
    expect(process.env.ACCESS_TOKEN_CUSTOMER).toBeTruthy();
  });
});
```

---

### 7. Update Tests to Use Pre-Authentication

**Pattern 1: Using token in API calls**:

```typescript
test("should fetch user profile", async ({ request }) => {
  // Token already available from global setup
  const response = await request.get("/api/profile", {
    headers: {
      Authorization: `Bearer ${process.env.ACCESS_TOKEN_ADMIN}`,
    },
  });

  expect(response.status()).toBe(200);
  const data = await response.json();
  expect(data.role).toBe("ADMIN");
});
```

**Pattern 2: Using storage state in browser context**:

```typescript
test("should be logged in on dashboard", async ({ browser }) => {
  // Create context with pre-authenticated storage state
  const context = await browser.newContext({
    storageState: ".auth/admin.json",
  });
  const page = await context.newPage();

  // Navigate directly to protected page (already authenticated)
  await page.goto("/dashboard");

  // Validate you're on dashboard without login flow
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  await expect(page.getByTestId("user-menu")).toContainText("Admin User");

  await context.close();
});
```

**Pattern 3: Using fixture for automatic context injection**:

```typescript
// tests/fixtures/auth.fixture.ts
import { test as base, BrowserContext } from "@playwright/test";

type AuthFixtures = {
  adminContext: BrowserContext;
  customerContext: BrowserContext;
};

export const test = base.extend<AuthFixtures>({
  adminContext: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: ".auth/admin.json",
    });
    await use(context);
    await context.close();
  },
  customerContext: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: ".auth/customer.json",
    });
    await use(context);
    await context.close();
  },
});

export { expect };
```

**Using the fixture**:

```typescript
import { test, expect } from "../fixtures/auth.fixture";

test("admin should access admin dashboard", async ({ adminContext }) => {
  const page = await adminContext.newPage();

  await page.goto("/dashboard");
  await expect(
    page.getByRole("heading", { name: "Admin Dashboard" }),
  ).toBeVisible();

  await page.close();
});

test("customer should access user dashboard", async ({ customerContext }) => {
  const page = await customerContext.newPage();

  await page.goto("/dashboard");
  await expect(
    page.getByRole("heading", { name: "Customer Dashboard" }),
  ).toBeVisible();

  await page.close();
});
```

---

### 8. Environment Variables Setup

**Create `.env` file** (or use CI environment):

```bash
# .env
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=secure-admin-password

CUSTOMER_EMAIL=customer@example.com
CUSTOMER_PASSWORD=secure-customer-password

# Optional: API base URL
API_BASE_URL=http://localhost:3000
```

**Update `.gitignore`**:

```
# Auth state storage
.auth/

# Environment files
.env
.env.local
.env.*.local
```

---

### 9. Handling Edge Cases

**Expired tokens during test run**:

```typescript
// In test setup
test.beforeEach(async ({ request, page }) => {
  // Validate token is still valid
  const response = await request.get("/api/verify-token", {
    headers: {
      Authorization: `Bearer ${process.env.ACCESS_TOKEN_ADMIN}`,
    },
  });

  if (response.status() === 401) {
    // Token expired - re-authenticate
    console.warn("Token expired, re-authenticating...");
    // Call re-auth logic or skip test
  }
});
```

**Multi-environment support**:

```typescript
// global-setup.ts
async function globalSetup(config: FullConfig) {
  const baseUrl = process.env.BASE_URL || "http://localhost:3000";

  // Use baseUrl from config
  const browser = await chromium.launch();
  const page = await browser.newPage({ baseURL: baseUrl });

  // Rest of setup...
}
```

**Conditional authentication**:

```typescript
async function globalSetup(config: FullConfig) {
  // Skip if running locally without credentials
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    console.log("⚠️  Skipping global setup: auth credentials not provided");
    return;
  }

  // Perform authentication...
}
```

---

### 10. Cleanup and Maintenance

**Refresh tokens between test runs**:

```bash
# Clear old auth state before test run
rm -rf .auth/

# Run tests (triggers global setup)
npx playwright test
```

**Validate setup is working**:

```bash
# Run setup only
npx playwright test --grep "@setup" --verbose
```

**Measure efficiency gains**:

```bash
# Compare test durations
npx playwright test --reporter=json > results-with-global-setup.json
```

---

## Migration Path

### Step 1: Add Global Setup (Parallel execution)

Keep existing test login logic while adding Global Setup - tests can use either approach.

### Step 2: Update Tests Incrementally

Convert tests one file at a time to use pre-authenticated context.

### Step 3: Remove Legacy Login Logic

Once all tests are migrated, remove login steps from individual tests.

### Step 4: Monitor & Optimize

Track performance improvements and adjust token refresh strategy as needed.

---

## Final Checklist

Before completing Global Setup implementation, verify:

- [ ] Global Setup file (`global-setup.ts`) created and handles all auth flows
- [ ] Setup project defined in `playwright.config.ts` with proper dependencies
- [ ] Setup spec file (`auth.setup.ts`) created to trigger setup execution
- [ ] Environment variables properly configured (.env or CI)
- [ ] Auth tokens stored in process.env with correct naming
- [ ] Storage state JSON files stored in `.auth/` directory
- [ ] Tests updated to use pre-authenticated context or token from process.env
- [ ] `.auth/` directory added to `.gitignore`
- [ ] Global Setup runs once per worker pool (not per test)
- [ ] Token refresh strategy documented (if needed)
- [ ] Multi-environment support verified (dev, staging, production)
- [ ] Tests no longer contain login steps (or converted to conditional)
- [ ] Performance improvement validated (fewer API calls, faster test execution)
- [ ] Error handling in global setup handles auth failures gracefully
- [ ] Cleanup logic removes old auth state before fresh runs

---

## Benefits Summary

✅ **Performance**: 1 login instead of N (where N = number of tests)  
✅ **Latency**: Eliminate repeated login API calls from test execution  
✅ **Maintainability**: Authentication centralized, easier to update  
✅ **Scalability**: Setup once, use across entire test suite  
✅ **Parallelization**: Tests start already authenticated, faster payoff  
✅ **Architecture**: Treats Auth as configuration, not test steps

---

## Common Patterns

### Pattern 1: Token-based API requests

```typescript
const token = process.env.ACCESS_TOKEN_ADMIN;
const response = await request.get("/api/data", {
  headers: { Authorization: `Bearer ${token}` },
});
```

### Pattern 2: Storage state for browser context

```typescript
const context = await browser.newContext({
  storageState: ".auth/admin.json",
});
```

### Pattern 3: Fixture-based automatic injection

```typescript
test("feature test", async ({ adminContext }) => {
  const page = await adminContext.newPage();
  // Already authenticated
});
```

---

## Troubleshooting

**Setup doesn't run**:

- Ensure `dependencies: ['setup-auth']` is set in project config
- Verify setup spec file matches pattern in `testMatch`

**Token not available in test**:

- Check `process.env.ACCESS_TOKEN_*` is being set in global setup
- Ensure global setup completes successfully before tests run

**Storage state not working**:

- Verify `.auth/` directory exists
- Check file permissions on auth JSON files
- Ensure browser context is created with `storageState` path

**Tests still slow**:

- Verify global setup running once per worker, not per test
- Check for additional auth calls in test setup hooks
- Review `page.waitForResponse()` patterns for unnecessary waits
