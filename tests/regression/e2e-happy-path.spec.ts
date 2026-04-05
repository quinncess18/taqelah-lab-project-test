import { test, expect, Page } from '../../fixtures/worker-fixture';

test.describe.configure({ mode: 'serial' });

test.describe('E2E Happy Path', () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    // Clear cart state before the flow begins
    await page.goto('/taqelah-demo-site.html');
    await page.evaluate(() => localStorage.setItem('taqelahCart', '[]'));
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('step 1: login', async () => {
    await page.getByTestId('username-input').fill('autumn');
    await page.getByTestId('password-input').fill('autumn_GO');
    await page.getByTestId('login-button').click();

    await expect(page.getByText('Spring Collection 2025')).toBeVisible();
    await expect(page.getByTestId('logout-button')).toBeVisible();
  });

  test('step 2: search for product', async () => {
    await page.getByTestId('search-input').fill('trench coat');

    await expect(page.getByTestId('search-grid')).toBeVisible();
    await expect(page.getByTestId('search-grid').locator('.product-card').first()).toBeVisible();
  });

  test('step 3: view product details modal', async () => {
    await page.getByTestId('search-grid').getByTestId('product-name-19').dispatchEvent('click');

    await expect(page.getByTestId('product-details-modal')).toBeVisible();
    await expect(page.getByTestId('product-details-modal')).toContainText('Trench Coat');
  });

  test('step 4: add to cart and verify toast notification', async () => {
    await page.getByTestId('product-details-add-to-cart').click();

    await expect(page.getByTestId('toast-message')).toBeVisible();

    // Wait for modal to close before proceeding
    await expect(page.getByTestId('product-details-modal')).not.toBeVisible();
  });

  test('step 5: view cart and verify item with price', async () => {
    await page.evaluate(() => {
      const toast = document.getElementById('toastMessage');
      if (toast?.parentElement) toast.parentElement.style.display = 'none';
    });

    await page.getByTestId('cart-icon').click();

    await expect(page.getByRole('heading', { name: 'Shopping Cart' })).toBeVisible();

    const cartItems = page.getByTestId('cart-items');
    await expect(cartItems.locator('[data-testid^="cart-item-"]').filter({ hasText: /trench coat/i }).first()).toBeVisible();
    await expect(page.getByTestId('cart-total').or(page.getByTestId('checkout-total')).first()).toBeVisible();
  });

  test('step 6: proceed to checkout', async () => {
    const checkoutButton = page.getByTestId('checkout-button');
    await expect(checkoutButton).toBeVisible();
    await expect(checkoutButton).toBeEnabled();
    await expect(checkoutButton).toHaveText(/checkout/i);

    await checkoutButton.click();

    await expect(page.getByTestId('checkout-modal')).toBeVisible();
  });

  test('step 7: fill checkout form with promo code', async ({ uniqueEmail }) => {
    await page.getByTestId('promo-toggle').click();
    await page.getByTestId('promo-code-input').fill('WELCOME20');
    await page.getByTestId('apply-promo-button').click();

    await expect(page.getByTestId('applied-promo-code')).toContainText('WELCOME20');
    await expect(page.getByTestId('applied-promo-code')).toContainText('20%');

    await page.getByTestId('full-name-input').fill('Autumn Taqelah');
    await page.getByTestId('email-input').fill(uniqueEmail);
    await page.getByTestId('phone-input').fill('+6591234567');
    await page.getByTestId('address1-input').fill('88 Orchard Road');
    await page.getByTestId('city-input').fill('Singapore');
    await page.getByTestId('state-input').fill('SG');
    await page.getByTestId('postal-input').fill('238839');
    await page.getByTestId('country-select').selectOption('Singapore');

    await expect(page.getByTestId('place-order-button')).toBeVisible();
    await expect(page.getByTestId('place-order-button')).toBeEnabled();
  });

  test('step 8: place order and verify confirmation', async () => {
    await page.getByTestId('place-order-button').click();

    await expect(page.getByTestId('order-confirmation')).toBeVisible();
    await expect(page.getByTestId('order-number-display')).toBeVisible();
  });

});
