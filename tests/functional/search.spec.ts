import { test, expect } from '@playwright/test';

test.describe('Product Search - Parallel Safe', () => {

  test.beforeEach(async ({ page }) => {
  await page.goto('/taqelah-demo-site.html');

  // Wait for button to be clickable (visible AND stable)
  await page.getByTestId('login-button').isEnabled();

  // Login
  await page.getByTestId('username-input').fill('ladies');
  await page.getByTestId('password-input').fill('ladies_GO');
  await page.getByTestId('login-button').click();

  // Wait for login to complete
  await expect(page.getByTestId('search-input')).toBeVisible();
});

  // These tests can run in parallel - no shared state
  test('search for dresses', async ({ page }) => {
    await page.getByTestId('search-input').fill('dress');

    const productGrid = page.getByTestId('search-grid');
    await productGrid.scrollIntoViewIfNeeded();
    await expect(productGrid).toBeVisible();

    // Verify search results contain dresses
    await expect(page.getByText('Maxi Dress').first()).toBeVisible();
  });

  test('search for tops', async ({ page }) => {
    await page.getByTestId('search-input').fill('top');

    const productGrid = page.getByTestId('search-grid');
    await productGrid.scrollIntoViewIfNeeded();
    await expect(productGrid).toBeVisible();
    await expect(productGrid.locator('.product-card').first()).toBeVisible();
  });

  test('search for accessories', async ({ page }) => {
    await page.getByTestId('search-input').fill('accessories');

    const productGrid = page.getByTestId('search-grid');
    await productGrid.scrollIntoViewIfNeeded();
    await expect(productGrid).toBeVisible();
    await expect(productGrid.locator('.product-card').first()).toBeVisible();
  });

  test('search returns no results for unmatched term', async ({ page }) => {
    await page.getByTestId('search-input').fill('zzznoresults');

    const productGrid = page.getByTestId('search-grid');
    await expect(productGrid).toBeVisible();
    await expect(productGrid.locator('.product-card')).toHaveCount(0);
    await expect(productGrid).toContainText('No Results Found');
  });

  test('filter by category - New In', async ({ page }) => {
    await page.getByRole('link', { name: 'New In' }).click();

    // Instead of checking the grid (container), we wait for the first PRODUCT (content)
    // This is the "industry standard" for dynamic grids
    await expect(page.locator('.product-card').first()).toBeVisible({ timeout: 10000 });
  });

  test('filter by category - Sale', async ({ page }) => {
    await page.getByRole('link', { name: 'Sale' }).click();

    // Same here: Wait for the content to appear inside the grid
    await expect(page.locator('.product-card').first()).toBeVisible({ timeout: 10000 });
  });
});