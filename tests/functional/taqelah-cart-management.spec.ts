import { test, expect } from '@playwright/test';
import { CartPage, ShopPage } from '../pages';

test.use({ storageState: '.auth/taqelah-user.json' });

test.describe('Cart Management @functional', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/taqelah-demo-site.html');
    await expect(page.getByTestId('logout-button')).toBeVisible();
    await page.evaluate(() => localStorage.setItem('taqelahCart', '[]'));
  });

  test('User can add multiple products, update quantity, remove an item, and keep totals consistent', async ({ page }) => {
    const shopPage = new ShopPage(page);
    const cartPage = new CartPage(page);

    await shopPage.addProductToCart('Maxi Dress');
    await expect(shopPage.confirmationMessage).toContainText(/added to cart/i);

    await shopPage.addProductToCart('Wide Leg Pants');
    await expect(shopPage.confirmationMessage).toContainText(/added to cart/i);

    await shopPage.openCart();
    await expect(cartPage.cartHeading).toBeVisible();
    await expect(cartPage.cartItems.getByText('Maxi Dress')).toBeVisible();
    await expect(cartPage.cartItems.getByText('Wide Leg Pants')).toBeVisible();

    const totalBefore = await cartPage.getCartTotal();
    await cartPage.updateQuantity('6', 2);
    await expect(cartPage.cartTotal).toBeVisible();
    // Wait for total to reflect the quantity change
    await page.waitForTimeout(500);
    const totalAfter = await cartPage.getCartTotal();
    expect(totalAfter).toBeGreaterThanOrEqual(totalBefore);

    // Dismiss toast before removing item
    await page.evaluate(() => {
      const toast = document.getElementById('toastMessage');
      if (toast && toast.parentElement) toast.parentElement.style.display = 'none';
    });

    // Wait before attempting remove action
    await page.waitForTimeout(300);
    await cartPage.removeItem('6');
    await expect(cartPage.cartItems.getByText('Maxi Dress')).not.toBeVisible();
    await expect(cartPage.cartItems.getByText('Wide Leg Pants')).toBeVisible();
    await expect(cartPage.checkoutButton).toBeVisible();
  });
});
