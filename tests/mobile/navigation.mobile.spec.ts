import { test, expect } from '@playwright/test';

test.describe('Mobile Navigation', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/taqelah-demo-site.html');
    
    // Login
    await page.getByTestId('username-input').fill('ladies');
    await page.getByTestId('password-input').fill('ladies_GO');
    await page.getByTestId('login-button').click();

    await expect(page.getByTestId('search-input')).toBeVisible();
  });

  test('should open mobile filter menu', async ({ page }) => {
    // Mobile filter menu (slide-out overlay)
    const mobileFilterButton = page.getByTestId('mobile-filter-button');

    // Check if mobile filter button exists (only on mobile viewport)
    if (await mobileFilterButton.isVisible()) {
      await mobileFilterButton.click();

      // Verify filter menu is open
      await expect(page.getByTestId('mobile-filter-menu')).toBeVisible();
    }
  });

  test('should handle touch interactions for product selection', async ({ page }) => {
    // Search for product
    await page.getByTestId('search-input').tap();
    await page.getByTestId('search-input').fill('dress');

    // Wait for results
    await expect(page.getByTestId('search-grid')).toBeVisible();

    // Tap on first product
    await page.getByTestId('product-name-6').tap();

    // Verify product details modal
    await expect(page.getByTestId('product-details-add-to-cart')).toBeVisible();
  });

  test('should display mobile-optimized cart', async ({ page }) => {
    // Add item to cart
    await page.getByTestId('search-input').fill('maxi dress');
    await page.getByTestId('search-grid').getByTestId('product-name-6').click();
    await page.getByTestId('product-details-add-to-cart').click();

    // Open cart
    await page.getByTestId('cart-icon').tap();

    // Verify cart is displayed
    await expect(page.getByRole('heading', { name: 'Shopping Cart' })).toBeVisible();

    // Take mobile screenshot
    await page.screenshot({ path: 'screenshots/mobile-cart.png' });
  });
});