# Playwright E2E Testing Framework with Agent Skills & MCP

A complete Playwright test automation framework with **AI agent assistance**, **SauceDemo application test suite**, and reusable **agent skills** for writing high-quality E2E tests.

This project serves as both:
1. **Working Reference** - Complete test suite for the SauceDemo application
2. **Template Framework** - Agent skills and patterns for your own projects

## 📁 Project Structure

```
.
├── .claude/                              # Agent configuration
│   ├── skills/
│   │   ├── write-e2e-test/              # E2E test writing skill
│   │   └── auth-global-setup/           # Authentication setup skill
│   └── hooks/
│       └── lint-e2e.sh                   # ESLint validation hook
│
├── tests/
│   ├── e2e/
│   │   ├── auth.setup.ts                # Global authentication setup
│   │   └── saucedemo/                   # SauceDemo test suite
│   │       ├── checkout-flow.spec.ts    # Checkout workflow tests
│   │       ├── role-based.spec.ts       # Multi-user role tests
│   │       ├── advanced-scenarios.spec.ts # Complex scenarios
│   │       ├── performance-validation.spec.ts # Performance tests
│   │       └── visual-regression.spec.ts # Visual regression tests
│   │
│   ├── pages/                           # Page Object Model
│   │   ├── login.page.ts
│   │   └── inventory.page.ts
│   │
│   ├── fixtures/
│   │   ├── api.ts                       # API fixture for state setup
│   │   ├── visual.ts                    # Visual regression utilities
│   │   ├── test-data.ts                 # Test data generators
│   │   ├── global-setup.ts              # Global test setup
│   │   └── saucedemo/
│   │       ├── test.fixture.ts          # SauceDemo custom fixture
│   │       └── roles.ts                 # User role definitions
│   │
│   └── AGENTS.md                        # Testing-specific instructions
│
├── docs/                                # Documentation
│   ├── guides/                          # Integration and setup guides
│   └── saucedemo/                       # SauceDemo-specific docs
│
├── specs/                               # Test specifications
│   └── *.spec.md                        # Test plans
│
├── AGENTS.md                            # Root-level project instructions
├── AGENTS-CUSTOM.md                     # Customized agent instructions
├── playwright.config.ts                 # Playwright configuration
├── .eslintrc.json                       # ESLint configuration
├── package.json                         # Dependencies and scripts
├── STRUCTURE.md                         # Detailed directory structure
├── QUICKSTART.md                        # Quick setup guide
├── INTEGRATION_CHECKLIST.md             # Integration checklist
└── INTEGRATION_GUIDE.md                 # Full integration guide
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file in the project root:

```env
# SauceDemo Application
SAUCE_BASE_URL=https://www.saucedemo.com
SAUCE_PASSWORD=secret_sauce

# User Roles
SAUCE_STANDARD_USER=standard_user
SAUCE_LOCKED_OUT_USER=locked_out_user
SAUCE_PROBLEM_USER=problem_user
SAUCE_PERFORMANCE_GLITCH_USER=performance_glitch_user
SAUCE_ERROR_USER=error_user
SAUCE_VISUAL_USER=visual_user
```

### 3. Run Tests

```bash
# All tests
npm run test

# Specific test suites
npm run test:saucedemo          # SauceDemo suite
npm run test:smoke              # Smoke tests (@smoke)
npm run test:integration        # Integration tests (@integration)
npm run test:regression         # Regression tests (@regression)
npm run test:visual             # Visual tests (@visual)

# Headed mode (see browser)
npm run test:headed

# UI mode (interactive)
npm run test:ui

# Debug mode
npm run test:debug

# View results
npm run test:report
```

### 4. Linting

```bash
# Check for linting errors
npm run lint

# Fix linting errors
npm run lint:fix
```

## 🎯 Working Test Suite: SauceDemo

This project includes a **complete working test suite** for the [SauceDemo](https://www.saucedemo.com) application with:

- **Role-Based Testing** - 6 different user roles with distinct behaviors
- **Page Object Model** - Clean, maintainable page interactions (`login.page.ts`, `inventory.page.ts`)
- **Data-Driven Tests** - Parameterized execution across multiple users
- **Multiple Test Suites**:
  - `role-based.spec.ts` - Login & navigation validation
  - `checkout-flow.spec.ts` - Complete purchase workflows
  - `performance-validation.spec.ts` - Performance delay detection
  - `visual-regression.spec.ts` - Screenshot-based visual consistency
  - `advanced-scenarios.spec.ts` - Complex user scenarios

### Running SauceDemo Tests

```bash
# All SauceDemo tests
npm run test:saucedemo

