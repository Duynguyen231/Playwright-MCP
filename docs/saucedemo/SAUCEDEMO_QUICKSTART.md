# SauceDemo Tests - Quick Start Guide

**TL;DR** - Get the tests running in 5 minutes!

---

## ⚡ Quick Setup (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Install Playwright Browsers
```bash
npx playwright install
```

### 3. That's it! Run tests:
```bash
npx playwright test tests/e2e/saucedemo/
```

---

## 🎯 Common Commands

### Run All Tests
```bash
npx playwright test tests/e2e/saucedemo/
```

### Run Specific Test File
```bash
npx playwright test tests/e2e/saucedemo/role-based.spec.ts
```

### Interactive UI Mode (Recommended)
```bash
npx playwright test --ui
```

### Visible Browser Mode
```bash
npx playwright test --headed
```

### Single Test by Name
```bash
npx playwright test -g "should allow standard_user to login"
```

### View HTML Report
```bash
npx playwright show-report
```

---

## 📁 Test Files

| File | Tests | Purpose |
|------|-------|---------|
| `role-based.spec.ts` | 9 | Core login & navigation for all roles |
| `performance-validation.spec.ts` | 3 | Detect performance delays |
| `visual-regression.spec.ts` | 5 | Screenshot-based visual validation |
| `advanced-scenarios.spec.ts` | 5 | Complex multi-user scenarios |
| **Total** | **22** | **Complete coverage** |

---

## 👥 User Roles

```
standard_user              → ✅ Normal user, all features work
locked_out_user            → 🔒 Login blocked  
problem_user               → ⚠️ UI issues on inventory
performance_glitch_user    → 🐌 3+ second delays
error_user                 → ❌ Errors during checkout
visual_user                → 🎨 Visual/styling issues
```

All use password: `secret_sauce`

---

## 📍 Page Objects

### LoginPage
```typescript
const loginPage = new LoginPage(page);
await loginPage.goto();
await loginPage.login(username, password);
const error = await loginPage.getErrorMessage();
```

### InventoryPage
```typescript
const inventoryPage = new InventoryPage(page);
await inventoryPage.waitForPageLoad();
const products = await inventoryPage.getProductNames();
await inventoryPage.addProductToCart(productName);
const cartCount = await inventoryPage.getCartItemCount();
```

---

## 🔧 Configuration

Environment variables in `.env`:
```
SAUCE_BASE_URL=https://www.saucedemo.com
SAUCE_PASSWORD=secret_sauce
SAUCE_STANDARD_USER=standard_user
SAUCE_LOCKED_OUT_USER=locked_out_user
# ... etc
```

**Note:** `.env` is already configured and ready to use!

---

## 📊 Test Execution Times

| Scenario | Time |
|----------|------|
| Single standard user test | ~5 seconds |
| All role-based tests (9) | ~40 seconds |
| Performance tests (3) | ~60 seconds |
| Visual tests (5) | ~25 seconds |
| Advanced scenarios (5) | ~30 seconds |
| **All tests (22)** | **~2-3 minutes** |

---

## ✅ Verification

### Verify Installation
```bash
npx playwright --version
```

### List Tests
```bash
npx playwright test --list tests/e2e/saucedemo/
```

### Run Single Test
```bash
npx playwright test -g "standard_user" 
```

---

## 🐛 Debugging

### Debug Mode (Step Through)
```bash
npx playwright test --debug tests/e2e/saucedemo/role-based.spec.ts
```

### Verbose Output
```bash
npx playwright test --reporter=verbose
```

### View Test in Browser
```bash
npx playwright test --headed --reporter=html
```

---

## 📚 Full Documentation

For complete details, see:
- `tests/e2e/saucedemo/README.md` - Comprehensive guide
- `SAUCEDEMO_IMPLEMENTATION_GUIDE.md` - Implementation details
- Source files:
  - `tests/pages/login.page.ts` - LoginPage class
  - `tests/pages/inventory.page.ts` - InventoryPage class
  - `tests/fixtures/saucedemo/test.fixture.ts` - Custom fixture
  - `tests/fixtures/saucedemo/roles.ts` - User roles & data

---

## 🚀 Next Steps

1. **Run tests:** `npx playwright test --ui`
2. **Explore:** Open `tests/e2e/saucedemo/role-based.spec.ts` to see tests
3. **Modify:** Add your own tests using the same patterns
4. **Extend:** Add new test scenarios for checkout, etc.

---

## 💡 Tips

- Use `--ui` mode for interactive debugging
- Use `--headed` to see test execution in browser
- Tests run in parallel automatically (3 workers)
- Each test is independent (can run in any order)
- Visual tests create baseline on first run (use `--update-snapshots` if needed)

---

## 📞 Need Help?

1. Check `tests/e2e/saucedemo/README.md` for detailed docs
2. Read inline comments in test files (Gherkin-style)
3. Use `--debug` mode to step through execution
4. Run individual tests with `-g "test name"`

---

**Created:** February 7, 2026  
**Status:** Ready to Use ✅
