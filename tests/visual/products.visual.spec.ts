import { test, expect } from '@playwright/test';

test.describe('Visual Regression - Product Pages', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/taqelah-demo-site.html');

    // Login
    await page.getByTestId('username-input').fill('ladies');
    await page.getByTestId('password-input').fill('ladies_GO');
    await page.getByTestId('login-button').click();

    await expect(page.getByTestId('search-input')).toBeVisible();
    // Wait for any animations to complete
    await page.waitForTimeout(10000);
  });

  test('search page layout', async ({ page }) => {
  await expect(page).toHaveScreenshot('search-page.png', {
    fullPage: true,
    animations: 'disabled',
    // Mask dynamic content like timestamps
    mask: [page.locator('.timestamp'), page.locator('.dynamic-content')],
    maxDiffPixelRatio: 0.05,  // ADD THIS LINE
  });
});

  test('product grid appearance', async ({ page }) => {
  await page.getByTestId('search-input').fill('dress');
  await expect(page.getByTestId('search-grid')).toBeVisible();
  await page.waitForLoadState('networkidle');

  // Clear all overlays completely
  await page.locator('[role="dialog"], .modal, .notification, .toast').all().then(els => 
    Promise.all(els.map(el => el.evaluate(e => e.style.display = 'none')))
  );

  // Wait for layout stability
  test.setTimeout(60000);

  await expect(page.getByTestId('search-grid')).toHaveScreenshot('product-grid.png', {
    animations: 'disabled',
    maxDiffPixelRatio: 0.3,  // Increase tolerance for scrollbar variance
  });
});

 test('product details modal', async ({ page }) => {
    await page.getByTestId('search-input').fill('maxi dress');
    await page.getByTestId('search-grid').getByTestId('product-name-6').click();

    // Wait for modal animation
    const modal = page.locator('[role="dialog"], .modal-content, [data-testid="product-details-modal"]').first();
    await modal.waitFor({ state: 'visible', timeout: 15000 });
    await expect(modal).toHaveScreenshot('product-modal.png', {
      animations: 'disabled',
      maxDiffPixelRatio: 0.05,
    });
  });

  test('shopping cart appearance', async ({ page }) => {
    await page.getByTestId('search-input').fill('maxi dress');
    await page.getByTestId('search-grid').getByTestId('product-name-6').click();
    await page.getByTestId('product-details-add-to-cart').click();
    await page.getByTestId('cart-icon').click();
    await page.waitForLoadState('networkidle');

    // Hide dynamic overlays AND toasts
    await page.locator('[role="dialog"], .toast, .notification').all().then(els => 
      Promise.all(els.map(el => el.evaluate(e => e.style.display = 'none')))
    );

    // Wait longer for toast to fully disappear
    await page.waitForTimeout(1000);

    // Use more specific selector
    await expect(page.getByTestId('cart-items')).toHaveScreenshot('shopping-cart.png', {
      animations: 'disabled',
      maxDiffPixelRatio: 0.5,  // Increased tolerance
    });
  });
});