import { test, expect } from '../../fixtures/visual-fixture';
import path from 'path';

test.describe('Advanced Visual Testing', () => {

  test.beforeEach(async ({ stablePage }) => {
    await stablePage.goto('/taqelah-demo-site.html');
    await stablePage.getByTestId('username-input').fill('ladies');
    await stablePage.getByTestId('password-input').fill('ladies_GO');
    await stablePage.getByTestId('login-button').click();
    await expect(stablePage.getByTestId('search-input')).toBeVisible();
  });

  test('compare with custom threshold', async ({ stablePage }) => {
    await expect(stablePage).toHaveScreenshot('search-strict.png', {
      // Stricter comparison
      maxDiffPixels: 10,
      threshold: 0.1,
    });
  });

  test('screenshot with masked regions', async ({ stablePage }) => {
    await stablePage.getByTestId('search-input').fill('dress');
    await expect(stablePage.getByTestId('search-grid')).toBeVisible();

    await expect(stablePage).toHaveScreenshot('products-masked.png', {
      // Mask elements that may change
      mask: [
        stablePage.locator('.price'),
        stablePage.locator('.stock-status'),
        stablePage.locator('[data-testid="timestamp"]'),
      ],
    });
  });

  test('screenshot after interaction', async ({ stablePage }) => {
    // Hover over navigation
    await stablePage.getByRole('link', { name: 'New In' }).hover();

    // Capture hover state
    await expect(stablePage.locator('nav')).toHaveScreenshot('nav-hover.png');
  });

  test('screenshot with styleMask', async ({ stablePage }) => {
    const cssPath = path.resolve(__dirname, 'visual-test-styles.css');

    await expect(stablePage).toHaveScreenshot('page-stable.png', {
      stylePath: cssPath, 
    });
  });

  test('capture element in different states', async ({ stablePage }) => {
    const searchInput = stablePage.getByTestId('search-input');

    // Empty state
    await expect(searchInput).toHaveScreenshot('search-empty.png');

    // Focused state
    await searchInput.focus();
    await expect(searchInput).toHaveScreenshot('search-focused.png');

    // With text
    await searchInput.fill('dress');
    await expect(searchInput).toHaveScreenshot('search-filled.png');
  });
});