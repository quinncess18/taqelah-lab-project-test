import { test, expect } from '@playwright/test';
import { ShopPage } from './pages/ShopPage';
import { CartPage } from './pages/CartPage';

test.use({ storageState: '.auth/taqelah-user.json' });

// Desktop test for adding item to cart and proceeding to checkout
test.describe('Desktop Shopping Experience @desktop', () => {
  test.beforeEach(async ({ page, isMobile }) => {
    test.skip(isMobile, 'This test is for desktop only');
    await page.goto('/taqelah-demo-site.html');
    await expect(page.getByTestId('logout-button')).toBeVisible();
    await expect(page.getByText('Spring Collection 2025')).toBeVisible();
  });

  test('User can add first item to cart and proceed to checkout form on desktop view', async ({ page }) => {
    const shopPage = new ShopPage(page);
    const cartPage = new CartPage(page);

    // Search for product
    await shopPage.searchProduct('maxi dress');

    // Verify product is visible
    await expect(shopPage.searchGrid).toBeVisible();
    await shopPage.searchGrid.scrollIntoViewIfNeeded();
    await expect(shopPage.searchGrid.getByRole('img', { name: 'Maxi Dress' })).toBeVisible();
    
    // Add to cart
    await shopPage.searchGrid.getByRole('button', { name: 'Add to Cart' }).click();

    // Verify confirmation message
    const confirmationText = await shopPage.getConfirmationMessage();
    expect(confirmationText).toContain('Maxi Dress added to cart');

    // Navigate to cart
    await shopPage.cartIcon.scrollIntoViewIfNeeded();
    await shopPage.openCart();

    // Verify item in cart
    const cartItems = page.getByTestId('cart-items');
    await expect(cartItems).toBeVisible();
    await expect(cartItems.getByText('Maxi Dress')).toBeVisible();

    // Proceed to checkout
    await cartPage.checkoutButton.click();
    await expect(page.getByTestId('checkout-form')).toBeVisible();

    // Take full-page screenshot for visual verification of desktop layout
    await page.screenshot({ path: 'desktop-checkout-view.png', fullPage: true });
  });
});