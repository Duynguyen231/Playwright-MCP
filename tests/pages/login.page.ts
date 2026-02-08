import { Page, Locator } from '@playwright/test';

/**
 * LoginPage - Page Object Model for SauceDemo Login page
 * Encapsulates all login-related interactions and assertions
 */
export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly pageContainer: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Locators using role-based queries (most stable for accessibility)
    this.usernameInput = page.getByRole('textbox', { name: 'Username' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'Login' });
    // Error message appears as a heading with text starting with "Epic sadface:"
    this.errorMessage = page.getByRole('heading', { level: 3 });
    this.pageContainer = page.locator('[class*="login"]');
  }

  /**
   * Navigate to SauceDemo login page
   */
  async goto() {
    await this.page.goto(process.env.SAUCE_BASE_URL || 'https://www.saucedemo.com');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Perform login with provided credentials
   */
  async login(username: string, password: string) {
    // Given: User is on the login page
    await this.usernameInput.fill(username);
    
    // When: User enters credentials
    await this.passwordInput.fill(password);
    
    // And: User clicks login button
    await this.loginButton.click();
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string | null> {
    const isVisible = await this.errorMessage.isVisible().catch(() => false);
    if (isVisible) {
      return await this.errorMessage.textContent();
    }
    return null;
  }

  /**
   * Check if error message is displayed with specific text
   */
  async hasErrorMessage(errorText: string): Promise<boolean> {
    const message = await this.getErrorMessage();
    return message?.includes(errorText) ?? false;
  }

  /**
   * Check if page is loaded (username input is visible)
   */
  async isLoaded(): Promise<boolean> {
    return await this.usernameInput.isVisible().catch(() => false);
  }

  /**
   * Get page title
   */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }
}
