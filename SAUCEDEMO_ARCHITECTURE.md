# SauceDemo Test Architecture

## System Design Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    PLAYWRIGHT TEST SUITE                    │
│              Role-Based UI Automation for SauceDemo         │
└─────────────────────────────────────────────────────────────┘

                            ┌──────────────┐
                            │   .env File  │
                            └──────┬───────┘
                                   │
                    ┌──────────────┬┴────────────────┐
                    │              │                 │
            ┌───────▼────────┐   ┌─┴────────────┐   │
            │  Environment   │   │  Playwright  │   │
            │   Variables    │   │   Config     │   │
            └────────────────┘   └──────────────┘   │
                                                    │
                    ┌──────────────────────────────┴┐
                    │                               │
        ┌───────────▼──────────────────┐   ┌───────▼──────────────┐
        │   Custom Test Fixture        │   │  Browser Instances   │
        │  (test.fixture.ts)           │   │  (Chromium, Firefox) │
        │                              │   │       (Webkit)       │
        │  - loginPage                 │   └──────────────────────┘
        │  - inventoryPage             │
        │  - authenticatedPage         │
        └───────────┬──────────────────┘
                    │ Provides
                    │
        ┌───────────▼──────────────────────────────────────┐
        │           Page Object Models (POM)               │
        ├──────────────────────────────────────────────────┤
        │                                                  │
        │  ┌─────────────────┐    ┌──────────────────┐   │
        │  │  LoginPage      │    │  InventoryPage   │   │
        │  ├─────────────────┤    ├──────────────────┤   │
        │  │ - usernameInput │    │ - productItems   │   │
        │  │ - passwordInput │    │ - cartBadge      │   │
        │  │ - loginButton   │    │ - hamburgerMenu  │   │
        │  │ - errorMessage  │    │ - logoutButton   │   │
        │  ├─────────────────┤    ├──────────────────┤   │
        │  │ + goto()        │    │ + waitForPageLoad()  │
        │  │ + login()       │    │ + getProductCount()  │
        │  │ + getError()    │    │ + getProductNames()  │
        │  │ + isLoaded()    │    │ + addToCart()    │   │
        │  │                 │    │ + logout()       │   │
        │  └─────────────────┘    └──────────────────┘   │
        │                                                  │
        └───────────┬──────────────────────────────────────┘
                    │ Used by
                    │
        ┌───────────▼──────────────────────────────────────┐
        │         Test Suites (*.spec.ts files)            │
        ├──────────────────────────────────────────────────┤
        │                                                  │
        │  ┌─────────────────────────────────────────┐   │
        │  │  role-based.spec.ts (9 tests)          │   │
        │  │  - Standard user login                  │   │
        │  │  - Locked out user blocked             │   │
        │  │  - Problem user UI issues              │   │
        │  │  - Performance user delays             │   │
        │  │  - Error user login                    │   │
        │  │  - Visual user login                   │   │
        │  │  - Product viewing                     │   │
        │  │  - Add to cart                         │   │
        │  │  - Logout                              │   │
        │  └─────────────────────────────────────────┘   │
        │                                                  │
        │  ┌─────────────────────────────────────────┐   │
        │  │  performance-validation.spec.ts (3)    │   │
        │  │  - Login duration measurement          │   │
        │  │  - Inventory load timing               │   │
        │  │  - Product interaction delay           │   │
        │  └─────────────────────────────────────────┘   │
        │                                                  │
        │  ┌─────────────────────────────────────────┐   │
        │  │  visual-regression.spec.ts (5 tests)   │   │
        │  │  - Login page baseline                 │   │
        │  │  - Inventory baseline                  │   │
        │  │  - Visual user differences             │   │
        │  │  - Problem user rendering              │   │
        │  │  - Element visibility                  │   │
        │  └─────────────────────────────────────────┘   │
        │                                                  │
        │  ┌─────────────────────────────────────────┐   │
        │  │  advanced-scenarios.spec.ts (5 tests)  │   │
        │  │  - Error user inventory access         │   │
        │  │  - Problem user add to cart            │   │
        │  │  - Multi-user comparison               │   │
        │  │  - Direct URL navigation               │   │
        │  │  - Complex scenarios                   │   │
        │  └─────────────────────────────────────────┘   │
        │                                                  │
        └───────────┬──────────────────────────────────────┘
                    │ Execute
                    │
                    ▼
        ┌─────────────────────────────────────────────┐
        │     SauceDemo Application (Target)          │
        │     https://www.saucedemo.com               │
        │                                             │
        │  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
        │  │  Login   │→ │Inventory │→ │ Checkout │ │
        │  │  Page    │  │  Page    │  │   Page   │ │
        │  └──────────┘  └──────────┘  └──────────┘ │
        │                                             │
        │  Multiple user roles with different        │
        │  behaviors and issues                      │
        └─────────────────────────────────────────────┘
