import { test, expect } from '@playwright/test';
import { ShopPage } from './pages/ShopPage';
import { CartPage } from './pages/CartPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';

test.use({ storageState: '.auth/taqelah-user.json' });

test.describe('Add Multiple Items To Cart', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/taqelah-demo-site.html');
    await expect(page.getByTestId('logout-button')).toBeVisible();
    await expect(page.getByText('Spring Collection 2025')).toBeVisible();
  });

  test('User can add two different items to cart and verify them before checkout', async ({ page }) => {
    const shopPage = new ShopPage(page);
    const cartPage = new CartPage(page);
    const productDetailsPage = new ProductDetailsPage(page);

    // Add first item from search grid
    await shopPage.searchProduct('maxi dress');
    await expect(shopPage.searchGrid).toBeVisible();
    await shopPage.searchGrid.scrollIntoViewIfNeeded();
    await expect(shopPage.searchGrid.getByRole('img', { name: 'Maxi Dress' })).toBeVisible();
    await shopPage.searchGrid.getByRole('button', { name: 'Add to Cart' }).click();
    await expect(shopPage.confirmationMessage).toContainText('Maxi Dress added to cart');

    // Add second item from product details page
    await shopPage.searchProduct('pants');
    await shopPage.searchGrid.scrollIntoViewIfNeeded();
    await expect(shopPage.searchGrid.getByRole('img', { name: 'Wide Leg Pants' })).toBeVisible();
    await shopPage.searchGrid.getByRole('img', { name: 'Wide Leg Pants' }).click();
    await productDetailsPage.expectProductDetailsToBeVisible();
    await productDetailsPage.addToCartButton.scrollIntoViewIfNeeded();
    await productDetailsPage.addToCartButton.click();
    await expect(shopPage.confirmationMessage).toContainText('Wide Leg Pants added to cart');


    // Verify both items are present before checkout
    await shopPage.cartIcon.scrollIntoViewIfNeeded();
    await shopPage.openCart();
    const cartItems = page.getByTestId('cart-items');
    await expect(cartItems).toBeVisible();
    await expect(cartItems.getByText('Maxi Dress')).toBeVisible();
    await expect(cartItems.getByText('Wide Leg Pants')).toBeVisible();

    // Proceed to checkout after verification
    await cartPage.checkoutButton.click();
    await expect(page.getByTestId('checkout-form')).toBeVisible();
  });
});
