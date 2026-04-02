import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { parse } from 'csv-parse/sync';
import * as fs from 'fs';
import * as path from 'path';
import customers from '../../test-data/users.json';

interface Product {
  productId: string;
  searchTerm: string;
  productName: string;
  category: string;
}

// Load test data from CSV
const csvPath = path.join(__dirname, '../../test-data/products.csv');
const products: Product[] = parse(fs.readFileSync(csvPath, 'utf-8'), {
  columns: true,
  skip_empty_lines: true,
});

// Filter only customer users with assigned promo codes
const testUsers = customers.filter(user => user.expectedRole === 'customer' && user.promoCode);

test.describe('Parameterized Promo Codes with Multiple Users', () => {
  /**
   * Data-Driven Testing: Loops through each customer user
   * Each user logs in, adds multiple products to cart, proceeds to checkout once,
   * and applies a single promo code
   */
  testUsers.forEach((user) => {
    test(`User: ${user.username} - Apply promo code: ${user.promoCode}`, async ({ page }) => {
      test.setTimeout(60000);

      // Navigate and Login
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(user.username, user.password);

      // Ensure each user test starts with a clean cart state
      await page.evaluate(() => localStorage.setItem('taqelahCart', '[]'));

      // Verify login successful
      await expect(page.getByText('Spring Collection 2025')).toBeVisible();

      // Add multiple products to cart
      for (const product of products) {
        // Search for product
        await page.getByTestId('search-input').fill(product.searchTerm);
        
        // Wait for search results
        await expect(page.getByTestId('search-grid')).toBeVisible();

        // Click on the product
        const productElement = page.getByTestId('search-grid').getByTestId(`product-name-${product.productId}`);
        await expect(productElement).toBeVisible();
        await productElement.click();

        // Add to cart
        await page.getByTestId('product-details-add-to-cart').click();

        // Re-open the shop page explicitly; browser history back is flaky in this app
        await page.goto('/taqelah-demo-site.html', { waitUntil: 'domcontentloaded' });
        await expect(page.getByTestId('search-input')).toBeVisible();
      }

      // Proceed to checkout
      await page.getByTestId('cart-icon').click();
      await page.getByTestId('checkout-button').click();

      // Expand promo code section
      await page.getByTestId('promo-toggle').click();
      await expect(page.getByTestId('promo-code-input')).toBeVisible();

      // Apply the assigned promo code for this user
      const promoInput = page.getByTestId('promo-code-input');
      const applyBtn = page.getByTestId('apply-promo-button');

      await promoInput.fill(user.promoCode!);
      await applyBtn.click();

      // Assert that the discount is correctly reflected in the UI
      await expect(page.getByTestId('applied-promo-code')).toContainText(user.promoCode!);
    });
  });
});