```

---

## Data Flow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                      TEST EXECUTION FLOW                     │
└──────────────────────────────────────────────────────────────┘

1. INITIALIZE
   ├─ Load .env variables
   ├─ Configure Playwright
   │  └─ Launch browsers (chromium, firefox, webkit)
   └─ Setup custom fixture

2. FOR EACH TEST
   ├─ Get User Role from SAUCE_DEMO_USERS
   │  ├─ Credentials (name, password)
   │  ├─ Expected behavior
   │  └─ Role-specific config
   │
   ├─ Initialize Page Objects
   │  ├─ New LoginPage(page)
   │  └─ New InventoryPage(page)
   │
   ├─ Navigate to SauceDemo
   │  └─ page.goto(SAUCE_BASE_URL)
   │
   ├─ Perform Test Actions
   │  ├─ loginPage.login(user, password)
   │  ├─ [Wait for response / error]
   │  ├─ inventoryPage.waitForPageLoad()
   │  ├─ [Perform role-specific actions]
   │  └─ [Take screenshots if visual test]
   │
   ├─ Validate Assertions
   │  ├─ expect(page).toHaveURL(...)
   │  ├─ expect(element).toBeVisible()
   │  ├─ expect(text).toContain(...)
   │  └─ [Role-specific assertions]
   │
   └─ Cleanup
      ├─ Clear cookies/storage
      └─ Close connections

3. GENERATE RESULTS
   ├─ Test report (passed/failed)
   ├─ Screenshots (if visual tests)
   ├─ Performance metrics
   └─ HTML report

4. DISPLAY
   └─ Show results in HTML report/console
```

---

## Role Distribution Across Tests

```
                    TEST FILES
                        │
        ┌───────────────┼───────────────┐
        │               │               │
    ┌───▼───┐      ┌────▼────┐    ┌───▼──────┐
    │ Role  │      │ Login   │    │Advanced  │
    │Based  │      │ Based   │    │Scenarios │
    │ (9)   │      │ (3)     │    │  (5)     │
    └───┬───┘      └────┬────┘    └───┬──────┘
        │               │             │
        │ Tests 6 roles │ Measures    │ Complex
        │ + operations  │ performance │ scenarios
        │               │             │

ROLE COVERAGE
─────────────

✅ standard_user:
   • role-based.spec.ts (All 9 tests)
   • visual-regression.spec.ts (4 tests)
   • advanced-scenarios.spec.ts (partial)

✅ locked_out_user:
   • role-based.spec.ts (1 test)
   • advanced-scenarios.spec.ts (1 test)

✅ problem_user:
   • role-based.spec.ts (1 test)
   • visual-regression.spec.ts (1 test)
   • advanced-scenarios.spec.ts (2 tests)

✅ performance_glitch_user:
   • role-based.spec.ts (1 test)
   • performance-validation.spec.ts (3 tests)

✅ error_user:
   • role-based.spec.ts (1 test)
   • advanced-scenarios.spec.ts (2 tests)

✅ visual_user:
   • role-based.spec.ts (1 test)
   • visual-regression.spec.ts (1 test)

TOTAL: 22 tests covering all 6 roles
```

---

## Fixture Injection Pattern