# With UI mode
npm run test:ui -- tests/e2e/saucedemo/

# With headed browser
npm run test:headed -- tests/e2e/saucedemo/role-based.spec.ts

# Specific test
npx playwright test -g "should login successfully"
```

### SauceDemo User Roles

| Role | Behavior | Test Focus |
|------|----------|-----------|
| **Standard User** | ✅ Normal operation | Happy path flows |
| **Locked Out** | 🔒 Login denied | Error handling |
| **Problem User** | ⚠️ UI/functional issues | Edge cases |
| **Performance Glitch** | 🐢 Slow performance | Performance detection |
| **Error User** | ❌ Backend errors | Error recovery |
| **Visual User** | 👁️ Visual differences | Regression detection |

For detailed SauceDemo documentation, see [docs/saucedemo/](docs/saucedemo/)

## 🤖 AI Agent Skills

This framework includes **reusable agent skills** for AI assistants:

### Available Skills

1. **write-e2e-test** - Systematically write new E2E tests
   - Requirements gathering & clarification
   - Implementation research
   - Test plan approval
   - Structured implementation (5-phase workflow)
   - Automatic validation and linting

2. **auth-global-setup** - Configure global authentication
   - Pre-test authentication setup
   - Token storage and management
   - Test integration patterns

### Using Skills with AI Agents

When working with Claude or other agents that support `.claude/skills/`:

```
"Write an e2e test for the checkout flow"
"Set up global authentication for tests"
"Add visual regression tests for the inventory page"
```

The agent will automatically:
- Use the appropriate skill
- Research actual code and APIs
- Present a test plan for your review
- Implement with best practices
- Run tests to validate

## 📝 Writing Tests

### Page Object Model Pattern

Tests use the Page Object Model for maintainability:

```typescript
// pages/inventory.page.ts
export class InventoryPage {
  constructor(private page: Page) {}

  async addItemToCart(itemName: string) {
    await this.page.getByRole('button', { name: `Add to cart: ${itemName}` }).click();
  }

  async viewCart() {
    await this.page.getByTestId('shopping-cart-link').click();
  }
}

// Test usage
test('should add item to cart', async ({ page }) => {
  const inventory = new InventoryPage(page);
  await inventory.addItemToCart('Backpack');
  await inventory.viewCart();
});
```

### Using Custom Fixture

The project includes custom fixtures for SauceDemo:

```typescript
import { test, expect } from '../../fixtures/saucedemo/test.fixture';

test('should login with different roles', async ({ page, loginAs }) => {
  // Helper function from fixture
  await loginAs('standard_user');
  
  await expect(page).toHaveURL(/\/inventory/);
});
```

### API Fixture (State Setup)

Set up test data quickly via API:

```typescript
test('should display order history', async ({ api, page }) => {
  // Create user and order via API (faster than UI)
  const user = await api.createUser({
    email: 'test@example.com',
    name: 'Test User'
  });
  
  const order = await api.createOrder({
    userId: user.id,
    items: ['item1', 'item2']
  });

  await page.goto(`/orders/${order.id}`);
  await expect(page.getByText('Order confirmed')).toBeVisible();
  
  // Automatic cleanup on test end
});
```

### Visual Regression Testing

```typescript
test('should match baseline screenshot', async ({ page }) => {
  await page.goto('/inventory');
  
  await expect(page).toHaveScreenshot('inventory-page.png', {
    mask: [
      page.getByTestId('current-user'),  // Dynamic content
      page.getByTestId('timestamp')
    ],
    maxDiffPixels: 100
  });
});
```

## 🔧 Customization

### Adapting for Your Own Project

This framework can be easily adapted to test any web application:

#### 1. Update AGENTS.md Files

Customize instructions in:
- [AGENTS.md](AGENTS.md) - Root-level project conventions
- [tests/AGENTS.md](tests/AGENTS.md) - Testing-specific patterns

#### 2. Create Page Objects

Create page classes for your application:

```typescript
// tests/pages/dashboard.page.ts
import { Page } from '@playwright/test';

