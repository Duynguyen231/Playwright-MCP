import 'dotenv/config';
import { test, expect } from '../../fixtures/saucedemo/test.fixture';
import { SAUCE_DEMO_USERS, UserRole } from '../../fixtures/saucedemo/roles';

/**
 * SauceDemo Role-Based Automation Tests
 *
 * Test Suite: Login Behavior for Different User Roles
 * Purpose: Validate application behavior with different user roles and access scenarios
 *
 * User Roles Tested:
 * - standard_user: Normal user with full functionality
 * - locked_out_user: User with locked account
 * - problem_user: User with UI/functional issues
 * - performance_glitch_user: User with performance delays
 * - error_user: User experiencing errors
 * - visual_user: User with visual regression issues
 *
 * REFACTORED FOR GLOBAL SETUP:
 * - Login behavior tests: Kept as-is (they test the login flow itself)
 * - Post-login tests: Use pre-authenticated context from Global Setup
 *   This eliminates redundant login API calls and improves test performance
 */

test.describe('SauceDemo - Login Behavior by User Role', () => {
  /**
   * Test: Standard User - Successful Login
   *
   * Scenario: Given a standard_user with valid credentials
   *          When the user attempts to login
   *          Then the user should be logged in and redirected to the inventory page
   */
  test('@smoke @integration @e2e should allow standard_user to login successfully', async ({ loginPage, page }) => {
    const user = SAUCE_DEMO_USERS[UserRole.STANDARD];

    // Given: User navigates to SauceDemo login page
    await loginPage.goto();
    await expect(loginPage.usernameInput).toBeVisible();

    // When: User enters valid credentials and submits
    await loginPage.login(user.username, user.password);

    // Then: User should be redirected to inventory page
    await expect(page).toHaveURL(/inventory/);
    await expect(page.locator('[data-test="inventory-container"]')).toBeVisible();

    // And: No error message should be displayed
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBeNull();
  });

  /**
   * Test: Locked Out User - Login Blocked
   *
   * Scenario: Given a locked_out_user account
   *          When the user attempts to login with valid credentials
   *          Then the login should fail with a specific error message
   */
  test('@smoke @integration @e2e should block login for locked_out_user with error message', async ({ loginPage, page }) => {
    const user = SAUCE_DEMO_USERS[UserRole.LOCKED_OUT];

    // Given: User navigates to SauceDemo login page
    await loginPage.goto();

    // When: User enters locked_out credentials
    await loginPage.login(user.username, user.password);

    // Then: User should remain on login page
    await expect(page).toHaveURL(/saucedemo/);

    // And: Error message should be displayed
    await expect(loginPage.errorMessage).toBeVisible();
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('locked out');
  });

  /**
   * Test: Performance Glitch User - Login with Performance Delays
   *
   * Scenario: Given a performance_glitch_user account
   *          When the user attempts to login
   *          Then the login should succeed but with noticeable delays
   */
  test('@integration @e2e @regression should allow performance_glitch_user to login with delays', async ({
    loginPage,
    page,
  }) => {
    const user = SAUCE_DEMO_USERS[UserRole.PERFORMANCE];

    // Given: User navigates to SauceDemo login page
    await loginPage.goto();

    // Record start time to measure performance
    const startTime = Date.now();

    // When: User enters performance_glitch credentials
    await loginPage.login(user.username, user.password);

    // Then: Eventually redirected to inventory (with delay)
    await expect(page).toHaveURL(/inventory/, { timeout: 15000 });

    // And: Confirm at least 3 seconds elapsed (performance issue verification)
    const elapsedTime = Date.now() - startTime;
    expect(elapsedTime).toBeGreaterThanOrEqual(3000);

    // And: No error messages should be displayed
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBeNull();
  });

  /**
   * Test: Problem User - Login Success but with UI Issues Expected
   *
   * Scenario: Given a problem_user account
   *          When the user attempts to login
   *          Then the login should succeed, but UI issues may be visible on inventory
   */
  test('@integration @e2e @visual-user should allow problem_user to login (UI issues expected on inventory)', async ({
    loginPage,
    page,
  }) => {
    const user = SAUCE_DEMO_USERS[UserRole.PROBLEM];

    // Given: User navigates to SauceDemo login page
    await loginPage.goto();

    // When: User enters problem_user credentials
    await loginPage.login(user.username, user.password);

    // Then: User should be redirected to inventory page
    await expect(page).toHaveURL(/inventory/, { timeout: 10000 });

    // And: No login error should occur
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBeNull();

    // Note: UI issues would be visible on the inventory page
    // (e.g., broken images, missing elements, layout issues)
    // These are validated separately in visual/functional tests
  });

  /**
   * Test: Error User - Login Success but Errors Expected During Navigation
   *
   * Scenario: Given an error_user account
   *          When the user attempts to login
   *          Then the login should succeed initially
   */
  test('@integration @e2e @regression should allow error_user to login successfully', async ({ loginPage, page }) => {
    const user = SAUCE_DEMO_USERS[UserRole.ERROR];

    // Given: User navigates to SauceDemo login page
    await loginPage.goto();

    // When: User enters error_user credentials
    await loginPage.login(user.username, user.password);

    // Then: User should be redirected to inventory page
    await expect(page).toHaveURL(/inventory/, { timeout: 10000 });

    // And: No login errors
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBeNull();

    // Note: For error_user, issues appear during checkout or on specific pages
    // Those scenarios are validated separately
  });

  /**
   * Test: Visual User - Login Success with Visual Issues Expected
   *
   * Scenario: Given a visual_user account
   *          When the user attempts to login
   *          Then the login should succeed
   */
  test('@integration @e2e @visual-user should allow visual_user to login successfully', async ({ loginPage, page }) => {
    const user = SAUCE_DEMO_USERS[UserRole.VISUAL];

    // Given: User navigates to SauceDemo login page
    await loginPage.goto();

    // When: User enters visual_user credentials
    await loginPage.login(user.username, user.password);

    // Then: User should be redirected to inventory page
    await expect(page).toHaveURL(/inventory/, { timeout: 10000 });

    // And: No login errors
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toBeNull();

    // Note: Visual issues are style-related and tested via visual regression
  });
});

