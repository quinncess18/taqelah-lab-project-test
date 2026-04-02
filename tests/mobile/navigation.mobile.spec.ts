import { test, expect } from '@playwright/test';
import { CartPage } from '../pages/CartPage';

test.describe('Mobile Navigation', () => {

  test.beforeEach(async ({ page, isMobile }) => {
    test.skip(!isMobile, 'This test is for mobile only');

    await page.goto('/taqelah-demo-site.html');

    // Login
    await page.getByTestId('username-input').fill('ladies');
    await page.getByTestId('password-input').fill('ladies_GO');
    await page.getByTestId('login-button').tap();

    await expect(page.getByTestId('search-input')).toBeVisible();

    // Clear cart after login so any server-restored cart state doesn't bleed into tests
    await page.evaluate(() => localStorage.setItem('taqelahCart', '[]'));
  });

  test('should open mobile filter menu', async ({ page }) => {
    // Mobile filter menu (slide-out overlay)
    const mobileFilterButton = page.getByTestId('mobile-filter-button');

    // Check if mobile filter button exists (only on mobile viewport)
    if (await mobileFilterButton.isVisible()) {
      await mobileFilterButton.tap();

      // Verify filter menu is open
      await expect(page.getByTestId('mobile-filter-menu')).toBeVisible();
    }
  });

      test('should handle touch interactions for product selection', async ({ page, isMobile }) => {
    // Search for product
    await page.getByTestId('search-input').tap();
    await page.getByTestId('search-input').fill('dress');

    // Wait for results
    await expect(page.getByTestId('search-grid')).toBeVisible();

    // Wait for product to render within grid
    await expect(page.getByTestId('search-grid').getByTestId('product-name-6')).toBeVisible();

    // Tap on first product
    await page.getByTestId('search-grid').getByTestId('product-name-6').tap();

    // Verify product details modal
    await expect(page.getByTestId('product-details-add-to-cart')).toBeVisible();
  });

    test('should display mobile-optimized cart', async ({ page }) => {
    test.slow();
    test.setTimeout(60000);

    // Add item to cart
    await page.getByTestId('search-input').fill('maxi dress');
    
    // Wait for search grid to load
    await expect(page.getByTestId('search-grid')).toBeVisible();

    // Wait for product card to render before tapping it
    await expect(page.getByTestId('search-grid').getByTestId('product-name-6')).toBeVisible();
    
    // Tap product within grid context
    await page.getByTestId('search-grid').getByTestId('product-name-6').tap();

    // Ensure product details modal is ready before adding to cart
    await expect(page.getByTestId('product-details-add-to-cart')).toBeVisible();
    await page.getByTestId('product-details-add-to-cart').tap();

    // Open cart
    await page.getByTestId('cart-icon').tap();

    // Verify cart is displayed
    await expect(page.getByRole('heading', { name: 'Shopping Cart' })).toBeVisible();

    // Verify item in cart
    const cartItems = page.getByTestId('cart-items');
    await expect(cartItems).toBeVisible();
    await expect(cartItems.getByText('Maxi Dress')).toBeVisible();

    // Dismiss add-to-cart toast before capturing cart state
    await page.evaluate(() => {
      const toast = document.getElementById('toastMessage');
      if (toast && toast.parentElement) toast.parentElement.style.display = 'none';
    });

    // Take mobile screenshot of cart view
    await page.screenshot({ path: 'screenshots/mobile-cart.png' });

    // Proceed to checkout
    const cartPage = new CartPage(page);
    await cartPage.checkoutButton.tap();
    await expect(page.getByTestId('checkout-form')).toBeVisible();
  });

  test('should allow cart operations (update quantity and remove items)', async ({ page }) => {
    // Add first item to cart
    await page.getByTestId('search-input').fill('maxi dress');
    await expect(page.getByTestId('search-grid')).toBeVisible();
    await page.getByTestId('search-grid').getByTestId('product-name-6').tap();
    await page.getByTestId('product-details-add-to-cart').tap();

    // Open cart
    await page.getByTestId('cart-icon').tap();
    await expect(page.getByRole('heading', { name: 'Shopping Cart' })).toBeVisible();

    // Verify item in cart
    const cartItems = page.getByTestId('cart-items');
    await expect(cartItems.getByText('Maxi Dress')).toBeVisible();

    // Update quantity (increase)
    const quantityInput = cartItems.getByTestId('quantity-input');
    if (await quantityInput.isVisible()) {
      await quantityInput.fill('2');
      await page.waitForTimeout(500); // Wait for price update
    }

    // Verify price is updated
    const totalPrice = page.getByTestId('cart-total');
    await expect(totalPrice).toBeVisible();

    // Dismiss add-to-cart toast before interacting with remove
    await page.evaluate(() => {
      const toast = document.getElementById('toastMessage');
      if (toast && toast.parentElement) toast.parentElement.style.display = 'none';
    });

    // Remove item from cart
    const removeButton = cartItems.getByText('Remove');
    await removeButton.tap();
    await expect(cartItems.getByText('Maxi Dress')).not.toBeVisible();

    // Take screenshot of empty cart
    await page.screenshot({ path: 'screenshots/mobile-cart-empty.png' });
  });

  test('should maintain layout on orientation change', async ({ page }) => {
    // Add item to cart
    await page.getByTestId('search-input').fill('maxi dress');
    await expect(page.getByTestId('search-grid')).toBeVisible();
    await page.getByTestId('search-grid').getByTestId('product-name-6').tap();
    await page.getByTestId('product-details-add-to-cart').tap();

    // Open cart in portrait
    await page.getByTestId('cart-icon').tap();
    await expect(page.getByRole('heading', { name: 'Shopping Cart' })).toBeVisible();

    // Verify cart layout in portrait
    const cartItems = page.getByTestId('cart-items');
    await expect(cartItems).toBeVisible();
    await expect(cartItems.getByText('Maxi Dress')).toBeVisible();

    // Dismiss add-to-cart toast before capturing layout
    await page.evaluate(() => {
      const toast = document.getElementById('toastMessage');
      if (toast && toast.parentElement) toast.parentElement.style.display = 'none';
    });

    await page.screenshot({ path: 'screenshots/mobile-cart-portrait.png' });

    // Change to landscape orientation by swapping the viewport dimensions
    const viewport = page.viewportSize();
    await page.setViewportSize({ width: viewport!.height, height: viewport!.width });

    // Verify cart layout is still visible in landscape
    await expect(cartItems).toBeVisible();
    await expect(cartItems.getByText('Maxi Dress')).toBeVisible();
    await page.screenshot({ path: 'screenshots/mobile-cart-landscape.png' });
  });
});