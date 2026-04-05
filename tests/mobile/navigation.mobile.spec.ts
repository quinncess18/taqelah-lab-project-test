import { test, expect } from '@playwright/test';
import { CartPage } from '../pages/CartPage';

test.use({ storageState: '.auth/taqelah-user.json' });

test.describe('Mobile Navigation', () => {

  test.beforeEach(async ({ page, isMobile }) => {
    test.skip(!isMobile, 'This test is for mobile only');

    await page.goto('/taqelah-demo-site.html');
    await expect(page.getByTestId('logout-button')).toBeVisible();

    // Clear cart so any server-restored cart state doesn't bleed into tests
    await page.evaluate(() => localStorage.setItem('taqelahCart', '[]'));
  });

  test('should open mobile filter menu', async ({ page }) => {
    const mobileFilterButton = page.getByTestId('mobile-filter-button');

    if (await mobileFilterButton.isVisible()) {
      await mobileFilterButton.tap();
      await expect(page.getByTestId('mobile-filter-menu')).toBeVisible();
    }
  });

  test('should handle touch interactions for product selection', async ({ page, isMobile }) => {
    await page.getByTestId('search-input').tap();
    await page.getByTestId('search-input').fill('dress');

    await expect(page.getByTestId('search-grid')).toBeVisible();
    await expect(page.getByTestId('search-grid').getByTestId('product-name-6')).toBeVisible();

    await page.getByTestId('search-grid').getByTestId('product-name-6').tap();
    await expect(page.getByTestId('product-details-add-to-cart')).toBeVisible();
  });

  test('should display mobile-optimized cart', async ({ page }) => {
    test.slow();
    test.setTimeout(60000);

    await page.getByTestId('search-input').fill('maxi dress');
    await expect(page.getByTestId('search-grid')).toBeVisible();
    await expect(page.getByTestId('search-grid').getByTestId('product-name-6')).toBeVisible();

    await page.getByTestId('search-grid').getByTestId('product-name-6').tap();
    await expect(page.getByTestId('product-details-add-to-cart')).toBeVisible();
    await page.getByTestId('product-details-add-to-cart').tap();

    // Wait for product details modal to close before opening cart
    await expect(page.getByTestId('product-details-modal')).not.toBeVisible();

    await page.evaluate(() => {
      const toast = document.getElementById('toastMessage');
      if (toast && toast.parentElement) toast.parentElement.style.display = 'none';
    });

    await page.getByTestId('cart-icon').tap();
    await expect(page.getByRole('heading', { name: 'Shopping Cart' })).toBeVisible();

    const cartItems = page.getByTestId('cart-items');
    await expect(cartItems).toBeVisible();
    await expect(cartItems.getByText('Maxi Dress')).toBeVisible();

    const cartPage = new CartPage(page);
    await cartPage.checkoutButton.tap();
    await expect(page.getByTestId('checkout-form')).toBeVisible();
  });

  test('should allow cart operations (update quantity and remove items)', async ({ page }) => {
    await page.getByTestId('search-input').fill('maxi dress');
    await expect(page.getByTestId('search-grid')).toBeVisible();
    await page.getByTestId('search-grid').getByTestId('product-name-6').tap();
    await page.getByTestId('product-details-add-to-cart').tap();

    await page.getByTestId('cart-icon').tap();
    await expect(page.getByRole('heading', { name: 'Shopping Cart' })).toBeVisible();

    const cartItems = page.getByTestId('cart-items');
    await expect(cartItems.getByText('Maxi Dress')).toBeVisible();

    const quantityInput = cartItems.getByTestId('quantity-input');
    if (await quantityInput.isVisible()) {
      await quantityInput.fill('2');
      await page.waitForTimeout(500);
    }

    await expect(page.getByTestId('cart-total')).toBeVisible();

    await page.evaluate(() => {
      const toast = document.getElementById('toastMessage');
      if (toast && toast.parentElement) toast.parentElement.style.display = 'none';
    });

    await cartItems.getByText('Remove').tap();
    await expect(cartItems.getByText('Maxi Dress')).not.toBeVisible();

    await page.screenshot({ path: 'screenshots/mobile-cart-empty.png' });
  });

  test('should persist cart contents after page reload', async ({ page }) => {
    await page.getByTestId('search-input').fill('maxi dress');
    await expect(page.getByTestId('search-grid')).toBeVisible();
    await page.getByTestId('search-grid').getByTestId('product-name-6').tap();
    await expect(page.getByTestId('product-details-add-to-cart')).toBeVisible();
    await page.getByTestId('product-details-add-to-cart').tap();

    await page.evaluate(() => {
      const toast = document.getElementById('toastMessage');
      if (toast?.parentElement) toast.parentElement.style.display = 'none';
    });

    // Wait for cart state to flush to localStorage before reloading
    await page.waitForTimeout(500);

    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.getByTestId('logout-button')).toBeVisible();

    await page.getByTestId('cart-icon').tap();
    await expect(page.getByTestId('cart-items').getByText('Maxi Dress')).toBeVisible();
  });

  test('should preserve cart contents after closing checkout modal', async ({ page }) => {
    await page.getByTestId('search-input').fill('maxi dress');
    await expect(page.getByTestId('search-grid')).toBeVisible();
    await page.getByTestId('search-grid').getByTestId('product-name-6').tap();
    await expect(page.getByTestId('product-details-add-to-cart')).toBeVisible();
    await page.getByTestId('product-details-add-to-cart').tap();

    await page.evaluate(() => {
      const toast = document.getElementById('toastMessage');
      if (toast?.parentElement) toast.parentElement.style.display = 'none';
    });

    await page.getByTestId('cart-icon').tap();
    await expect(page.getByRole('heading', { name: 'Shopping Cart' })).toBeVisible();
    await page.getByTestId('checkout-button').tap();
    await expect(page.getByTestId('checkout-modal')).toBeVisible();

    await page.getByTestId('close-checkout-button').tap();
    await expect(page.getByTestId('checkout-modal')).not.toBeVisible();

    await page.getByTestId('cart-icon').tap();
    await expect(page.getByTestId('cart-items').getByText('Maxi Dress')).toBeVisible();
  });

  test('should render login page correctly in landscape', async ({ page }) => {
    await page.getByTestId('logout-button').tap();
    await expect(page.locator('#loginPage')).toBeVisible();

    const viewport = page.viewportSize();
    await page.setViewportSize({ width: viewport!.height, height: viewport!.width });

    await expect(page.getByTestId('username-input')).toBeVisible();
    await expect(page.getByTestId('password-input')).toBeVisible();
    await expect(page.getByTestId('login-button')).toBeVisible();

    await page.getByTestId('username-input').fill('ladies');
    await page.getByTestId('password-input').fill('ladies_GO');
    await page.getByTestId('login-button').tap();
    await expect(page.getByTestId('search-input')).toBeVisible();
  });

  test('should render product search and grid correctly in landscape', async ({ page }) => {
    const viewport = page.viewportSize();
    await page.setViewportSize({ width: viewport!.height, height: viewport!.width });

    await page.getByTestId('search-input').tap();
    await page.getByTestId('search-input').fill('dress');
    await expect(page.getByTestId('search-grid')).toBeVisible();

    const productCards = page.getByTestId('search-grid').locator('[data-testid^="product-name-"]');
    await expect(productCards.first()).toBeVisible();

    await productCards.first().tap();
    await expect(page.getByTestId('product-details-add-to-cart')).toBeVisible();
  });

  test('should add item to cart and view cart in landscape', async ({ page }) => {
    const viewport = page.viewportSize();
    await page.setViewportSize({ width: viewport!.height, height: viewport!.width });

    await page.getByTestId('search-input').fill('maxi dress');
    await expect(page.getByTestId('search-grid')).toBeVisible();
    await page.getByTestId('search-grid').getByTestId('product-name-6').tap();
    await expect(page.getByTestId('product-details-add-to-cart')).toBeVisible();
    await page.getByTestId('product-details-add-to-cart').tap();

    await expect(page.getByTestId('product-details-modal')).not.toBeVisible();

    await page.evaluate(() => {
      const toast = document.getElementById('toastMessage');
      if (toast?.parentElement) toast.parentElement.style.display = 'none';
    });

    await page.getByTestId('cart-icon').tap();
    await expect(page.getByRole('heading', { name: 'Shopping Cart' })).toBeVisible();
    await expect(page.getByTestId('cart-items').getByText('Maxi Dress')).toBeVisible();
    await expect(page.getByTestId('checkout-button')).toBeEnabled();
  });

  test('should render checkout form correctly in landscape', async ({ page }) => {
    await page.getByTestId('search-input').fill('maxi dress');
    await expect(page.getByTestId('search-grid')).toBeVisible();
    await page.getByTestId('search-grid').getByTestId('product-name-6').tap();
    await expect(page.getByTestId('product-details-add-to-cart')).toBeVisible();
    await page.getByTestId('product-details-add-to-cart').tap();

    await page.evaluate(() => {
      const toast = document.getElementById('toastMessage');
      if (toast?.parentElement) toast.parentElement.style.display = 'none';
    });

    await page.getByTestId('cart-icon').tap();
    await expect(page.getByRole('heading', { name: 'Shopping Cart' })).toBeVisible();
    await page.getByTestId('checkout-button').tap();
    await expect(page.getByTestId('checkout-modal')).toBeVisible();

    const viewport = page.viewportSize();
    await page.setViewportSize({ width: viewport!.height, height: viewport!.width });

    await expect(page.getByTestId('full-name-input')).toBeVisible();
    await expect(page.getByTestId('email-input')).toBeVisible();
    await expect(page.getByTestId('place-order-button')).toBeVisible();
  });

  test('should maintain layout on orientation change', async ({ page }) => {
    await page.getByTestId('search-input').fill('maxi dress');
    await expect(page.getByTestId('search-grid')).toBeVisible();
    await page.getByTestId('search-grid').getByTestId('product-name-6').tap();
    await page.getByTestId('product-details-add-to-cart').tap();

    // Wait for product details modal to close before opening cart
    await expect(page.getByTestId('product-details-modal')).not.toBeVisible();

    await page.getByTestId('cart-icon').tap();
    await expect(page.getByRole('heading', { name: 'Shopping Cart' })).toBeVisible();

    const cartItems = page.getByTestId('cart-items');
    await expect(cartItems).toBeVisible();
    await expect(cartItems.getByText('Maxi Dress')).toBeVisible();

    await page.evaluate(() => {
      const toast = document.getElementById('toastMessage');
      if (toast && toast.parentElement) toast.parentElement.style.display = 'none';
    });

    // Wait for cart slide-in animation to fully complete before capturing
    await page.waitForTimeout(400);
    await page.screenshot({ path: 'screenshots/mobile-cart-portrait.png' });

    const viewport = page.viewportSize();
    await page.setViewportSize({ width: viewport!.height, height: viewport!.width });

    await expect(cartItems).toBeVisible();
    await expect(cartItems.getByText('Maxi Dress')).toBeVisible();
    await page.screenshot({ path: 'screenshots/mobile-cart-landscape.png' });
  });
});
