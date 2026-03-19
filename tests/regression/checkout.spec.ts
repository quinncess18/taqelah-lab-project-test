import { test, expect } from '@playwright/test';

// Configure this describe block to run serially
test.describe.configure({ mode: 'serial' });

test.describe('Checkout Flow - Serial Execution', () => {

  test.beforeAll(async ({ browser }) => {
    // Setup that runs once before all tests in this file
    console.log('Starting checkout flow tests');
  });

  test('step 1: login and search for product', async ({ page }) => {
    await page.goto('/taqelah-demo-site.html');

    // Login
    await page.getByTestId('username-input').fill('ladies');
    await page.getByTestId('password-input').fill('ladies_GO');
    await page.getByTestId('login-button').click();

    await expect(page.getByTestId('search-input')).toBeVisible();

    // Search for product
    await page.getByTestId('search-input').fill('maxi dress');
    await expect(page.getByTestId('search-grid')).toBeVisible();
  });

  test('step 2: add product to cart', async ({ page }) => {
    await page.goto('/taqelah-demo-site.html');

    // Login
    await page.getByTestId('username-input').fill('ladies');
    await page.getByTestId('password-input').fill('ladies_GO');
    await page.getByTestId('login-button').click();

    // Search and add to cart
    await page.getByTestId('search-input').fill('maxi dress');
    await page.getByTestId('search-grid').getByTestId('product-name-6').click();
    await page.getByTestId('product-details-add-to-cart').click();

    // Verify cart icon shows item
    await page.getByTestId('cart-icon').click();
    await expect(page.getByRole('heading', { name: 'Shopping Cart' })).toBeVisible();
  });

  test('step 3: proceed to checkout', async ({ page }) => {
    await page.goto('/taqelah-demo-site.html');

    // Login and add product
    await page.getByTestId('username-input').fill('ladies');
    await page.getByTestId('password-input').fill('ladies_GO');
    await page.getByTestId('login-button').click();

    await page.getByTestId('search-input').fill('maxi dress');
    await page.getByTestId('search-grid').getByTestId('product-name-6').click();
    await page.getByTestId('product-details-add-to-cart').click();

    // Go to cart and checkout
    await page.getByTestId('cart-icon').click();
    await page.getByTestId('checkout-button').click();

    // Verify checkout form is visible
    await expect(page.getByTestId('checkout-name')).toBeVisible();
  });

  test('step 4: complete checkout form', async ({ page }) => {
    await page.goto('/taqelah-demo-site.html');

    // Login, add product, go to checkout
    await page.getByTestId('username-input').fill('ladies');
    await page.getByTestId('password-input').fill('ladies_GO');
    await page.getByTestId('login-button').click();

    await page.getByTestId('search-input').fill('maxi dress');
    await page.getByTestId('search-grid').getByTestId('product-name-6').click();
    await page.getByTestId('product-details-add-to-cart').click();

    await page.getByTestId('cart-icon').click();
    await page.getByTestId('checkout-button').click();

    // Fill checkout form
    await page.getByTestId('checkout-name').fill('Jane Doe');
    await page.getByTestId('checkout-email').fill('jane@example.com');
    await page.getByTestId('checkout-address').fill('123 Fashion Street');
    await page.getByTestId('checkout-city').fill('Singapore');
    await page.getByTestId('checkout-state').fill('SG');
    await page.getByTestId('checkout-postal').fill('123456');
    await page.getByTestId('checkout-country').fill('Singapore');

    // Apply promo code
    await page.getByTestId('promo-code-input').fill('SAVE10');
    await page.getByTestId('apply-promo-button').click();

    // Verify discount applied
    await expect(page.getByText('10%')).toBeVisible();
  });
});