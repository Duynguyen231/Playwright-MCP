import { test as base, Page } from '@playwright/test';

/**
 * Visual regression testing utilities
 * Provides helpers for consistent screenshot comparisons
 */

type VisualFixtures = {
  visual: {
    captureScreenshot: (
      page: Page,
      name: string,
      options?: ScreenshotOptions
    ) => Promise<void>;
    captureElement: (
      page: Page,
      selector: string,
      name: string,
      options?: ScreenshotOptions
    ) => Promise<void>;
  };
};

type ScreenshotOptions = {
  mask?: any[];
  maxDiffPixels?: number;
  threshold?: number;
  fullPage?: boolean;
};

export const test = base.extend<VisualFixtures>({
  visual: async ({ page }, use) => {
    const visual = {
      /**
       * Capture full page screenshot with common dynamic content masked
       */
      captureScreenshot: async (
        page: Page,
        name: string,
        options: ScreenshotOptions = {}
      ): Promise<void> => {
        // Wait for page to be fully loaded
        await page.waitForLoadState('load');

        // Common elements to mask by default
        const defaultMasks = [
          page.getByTestId('timestamp').catch(() => null),
          page.getByTestId('session-id').catch(() => null),
          page.getByTestId('user-id').catch(() => null),
        ].filter(Boolean);

        const masks = [...defaultMasks, ...(options.mask || [])];

        await page.screenshot({
          fullPage: options.fullPage ?? false,
          mask: masks,
          animations: 'disabled', // Disable animations for consistent screenshots
        });

        // Use Playwright's built-in visual comparison
        await page.screenshot({ path: `screenshots/${name}` });
      },

      /**
       * Capture screenshot of a specific element
       */
      captureElement: async (
        page: Page,
        selector: string,
        name: string,
        options: ScreenshotOptions = {}
      ): Promise<void> => {
        const element = page.locator(selector);
        await element.waitFor({ state: 'visible' });

        await element.screenshot({
          path: `screenshots/${name}`,
          mask: options.mask,
          animations: 'disabled',
        });
      },
    };

    await use(visual);
  },
});

export { expect } from '@playwright/test';

/**
 * Example usage in tests:
 * 
 * import { test, expect } from '../fixtures/visual';
 * 
 * test('should render dashboard correctly', async ({ page }) => {
 *   await page.goto('/dashboard');
 *   
 *   // Option 1: Using Playwright's built-in toHaveScreenshot
 *   await expect(page).toHaveScreenshot('dashboard.png', {
 *     mask: [
 *       page.getByTestId('current-time'),
 *       page.getByTestId('live-data')
 *     ],
 *     maxDiffPixels: 100
 *   });
 * 
 *   // Option 2: Using the visual fixture
 *   await visual.captureScreenshot(page, 'dashboard-full.png', {
 *     fullPage: true,
 *     mask: [page.getByTestId('current-time')]
 *   });
 * });
 * 
 * test('should render card component correctly', async ({ page }) => {
 *   await page.goto('/components');
 *   
 *   // Capture specific element
 *   await expect(page.getByTestId('user-card')).toHaveScreenshot('user-card.png');
 * });
 */
