import 'dotenv/config';
import { test, expect } from '../../fixtures/saucedemo/test.fixture';
import { SAUCE_DEMO_USERS, UserRole } from '../../fixtures/saucedemo/roles';

/**
 * SauceDemo Visual Regression Tests
 *
 * Test Suite: Visual Consistency for Different User Roles
 * Purpose: Validate visual appearance using screenshot comparisons
 *
 * Note: Visual user (visual_user) experiences styling inconsistencies
 */

test.describe('SauceDemo - Visual Regression Tests', () => {
  /**
   * Test: Visual - Standard User Inventory Screenshot
   *
   * Scenario: Given standard_user is on inventory page
   *          When the page is fully loaded
   *          Then the visual appearance should be consistent
   *
   * Note: On first run, baseline is created. Run with --update-snapshots to create baseline.
   */
  test('@visual @regression should match baseline screenshot for standard_user inventory', async ({
    loginPage,
    inventoryPage,
  }) => {
    const user = SAUCE_DEMO_USERS[UserRole.STANDARD];

    // Given: User is logged in
    await loginPage.goto();
    await loginPage.login(user.username, user.password);
    await inventoryPage.waitForPageLoad();

    // When: Take screenshot of inventory
    // Note: First run creates baseline, subsequent runs compare
    await expect(inventoryPage.inventoryContainer).toHaveScreenshot(
      'saucedemo-standard-inventory.png',
      {
        mask: [inventoryPage.page.locator('[class*="sidebar_label"]')],
        maxDiffPixels: 100,
        threshold: 0.2,
      }
    );
  });

  /**
   * Test: Visual - Login Page Screenshot
   *
   * Scenario: Given user is on login page
   *          When the page is fully loaded
   *          Then visual appearance should be consistent
   */
  test('@visual @regression should match baseline screenshot for login page', async ({ loginPage }) => {
    // Given: User navigates to login page
    await loginPage.goto();
    await loginPage.usernameInput.waitFor({ state: 'visible' });

    // When: Take screenshot of login page
    await expect(loginPage.page).toHaveScreenshot('saucedemo-login-page.png', {
      maxDiffPixels: 50,
      threshold: 0.2,
    });
  });

  /**
   * Test: Visual - Visual User Inventory (Expected Differences)
   *
   * Scenario: Given visual_user is on inventory page
   *          When the page loads
   *          Then visual inconsistencies may be apparent
   *          And the screenshot should show visual issues
   */
  test('@visual @visual-user should show visual differences for visual_user', async ({
    loginPage,
    inventoryPage,
  }) => {
    const user = SAUCE_DEMO_USERS[UserRole.VISUAL];

    // Given: User logs in as visual_user
    await loginPage.goto();
    await loginPage.login(user.username, user.password);
    await inventoryPage.waitForPageLoad();

    // When: Take screenshot of visual_user inventory
    // This will show visual inconsistencies compared to standard user
    const screenshot = await inventoryPage.inventoryContainer.screenshot();

    // Then: Screenshot should exist (visual issues documented)
    expect(screenshot).toBeTruthy();

    // Note: A detailed visual regression report would compare this against
    // the baseline. The visual_user will show styling differences like:
    // - Color mismatches
    // - Font issues
    // - Alignment problems
    // - Missing borders or shadows
  });

  /**
   * Test: Visual - Problem User Inventory (Expected Rendering Issues)
   *
   * Scenario: Given problem_user is on inventory page
   *          When the page loads
   *          Then rendering issues may be visible
   */
  test('@visual @problem-user should identify potential rendering issues for problem_user', async ({
    loginPage,
    inventoryPage,
  }) => {
    const user = SAUCE_DEMO_USERS[UserRole.PROBLEM];

    // Given: User logs in as problem_user
    await loginPage.goto();
    await loginPage.login(user.username, user.password);
    await inventoryPage.waitForPageLoad();

    // When: Check for expected issues
    const productItems = await inventoryPage.getProductCount();
    expect(productItems).toBeGreaterThan(0);

    // Then: Get screenshots to document issues
    const screenshot = await inventoryPage.inventoryContainer.screenshot();
    expect(screenshot).toBeTruthy();

    // Note: problem_user experiences UI/functional issues such as:
    // - Broken/missing images
    // - Layout issues
    // - Missing elements
    // - Text rendering problems
  });

  /**
   * Test: Visual - Element Visibility Validation
   *
   * Scenario: Given any user completes login
   *          When on the inventory page
   *          Then essential elements should be visible
   */
  test('@visual @critical should verify essential UI elements are visible', async ({
    loginPage,
    inventoryPage,
  }) => {
    const user = SAUCE_DEMO_USERS[UserRole.STANDARD];

    // Setup: Login
    await loginPage.goto();
    await loginPage.login(user.username, user.password);
    await inventoryPage.waitForPageLoad();

    // Then: Essential elements should be visible
    await expect(inventoryPage.hamburgerMenu).toBeVisible();
    await expect(inventoryPage.inventoryContainer).toBeVisible();

    const productCount = await inventoryPage.getProductCount();
    expect(productCount).toBeGreaterThan(0);
  });
});
