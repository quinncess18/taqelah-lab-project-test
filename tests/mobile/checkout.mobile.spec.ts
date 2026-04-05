import { test, expect, BrowserContext, Page } from '@playwright/test';
import users from '../../test-data/users.json';

test.describe.configure({ mode: 'serial' });

test.describe('Mobile E2E — Full Checkout Flow', () => {
  let context: BrowserContext;
  let page: Page;

  const promoUser = users.find(user => user.expectedRole === 'customer' && user.promoCode);

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext({
      storageState: '.auth/taqelah-user.json',
      baseURL: 'https://taqelah.sg',
    });
    page = await context.newPage();
  });

  test.afterAll(async () => {
    await context?.close();
  });

  test('step 1: verify authenticated state and clear cart', async ({ isMobile }) => {
    test.skip(!isMobile, 'Mobile E2E only');

    await page.goto('/taqelah-demo-site.html');
    await expect(page.getByTestId('logout-button')).toBeVisible();
    await page.evaluate(() => localStorage.setItem('taqelahCart', '[]'));

    const cartCount = page.getByTestId('cart-count');
    await expect(cartCount).toContainText('0');
  });

  test('step 2: search for product and add to cart', async ({ isMobile }) => {
    test.skip(!isMobile, 'Mobile E2E only');

    await page.getByTestId('search-input').tap();
    await page.getByTestId('search-input').fill('maxi dress');
    await expect(page.getByTestId('search-grid')).toBeVisible();
    await expect(page.getByTestId('search-grid').getByTestId('product-name-6')).toBeVisible();

    await page.getByTestId('search-grid').getByTestId('product-name-6').tap();
    await expect(page.getByTestId('product-details-add-to-cart')).toBeVisible();
    await page.getByTestId('product-details-add-to-cart').tap();

    // Wait for modal to close and toast to confirm add
    await expect(page.getByTestId('product-details-modal')).not.toBeVisible();
    await expect(page.getByTestId('toast-message')).toBeVisible();
  });

  test('step 3: open cart and verify item', async ({ isMobile }) => {
    test.skip(!isMobile, 'Mobile E2E only');

    await page.evaluate(() => {
      const toast = document.getElementById('toastMessage');
      if (toast?.parentElement) toast.parentElement.style.display = 'none';
    });

    await page.getByTestId('cart-icon').tap();
    await expect(page.getByRole('heading', { name: 'Shopping Cart' })).toBeVisible();

    const cartItems = page.getByTestId('cart-items');
    await expect(cartItems).toBeVisible();
    await expect(cartItems.getByText('Maxi Dress')).toBeVisible();
    await expect(page.getByTestId('checkout-button')).toBeEnabled();
  });

  test('step 4: proceed to checkout and fill form', async ({ isMobile }) => {
    test.skip(!isMobile, 'Mobile E2E only');

    await page.getByTestId('checkout-button').tap();
    await expect(page.getByTestId('checkout-modal')).toBeVisible();

    // Apply promo code
    await page.getByTestId('promo-toggle').tap();
    await expect(page.getByTestId('promo-code-input')).toBeVisible();
    if (promoUser?.promoCode) {
      await page.getByTestId('promo-code-input').fill(promoUser.promoCode);
      await page.getByTestId('apply-promo-button').tap();
      await expect(page.getByTestId('applied-promo-code')).toContainText(promoUser.promoCode);
    }

    // Fill shipping details
    await page.getByTestId('full-name-input').fill('Taqelah Mobile Customer');
    await page.getByTestId('email-input').fill(`mobile-checkout-${Date.now()}@example.com`);
    await page.getByTestId('phone-input').fill('+6588888888');
    await page.getByTestId('address1-input').fill('1 Orchard Road');
    await page.getByTestId('city-input').fill('Singapore');
    await page.getByTestId('state-input').fill('SG');
    await page.getByTestId('postal-input').fill('238801');
    await page.getByTestId('country-select').selectOption('Singapore');

    await expect(page.getByTestId('place-order-button')).toBeVisible();
  });

  test('step 5: place order and verify confirmation', async ({ isMobile }) => {
    test.skip(!isMobile, 'Mobile E2E only');

    await page.getByTestId('place-order-button').tap();

    await expect(page.getByTestId('order-confirmation')).toBeVisible();
    await expect(page.getByTestId('confirmation-title')).toBeVisible();
    await expect(page.getByTestId('order-number-display')).toBeVisible();
    await expect(page.getByTestId('confirmation-total')).toBeVisible();

    const continueShoppingButton = page.getByTestId('continue-shopping-button');
    if (await continueShoppingButton.isVisible().catch(() => false)) {
      await continueShoppingButton.tap();
      await expect(page.getByTestId('search-input')).toBeVisible();
    }
  });
});
