// @ts-check
import { test, expect, Page } from '@playwright/test';

test.describe('Checkout Flow @e2e @integration @smoke', () => {
  const baseUrl = 'https://www.saucedemo.com';
  const credentials = {
    username: 'standard_user',
    password: 'secret_sauce'
  };

  test('should complete successful checkout with single product as standard_user', async ({ page }) => {
    // Navigate to SauceDemo application to explore the checkout flow
    await page.goto(`${baseUrl}/`);
    
    // Enter standard_user username
    await page.locator('[data-test="username"]').fill(credentials.username);
    
    // Enter password
    await page.locator('[data-test="password"]').fill(credentials.password);
    
    // Click login button to proceed to inventory page
    await page.locator('[data-test="login-button"]').click();
    await page.waitForURL('**/inventory.html');
    
    // Verify 6 products displayed on inventory page
    const productItems = page.locator('[data-test="inventory-item"]');
    await expect(productItems).toHaveCount(6);
    
    // Add Bike Light product to cart
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    
    // Cart badge shows "1"
    const cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    await expect(cartBadge).toContainText('1');
    
    // Navigate to shopping cart page
    await page.locator('[data-test="shopping-cart-link"]').click();
    await page.waitForURL('**/cart.html');
    
    // Verify product with price $9.99
    await expect(page.locator('text=Sauce Labs Bike Light')).toBeVisible();
    await expect(page.locator('text=$9.99')).toBeVisible();
    
    // Click Checkout
    await page.locator('[data-test="checkout"]').click();
    await page.waitForURL('**/checkout-step-one.html');
    
    // Fill form: First Name="John", Last Name="Doe", Zip Code="70000"
    await page.locator('[data-test="firstName"]').fill('John');
    await page.locator('[data-test="lastName"]').fill('Doe');
    await page.locator('[data-test="postalCode"]').fill('70000');
    
    // Proceed to checkout overview page
    await page.locator('[data-test="continue"]').click();
    await page.waitForURL('**/checkout-step-two.html');
    
    // Verify order overview with totals (Item: $9.99, Tax: $0.80, Total: $10.79)
    await expect(page.locator('[data-test="subtotal-label"]')).toContainText('$9.99');
    await expect(page.locator('[data-test="tax-label"]')).toContainText('$0.80');
    await expect(page.locator('[data-test="total-label"]')).toContainText('$10.79');
    
    // Verify payment info "SauceCard #31337" and shipping "Free Pony Express Delivery!"
    await expect(page.locator('text=SauceCard #31337')).toBeVisible();
    await expect(page.locator('text=Free Pony Express Delivery!')).toBeVisible();
    
    // Click Finish
    await page.locator('[data-test="finish"]').click();
    await page.waitForURL('**/checkout-complete.html');
    
    // Verify success message "Thank you for your order!"
    await expect(page.locator('text=Thank you for your order!')).toBeVisible();
    
    // Verify "Your order has been dispatched..."
    await expect(page.locator('text=Your order has been dispatched, and will arrive just as fast as the pony can get there!')).toBeVisible();
    
    // Click Back Home
    await page.locator('[data-test="back-to-products"]').click();
    await page.waitForURL('**/inventory.html');
    
    // Cart badge is empty
    const cartBadgeAfter = page.locator('[data-test="shopping-cart-badge"]');
    await expect(cartBadgeAfter).not.toBeVisible();
  });

  // test('should update cart count correctly when adding multiple products', async ({ page }) => {
  //   // Navigate to SauceDemo application
  //   await page.goto(`${baseUrl}/`);
    
  //   // Login as standard_user
  //   await page.locator('[data-test="username"]').fill(credentials.username);
  //   await page.locator('[data-test="password"]').fill(credentials.password);
  //   await page.locator('[data-test="login-button"]').click();
  //   await page.waitForURL('**/inventory.html');
    
  //   // Add Backpack ($29.99) - cart badge shows "1"
  //   await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  //   let cartBadge = page.locator('[data-test="shopping-cart-badge"]');
  //   await expect(cartBadge).toContainText('1');
    
  //   // Add Bolt T-Shirt ($15.99) - cart badge shows "2"
  //   await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();
  //   await expect(cartBadge).toContainText('2');
    
  //   // Add Onesie ($7.99) - cart badge shows "3"
  //   await page.locator('[data-test="add-to-cart-sauce-labs-onesie"]').click();
  //   await expect(cartBadge).toContainText('3');
    
  //   // Go to cart
  //   await page.locator('[data-test="shopping-cart-link"]').click();
  //   await page.waitForURL('**/cart.html');
    
  //   // Verify all 3 products displayed
  //   const cartItems = page.locator('[data-test="cart-item"]');
  //   await expect(cartItems).toHaveCount(3);
    
  //   // Verify product names
  //   await expect(page.locator('text=Sauce Labs Backpack')).toBeVisible();
  //   await expect(page.locator('text=Sauce Labs Bolt T-Shirt')).toBeVisible();
  //   await expect(page.locator('text=Sauce Labs Onesie')).toBeVisible();
    
  //   // Verify item total = $53.97
  //   await expect(page.locator('[data-test="subtotal-label"]')).toContainText('$53.97');
  // });
});