export class DashboardPage {
  constructor(private page: Page) {}

  async navigateTo() {
    await this.page.goto('/dashboard');
  }

  async getWelcomeMessage() {
    return this.page.getByRole('heading', { level: 1 });
  }
}
```

#### 3. Extend Fixtures

Add your application's custom fixtures:

```typescript
// tests/fixtures/your-app.fixture.ts
import { test as base } from '@playwright/test';
import { YourAppPage } from '../pages/your-app.page';

type YourAppFixtures = {
  appPage: YourAppPage;
};

export const test = base.extend<YourAppFixtures>({
  appPage: async ({ page }, use) => {
    const appPage = new YourAppPage(page);
    await use(appPage);
  },
});

export { expect } from '@playwright/test';
```

#### 4. Configure Environment

Update `.env` with your application's variables:

```env
APP_BASE_URL=https://your-app.com
API_KEY=your-api-key
# ... other env vars
```

### Extend ESLint Rules

Add project-specific linting rules in [.eslintrc.json](.eslintrc.json):

```json
{
  "rules": {
    "playwright/valid-title": [
      "error",
      {
        "mustMatch": {
          "test": "^should",
          "describe": ""
        }
      }
    ]
  }
}
```

## 🎓 Best Practices (Built-In)

### Locator Strategy (Priority Order)

The ESLint rules enforce this priority:

1. ✅ `getByRole('button', { name: 'Submit' })` - Best for accessibility
2. ✅ `getByLabel('Email')` - For form fields  
3. ✅ `getByTestId('user-menu')` - When semantic queries aren't possible
4. ✅ `getByText('Welcome')` - For unique text
5. ❌ `page.locator('.btn-primary')` - Avoid CSS selectors (ESLint error)

### Waiting Strategies

```typescript
// ✅ GOOD - Wait for specific response
const responsePromise = page.waitForResponse(
  response => response.url().includes('/api/users') && response.status() === 200
);
await page.getByRole('button', { name: 'Load Users' }).click();
await responsePromise;

// ✅ GOOD - Wait for element
await expect(page.getByText('Data loaded')).toBeVisible();

// ❌ BAD - Arbitrary waitForTimeout (ESLint error)
await page.waitForTimeout(2000);
```

### Test Structure (Given-When-Then)

```typescript
test('should complete checkout', async ({ page }) => {
  // GIVEN: User is logged in and on inventory page
  await page.goto('/inventory');
  
  // WHEN: User adds items and checks out
  await page.getByRole('button', { name: /add to cart/i }).first().click();
  await page.getByRole('link', { name: 'cart' }).click();
  await page.getByRole('button', { name: 'Checkout' }).click();
  
  // THEN: Checkout flow is completed
  await expect(page).toHaveURL(/checkout/);
});
```

### Test Independence

```typescript
// ✅ GOOD - Each test is independent
test('should create project', async ({ api, page }) => {
  const project = await api.createProject({ name: 'Test' });
  await page.goto(`/projects/${project.id}`);
  // Automatic cleanup via fixture
});

// ❌ BAD - Tests with shared state (causes flakiness in parallel)
let sharedProject;
beforeAll(async () => {
  sharedProject = await api.createProject({ name: 'Shared' });
});
```

### Error Handling

```typescript
// ✅ GOOD - Graceful error handling
try {
  const response = await page.goto('/protected', { waitUntil: 'networkidle' });
  if (!response?.ok()) {
    throw new Error(`Failed to load: ${response?.status()}`);
  }
} catch (error) {
  console.error('Navigation failed:', error);
  throw;
}

// ❌ BAD - Swallowing errors
page.goto('/protected').catch(() => {});
```

### ESLint Enforcement

This project's [ESLint configuration](.eslintrc.json) automatically catches:
- ❌ `waitForTimeout()` - Use proper assertions instead
- ❌ `networkidle` - Use `waitForResponse()` instead
- ❌ Force options (`{ force: true }`) - Fix the test instead
- ❌ Hardcoded timeouts - Use dynamic waits
- ✅ Web-first assertions - `expect()` over custom code

## 🐛 Debugging & Troubleshooting

### Interactive Debugging

```bash
# Debug Mode - Step through tests
npm run test:debug

