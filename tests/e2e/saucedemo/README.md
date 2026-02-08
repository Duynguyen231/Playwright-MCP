# SauceDemo Role-Based UI Automation Tests

A comprehensive Playwright test suite for validating the [SauceDemo application](https://www.saucedemo.com) with focus on role-based testing and user behavior across different account types.

## Project Overview

This test suite is designed following **Playwright best practices** and implements the **Page Object Model (POM)** pattern for maintainability and scalability.

### Key Features

✅ **Role-Based Testing** - 6 different user roles with distinct behaviors  
✅ **Page Object Model** - Encapsulated page interactions and locators  
✅ **Data-Driven Tests** - Parameterized test execution for multiple users  
✅ **Environment Configuration** - Secure credential management with dotenv  
✅ **Performance Validation** - Detect and measure performance issues  
✅ **Visual Regression** - Screenshot-based visual consistency checks  
✅ **Custom Fixtures** - Pre-configured test utilities and helpers  
✅ **Gherkin Comments** - Clear Given-When-Then test documentation  

---

## Project Structure

```
tests/
├── e2e/
│   └── saucedemo/
│       ├── role-based.spec.ts              # Core login & navigation tests
│       ├── performance-validation.spec.ts   # Performance delay tests
│       ├── visual-regression.spec.ts        # Visual consistency tests
│       └── advanced-scenarios.spec.ts       # Complex user scenarios
├── pages/
│   ├── login.page.ts                        # LoginPage Object Model
│   └── inventory.page.ts                    # InventoryPage Object Model
├── fixtures/
│   └── saucedemo/
│       ├── test.fixture.ts                  # Custom Playwright fixture
│       ├── roles.ts                         # User role definitions
│       └── api.ts                           # API helper (optional)
└── AGENTS.md                                # E2E testing guidelines

.env                                          # Environment variables
.env.example                                  # Environment template
playwright.config.ts                          # Playwright configuration
```

---

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
```

**Newly added dependency:**
- `dotenv` - For environment variable management

### 2. Configure Environment

Create a `.env` file in the project root:

```env
# SauceDemo Application Configuration
SAUCE_BASE_URL=https://www.saucedemo.com

# Common password for all test users
SAUCE_PASSWORD=secret_sauce

# User Roles for Testing
SAUCE_STANDARD_USER=standard_user
SAUCE_LOCKED_OUT_USER=locked_out_user
SAUCE_PROBLEM_USER=problem_user
SAUCE_PERFORMANCE_GLITCH_USER=performance_glitch_user
SAUCE_ERROR_USER=error_user
SAUCE_VISUAL_USER=visual_user
```

**Environment variables are loaded automatically** via `playwright.config.ts` using the `dotenv` package.

### 3. Install Browsers (First Time)

```bash
npx playwright install
```

---

## User Roles & Expected Behaviors

| Role | Username | Expected Behavior |
|------|----------|-------------------|
| **Standard User** | `standard_user` | ✅ Full functionality, normal performance |
| **Locked Out** | `locked_out_user` | 🔒 Login blocked with error message |
| **Problem User** | `problem_user` | ⚠️ Login succeeds, UI/functional issues on inventory |
| **Performance Glitch** | `performance_glitch_user` | 🐌 Login succeeds with 3+ second delays |
| **Error User** | `error_user` | ❌ Login succeeds, errors during checkout |
| **Visual User** | `visual_user` | 🎨 Login succeeds, visual/style inconsistencies |

---

## Running Tests

### Run All Tests

```bash
npx playwright test
```

### Run Specific Test Suite

```bash
# Login and navigation tests
npx playwright test role-based.spec.ts

# Performance validation
npx playwright test performance-validation.spec.ts

# Visual regression
npx playwright test visual-regression.spec.ts

# Advanced scenarios
npx playwright test advanced-scenarios.spec.ts
```

### Run Specific Test

```bash
npx playwright test -g "should allow standard_user to login successfully"
```

### Run Tests in UI Mode (Recommended for Development)

```bash
npx playwright test --ui
```

This opens an interactive dashboard where you can:
- Run individual tests
- Pause and step through execution
- Inspect DOM elements
- View test reports

### Run Tests in Headed Mode (Visible Browser)

```bash
npx playwright test --headed
```

### Run Tests with Verbose Output

```bash
npx playwright test --reporter=verbose
```

### Run Tests Multiple Times (Flakiness Validation)

```bash
npx playwright test -g "test name" --repeat-each=3
```

### View HTML Report

```bash
npx playwright show-report
```

---

## Page Object Model (POM) Examples

### LoginPage

The `LoginPage` class encapsulates all login-related interactions:

```typescript
import { LoginPage } from '../../pages/login.page';

const loginPage = new LoginPage(page);

// Navigate to login
await loginPage.goto();

// Perform login
await loginPage.login('standard_user', 'secret_sauce');

// Get error message
const errorMsg = await loginPage.getErrorMessage();

// Check if page is loaded
const isLoaded = await loginPage.isLoaded();
```

**Key Methods:**
- `goto()` - Navigate to SauceDemo login page
- `login(username, password)` - Fill credentials and submit
- `getErrorMessage()` - Retrieve error message text
- `hasErrorMessage(text)` - Check for specific error
- `isLoaded()` - Verify page is ready

### InventoryPage

The `InventoryPage` class handles product inventory interactions:

```typescript
import { InventoryPage } from '../../pages/inventory.page';

const inventoryPage = new InventoryPage(page);

// Wait for page to load
await inventoryPage.waitForPageLoad();

// Get product count
const count = await inventoryPage.getProductCount();

// Get product names
const names = await inventoryPage.getProductNames();

// Add product to cart
await inventoryPage.addProductToCart('Sauce Labs Backpack');

// Get cart count
const cartItems = await inventoryPage.getCartItemCount();

// Logout
await inventoryPage.logout();
```

**Key Methods:**
- `waitForPageLoad()` - Wait for inventory container visibility
- `getProductCount()` - Count visible products
- `getProductNames()` - Retrieve all product names
- `addProductToCart(name)` - Add product by name
- `removeProductFromCart(name)` - Remove product by name
- `getCartItemCount()` - Get items in cart
- `logout()` - Logout via hamburger menu
- `clickProduct(name)` - Click product to view details

---

## Custom Fixtures

The `test.fixture.ts` extends Playwright's test fixture with SauceDemo-specific utilities:

### Available Fixtures

```typescript
import { test } from './fixtures/saucedemo/test.fixture.ts';

test('example', async ({ loginPage, inventoryPage, authenticatedPage }) => {
  // loginPage: Pre-configured LoginPage instance
  // inventoryPage: Pre-configured InventoryPage instance
  // authenticatedPage: Function to login and return page
});
```

### Fixture Types

1. **loginPage** - LoginPage instance
2. **inventoryPage** - InventoryPage instance  
3. **authenticatedPage** - Async function that returns authenticated page

### Using the Authenticated Page Fixture

```typescript
test('with authenticated user', async ({ authenticatedPage }) => {
  const page = await authenticatedPage(SAUCE_DEMO_USERS[UserRole.STANDARD]);
  
  // Page is now logged in and ready to use
  await expect(page).toHaveURL(/inventory/);
});
```

---

## Test Examples

### Example 1: Standard User Login

```typescript
test('should allow standard_user to login successfully', async ({ loginPage, page }) => {
  const user = SAUCE_DEMO_USERS[UserRole.STANDARD];

  // Given: User navigates to login page
  await loginPage.goto();
  await expect(loginPage.usernameInput).toBeVisible();

  // When: User enters credentials
  await loginPage.login(user.username, user.password);

  // Then: User is on inventory page
  await expect(page).toHaveURL(/inventory/);
  
  // And: No error is displayed
  const error = await loginPage.getErrorMessage();
  expect(error).toBeNull();
});
```

### Example 2: Locked Out User

```typescript
test('should block login for locked_out_user with error', async ({ loginPage, page }) => {
  const user = SAUCE_DEMO_USERS[UserRole.LOCKED_OUT];

  // Given: User navigates to login
  await loginPage.goto();

  // When: Locked out user tries to login
  await loginPage.login(user.username, user.password);

  // Then: Login fails with error
  await expect(loginPage.errorMessage).toBeVisible();
  const error = await loginPage.getErrorMessage();
  expect(error).toContain('locked out');
});
```

### Example 3: Performance Measurement

```typescript
test('should show performance delay', async ({ loginPage, page }) => {
  const user = SAUCE_DEMO_USERS[UserRole.PERFORMANCE];

  // Given: Performance user logs in
  await loginPage.goto();
  const start = Date.now();

  // When: Login is performed
  await loginPage.login(user.username, user.password);
  await page.waitForURL(/inventory/, { timeout: 15000 });

  // Then: At least 3 seconds elapsed
  const elapsed = Date.now() - start;
  expect(elapsed).toBeGreaterThanOrEqual(3000);
});
```

### Example 4: Add Product to Cart

```typescript
test('should add product to cart', async ({ loginPage, inventoryPage }) => {
  const user = SAUCE_DEMO_USERS[UserRole.STANDARD];

  // Setup: Login
  await loginPage.goto();
  await loginPage.login(user.username, user.password);
  await inventoryPage.waitForPageLoad();

  // Get products
  const products = await inventoryPage.getProductNames();
  const initialCount = await inventoryPage.getCartItemCount();

  // When: Add product
  await inventoryPage.addProductToCart(products[0]);

  // Then: Cart increments
  const newCount = await inventoryPage.getCartItemCount();
  expect(newCount).toBe((initialCount || 0) + 1);
});
```

---

## Locator Strategy (Priority)

This project follows Playwright's recommended locator priority:

1. **getByRole()** - Most reliable (accessibility-based)  
   ```typescript
   page.getByRole('button', { name: 'Login' })
   ```

2. **getByLabel()** - For form fields
   ```typescript
   page.getByLabel('Username')
   ```

3. **getByTestId()** - When semantic queries unavailable
   ```typescript
   page.getByTestId('login-button')
   ```

4. **getByText()** - For unique text
   ```typescript
   page.getByText('Products')
   ```

5. **getByPlaceholder()** - Input placeholders
   ```typescript
   page.getByPlaceholder('Search...')
   ```

**❌ Avoid:** Direct CSS selectors or XPath
```typescript
// Bad
page.locator('.btn-primary')
page.locator('//button[@class="submit"]')

// Good
page.getByRole('button', { name: 'Submit' })
```

---

## Playwright Configuration

Key settings in `playwright.config.ts`:

```typescript
// Environment variables are loaded
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  // Run tests in parallel
  fullyParallel: true,
  
  // Tests directory
  testDir: './tests',
  
  // Retries on CI only
  retries: process.env.CI ? 2 : 0,
  
  // HTML report
  reporter: 'html',
  
  // Chrome, Firefox, Safari
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
```

---

## Best Practices Implemented

### ✅ Stability

- ✓ No hardcoded waits (`waitForTimeout`)
- ✓ Proper wait strategies (visibility, network)
- ✓ Environment variable management
- ✓ Deterministic test execution

### ✅ Maintainability

- ✓ Page Object Model for encapsulation
- ✓ DRY principle (no duplicated code)
- ✓ Clear method naming
- ✓ Comprehensive comments
- ✓ Reusable fixtures

### ✅ Reliability

- ✓ Independent tests (no shared state)
- ✓ Parallel-safe execution
- ✓ Proper error handling
- ✓ Gherkin-style documentation

### ✅ Performance

- ✓ Data-driven tests (multiple users)
- ✓ Parallel browser execution
- ✓ Efficient waits (not hardcoded sleep)
- ✓ Screenshot optimization

### ✅ Accessibility

- ✓ Role-based locators preferred
- ✓ ARIA-compliant queries
- ✓ Label-based form inputs
- ✓ Semantic HTML validation

---

## Troubleshooting

### Issue: Tests cannot find elements

**Solution:** Inspect the page to verify actual selectors:
```bash
npx playwright codegen https://www.saucedemo.com
```

### Issue: Performance delays not detected

**Solution:** Increase timeout in test:
```typescript
await page.waitForURL(/inventory/, { timeout: 20000 });
```

### Issue: Visual regression tests differ on first run

**Solution:** Update baseline screenshots:
```bash
npx playwright test --update-snapshots
```

### Issue: Environment variables not loaded

**Solution:** Verify `.env` file exists and check for syntax errors:
```bash
cat .env  # View file contents
```

---

## Performance Considerations

### Test Execution Time

- **Standard User:** ~3-5 seconds
- **Locked Out User:** ~2-3 seconds  
- **Performance User:** ~15+ seconds (intentional delay)
- **Visual User:** ~3-5 seconds
- **Problem User:** ~3-5 seconds
- **Error User:** ~3-5 seconds

### Total Suite Execution

- **Sequential:** ~40-60 seconds
- **Parallel (3 workers):** ~20-25 seconds
- **Parallel (6 workers):** ~15-20 seconds

---

## CI/CD Integration

### GitHub Actions Example

```yaml
- name: Install dependencies
  run: npm install

- name: Install Playwright browsers
  run: npx playwright install

- name: Run SauceDemo tests
  run: npx playwright test tests/e2e/saucedemo/

- name: Upload test results
  uses: actions/upload-artifact@v3
  with:
    name: playwright-report
    path: playwright-report/
```

---

## Future Enhancements

- 🔄 Cart and checkout flow tests
- 🔐 Additional authentication scenarios
- 📊 Performance metrics collection
- 🎯 API-based test setup
- 🔍 Cross-browser consistency checks
- 📱 Mobile viewport testing
- ♿ Comprehensive accessibility audit

---

## Resources

- [Playwright Documentation](https://playwright.dev)
- [SauceDemo Repository](https://github.com/saucelabs/sample-app-web)
- [Best Practices Guide](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)
- [CI/CD Integration](https://playwright.dev/docs/ci)

---

**Created:** February 7, 2026  
**Author:** QA Automation Team  
**Version:** 1.0.0
