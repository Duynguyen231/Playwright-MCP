# SauceDemo Checkout Flow Test Plan

## Application Overview

This test plan covers the complete checkout flow on the SauceDemo application (https://www.saucedemo.com). The application is a test e-commerce site used by Sauce Labs to demonstrate web testing using Playwright. The tests verify successful checkout operations including login, product selection, cart management, checkout information entry, order review, and confirmation. The tests use the Page Object Model pattern with custom fixtures for role-based testing and proper Gherkin-style assertions.

## Test Scenarios

### 1. Checkout Flow - Complete Purchase

**Seed:** `tests/fixtures/saucedemo/test.fixture.ts`

#### 1.1. should complete successful checkout with single product as standard_user

**File:** `tests/e2e/saucedemo/checkout-flow.spec.ts`

**Steps:**
  1. Given user is logged in as 'standard_user' with password 'secret_sauce'
  2. When user navigates to the inventory page
  3. Then user should see 6 products displayed (Backpack $29.99, Bike Light $9.99, Bolt T-Shirt $15.99, Fleece Jacket $49.99, Onesie $7.99, Test.allTheThings T-Shirt $15.99)
  4. When user clicks 'Add to cart' button for 'Sauce Labs Bike Light'
  5. Then the cart badge should display '1'
  6. When user clicks the shopping cart icon
  7. Then user should be on the cart page (cart.html)
  8. Then user should see the Bike Light product in their cart with price $9.99
  9. When user clicks the 'Checkout' button on the cart page
  10. Then user should be on the checkout information page (checkout-step-one.html)
  11. When user fills in checkout form: First Name='John', Last Name='Doe', Zip Code='70000'
  12. When user clicks the 'Continue' button
  13. Then user should be on the checkout overview page (checkout-step-two.html)
  14. Then user should see the order summary with Item total $9.99, Tax $0.80, Total $10.79
  15. Then user should see payment information displaying 'SauceCard #31337'
  16. Then user should see shipping information displaying 'Free Pony Express Delivery!'
  17. When user clicks the 'Finish' button
  18. Then user should be on the order confirmation page (checkout-complete.html)
  19. Then user should see the success message 'Thank you for your order!'
  20. Then user should see the message 'Your order has been dispatched, and will arrive just as fast as the pony can get there!'
  21. When user clicks the 'Back Home' button
  22. Then user should be redirected back to the inventory page (inventory.html)
  23. Then the cart badge should be empty (no items displayed)

**Expected Results:**
  - User successfully logs in with standard_user credentials and reaches inventory page
  - All 6 products are displayed with correct names and prices
  - Product successfully added to cart, cart badge updates to show '1'
  - Cart page displays the added product with correct price
  - Checkout form page loads with empty form fields
  - Checkout form accepts input data for First Name, Last Name, and Zip Code
  - Order overview page displays correct product information and calculated totals
  - Payment and shipping information is displayed correctly
  - Order confirmation is successful with appropriate messaging
  - User is successfully redirected back to inventory page after completing checkout
  - Cart is cleared after completed purchase (no badge visible)

#### 1.2. should update cart count correctly when adding multiple products

**File:** `tests/e2e/saucedemo/checkout-flow.spec.ts`

**Steps:**
  1. Given user is logged in as 'standard_user'
  2. When user navigates to the inventory page
  3. When user adds 'Sauce Labs Backpack' ($29.99) to cart
  4. Then the cart badge should display '1'
  5. When user adds 'Sauce Labs Bolt T-Shirt' ($15.99) to cart
  6. Then the cart badge should display '2'
  7. When user adds 'Sauce Labs Onesie' ($7.99) to cart
  8. Then the cart badge should display '3'
  9. When user clicks the shopping cart icon
  10. Then user should see all 3 products in the cart
  11. Then the item total should be calculated correctly: $29.99 + $15.99 + $7.99 = $53.97

**Expected Results:**
  - Cart badge increments correctly with each product addition (1 → 2 → 3)
  - Shopping cart displays all added products in correct order
  - Item total calculation is accurate: $53.97
  - Each product displays correct price and quantity in the cart
  - Remove button is available for each item in cart (optional: verify remove functionality)