/**
 * Test Suite: Post-Login Inventory Navigation
 * Purpose: Validate behavior after successful login
 *
 * REFACTORED FOR GLOBAL SETUP:
 * These tests now use pre-authenticated context from Global Setup.
 * Instead of logging in within each test, they assume authentication
 * is already complete and start directly on the inventory page.
 * This eliminates redundant login API calls and improves test speed.
 */
test.describe('SauceDemo - Post-Login Inventory (Standard User)', () => {
  /**
   * Test: Standard User - View Products
   *
   * Scenario: Given standard_user is already authenticated (via Global Setup)
   *          When the user navigates to inventory
   *          Then the user should see products displayed
   */
  test('@smoke @integration @e2e should display products on inventory page for standard_user', async ({ browser }) => {
    // Pre-authenticated context from Global Setup
    const context = await browser.newContext({
      storageState: '.auth/saucedemo-standard-user.json',
    });
    const preAuthPage = await context.newPage();

    try {
      // Navigate directly to inventory (already authenticated, no login needed)
      await preAuthPage.goto('https://www.saucedemo.com/inventory.html');

      // Then: Products should be visible
      const products = await preAuthPage.locator('[data-test="inventory-item"]');
      const productCount = await products.count();
      expect(productCount).toBeGreaterThan(0);

      // And: Product names should be retrievable
      const firstProductName = await preAuthPage
        .locator('[data-test="inventory-item-name"]')
        .first()
        .textContent();
      expect(firstProductName).toBeTruthy();
    } finally {
      await preAuthPage.close();
      await context.close();
    }
  });

  /**
   * Test: Standard User - Add Product to Cart
   *
   * Scenario: Given standard_user is already authenticated (via Global Setup)
   *          When the user adds a product to cart
   *          Then the cart badge should increment
   */
  test('@smoke @integration @e2e should allow standard_user to add product to cart', async ({ browser }) => {
    // Pre-authenticated context from Global Setup
    const context = await browser.newContext({
      storageState: '.auth/saucedemo-standard-user.json',
    });
    const preAuthPage = await context.newPage();

    try {
      // Navigate directly to inventory (already authenticated)
      await preAuthPage.goto('https://www.saucedemo.com/inventory.html');

      // Get initial cart count
      const cartBadge = preAuthPage.locator('[data-test="shopping-cart-badge"]');
      const initialCartCount = (await cartBadge.isVisible()) ? parseInt(await cartBadge.textContent() || '0') : 0;

      // When: User adds a product to cart
      const addToCartButton = preAuthPage.locator('[data-test="add-to-cart-sauce-labs-backpack"]').first();
      if (await addToCartButton.isVisible()) {
        await addToCartButton.click();
      }

      // Then: Cart badge should increase
      const updatedCartBadge = preAuthPage.locator('[data-test="shopping-cart-badge"]');
      const updatedCartCount = await updatedCartBadge.textContent();
      expect(parseInt(updatedCartCount || '0')).toBe(initialCartCount + 1);
    } finally {
      await preAuthPage.close();
      await context.close();
    }
  });

  /**
   * Test: Standard User - Logout
   *
   * Scenario: Given standard_user is already authenticated (via Global Setup)
   *          When the user logs out via hamburger menu
   *          Then the user should be redirected to login page
   */
  test('@smoke @integration @e2e should allow standard_user to logout', async ({ browser }) => {
    // Pre-authenticated context from Global Setup
    const context = await browser.newContext({
      storageState: '.auth/saucedemo-standard-user.json',
    });
    const preAuthPage = await context.newPage();

    try {
      // Navigate directly to inventory (already authenticated)
      await preAuthPage.goto('https://www.saucedemo.com/inventory.html');

      // When: User logs out via hamburger menu
      const menuButton = preAuthPage.locator('button[id="react-burger-menu-btn"]');
      await menuButton.click();

      const logoutLink = preAuthPage.locator('a[id="logout_sidebar_link"]');
      await logoutLink.click();

      // Then: User should be redirected to login page
      await preAuthPage.waitForURL('**/index.html');
      const usernameInput = preAuthPage.locator('input[id="user-name"]');
      expect(await usernameInput.isVisible()).toBe(true);
    } finally {
      await preAuthPage.close();
      await context.close();
    }
  });
});
