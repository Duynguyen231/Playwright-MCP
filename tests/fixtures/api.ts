import { test as base, APIRequestContext } from '@playwright/test';

/**
 * Extended API fixture for setting up test state via REST API calls
 * This is faster than setting up state through the UI
 */

type User = {
  id: string;
  email: string;
  name: string;
  role?: string;
};

type ApiFixtures = {
  api: {
    createUser: (userData: Partial<User>) => Promise<User>;
    deleteUser: (userId: string) => Promise<void>;
    loginUser: (email: string, password: string) => Promise<{ token: string }>;
    logoutUser: () => Promise<void>;
    refreshToken: (token: string) => Promise<{ token: string }>;
  };
};

export const test = base.extend<ApiFixtures>({
  api: async ({ request }, use) => {
    const createdUsers: string[] = [];
    const baseURL = process.env.BASE_URL || 'http://localhost:3000';

    const api = {
      /**
       * Create a user via API
       * Automatically cleaned up after test
       */
      createUser: async (userData: Partial<User>): Promise<User> => {
        const defaultUser = {
          email: `test-${Date.now()}@example.com`,
          name: 'Test User',
          password: 'password123',
          ...userData,
        };

        const response = await request.post(`${baseURL}/api/users`, {
          data: defaultUser,
        });

        if (!response.ok()) {
          throw new Error(`Failed to create user: ${response.status()} ${await response.text()}`);
        }

        const user = await response.json();
        createdUsers.push(user.id);
        return user;
      },

      /**
       * Delete a user via API
       */
      deleteUser: async (userId: string): Promise<void> => {
        const response = await request.delete(`${baseURL}/api/users/${userId}`);
        if (!response.ok() && response.status() !== 404) {
          console.warn(`Failed to delete user ${userId}: ${response.status()}`);
        }
      },

      /**
       * Login user and get authentication token
       */
      loginUser: async (email: string, password: string): Promise<{ token: string }> => {
        const response = await request.post(`${baseURL}/api/auth/login`, {
          data: { email, password },
        });

        if (!response.ok()) {
          throw new Error(`Login failed: ${response.status()} ${await response.text()}`);
        }

        return await response.json();
      },

      /**
       * Logout user and clear session
       */
      logoutUser: async (): Promise<void> => {
        const response = await request.post(`${baseURL}/api/auth/logout`);

        if (!response.ok() && response.status() !== 401) {
          console.warn(`Logout returned status ${response.status()}`);
        }
      },

      /**
       * Refresh authentication token
       */
      refreshToken: async (token: string): Promise<{ token: string }> => {
        const response = await request.post(`${baseURL}/api/auth/refresh`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok()) {
          throw new Error(`Token refresh failed: ${response.status()} ${await response.text()}`);
        }

        return await response.json();
      },
    };

    // Provide the API helpers to the test
    await use(api);

    // Cleanup: Delete all created users
    for (const userId of createdUsers) {
      try {
        await api.deleteUser(userId);
      } catch (error) {
        console.warn(`Cleanup failed for user ${userId}:`, error);
      }
    }
  },
});

export { expect } from '@playwright/test';

/**
 * Example usage in tests:
 * 
 * test('should display user profile', async ({ page, api }) => {
 *   // Given: User exists in database
 *   const user = await api.createUser({
 *     email: 'john@example.com',
 *     name: 'John Doe'
 *   });
 *   
 *   // When: Navigate to profile page
 *   await page.goto(`/profile/${user.id}`);
 *   
 *   // Then: Profile information is displayed
 *   await expect(page.getByRole('heading', { name: 'John Doe' })).toBeVisible();
 * });
 */
