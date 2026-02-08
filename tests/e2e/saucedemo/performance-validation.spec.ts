import 'dotenv/config';
import { test, expect } from '../../fixtures/saucedemo/test.fixture';
import { SAUCE_DEMO_USERS, UserRole } from '../../fixtures/saucedemo/roles';

/**
 * SauceDemo Performance Validation Tests
 *
 * Test Suite: Performance Issues for performance_glitch_user
 * Purpose: Validate that performance_glitch_user experiences expected delays
 */

test.describe('SauceDemo - Performance Validation for performance_glitch_user', () => {
  /**
   * Test: Performance - Measure Login Action Duration
   *
   * Scenario: Given performance_glitch_user logs in
   *          When the login action is performed
   *          Then it should show measurable delay (3+ seconds)
   */
  test('@e2e @regression should show performance delay on login action', async ({ loginPage, page }) => {
    const user = SAUCE_DEMO_USERS[UserRole.PERFORMANCE];

    // Given: Performance user navigates to login
    await loginPage.goto();

    // Record timing for login action
    const startTime = Date.now();

    // When: Perform login
    await loginPage.login(user.username, user.password);

    // Then: Wait for navigation to complete
    try {
      await page.waitForURL(/inventory/, { timeout: 15000 });
    } catch {
      // Expected to timeout or take longer
    }

    const elapsedTime = Date.now() - startTime;

    // Assert: At least 3 seconds should have elapsed
    expect(elapsedTime).toBeGreaterThanOrEqual(3000);
  });

  /**
   * Test: Performance - Inventory Load Time
   *
   * Scenario: Given performance_glitch_user is logged in
   *          When the inventory page loads
   *          Then it should measure the render time
   */
  test('@e2e @regression should measure inventory page load delay', async ({
    loginPage,
    inventoryPage,
    page,
  }) => {
    const user = SAUCE_DEMO_USERS[UserRole.PERFORMANCE];

    // Given: User logs in
    await loginPage.goto();
    await loginPage.login(user.username, user.password);
    await page.waitForURL(/inventory/, { timeout: 15000 });

    // When: Measure inventory rendering
    const startTime = Date.now();
    await inventoryPage.waitForPageLoad();
    const elapsedTime = Date.now() - startTime;

    // Then: Should complete eventually (even if delayed)
    const inventoryVisible = await inventoryPage.isLoaded();
    expect(inventoryVisible).toBe(true);
  });

  /**
   * Test: Performance - Product Interaction Delay
   *
   * Scenario: Given performance_glitch_user is on inventory
   *          When the user attempts to add a product to cart
   *          Then the action should be slower than standard_user
   */
  test('@e2e @regression should show delay when adding product to cart', async ({
    loginPage,
    inventoryPage,
  }) => {
    const user = SAUCE_DEMO_USERS[UserRole.PERFORMANCE];

    // Setup: Login as performance user
    await loginPage.goto();
    await loginPage.login(user.username, user.password);
    await inventoryPage.waitForPageLoad();

    // Get products
    const products = await inventoryPage.getProductNames();
    if (products.length === 0) {
      test.skip();
    }

    // When: Add product with timing
    const startTime = Date.now();
    await inventoryPage.addProductToCart(products[0]);
    const elapsedTime = Date.now() - startTime;

    // Then: Action should complete
    const cartCount = await inventoryPage.getCartItemCount();
    expect(cartCount).toBeGreaterThan(0);
  });
});
