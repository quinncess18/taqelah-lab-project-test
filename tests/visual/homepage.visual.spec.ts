import { test, expect } from '@playwright/test';

test.describe('Visual Regression - Homepage', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/taqelah-demo-site.html');
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
  });

  test('login page appearance', async ({ page }) => {
    // Full page screenshot
    await expect(page).toHaveScreenshot('login-page.png', {
      fullPage: true,
    });
  });

  test('login form elements', async ({ page }) => {
    // Screenshot of specific element
    const loginForm = page.locator('#loginPage');
    await expect(loginForm).toHaveScreenshot('login-form.png');
  });

  test('login button states', async ({ page }) => {
    const loginButton = page.getByTestId('login-button');

    // Default state
    await expect(loginButton).toHaveScreenshot('login-button-default.png');

    // Hover state
    await loginButton.hover();
    await expect(loginButton).toHaveScreenshot('login-button-hover.png');
  });
});