```
┌────────────────────────────────────────────────────────────┐
│              CUSTOM FIXTURE INJECTION                      │
└────────────────────────────────────────────────────────────┘

test('example', async ({ loginPage, inventoryPage, page, authenticatedPage }) => {
                       │          │                  │       │
                       │          │                  │       └─ Standard Playwright
                       │          │                  │          (built-in)
                       │          │                  │
                       │          │                  └─ Custom: Authenticated Page Function
                       │          │                     Purpose: Pre-login helper
                       │          │                     Returns: Promise<Page>
                       │          │
                       │          └─ Custom: InventoryPage Instance
                       │             Purpose: Inventory interactions
                       │             Type: InventoryPage (POM)
                       │
                       └─ Custom: LoginPage Instance
                          Purpose: Login interactions
                          Type: LoginPage (POM)

FIXTURE LIFECYCLE
─────────────────

1. Test starts
   ↓
2. Fixture middleware runs
   ├─ Create LoginPage instance
   ├─ Create InventoryPage instance
   └─ Define authenticatedPage function
   ↓
3. Test code executes
   ├─ Uses loginPage instance
   ├─ Uses inventoryPage instance
   └─ Calls authenticatedPage(user) if needed
   ↓
4. Test ends
   └─ Cleanup (automatic via Playwright)

Benefits:
─────────
✅ Code reuse (no need to instantiate in each test)
✅ Consistent API (all tests use same interface)
✅ Type safety (TypeScript fixtures)
✅ Maintainability (changes in one place)
```

---

## Test Execution Timeline

```
TIME: -0s ────────────────────────────────────────────
     │ Start
     │
     ├─ Load .env variables
     ├─ Load Playwright config
     ├─ Launch browsers (parallel)
     │  ├─ Chromium
     │  ├─ Firefox
     │  └─ Webkit
     │
     │ ~3-5 seconds

TIME: 5s ──────────────────────────────────────────────
     │ Start Test Execution (3 workers, parallel)
     │
     ├─ WORKER 1: role-based tests
     │  ├─ Standard user login (5s)
     │  ├─ Locked out user (3s)
     │  ├─ Problem user (5s)
     │  ├─ Performance user (15s) ⏱️
     │  ├─ Error user (5s)
     │  ├─ Visual user (5s)
     │  └─ Cart/Logout tests (15s)
     │
     ├─ WORKER 2: Performance tests
     │  ├─ Login timing (15s) ⏱️
     │  ├─ Inventory load (5s)
     │  └─ Product delay (5s)
     │
     └─ WORKER 3: Visual tests
        ├─ Screenshots (20s)
        └─ Element visibility (5s)
     │
     │ ~60-90 seconds (parallel execution)

TIME: 90s ──────────────────────────────────────────
     │ Generate Results
     │
     ├─ Compile test results
     ├─ Generate HTML report
     ├─ Collect screenshots
     └─ Close browsers
     │
     └─ ~30 seconds

TIME: 120s ──────────────────────────────────────
     └─ Complete (2 minutes)

SEQUENCIAL VS PARALLEL
──────────────────────
Sequential:  ~3-4 minutes (slow)
Parallel:    ~2 minutes (3 workers)
```

---

## POM (Page Object Model) Structure

```
┌──────────────────────────────────────────────────────────┐
│          PAGE OBJECT MODEL ARCHITECTURE                  │
└──────────────────────────────────────────────────────────┘

PRINCIPLE: Encapsulate page interactions

┌─ LoginPage ─────────────────────────────────────────────┐
│                                                         │
│  Responsibilities:                                      │
│  ├─ Know about login page elements                     │
│  ├─ Know how to navigate                               │
│  ├─ Know how to login                                  │
│  └─ Know how to handle errors                          │
│                                                         │
│  Properties:                                            │
│  ├─ page: Page                                          │
│  ├─ usernameInput: Locator                              │
│  ├─ passwordInput: Locator                              │
│  ├─ loginButton: Locator                                │
│  └─ errorMessage: Locator                               │
│                                                         │
│  Methods:                                               │
│  ├─ goto()                                              │
│  ├─ login(username, password)                           │
│  ├─ getErrorMessage(): Promise<string | null>          │
│  ├─ hasErrorMessage(text): Promise<boolean>            │
│  └─ isLoaded(): Promise<boolean>                        │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─ InventoryPage ─────────────────────────────────────────┐
│                                                         │
│  Responsibilities:                                      │
│  ├─ Know about inventory page elements                 │
│  ├─ Know how to interact with products                 │
│  ├─ Know how to manage cart                            │
│  └─ Know how to logout                                 │
│                                                         │
│  Properties:                                            │
│  ├─ page: Page                                          │
│  ├─ inventoryContainer: Locator                         │
│  ├─ productItems: Locator                               │
│  ├─ cartBadge: Locator                                  │
│  ├─ hamburgerMenu: Locator                              │
│  └─ logoutButton: Locator                               │
│                                                         │
│  Methods:                                               │
│  ├─ waitForPageLoad()                                   │
│  ├─ getProductCount(): Promise<number>                  │
│  ├─ getProductNames(): Promise<string[]>                │
│  ├─ addProductToCart(name)                              │
│  ├─ removeProductFromCart(name)                         │
│  ├─ getCartItemCount(): Promise<number | null>         │
│  ├─ logout()                                            │
│  ├─ clickProduct(name)                                  │
│  ├─ isLoaded(): Promise<boolean>                        │
│  └─ takeScreenshot(filename)                            │
│                                                         │
└─────────────────────────────────────────────────────────┘

BENEFITS OF POM
───────────────
✅ Encapsulation: Page details hidden from tests
✅ Maintainability: Change selectors in one place
✅ Reusability: Use same methods across tests
✅ Readability: Tests read like user actions
✅ Scalability: Easy to add new pages
```

