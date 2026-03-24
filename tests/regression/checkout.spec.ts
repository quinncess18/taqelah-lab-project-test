import { test, expect, Page } from '../../fixtures/worker-fixture';

// Parameterized promo code tests
const promoCodes = [
  { code: 'SAVE10', discount: '10%', description: '10% discount' },
  { code: 'WELCOME20', discount: '20%', description: '20% discount' },
  { code: 'FREESHIP', discount: 'Free Shipping', description: 'free shipping' },
];

/**
 * Configure this file to run in serial mode.
 * If one test fails, the subsequent tests will be skipped.
 */
test.describe.configure({ mode: 'serial' });

test.describe('Checkout Flow - Serial Execution', () => {

  /**
   * SHARED PAGE INSTANCE: 
   * Declaring 'page' here allows all test blocks to share the same browser window.
   */
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    // Create a single page instance for the entire flow
    page = await browser.newPage();
    console.log('Starting checkout flow tests...');
  });

  test.afterAll(async () => {
    // Close the page instance after all tests are completed
    await page.close();
  });

  test('step 1: login and search for product', async () => {
    // Step 1 handles the manual login and initial search
    await page.goto('/taqelah-demo-site.html');

    // Perform Login
    await page.getByTestId('username-input').fill('ladies');
    await page.getByTestId('password-input').fill('ladies_GO');
    await page.getByTestId('login-button').click();

    // Verify login was successful
    await expect(page.getByTestId('search-input')).toBeVisible();

    // Search for product
    await page.getByTestId('search-input').fill('maxi dress');
    await expect(page.getByTestId('search-grid')).toBeVisible();
  });

  test('step 2: add product to cart', async () => {
    /**
     * Do NOT use page.goto() here. 
     * We are continuing from the state left by Step 1.
     */
    await page.getByTestId('search-grid').getByTestId('product-name-6').click({
      force: true,
    });
    await page.getByTestId('product-details-add-to-cart').click();

    // Open cart and verify the Shopping Cart heading
    await page.getByTestId('cart-icon').click();
    await expect(page.getByRole('heading', { name: 'Shopping Cart' })).toBeVisible();
  });

  test('step 3: proceed to checkout', async () => {
    // Navigate to the checkout form from the cart
    await page.getByTestId('checkout-button').click();

    // Verify the checkout name field is visible
    await expect(page.getByTestId('checkout-modal')).toBeVisible();
  });

  test('step 4: complete checkout form', async ({ uniqueEmail }) => {
    // Toggle promo code section
      await page.getByTestId('promo-toggle').click();

    /**
    * ACCESSING THE PROMO CODE:
    * Since 'promoCodes' is an array of objects, 
    * use [0] for the first item, and .code for the string value.
    */
    const myPromo = promoCodes[0];

    // Apply promo code
    await page.getByTestId('promo-code-input').fill(myPromo.code);
    await page.getByTestId('apply-promo-button').click();

    // Verify discount is applied
    await expect(page.getByTestId('applied-promo-code')).toContainText(myPromo.code);
    await expect(page.getByTestId('applied-promo-code')).toContainText(myPromo.discount);

    // Fill in the shipping and billing details
    await page.getByTestId('full-name-input').fill('Jane Doe');
    await page.getByTestId('email-input').fill(uniqueEmail);
    await page.getByTestId('phone-input').fill('+1234567890');
    await page.getByTestId('address1-input').fill('123 Fashion Street');
    await page.getByTestId('city-input').fill('Singapore');
    await page.getByTestId('state-input').fill('SG');
    await page.getByTestId('postal-input').fill('123456');
    await page.getByTestId('country-select').click();
    await page.getByTestId('country-select').selectOption('Singapore');

    // Verify the 10% discount is visible in the UI
    await expect(page.getByText('10%').first()).toBeVisible();
  });

});