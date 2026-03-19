import { test, expect } from '@playwright/test';

test.describe('Login Smoke Tests', () => {

  test('should display login form', async ({ page }) => {
    await page.goto('/taqelah-demo-site.html');

    await expect(page.getByTestId('username-input')).toBeVisible();
    await expect(page.getByTestId('password-input')).toBeVisible();
    await expect(page.getByTestId('login-button')).toBeVisible();
  });

  test('should login with valid credentials', async ({ page }) => {
    await page.goto('/taqelah-demo-site.html');

    await page.getByTestId('username-input').fill('ladies');
    await page.getByTestId('password-input').fill('ladies_GO');
    await page.getByTestId('login-button').click();

    // Verify successful login
    await expect(page.getByTestId('search-input')).toBeVisible();
  });

  test('should show validation error for invalid username', async ({ page }) => {
    await page.goto('/taqelah-demo-site.html');

    // Username must be exactly 6 letters
    await page.getByTestId('username-input').fill('test');
    await page.getByTestId('password-input').fill('test_GO');

    // Check for validation feedback
    await expect(page.getByTestId('username-input')).toHaveAttribute('class', /invalid|error/);
  });
});