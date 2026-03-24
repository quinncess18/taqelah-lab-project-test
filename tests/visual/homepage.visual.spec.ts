import { test, expect } from '@playwright/test';

test.describe('Visual Regression - Homepage', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/taqelah-demo-site.html');
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    // Disable animations to prevent CI/Docker rendering differences
    await page.addInitScript(() => {
      document.documentElement.style.scrollBehavior = 'auto';
    });
  });

  test('login page appearance', async ({ page }) => {
    // Clear all overlays completely
    await page.locator('[role="dialog"], .modal, .notification').all().then(els => 
      Promise.all(els.map(el => el.evaluate(e => e.style.display = 'none')))
    );

    // Full page screenshot
    await expect(page).toHaveScreenshot('login-page.png', {
      fullPage: true,
      animations: 'disabled',
      mask: [page.locator('.timestamp'), page.locator('.dynamic-content')],
      maxDiffPixelRatio: 0.05,
    });
  });

  test('login form elements', async ({ page }) => {
    // Clear all overlays completely
    await page.locator('[role="dialog"], .modal, .notification').all().then(els => 
      Promise.all(els.map(el => el.evaluate(e => e.style.display = 'none')))
    );

    // Screenshot of specific element
    const loginForm = page.locator('#loginPage');
    await expect(loginForm).toHaveScreenshot('login-form.png', {
      animations: 'disabled',
      mask: [page.locator('.timestamp'), page.locator('.dynamic-content')],
      maxDiffPixelRatio: 0.05,
    });
  });

  test('login button states', async ({ page }) => {
    // Clear all overlays completely
    await page.locator('[role="dialog"], .modal, .notification').all().then(els => 
      Promise.all(els.map(el => el.evaluate(e => e.style.display = 'none')))
    );

    const loginButton = page.getByTestId('login-button');

    // Default state
    await expect(loginButton).toHaveScreenshot('login-button-default.png', {
      animations: 'disabled',
      maxDiffPixelRatio: 0.05,
    });

    // Hover state
    await loginButton.hover();
    await expect(loginButton).toHaveScreenshot('login-button-hover.png', {
      animations: 'disabled',
      maxDiffPixelRatio: 0.05,
    });
  });
});

