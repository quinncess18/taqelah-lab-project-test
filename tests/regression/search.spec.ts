import { test, expect } from '@playwright/test';

test.describe('Product Search - Parallel Safe', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/taqelah-demo-site.html');

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
    const targetDress = productGrid.getByText('Maxi Dress').first();
    await expect(productGrid).toBeVisible();

    // Verify search results contain dresses
    await productGrid.scrollIntoViewIfNeeded();
    await expect(targetDress).toBeVisible();
  });

  test('search for tops', async ({ page }) => {
    await page.getByTestId('search-input').fill('top');

    const productGrid = page.getByTestId('search-grid');
    await expect(productGrid).toBeVisible();
    await productGrid.scrollIntoViewIfNeeded();
    const targetTop = productGrid.getByText('Striped Button-Up').first();
    await expect(targetTop).toBeVisible();
  });

  test('search for accessories', async ({ page }) => {
    await page.getByTestId('search-input').fill('accessories');

    const productGrid = page.getByTestId('search-grid');
    await expect(productGrid).toBeVisible();
  });

    test('filter by category - New In', async ({ page }) => {
  // Click on category filter
  await page.getByRole('link', { name: 'New In' }).click();

  // Wait for results to load
  await page.waitForLoadState('networkidle');

  // Verify products are filtered
  await expect(page.getByTestId('search-grid')).toBeAttached();
});

test('filter by category - Sale', async ({ page }) => {
  await page.getByRole('link', { name: 'Sale' }).click();

  // Wait for results to load
  await page.waitForLoadState('networkidle');

  await expect(page.getByTestId('search-grid')).toBeAttached();
});
});