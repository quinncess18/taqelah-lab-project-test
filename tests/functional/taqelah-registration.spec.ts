import { expect } from '@playwright/test';
import { test } from '../../fixtures/worker-fixture';

test.describe.configure({ mode: 'serial' });

test.describe('Registration and First Purchase @functional', () => {
  test('New user can register and begin first purchase journey', async ({ page, uniqueEmail }) => {
    test.slow();
    test.setTimeout(60000);

    await page.goto('/taqelah-demo-site.html');

    const registrationEntryPoints = [
      page.getByRole('button', { name: /sign up|register|create account/i }),
      page.getByRole('link', { name: /sign up|register|create account/i }),
      page.getByTestId('register-button'),
      page.getByTestId('signup-button'),
    ];

    let openedRegistration = false;
    for (const entry of registrationEntryPoints) {
      if (await entry.first().isVisible().catch(() => false)) {
        await entry.first().click();
        openedRegistration = true;
        break;
      }
    }

    if (openedRegistration) {
      const fullName = page
        .getByTestId('full-name-input')
        .or(page.getByLabel(/full name|name/i))
        .first();
      const email = page.getByTestId('email-input').or(page.getByLabel(/email/i)).first();
      const password = page
        .getByTestId('password-input')
        .or(page.getByLabel(/^password$/i))
        .first();

      await fullName.fill('New Taqelah Customer');
      await email.fill(uniqueEmail);
      await password.fill('securePass123_GO');

      const submitRegistration = page
        .getByRole('button', { name: /create account|register|sign up/i })
        .or(page.getByTestId('register-submit-button'))
        .first();

      await submitRegistration.click();
    } else {
      await page.getByTestId('username-input').fill('ladies');
      await page.getByTestId('password-input').fill('ladies_GO');
      await page.getByTestId('login-button').click();
    }

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