---

## Environment Variable Flow

```
┌─────────────────────────────────────────────────────────┐
│              ENVIRONMENT VARIABLE FLOW                  │
└─────────────────────────────────────────────────────────┘

.env file (local)
    │
    ├─ SAUCE_BASE_URL=https://www.saucedemo.com
    ├─ SAUCE_PASSWORD=secret_sauce
    ├─ SAUCE_STANDARD_USER=standard_user
    ├─ SAUCE_LOCKED_OUT_USER=locked_out_user
    ├─ SAUCE_PROBLEM_USER=problem_user
    ├─ SAUCE_PERFORMANCE_GLITCH_USER=performance_glitch_user
    ├─ SAUCE_ERROR_USER=error_user
    └─ SAUCE_VISUAL_USER=visual_user
        │
        ↓
playwright.config.ts
    │
    └─ dotenv.config({ path: path.resolve(__dirname, '.env') })
        │
        ↓ Loads into process.env
        │
        ├─ process.env.SAUCE_BASE_URL
        ├─ process.env.SAUCE_PASSWORD
        ├─ process.env.SAUCE_STANDARD_USER
        └─ ... (all variables)
        │
        ↓
tests/fixtures/saucedemo/roles.ts
    │
    └─ SAUCE_DEMO_USERS object
        │
        ├─ UserRole.STANDARD
        │  └─ username: process.env.SAUCE_STANDARD_USER
        │  └─ password: process.env.SAUCE_PASSWORD
        │
        ├─ UserRole.LOCKED_OUT
        │  └─ username: process.env.SAUCE_LOCKED_OUT_USER
        │  └─ password: process.env.SAUCE_PASSWORD
        │
        └─ ... (all roles)
        │
        ↓
test files
    │
    └─ Retrieve: SAUCE_DEMO_USERS[UserRole.STANDARD]
        │
        ├─ username: "standard_user"
        ├─ password: "secret_sauce"
        └─ [user-specific properties]

SECURITY BENEFITS
─────────────────
✅ No hardcoded credentials
✅ Easy to change credentials
✅ CI/CD compatible (inject via environment)
✅ .git-ignored (.env not committed)
```

---

## Test Assertion Patterns

```
┌─────────────────────────────────────────────────────────┐
│              ASSERTION PATTERNS USED                    │
└─────────────────────────────────────────────────────────┘

1. URL Navigation
   expect(page).toHaveURL(/inventory/);
   expect(page).toHaveURL(/login/);

2. Element Visibility
   expect(loginPage.usernameInput).toBeVisible();
   expect(inventoryPage.inventoryContainer).toBeVisible();

3. Element Text Content
   const error = await loginPage.getErrorMessage();
   expect(error).toContain('locked out');

4. Element Disabled State
   expect(loginButton).toBeDisabled();

5. Element Count
   const count = await inventoryPage.getProductCount();
   expect(count).toBeGreaterThan(0);

6. Timeout/Performance
   expect(elapsed).toBeGreaterThanOrEqual(3000);

7. Array Length
   const names = await inventoryPage.getProductNames();
   expect(names.length).toBeGreaterThan(0);

8. Null/Undefined Checks
   const error = await loginPage.getErrorMessage();
   expect(error).toBeNull();

9. CSS Visibility
   expect(element).toHaveScreenshot('name.png');

10. Multiple Assertions
    expect(error).toContain('locked out');
    expect(error).not.toContain('success');
```

---

**Created:** February 7, 2026  
**Purpose:** Architectural reference for SauceDemo test implementation  
**Version:** 1.0