# UI Mode - Control test execution
npm run test:ui

# Headed Mode - See browser activity
npm run test:headed

# Specific test
npx playwright test -g "should login successfully"
```

### Detecting Flaky Tests

```bash
# Run test multiple times to check for flakiness
npx playwright test -g "test name" --repeat-each=5

# Run in serial mode (useful for dependency debugging)
npx playwright test --serial

# View detailed test report
npm run test:report
```

### Common Issues

| Issue | Solution |
|-------|----------|
| **Tests pass locally, fail in CI** | Check environment variables, browser versions |
| **Tests fail randomly** | Usually timing issues - use proper waits instead of timeouts |
| **Selectors don't work** | Use browser DevTools, `page.pause()`, or debug mode |
| **API calls hang** | Check network requests in DevTools, use `waitForResponse()` |
| **Visual regression mismatch** | Update snapshots with `--update-snapshots` if intentional |

### Debugging Commands

```typescript
// Pause test execution
test('debug example', async ({ page }) => {
  await page.pause(); // Opens DevTools
});

// Print element information
const element = page.getByRole('button', { name: 'Click me' });
console.log(await element.boundingBox());

// Track network requests
page.on('request', req => console.log(req.url()));
page.on('response', res => console.log(res.status(), res.url()));
```

## 📚 Documentation

### Quick References
- [QUICKSTART.md](QUICKSTART.md) - 5-minute setup guide
- [STRUCTURE.md](STRUCTURE.md) - Detailed directory structure
- [AGENTS.md](AGENTS.md) - AI agent instructions

### Integration Guides
- [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) - Full integration into existing projects
- [INTEGRATION_CHECKLIST.md](INTEGRATION_CHECKLIST.md) - Step-by-step checklist

### SauceDemo Docs
- [docs/saucedemo/SAUCEDEMO_QUICKSTART.md](docs/saucedemo/SAUCEDEMO_QUICKSTART.md)
- [docs/saucedemo/SAUCEDEMO_IMPLEMENTATION_GUIDE.md](docs/saucedemo/SAUCEDEMO_IMPLEMENTATION_GUIDE.md)
- [docs/saucedemo/SAUCEDEMO_ARCHITECTURE.md](docs/saucedemo/SAUCEDEMO_ARCHITECTURE.md)

### External Resources
- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [ESLint Playwright Plugin](https://github.com/mskelton/eslint-plugin-playwright)

## 🔄 Integration into Existing Projects

To integrate this framework into your existing Playwright project:

1. **Copy agent skills:**
   ```bash
   cp -r .claude/skills <your-project>/.claude/
   ```

2. **Copy testing guidelines:**
   ```bash
   cp AGENTS.md <your-project>/AGENTS.md
   cp tests/AGENTS.md <your-project>/tests/AGENTS.md
   ```

3. **Copy fixtures and configuration:**
   ```bash
   cp -r tests/fixtures <your-project>/tests/
   cp .eslintrc.json <your-project>/
   ```

4. **Update package.json** with lint scripts:
   ```json
   {
     "scripts": {
       "lint": "eslint tests/**/*.ts --fix-dry-run",
       "lint:fix": "eslint tests/**/*.ts --fix"
     }
   }
   ```

See [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) for detailed steps.

## 🤝 Project Features

### Framework Capabilities

✅ **AI Agent Skills** - Automated E2E test writing with quality validation  
✅ **SauceDemo Example** - Complete working test suite for reference  
✅ **Page Object Model** - Maintainable, scalable test code  
✅ **Global Setup** - Pre-test authentication and state management  
✅ **Custom Fixtures** - Reusable test utilities and helpers  
✅ **Visual Testing** - Screenshot-based regression testing  
✅ **ESLint Integration** - Automatic best practices enforcement  
✅ **Multi-user Testing** - Role-based and data-driven test execution  
✅ **Performance Testing** - Detect and measure performance issues  
✅ **Environment Config** - Secure credential management  

### Code Quality

- TypeScript from the ground up
- Strict linting rules
- Self-validating test workflow
- Automatic screenshot diffing
- Built-in test data generators

## 📄 License

MIT
