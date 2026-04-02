import { expect } from '@playwright/test';
import { test } from '../../fixtures/worker-fixture';

test.describe.configure({ mode: 'serial' });

test.describe('First Purchase Checkout Details @functional', () => {
  test('Logged-in user can complete checkout details and place first order', async ({ page, uniqueEmail }) => {
    test.slow();
    test.setTimeout(60000);

    await page.goto('/taqelah-demo-site.html');

    await page.getByTestId('username-input').fill('ladies');
    await page.getByTestId('password-input').fill('ladies_GO');
    await page.getByTestId('login-button').click();

    await expect(page.getByTestId('search-input')).toBeVisible();
    await page.evaluate(() => localStorage.setItem('taqelahCart', '[]'));
    await page.getByTestId('search-input').fill('maxi dress');
    await expect(page.getByTestId('search-grid')).toBeVisible();

    await page.getByTestId('search-grid').getByRole('button', { name: 'Add to Cart' }).first().click();
    await expect(page.getByTestId('toast-message')).toBeVisible();

    await page.getByTestId('cart-icon').click();
    await expect(page.getByRole('heading', { name: 'Shopping Cart' })).toBeVisible();

    await page.getByTestId('checkout-button').click();
    await expect(page.getByTestId('checkout-modal')).toBeVisible();

    await page.getByTestId('full-name-input').fill('New Taqelah Customer');
    await page.getByTestId('email-input').fill(uniqueEmail);
    await page.getByTestId('phone-input').fill('+6581234567');
    await page.getByTestId('address1-input').fill('10 Orchard Road');
    await page.getByTestId('city-input').fill('Singapore');
    await page.getByTestId('state-input').fill('SG');
    await page.getByTestId('postal-input').fill('238879');
    await page.getByTestId('country-select').selectOption('Singapore');

    await page.getByTestId('place-order-button').click();
    await expect(page.getByTestId('order-confirmation')).toBeVisible();
    await expect(page.getByTestId('order-number-display')).toBeVisible();

    const continueShoppingButton = page.getByTestId('continue-shopping-button');
    const canReturnToHomepage = await continueShoppingButton.isVisible().catch(() => false);

    if (canReturnToHomepage) {
      await continueShoppingButton.click();
      await expect(page.getByTestId('search-input')).toBeVisible();
    }
  });
});
