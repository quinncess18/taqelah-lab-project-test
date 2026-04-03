import { test, expect, Page, BrowserContext } from '@playwright/test';
import users from '../../test-data/users.json';

test.describe.configure({ mode: 'serial' });

test.describe('Authenticated Checkout Final @functional', () => {
  let context: BrowserContext;
  let page: Page;
  let contextClosedInFlow = false;

  const promoUser = users.find(user => user.expectedRole === 'customer' && user.promoCode);

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext({
      storageState: '.auth/taqelah-user.json',
      baseURL: 'https://taqelah.sg',
    });
    page = await context.newPage();
  });

  test.afterAll(async () => {
    if (!contextClosedInFlow) {
      await context.close();
    }
  });

  test('step 1: authenticated user adds item and opens checkout', async () => {
    await page.goto('/taqelah-demo-site.html');
    await expect(page.getByTestId('logout-button')).toBeVisible();

    await page.evaluate(() => localStorage.setItem('taqelahCart', '[]'));

    await page.getByTestId('search-input').fill('maxi dress');
    await expect(page.getByTestId('search-grid')).toBeVisible();
    await page.getByTestId('search-grid').getByRole('button', { name: 'Add to Cart' }).first().click();

    await page.evaluate(() => {
      const toast = document.getElementById('toastMessage');
      if (toast && toast.parentElement) toast.parentElement.style.display = 'none';
    });

    await page.getByTestId('cart-icon').click();
    await expect(page.getByRole('heading', { name: 'Shopping Cart' })).toBeVisible();
    await expect(page.getByTestId('checkout-button')).toBeVisible();
    await expect(page.getByTestId('checkout-button')).toBeEnabled();
    await page.getByTestId('checkout-button').click();
    await expect(page.getByTestId('checkout-modal')).toBeVisible();
  });

  test('step 2: apply promo and complete checkout form', async () => {
    await page.getByTestId('promo-toggle').click();
    await expect(page.getByTestId('promo-code-input')).toBeVisible();

    if (promoUser?.promoCode) {
      await page.getByTestId('promo-code-input').fill(promoUser.promoCode);
      await page.getByTestId('apply-promo-button').click();
      await expect(page.getByTestId('applied-promo-code')).toContainText(promoUser.promoCode);
    }

    await page.getByTestId('full-name-input').fill('Taqelah Test Customer');
    await page.getByTestId('email-input').fill(`checkout-${Date.now()}@example.com`);
    await page.getByTestId('phone-input').fill('+6588888888');
    await page.getByTestId('address1-input').fill('123 Orchard Road');
    await page.getByTestId('city-input').fill('Singapore');
    await page.getByTestId('state-input').fill('SG');
    await page.getByTestId('postal-input').fill('238888');
    await page.getByTestId('country-select').selectOption('Singapore');

    await expect(page.getByTestId('place-order-button')).toBeVisible();
  });

  test('step 3: place order and verify confirmation state', async () => {
    await page.getByTestId('place-order-button').click();

    await expect(page.getByTestId('order-confirmation')).toBeVisible();
    await expect(page.getByTestId('confirmation-title')).toBeVisible();
    await expect(page.getByTestId('order-number-display')).toBeVisible();
    await expect(page.getByTestId('confirmation-total')).toBeVisible();

    const continueShoppingButton = page.getByTestId('continue-shopping-button');
    const canReturnToHomepage = await continueShoppingButton.isVisible().catch(() => false);

    if (canReturnToHomepage) {
      await continueShoppingButton.click();
      await expect(page.getByTestId('search-input')).toBeVisible();
      return;
    }

    await context.close();
    contextClosedInFlow = true;
  });
});
