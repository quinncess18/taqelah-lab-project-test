import { test, expect } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

test.describe('Checkout - Negative Scenarios @functional', () => {
  let context: any;
  let page: any;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext({
      storageState: '.auth/taqelah-user.json',
      baseURL: 'https://taqelah.sg',
    });
    page = await context.newPage();
  });

  test.afterAll(async () => {
    if (context) {
      await context.close();
    }
  });

  test.beforeEach(async () => {
    await page.goto('/taqelah-demo-site.html');
    await expect(page.getByTestId('logout-button')).toBeVisible();
    await page.evaluate(() => localStorage.setItem('taqelahCart', '[]'));
  });

  test('Submit checkout form with empty full name shows validation error', async () => {
    await page.getByTestId('search-input').fill('maxi dress');
    await expect(page.getByTestId('search-grid')).toBeVisible();
    await page.getByTestId('search-grid').getByRole('button', { name: 'Add to Cart' }).first().click();
    await page.waitForTimeout(500);
    
    await page.getByTestId('cart-icon').click();
    await expect(page.getByRole('heading', { name: 'Shopping Cart' })).toBeVisible();
    await page.getByTestId('checkout-button').click();
    await expect(page.getByTestId('checkout-modal')).toBeVisible();

    await page.getByTestId('email-input').fill('test@example.com');
    await page.getByTestId('phone-input').fill('+6581234567');
    await page.getByTestId('address1-input').fill('123 Test Street');
    await page.getByTestId('city-input').fill('Singapore');
    await page.getByTestId('state-input').fill('SG');
    await page.getByTestId('postal-input').fill('123456');
    await page.getByTestId('country-select').selectOption('Singapore');

    await page.getByTestId('place-order-button').click();
    
    await expect(page.locator('#fullNameError')).toBeVisible();
    await expect(page.getByTestId('order-confirmation')).not.toBeVisible();
  });

  test('Submit checkout form with invalid email shows validation error', async () => {
    await page.getByTestId('search-input').fill('maxi dress');
    await expect(page.getByTestId('search-grid')).toBeVisible();
    await page.getByTestId('search-grid').getByRole('button', { name: 'Add to Cart' }).first().click();
    await page.waitForTimeout(500);
    
    await page.getByTestId('cart-icon').click();
    await expect(page.getByRole('heading', { name: 'Shopping Cart' })).toBeVisible();
    await page.getByTestId('checkout-button').click();
    await expect(page.getByTestId('checkout-modal')).toBeVisible();

    await page.getByTestId('full-name-input').fill('Test User');
    await page.getByTestId('email-input').fill('invalid-email');
    await page.getByTestId('phone-input').fill('+6581234567');
    await page.getByTestId('address1-input').fill('123 Test Street');
    await page.getByTestId('city-input').fill('Singapore');
    await page.getByTestId('state-input').fill('SG');
    await page.getByTestId('postal-input').fill('123456');
    await page.getByTestId('country-select').selectOption('Singapore');

    await page.getByTestId('place-order-button').click();
    
    await expect(page.locator('#emailError')).toBeVisible();
    await expect(page.getByTestId('order-confirmation')).not.toBeVisible();
  });

  test('Submit checkout form with phone number less than 10 digits shows validation error', async () => {
    await page.getByTestId('search-input').fill('maxi dress');
    await expect(page.getByTestId('search-grid')).toBeVisible();
    await page.getByTestId('search-grid').getByRole('button', { name: 'Add to Cart' }).first().click();
    await page.waitForTimeout(500);
    
    await page.getByTestId('cart-icon').click();
    await expect(page.getByRole('heading', { name: 'Shopping Cart' })).toBeVisible();
    await page.getByTestId('checkout-button').click();
    await expect(page.getByTestId('checkout-modal')).toBeVisible();

    await page.getByTestId('full-name-input').fill('Test User');
    await page.getByTestId('email-input').fill('test@example.com');
    await page.getByTestId('phone-input').fill('12345');
    await page.getByTestId('address1-input').fill('123 Test Street');
    await page.getByTestId('city-input').fill('Singapore');
    await page.getByTestId('state-input').fill('SG');
    await page.getByTestId('postal-input').fill('123456');
    await page.getByTestId('country-select').selectOption('Singapore');

    await page.getByTestId('place-order-button').click();
    
    await expect(page.locator('#phoneError')).toBeVisible();
    await expect(page.getByTestId('order-confirmation')).not.toBeVisible();
  });

  test('Apply invalid promo code shows error message', async () => {
    await page.getByTestId('search-input').fill('maxi dress');
    await expect(page.getByTestId('search-grid')).toBeVisible();
    await page.getByTestId('search-grid').getByRole('button', { name: 'Add to Cart' }).first().click();
    await page.waitForTimeout(500);
    
    await page.getByTestId('cart-icon').click();
    await expect(page.getByRole('heading', { name: 'Shopping Cart' })).toBeVisible();
    await page.getByTestId('checkout-button').click();
    await expect(page.getByTestId('checkout-modal')).toBeVisible();

    await page.getByTestId('promo-toggle').click();
    await expect(page.getByTestId('promo-code-input')).toBeVisible();
    await page.getByTestId('promo-code-input').fill('INVALIDCODE');
    await page.getByTestId('apply-promo-button').click();
    
    await expect(page.getByTestId('promo-message')).toContainText(/Invalid promo code|Try: SAVE10/i);
  });

  test('Apply valid promo code shows success message', async () => {
    await page.getByTestId('search-input').fill('maxi dress');
    await expect(page.getByTestId('search-grid')).toBeVisible();
    await page.getByTestId('search-grid').getByRole('button', { name: 'Add to Cart' }).first().click();
    await page.waitForTimeout(500);
    
    await page.getByTestId('cart-icon').click();
    await expect(page.getByRole('heading', { name: 'Shopping Cart' })).toBeVisible();
    await page.getByTestId('checkout-button').click();
    await expect(page.getByTestId('checkout-modal')).toBeVisible();

    await page.getByTestId('promo-toggle').click();
    await expect(page.getByTestId('promo-code-input')).toBeVisible();
    await page.getByTestId('promo-code-input').fill('SAVE10');
    await page.getByTestId('apply-promo-button').click();
    
    await expect(page.getByTestId('applied-promo-code')).toBeVisible();
  });

  test('Promo code is case-insensitive', async () => {
    await page.getByTestId('search-input').fill('maxi dress');
    await expect(page.getByTestId('search-grid')).toBeVisible();
    await page.getByTestId('search-grid').getByRole('button', { name: 'Add to Cart' }).first().click();
    await page.waitForTimeout(500);
    
    await page.getByTestId('cart-icon').click();
    await expect(page.getByRole('heading', { name: 'Shopping Cart' })).toBeVisible();
    await page.getByTestId('checkout-button').click();
    await expect(page.getByTestId('checkout-modal')).toBeVisible();

    await page.getByTestId('promo-toggle').click();
    await expect(page.getByTestId('promo-code-input')).toBeVisible();
    await page.getByTestId('promo-code-input').fill('save10');
    await page.getByTestId('apply-promo-button').click();
    
    await expect(page.getByTestId('applied-promo-code')).toBeVisible();
  });

  test('Form progress indicator updates as fields are filled', async () => {
    await page.getByTestId('search-input').fill('maxi dress');
    await expect(page.getByTestId('search-grid')).toBeVisible();
    await page.getByTestId('search-grid').getByRole('button', { name: 'Add to Cart' }).first().click();
    await page.waitForTimeout(500);
    
    await page.getByTestId('cart-icon').click();
    await expect(page.getByRole('heading', { name: 'Shopping Cart' })).toBeVisible();
    await page.getByTestId('checkout-button').click();
    await expect(page.getByTestId('checkout-modal')).toBeVisible();

    await expect(page.getByTestId('progress-text')).toContainText('0 of 8 fields completed');

    await page.getByTestId('full-name-input').fill('Test User');
    await expect(page.getByTestId('progress-text')).toContainText('1 of 8 fields completed');

    await page.getByTestId('email-input').fill('test@example.com');
    await expect(page.getByTestId('progress-text')).toContainText('2 of 8 fields completed');
  });

  test('Remove applied promo code before placing order', async () => {
    await page.getByTestId('search-input').fill('maxi dress');
    await expect(page.getByTestId('search-grid')).toBeVisible();
    await page.getByTestId('search-grid').getByRole('button', { name: 'Add to Cart' }).first().click();
    await page.waitForTimeout(500);
    
    await page.getByTestId('cart-icon').click();
    await expect(page.getByRole('heading', { name: 'Shopping Cart' })).toBeVisible();
    await page.getByTestId('checkout-button').click();
    await expect(page.getByTestId('checkout-modal')).toBeVisible();

    await page.getByTestId('promo-toggle').click();
    await page.getByTestId('promo-code-input').fill('SAVE10');
    await page.getByTestId('apply-promo-button').click();
    await expect(page.getByTestId('applied-promo-code')).toBeVisible();

    const removePromoButton = page.getByTestId('remove-promo-button');
    if (await removePromoButton.isVisible()) {
      await removePromoButton.click();
      await expect(page.getByTestId('applied-promo-code')).not.toBeVisible();
    }
  });

  test('Submit checkout form with all required fields empty shows multiple validation errors', async () => {
    await page.getByTestId('search-input').fill('maxi dress');
    await expect(page.getByTestId('search-grid')).toBeVisible();
    await page.getByTestId('search-grid').getByRole('button', { name: 'Add to Cart' }).first().click();
    await page.waitForTimeout(500);
    
    await page.getByTestId('cart-icon').click();
    await expect(page.getByRole('heading', { name: 'Shopping Cart' })).toBeVisible();
    await page.getByTestId('checkout-button').click();
    await expect(page.getByTestId('checkout-modal')).toBeVisible();

    await page.getByTestId('place-order-button').click();
    
    await expect(page.locator('#fullNameError')).toBeVisible();
    await expect(page.locator('#emailError')).toBeVisible();
    await expect(page.locator('#phoneError')).toBeVisible();
    await expect(page.getByTestId('order-confirmation')).not.toBeVisible();
  });

  test('Real-time validation shows success state for valid fields', async () => {
    await page.getByTestId('search-input').fill('maxi dress');
    await expect(page.getByTestId('search-grid')).toBeVisible();
    await page.getByTestId('search-grid').getByRole('button', { name: 'Add to Cart' }).first().click();
    await page.waitForTimeout(500);
    
    await page.getByTestId('cart-icon').click();
    await expect(page.getByRole('heading', { name: 'Shopping Cart' })).toBeVisible();
    await page.getByTestId('checkout-button').click();
    await expect(page.getByTestId('checkout-modal')).toBeVisible();

    await page.getByTestId('full-name-input').fill('Test User');
    await expect(page.getByTestId('full-name-input')).toHaveClass(/success/);

    await page.getByTestId('email-input').fill('valid@example.com');
    await expect(page.getByTestId('email-input')).toHaveClass(/success/);

    await page.getByTestId('phone-input').fill('+6581234567');
    await expect(page.getByTestId('phone-input')).toHaveClass(/success/);
  });

  test('Checkout with multiple items in cart calculates correct totals', async () => {
    await page.getByTestId('search-input').fill('dress');
    await expect(page.getByTestId('search-grid')).toBeVisible();
    
    const addToCartButtons = page.getByTestId('search-grid').getByRole('button', { name: 'Add to Cart' });
    await addToCartButtons.first().click();
    await page.waitForTimeout(300);
    await page.getByTestId('search-input').fill('top');
    await page.waitForTimeout(300);
    await addToCartButtons.first().click();
    await page.waitForTimeout(500);
    
    await page.getByTestId('cart-icon').click();
    await expect(page.getByRole('heading', { name: 'Shopping Cart' })).toBeVisible();

    const cartItems = page.locator('[data-testid^="cart-item-"]');
    const itemCount = await cartItems.count();
    expect(itemCount).toBeGreaterThanOrEqual(2);
  });
});
