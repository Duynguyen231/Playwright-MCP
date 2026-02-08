import 'dotenv/config';
import { test, expect } from '../../fixtures/saucedemo/test.fixture';
import { SAUCE_DEMO_USERS, UserRole } from '../../fixtures/saucedemo/roles';

/**
 * SauceDemo Advanced User Scenario Tests
 *
 * Test Suite: Complex Scenarios for error_user and problem_user
 * Purpose: Validate application behavior under various problematic conditions
 */

test.describe('SauceDemo - Advanced User Scenarios', () => {
  /**
   * Test: Error User - Inventory Access
   *
   * Scenario: Given error_user is logged in
   *          When navigating the inventory
   *          Then errors may occur on specific actions
   */
  test('should allow error_user to access inventory after login', async ({
    loginPage,
    inventoryPage,
  }) => {
    const user = SAUCE_DEMO_USERS[UserRole.ERROR];

    // Given: Error user logs in
    await loginPage.goto();
    await loginPage.login(user.username, user.password);

    // Then: Should reach inventory page
    await expect(loginPage.page).toHaveURL(/inventory/);

    // And: Inventory should be accessible
    const isLoaded = await inventoryPage.isLoaded();
    expect(isLoaded).toBe(true);

    // Note: Errors manifest during checkout, not on inventory page
    // This confirms login works before downstream errors
  });

  /**
   * Test: Problem User - View Products
   *
   * Scenario: Given problem_user is logged in
   *          When on inventory page
   *          Then products should be accessible despite UI issues
   */
  test('should allow problem_user to view products despite UI issues', async ({
    loginPage,
    inventoryPage,
  }) => {
    const user = SAUCE_DEMO_USERS[UserRole.PROBLEM];

    // Given: Problem user logs in
    await loginPage.goto();
    await loginPage.login(user.username, user.password);

    // When: Inventory page loads
    await inventoryPage.waitForPageLoad();

    // Then: Products should still be retrievable
    const products = await inventoryPage.getProductNames();
    expect(products.length).toBeGreaterThan(0);

    // And: Product count should match
    const productCount = await inventoryPage.getProductCount();
    expect(productCount).toBe(products.length);

    // Note: Despite the count matching, the visual representation
    // may have issues like broken images or missing elements
  });

  /**
   * Test: Problem User - Product Interaction
   *
   * Scenario: Given problem_user has products displayed
   *          When attempting to interact with products
   *          Then actions should function despite UI issues
   */
  test('should allow problem_user to add products to cart (UI issues expected)', async ({
    loginPage,
    inventoryPage,
  }) => {
    const user = SAUCE_DEMO_USERS[UserRole.PROBLEM];

    // Setup: Login as problem user
    await loginPage.goto();
    await loginPage.login(user.username, user.password);
    await inventoryPage.waitForPageLoad();

    const products = await inventoryPage.getProductNames();
    if (products.length === 0) {
      test.skip();
    }

    const initialCount = await inventoryPage.getCartItemCount();

    // When: Add product to cart
    await inventoryPage.addProductToCart(products[0]);

    // Then: Cart should update (despite UI issues)
    const newCount = await inventoryPage.getCartItemCount();
    expect(newCount).toBe((initialCount || 0) + 1);

    // Note: Functionality works, but visual rendering may be broken
  });

  /**
   * Test: Multiple User Comparison - Same Action Different Results
   *
   * Scenario: Both standard_user and locked_out_user attempt login
   *          When they use their respective credentials
   *          Then outcomes should differ
   */
  test('should demonstrate different login outcomes for different roles', async ({
    loginPage,
  }) => {
    // Test 1: Standard user succeeds
    const standardUser = SAUCE_DEMO_USERS[UserRole.STANDARD];
    await loginPage.goto();
    await loginPage.login(standardUser.username, standardUser.password);
    const standardError = await loginPage.getErrorMessage();
    expect(standardError).toBeNull();

    // Cleanup: Logout for next iteration
    await loginPage.page.goto(
      process.env.SAUCE_BASE_URL || 'https://www.saucedemo.com'
    );

    // Test 2: Locked user fails
    const lockedUser = SAUCE_DEMO_USERS[UserRole.LOCKED_OUT];
    await loginPage.goto();
    await loginPage.login(lockedUser.username, lockedUser.password);
    const lockedError = await loginPage.getErrorMessage();
    expect(lockedError).toBeTruthy();
    expect(lockedError).toContain('locked out');

    // Verify: Outcomes are different
    expect(standardError).not.toEqual(lockedError);
  });

  /**
   * Test: Error User - Accessible via Direct Navigation
   *
   * Scenario: Given error_user is logged in
   *          When accessing direct inventory URL
   *          Then page should be accessible
   */
  test('should allow error_user to navigate to inventory via direct URL', async ({
    loginPage,
    page,
  }) => {
    const user = SAUCE_DEMO_USERS[UserRole.ERROR];

    // Setup: Login
    await loginPage.goto();
    await loginPage.login(user.username, user.password);
    await page.waitForURL(/inventory/);

    // When: Navigate directly to inventory
    await page.goto(`${process.env.SAUCE_BASE_URL || 'https://www.saucedemo.com'}/inventory.html`);

    // Then: Page should load without errors
    const inventory = page.locator('[data-test="inventory-container"]');
    await expect(inventory).toBeVisible();
  });
});
