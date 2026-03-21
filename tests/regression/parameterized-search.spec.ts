import { test, expect } from '@playwright/test';
import { parse } from 'csv-parse/sync';
import * as fs from 'fs';
import * as path from 'path';

// Load test data from CSV
const csvPath = path.join(__dirname, '../../test-data/products.csv');
const products = parse(fs.readFileSync(csvPath, 'utf-8'), {
  columns: true,
  skip_empty_lines: true,
});

test.describe('Parameterized Product Search', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/taqelah-demo-site.html');

    // Login
    await page.getByTestId('username-input').fill('ladies');
    await page.getByTestId('password-input').fill('ladies_GO');
    await page.getByTestId('login-button').click();

    await expect(page.getByTestId('search-input')).toBeVisible();
  });

  // Generate tests from CSV data
  for (const product of products) {
    test(`search for ${product.productName} in ${product.category}`, async ({ page }) => {
      // Search for product
      await page.getByTestId('search-input').fill(product.searchTerm);

      // Wait for search results
      await expect(page.getByTestId('search-grid')).toBeVisible();

      // Verify product is in results
      const productElement = page.getByTestId('search-grid').getByTestId(`product-name-${product.productId}`);
      await expect(productElement).toBeVisible();
    });
  }
});

// Parameterized promo code tests
const promoCodes = [
  { code: 'SAVE10', discount: '10%', description: '10% discount' },
  { code: 'WELCOME20', discount: '20%', description: '20% discount' },
  { code: 'FREESHIP', discount: 'Free Shipping', description: 'free shipping' },
];

test.describe('Parameterized Promo Codes', () => {

  /**
   * Setup: Handles authentication and cart preparation before each test case.
   * This ensures isolation and follows the "Full Parallelization" requirement.
   */
  test.beforeEach(async ({ page }) => {
    // Navigate and Login
    await page.goto('/taqelah-demo-site.html');
    await page.getByTestId('username-input').fill('ladies');
    await page.getByTestId('password-input').fill('ladies_GO');
    await page.getByTestId('login-button').click();

    // Select a product and add to cart
    await page.getByTestId('search-input').fill('maxi dress');
    await page.getByTestId('search-grid').getByTestId('product-name-6').click();
    await page.getByTestId('product-details-add-to-cart').click();

    // Proceed to checkout and prepare promo section
    await page.getByTestId('cart-icon').click();
    await page.getByTestId('checkout-button').click();
    await page.getByTestId('promo-toggle').click();
  });

  /**
   * Data-Driven Execution: Loops through the promoCodes array to generate 
   * unique test instances for each discount scenario.
   */
  promoCodes.forEach(({ code, description }) => {
    test(`Verify promo code application for: ${description}`, async ({ page }) => {
      // Apply the specific promo code for this iteration
      const promoInput = page.getByTestId('promo-code-input');
      const applyBtn = page.getByTestId('apply-promo-button');

      await promoInput.fill(code);
      await applyBtn.click();

      // Assert that the discount is correctly reflected in the UI
      await expect(page.getByTestId('applied-promo-code')).toContainText(code);
    });
  });
});