import { test, expect } from '@playwright/test';
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
   * Data-Driven Testing: Loops through each customer user.
   * Each user logs in directly — no pre-saved auth state required.
   * Products are added to cart directly from the search grid to avoid full-page navigations.
   */
  testUsers.forEach((user) => {
    test.describe(`User: ${user.username}`, () => {
      test(`Apply promo code: ${user.promoCode}`, async ({ page }) => {
        test.setTimeout(60000);

        // Login as this user
        await page.goto('/taqelah-demo-site.html', { waitUntil: 'domcontentloaded' });
        await page.getByTestId('username-input').fill(user.username);
        await page.getByTestId('password-input').fill(user.password);
        await page.getByTestId('login-button').click();
        await expect(page.getByText('Spring Collection 2025')).toBeVisible();
        await page.evaluate(() => localStorage.setItem('taqelahCart', '[]'));

        // Add products directly from the search grid (no product-detail navigation)
        for (const product of products) {
          await page.getByTestId('search-input').fill(product.searchTerm);
          await expect(page.getByTestId('search-grid')).toBeVisible();
          await page.getByTestId('search-grid').getByRole('button', { name: 'Add to Cart' }).first().click();

          // Dismiss toast so it does not obscure the search input on the next iteration
          await page.evaluate(() => {
            const t = document.getElementById('toastMessage');
            if (t?.parentElement) t.parentElement.style.display = 'none';
          });
        }

        // Proceed to checkout
        await page.getByTestId('cart-icon').click();
        await page.getByTestId('checkout-button').click();

        // Expand promo code section
        await page.getByTestId('promo-toggle').click();
        await expect(page.getByTestId('promo-code-input')).toBeVisible();

        // Apply the assigned promo code for this user
        await page.getByTestId('promo-code-input').fill(user.promoCode!);
        await page.getByTestId('apply-promo-button').click();

        // Assert that the discount is correctly reflected in the UI
        await expect(page.getByTestId('applied-promo-code')).toContainText(user.promoCode!);
      });
    });
  });
});
