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
 */

test.describe('SauceDemo - Login Behavior by User Role', () => {
  /**
   * Test: Standard User - Successful Login
   *
   * Scenario: Given a standard_user with valid credentials
   *          When the user attempts to login
   *          Then the user should be logged in and redirected to the inventory page
   */
  test('should allow standard_user to login successfully', async ({ loginPage, page }) => {
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
  test('should block login for locked_out_user with error message', async ({ loginPage, page }) => {
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
  test('should allow performance_glitch_user to login with delays', async ({
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
  test('should allow problem_user to login (UI issues expected on inventory)', async ({
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
  test('should allow error_user to login successfully', async ({ loginPage, page }) => {
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
  test('should allow visual_user to login successfully', async ({ loginPage, page }) => {
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
 */
test.describe('SauceDemo - Post-Login Inventory (Standard User)', () => {
  /**
   * Test: Standard User - View Products
   *
   * Scenario: Given standard_user is logged in
   *          When the user navigates to inventory
   *          Then the user should see products displayed
   */
  test('should display products on inventory page for standard_user', async ({
    loginPage,
    inventoryPage,
  }) => {
    const user = SAUCE_DEMO_USERS[UserRole.STANDARD];

    // Given: User is logged in as standard_user
    await loginPage.goto();
    await loginPage.login(user.username, user.password);

    // When: Page loads the inventory
    await inventoryPage.waitForPageLoad();

    // Then: Products should be visible
    const productCount = await inventoryPage.getProductCount();
    expect(productCount).toBeGreaterThan(0);

    // And: Product names should be retrievable
    const productNames = await inventoryPage.getProductNames();
    expect(productNames.length).toBeGreaterThan(0);
    expect(productNames[0]).toBeTruthy();
  });

  /**
   * Test: Standard User - Add Product to Cart
   *
   * Scenario: Given standard_user is viewing the inventory
   *          When the user adds a product to cart
   *          Then the cart badge should increment
   */
  test('should allow standard_user to add product to cart', async ({
    loginPage,
    inventoryPage,
  }) => {
    const user = SAUCE_DEMO_USERS[UserRole.STANDARD];

    // Given: User is logged in as standard_user
    await loginPage.goto();
    await loginPage.login(user.username, user.password);
    await inventoryPage.waitForPageLoad();

    // Get initial cart count
    const initialCartCount = await inventoryPage.getCartItemCount();

    // When: User adds a product to cart
    const products = await inventoryPage.getProductNames();
    if (products.length > 0) {
      await inventoryPage.addProductToCart(products[0]);
    }

    // Then: Cart badge should increase
    const updatedCartCount = await inventoryPage.getCartItemCount();
    expect(updatedCartCount).toBe((initialCartCount || 0) + 1);
  });

  /**
   * Test: Standard User - Logout
   *
   * Scenario: Given standard_user is logged in
   *          When the user logs out via hamburger menu
   *          Then the user should be redirected to login page
   */
  test('should allow standard_user to logout', async ({ loginPage, inventoryPage }) => {
    const user = SAUCE_DEMO_USERS[UserRole.STANDARD];

    // Given: User is logged in as standard_user
    await loginPage.goto();
    await loginPage.login(user.username, user.password);
    await inventoryPage.waitForPageLoad();

    // When: User logs out
    await inventoryPage.logout();

    // Then: User should be redirected to login page
    await expect(loginPage.usernameInput).toBeVisible();
  });
});
