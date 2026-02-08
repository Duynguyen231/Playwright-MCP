# Playwright E2E Testing Setup with Agent Skills

This setup provides a complete structure for writing Playwright E2E tests with AI agent assistance using skills and AGENTS.md files.

## 📁 Structure

```
.
├── .claude/
│   ├── skills/
│   │   └── write-e2e-test/
│   │       └── SKILL.md          # E2E test writing skill
│   └── hooks/
│       └── lint-e2e.sh           # ESLint validation hook
├── tests/
│   ├── e2e/
│   │   └── auth/
│   │       └── login.spec.ts     # Example test file
│   ├── fixtures/
│   │   ├── api.ts                # API fixture for state setup
│   │   ├── visual.ts             # Visual regression utilities
│   │   └── test-data.ts          # Test data generators
│   └── AGENTS.md                 # Testing-specific instructions
├── AGENTS.md                     # Root-level project instructions
├── playwright.config.ts          # Playwright configuration
├── .eslintrc.json               # ESLint configuration
└── package.json                  # Dependencies and scripts
```

## 🚀 Installation

### 1. Copy files to your existing Playwright project

```bash
# Copy agent configuration
cp -r .claude/ <your-project>/.claude/
cp AGENTS.md <your-project>/AGENTS.md

# Copy test fixtures and instructions
cp tests/AGENTS.md <your-project>/tests/AGENTS.md
cp -r tests/fixtures/ <your-project>/tests/fixtures/

# Copy ESLint config
cp .eslintrc.json <your-project>/.eslintrc.json
```

### 2. Install dependencies

```bash
npm install --save-dev \
  eslint \
  @typescript-eslint/eslint-plugin \
  @typescript-eslint/parser \
  eslint-plugin-playwright
```

### 3. Update your package.json

Add these scripts:

```json
{
  "scripts": {
    "test": "playwright test",
    "test:headed": "playwright test --headed",
    "test:ui": "playwright test --ui",
    "test:debug": "playwright test --debug",
    "lint": "eslint tests/**/*.ts",
    "lint:fix": "eslint tests/**/*.ts --fix"
  }
}
```

### 4. Make the lint hook executable

```bash
chmod +x .claude/hooks/lint-e2e.sh
```

## 🎯 Usage with AI Agents

### Using the E2E Test Writing Skill

When working with Claude Code or other AI agents that support skills:

```bash
# Trigger the skill manually
"Write an e2e test for user login"

# Or let the agent decide to use it
"I need to test the checkout flow"
```

The skill will guide the agent through:
1. **Requirements gathering** - Clarifying questions about test scope
2. **Implementation research** - Checking actual code and APIs
3. **Plan approval** - Presenting test plan for your review
4. **Implementation** - Writing the test following best practices
5. **Validation** - Running tests in isolation to verify they work

### Key Features

✅ **Structured workflow** - 5-phase process ensures quality tests
✅ **Self-validation** - Tests are run multiple times before delivery
✅ **Automatic linting** - ESLint hooks catch common issues
✅ **Best practices** - Built-in patterns for locators, API waiting, visual testing
✅ **Fixtures ready** - API setup, visual testing, test data generators included

## 📝 Writing Tests

### Example: Login Test

```typescript
import { test, expect } from '../../fixtures/api';

test.describe('User Login', () => {
  test('should login successfully with valid credentials', async ({ page, api }) => {
    // Given: User exists in system
    const user = await api.createUser({
      email: 'test@example.com',
      password: 'password123'
    });

    // When: User logs in
    await page.goto('/login');
    await page.getByLabel('Email').fill(user.email);
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign In' }).click();

    // Then: User is redirected to dashboard
    await expect(page).toHaveURL('/dashboard');
  });
});
```

### Using API Fixture for State Setup

```typescript
test('should display user profile', async ({ page, api }) => {
  // Setup via API (faster than UI)
  const user = await api.createUser({
    name: 'John Doe',
    email: 'john@example.com'
  });

  await page.goto(`/profile/${user.id}`);
  await expect(page.getByRole('heading', { name: 'John Doe' })).toBeVisible();
  
  // Cleanup happens automatically
});
```

### Visual Regression Testing

```typescript
test('should render dashboard correctly', async ({ page }) => {
  await page.goto('/dashboard');
  
  await expect(page).toHaveScreenshot('dashboard.png', {
    mask: [
      page.getByTestId('current-time'),
      page.getByTestId('user-id')
    ],
    maxDiffPixels: 100
  });
});
```

## 🔧 Customization

### Update AGENTS.md Files

Customize the instructions for your specific project:

1. **Root AGENTS.md** - General project conventions
2. **tests/AGENTS.md** - Testing-specific patterns and practices

### Extend API Fixture

Add your own API helpers in `tests/fixtures/api.ts`:

```typescript
const api = {
  // ... existing methods ...
  
  createProduct: async (productData) => {
    const response = await request.post('/api/products', { data: productData });
    const product = await response.json();
    createdProducts.push(product.id);
    return product;
  },
};
```

### Add Custom ESLint Rules

Update `.eslintrc.json` to enforce your team's conventions:

```json
{
  "rules": {
    "playwright/valid-title": [
      "error",
      {
        "mustMatch": {
          "test": "^should",  // Enforce test naming convention
          "describe": ""
        }
      }
    ]
  }
}
```

## 🎓 Best Practices

### Locator Strategy (Priority Order)

1. ✅ `getByRole('button', { name: 'Submit' })` - Best for accessibility
2. ✅ `getByLabel('Email')` - For form fields
3. ✅ `getByTestId('user-menu')` - When semantic queries aren't possible
4. ✅ `getByText('Welcome')` - For unique text
5. ❌ `page.locator('.btn-primary')` - Avoid CSS selectors

### API Waiting

```typescript
// ✅ Good - wait for specific API call
const responsePromise = page.waitForResponse(
  response => response.url().includes('/api/users') && response.status() === 200
);
await page.getByRole('button', { name: 'Load' }).click();
await responsePromise;

// ❌ Bad - arbitrary timeout
await page.waitForTimeout(2000);
```

### Test Independence

```typescript
// ✅ Good - each test is independent
test('should create user', async ({ api }) => {
  const user = await api.createUser({ name: 'Test' });
  // test logic
  // automatic cleanup
});

// ❌ Bad - shared state between tests
let sharedUser; // Will cause issues in parallel execution
```

## 🐛 Debugging

```bash
# Run in headed mode
npm run test:headed

# Run in debug mode
npm run test:debug

# Run specific test
npx playwright test -g "should login successfully"

# Run test multiple times to check for flakiness
npx playwright test -g "should login" --repeat-each=5

# View test report
npm run test:report
```

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Agent Skills Format](https://agentskills.io/)
- [ESLint Playwright Plugin](https://github.com/mskelton/eslint-plugin-playwright)

## 🤝 Contributing

When you find patterns that work well or spot issues:

1. Update the relevant AGENTS.md file
2. Add ESLint rules to catch common mistakes
3. Update the skill workflow if needed
4. Share learnings with your team

## 📄 License

MIT
