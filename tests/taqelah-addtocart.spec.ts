import { test, expect } from '@playwright/test';

test.use({ storageState: '.auth/taqelah-user.json' });

test.describe('Taqelah Add to Cart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/taqelah-demo-site.html');
    await expect(page.getByTestId('logout-button')).toBeVisible();
    await expect(page.getByText('Spring Collection 2025')).toBeVisible();
  });

  test('user can search for maxi dress and add to cart', async ({ page }) => {
    await page.getByTestId('search-input').fill('maxi dress');

    const searchGrid = page.getByTestId('search-grid');
    await expect(searchGrid).toBeVisible();
    await searchGrid.scrollIntoViewIfNeeded();
    await expect(searchGrid.getByRole('img', { name: 'Maxi Dress' })).toBeVisible();

    await searchGrid.getByRole('button', { name: 'Add to Cart' }).click();

    await page.getByTestId('cart-icon').scrollIntoViewIfNeeded();
    await page.getByTestId('cart-icon').click();

    const cartItems = page.getByTestId('cart-items');
    await expect(cartItems).toBeVisible();
    await expect(cartItems.getByText('Maxi Dress')).toBeVisible();

    await page.getByTestId('checkout-button').click();
    await expect(page.getByTestId('checkout-form')).toBeVisible();
  });
});