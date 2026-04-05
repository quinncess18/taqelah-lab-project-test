import { test, expect } from '@playwright/test';

test.use({ storageState: '.auth/taqelah-user.json' });

test.describe('Mobile Negative Scenarios', () => {

  test.beforeEach(async ({ page, isMobile }) => {
    test.skip(!isMobile, 'This test is for mobile only');

    await page.goto('/taqelah-demo-site.html');
    await expect(page.getByTestId('logout-button')).toBeVisible();

    // Clear cart so any server-restored cart state doesn't bleed into tests
    await page.evaluate(() => localStorage.setItem('taqelahCart', '[]'));
  });

  test('should show error message on invalid login attempt', async ({ page }) => {
    await page.getByTestId('logout-button').tap();
    await expect(page.locator('#loginPage')).toBeVisible();

    await page.getByTestId('username-input').fill('ladies');
    await page.getByTestId('password-input').fill('wrongpassword');
    await page.getByTestId('login-button').tap();

    await expect(page.locator('text=Password must be username_GO')).toBeVisible();
    await expect(page.getByTestId('logout-button')).not.toBeVisible();
  });

  test('should show empty cart state with disabled checkout on mobile', async ({ page }) => {
    await page.getByTestId('cart-icon').tap();

    await expect(page.locator('.cart-empty')).toContainText(/empty|Your cart is empty/i);
    await expect(page.getByTestId('checkout-button')).toBeDisabled();
  });

  test('should show checkout form validation error for empty name on mobile', async ({ page }) => {
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

    await page.getByTestId('email-input').fill('test@example.com');
    await page.getByTestId('phone-input').fill('+6581234567');
    await page.getByTestId('place-order-button').tap();

    await expect(page.locator('#fullNameError')).toBeVisible();
    await expect(page.getByTestId('order-confirmation')).not.toBeVisible();
  });

  test('should show empty cart state with disabled checkout in landscape', async ({ page }) => {
    const viewport = page.viewportSize();
    await page.setViewportSize({ width: viewport!.height, height: viewport!.width });

    await page.getByTestId('cart-icon').tap();

    await expect(page.locator('.cart-empty')).toContainText(/empty|Your cart is empty/i);
    await expect(page.getByTestId('checkout-button')).toBeDisabled();
  });

  test('should show checkout form validation error for empty name in landscape', async ({ page }) => {
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

    await page.getByTestId('email-input').fill('test@example.com');
    await page.getByTestId('phone-input').fill('+6581234567');
    await page.getByTestId('place-order-button').tap();

    await expect(page.locator('#fullNameError')).toBeVisible();
    await expect(page.getByTestId('order-confirmation')).not.toBeVisible();
  });

  test('should remove item when quantity is decreased to zero', async ({ page }) => {
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

    const cartItems = page.getByTestId('cart-items');
    const maxiDressItem = cartItems.locator('[data-testid^="cart-item-"]').filter({ hasText: /maxi dress/i }).first();
    await expect(maxiDressItem).toBeVisible();

    const decreaseButton = maxiDressItem.getByTestId(/^decrease-quantity/i)
      .or(maxiDressItem.locator('button').filter({ hasText: /[-–]/ }))
      .first();
    await decreaseButton.tap();
    await page.waitForTimeout(300);

    await expect(page.locator('.cart-empty')).toContainText(/empty|Your cart is empty/i);
  });
});
