/**
 * Test data generators
 * Provides functions to generate consistent, realistic test data
 */

export type UserData = {
  email: string;
  name: string;
  password: string;
  role?: 'user' | 'admin' | 'moderator';
};

export type ProductData = {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
};

let userCounter = 0;
let productCounter = 0;

/**
 * Generate a unique user object for testing
 */
export function generateUser(overrides: Partial<UserData> = {}): UserData {
  userCounter++;
  return {
    email: `test.user${userCounter}@example.com`,
    name: `Test User ${userCounter}`,
    password: 'TestPassword123!',
    role: 'user',
    ...overrides,
  };
}

/**
 * Generate a unique product object for testing
 */
export function generateProduct(overrides: Partial<ProductData> = {}): ProductData {
  productCounter++;
  return {
    name: `Test Product ${productCounter}`,
    description: `Description for test product ${productCounter}`,
    price: Math.floor(Math.random() * 100) + 10,
    stock: Math.floor(Math.random() * 50) + 1,
    category: 'Electronics',
    ...overrides,
  };
}

/**
 * Generate a random string of specified length
 */
export function randomString(length: number = 10): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate a random email address
 */
export function randomEmail(): string {
  return `test.${randomString(8)}@example.com`;
}

/**
 * Generate a timestamp-based unique identifier
 */
export function uniqueId(): string {
  return `${Date.now()}-${randomString(6)}`;
}

/**
 * Example usage in tests:
 * 
 * import { generateUser, generateProduct } from '../fixtures/test-data';
 * 
 * test('should create user account', async ({ page, api }) => {
 *   const userData = generateUser({
 *     name: 'John Doe',
 *     role: 'admin'
 *   });
 *   
 *   const user = await api.createUser(userData);
 *   // ... rest of test
 * });
 * 
 * test('should add product to cart', async ({ page }) => {
 *   const product = generateProduct({
 *     name: 'Special Widget',
 *     price: 99.99
 *   });
 *   
 *   // Use product data in test
 * });
 */
