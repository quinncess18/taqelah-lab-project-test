import { test, expect } from '@playwright/test';

test.describe('Visual Regression - Product Pages', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/taqelah-demo-site.html');

    // Login
    await page.getByTestId('username-input').fill('ladies');
    await page.getByTestId('password-input').fill('ladies_GO');
    await page.getByTestId('login-button').click();

    await expect(page.getByTestId('search-input')).toBeVisible();
    // Wait for any animations to complete
    await page.waitForTimeout(500);
  });

  test('search page layout', async ({ page }) => {
    await expect(page).toHaveScreenshot('search-page.png', {
      fullPage: true,
      // Mask dynamic content like timestamps
      mask: [page.locator('.timestamp'), page.locator('.dynamic-content')],
    });
  });

  test('product grid appearance', async ({ page }) => {
    await page.getByTestId('search-input').fill('dress');
    await expect(page.getByTestId('search-grid')).toBeVisible();

    // Wait for images to load
    await page.waitForLoadState('networkidle');

    await expect(page.getByTestId('search-grid')).toHaveScreenshot('product-grid.png');
  });

 test('product details modal', async ({ page }) => {
    await page.getByTestId('search-input').fill('maxi dress');
    await page.getByTestId('search-grid').getByTestId('product-name-6').click();

    // Wait for modal animation
    const modal = page.locator('[role="dialog"], .modal-content, [data-testid="product-details-modal"]').first();
    await modal.waitFor({ state: 'visible', timeout: 15000 });
    await expect(modal).toHaveScreenshot('product-modal.png');
  });

  test('shopping cart appearance', async ({ page }) => {
    // Add product to cart
    await page.getByTestId('search-input').fill('maxi dress');
    await page.getByTestId('search-grid').getByTestId('product-name-6').click();
    await page.getByTestId('product-details-add-to-cart').click();

    // Open cart
    await page.getByTestId('cart-icon').click();

    // Wait for cart animation
    await page.waitForTimeout(300);

    await expect(page.locator('.cart-items, .shopping-cart')).toHaveScreenshot('shopping-cart.png', {
      // Mask prices if they might change
      mask: [page.locator('.price-dynamic')],
    });
  });
});