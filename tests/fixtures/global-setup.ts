import { chromium, FullConfig } from '@playwright/test';
import path from 'path';
import fs from 'fs';

/**
 * Global Setup for Playwright
 * Handles pre-test authentication to avoid repeated login in each test
 *
 * Benefits:
 * - 1 login instead of N logins (where N = number of tests)
 * - Eliminates API latency from repeated authentication
 * - Tests start already authenticated, ready to validate
 */

async function globalSetup(config: FullConfig) {
  // Store auth files at project root (one level up from tests directory)
  const projectRoot = path.dirname(config.rootDir);
  const authDir = path.join(projectRoot, '.auth');
  
  // Create .auth directory if it doesn't exist
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true });
  }

  // Create browser and context for authentication
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Authenticate SauceDemo Standard User
    await authenticateSauceDemoUser(page, {
      url: 'https://www.saucedemo.com/',
      username: process.env.SAUCE_STANDARD_USER || 'standard_user',
      password: process.env.SAUCE_PASSWORD || 'secret_sauce',
      role: 'standard-user',
      storageStatePath: path.join(authDir, 'saucedemo-standard-user.json'),
    });

    console.log('✅ Global setup: Authentication completed');
    console.log(`   Storage states saved to: ${authDir}`);
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  } finally {
    await context.close();
    await browser.close();
  }
}

interface AuthConfig {
  url: string;
  username: string;
  password: string;
  role: string;
  storageStatePath: string;
}

async function authenticateSauceDemoUser(page: any, config: AuthConfig) {
  console.log(`🔐 Authenticating ${config.role}...`);

  try {
    // Navigate to login page
    await page.goto(config.url);
    
    // Wait for login form
    await page.waitForSelector('input[id="user-name"]', { timeout: 5000 });

    // Fill credentials
    await page.fill('input[id="user-name"]', config.username);
    await page.fill('input[id="password"]', config.password);

    // Click login button
    const loginButton = page.locator('input[id="login-button"]');
    await loginButton.click();

    // Wait for successful redirect (inventory page loads)
    await page.waitForURL('**/inventory.html', { timeout: 10000 });

    // Verify we're on the inventory page
    const inventoryContainer = await page.locator('[data-test="inventory-container"]').isVisible();
    if (!inventoryContainer) {
      throw new Error('Failed to verify inventory page loaded after login');
    }

    // Save storage state (localStorage, sessionStorage, cookies)
    await page.context().storageState({ path: config.storageStatePath });
    
    console.log(`✅ ${config.role} authenticated and storage state saved`);
  } catch (error) {
    console.error(`❌ Failed to authenticate ${config.role}:`, error);
    throw error;
  }
}

export default globalSetup;
