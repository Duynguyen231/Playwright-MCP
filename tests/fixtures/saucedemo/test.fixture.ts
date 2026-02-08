import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../../pages/login.page';
import { InventoryPage } from '../../pages/inventory.page';
import { SAUCE_DEMO_USERS, UserRole, SauceDemoUser } from './roles';

/**
 * SauceDemo Test Fixture
 * Provides pre-configured page objects and authentication helpers
 */
type SauceDemoFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  authenticatedPage: (user: SauceDemoUser) => Promise<Page>;
};

export const test = base.extend<SauceDemoFixtures>({
  /**
   * Fixture: loginPage
   * Provides a LoginPage instance for the test
   */
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  /**
   * Fixture: inventoryPage
   * Provides an InventoryPage instance for the test
   */
  inventoryPage: async ({ page }, use) => {
    const inventoryPage = new InventoryPage(page);
    await use(inventoryPage);
  },

  /**
   * Fixture: authenticatedPage
   * Returns a page that's already logged in with the given user
   * Usage: const page = await authenticatedPage(SAUCE_DEMO_USERS[UserRole.STANDARD]);
   */
  authenticatedPage: async ({ page }, use) => {
    const authenticate = async (user: SauceDemoUser): Promise<Page> => {
      const loginPage = new LoginPage(page);
      
      // Given: User navigates to SauceDemo
      await loginPage.goto();
      
      // When: User enters credentials and logs in
      await loginPage.login(user.username, user.password);
      
      // Then: Wait for navigation to inventory page (or error, depending on user)
      try {
        await page.waitForURL(/inventory/, { timeout: 10000 });
      } catch {
        // Some users may not reach inventory page due to locks/errors
        // This is expected behavior for certain roles
      }
      
      return page;
    };

    await use(authenticate);
  },
});

/**
 * Export test and expect for convenience
 */
export { expect } from '@playwright/test';
