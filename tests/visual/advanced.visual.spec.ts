import { test, expect } from '../../fixtures/visual-fixture';

test.describe('Advanced Visual Testing', () => {

  test.beforeEach(async ({ stablePage }) => {
    await stablePage.goto('/taqelah-demo-site.html');
    await stablePage.getByTestId('username-input').fill('ladies');
    await stablePage.getByTestId('password-input').fill('ladies_GO');
    await stablePage.getByTestId('login-button').click();
    await expect(stablePage.getByTestId('search-input')).toBeVisible();
  });

  test('compare with custom threshold', async ({ stablePage }) => {
    // Mask dynamic content
    await expect(stablePage).toHaveScreenshot('search-strict.png', {
      animations: 'disabled',
      mask: [stablePage.locator('.timestamp'), stablePage.locator('.dynamic-content')],
      maxDiffPixelRatio: 0.05,
    });
  });

  test('screenshot with masked regions', async ({ stablePage }) => {
    await stablePage.getByTestId('search-input').fill('dress');
    await expect(stablePage.getByTestId('search-grid')).toBeVisible();

    // Clear all overlays completely
    await stablePage.locator('[role="dialog"], .modal, .notification').all().then(els => 
      Promise.all(els.map(el => el.evaluate(e => e.style.display = 'none')))
    );

    // Mask dynamic content like timestamps
    await expect(stablePage).toHaveScreenshot('products-masked.png', {
      animations: 'disabled',
      mask: [
        stablePage.locator('.price'),
        stablePage.locator('.stock-status'),
        stablePage.locator('[data-testid="timestamp"]'),
      ],
      maxDiffPixelRatio: 0.05,
    });
  });

  test('screenshot after interaction', async ({ stablePage }) => {
    // Hover over navigation
    await stablePage.getByRole('link', { name: 'New In' }).hover();

    // Clear all overlays completely
    await stablePage.locator('[role="dialog"], .modal, .notification').all().then(els => 
      Promise.all(els.map(el => el.evaluate(e => e.style.display = 'none')))
    );

    // Capture hover state
    await expect(stablePage.locator('nav')).toHaveScreenshot('nav-hover.png', {
      animations: 'disabled',
      maxDiffPixelRatio: 0.05,
    });
  });

  test('screenshot with styleMask', async ({ stablePage }) => {
    // Clear all overlays completely
    await stablePage.locator('[role="dialog"], .modal, .notification').all().then(els => 
      Promise.all(els.map(el => el.evaluate(e => e.style.display = 'none')))
    );

    // Mask dynamic content like timestamps
    await expect(stablePage).toHaveScreenshot('page-stable.png', {
      animations: 'disabled',
      mask: [stablePage.locator('.timestamp'), stablePage.locator('.dynamic-content')],
      maxDiffPixelRatio: 0.05,
    });
  });

  test('capture element in different states', async ({ stablePage }) => {
    const searchInput = stablePage.getByTestId('search-input');

    // Clear all overlays completely
    await stablePage.locator('[role="dialog"], .modal, .notification').all().then(els => 
      Promise.all(els.map(el => el.evaluate(e => e.style.display = 'none')))
    );

    // Empty state
    await expect(searchInput).toHaveScreenshot('search-empty.png', {
      animations: 'disabled',
      maxDiffPixelRatio: 0.05,
    });

    // Focused state
    await searchInput.focus();
    await expect(searchInput).toHaveScreenshot('search-focused.png', {
      animations: 'disabled',
      maxDiffPixelRatio: 0.05,
    });

    // With text
    await searchInput.fill('dress');
    await expect(searchInput).toHaveScreenshot('search-filled.png', {
      animations: 'disabled',
      maxDiffPixelRatio: 0.05,
    });
  });
});
