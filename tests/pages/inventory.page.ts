import { Page, Locator } from '@playwright/test';

/**
 * InventoryPage - Page Object Model for SauceDemo Inventory page
 * Encapsulates all inventory/products page interactions
 */
export class InventoryPage {
  readonly page: Page;
  readonly inventoryContainer: Locator;
  readonly productItems: Locator;
  readonly cartBadge: Locator;
  readonly hamburgerMenu: Locator;
  readonly logoutButton: Locator;
  readonly sortDropdown: Locator;
  readonly pageTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    
    this.inventoryContainer = page.locator('[data-test="inventory-container"]');
    this.productItems = page.locator('[data-test="inventory-item"]');
    this.cartBadge = page.locator('[class*="shopping_cart_badge"]');
    this.hamburgerMenu = page.getByRole('button', { name: 'Open Menu' });
    this.logoutButton = page.getByRole('link', { name: 'Logout' });
    this.sortDropdown = page.getByRole('combobox');
    this.pageTitle = page.locator('[class*="title"]');
  }

  /**
   * Wait for inventory page to load
   */
  async waitForPageLoad() {
    await this.inventoryContainer.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * Get count of product items displayed
   */
  async getProductCount(): Promise<number> {
    return await this.productItems.count();
  }

  /**
   * Add product to cart by product name
   */
  async addProductToCart(productName: string) {
    const addButton = this.page.locator(
      `//div[contains(text(), "${productName}")]/ancestor::div[@class="inventory_item"]//button`
    );
    await addButton.click();
  }

  /**
   * Remove product from cart by product name
   */
  async removeProductFromCart(productName: string) {
    const removeButton = this.page.locator(
      `//div[contains(text(), "${productName}")]/ancestor::div[@class="inventory_item"]//button`
    );
    await removeButton.click();
  }

  /**
   * Check if cart badge is visible and get its count
   */
  async getCartItemCount(): Promise<number | null> {
    const isVisible = await this.cartBadge.isVisible().catch(() => false);
    if (isVisible) {
      const text = await this.cartBadge.textContent();
      return text ? parseInt(text) : null;
    }
    return null;
  }

  /**
   * Logout using hamburger menu
   */
  async logout() {
    // When: User opens hamburger menu
    await this.hamburgerMenu.click();
    
    // And: User clicks logout
    await this.logoutButton.click();
    
    // Then: Wait for redirect to login page
    await this.page.waitForURL(/login|saucedemo/, { timeout: 10000 });
  }

  /**
   * Click on a product by name
   */
  async clickProduct(productName: string) {
    const productLink = this.page.locator(
      `//a[contains(., "${productName}")]`
    );
    await productLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Get all product names visible on page
   */
  async getProductNames(): Promise<string[]> {
    const items = this.page.locator('[data-test="inventory-item"]');
    const count = await items.count();
    const names: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const name = await items.nth(i).locator('[data-test="inventory-item-name"]').textContent();
      if (name) {
        names.push(name.trim());
      }
    }
    
    return names;
  }

  /**
   * Check if page is loaded
   */
  async isLoaded(): Promise<boolean> {
    return await this.inventoryContainer.isVisible().catch(() => false);
  }

  /**
   * Take screenshot for visual regression
   */
  async takeScreenshot(filename: string) {
    await this.page.screenshot({ path: `tests/screenshots/${filename}.png` });
  }
}
