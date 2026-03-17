import { test, expect } from '@playwright/test';

test.use({ storageState: '.auth/taqelah-user.json' });

// Desktop tests - skip on mobile
test.describe('Desktop Shopping Experience', () => {
  test.beforeEach(async ({ page, isMobile }) => {
    test.skip(isMobile, 'This test is for desktop only');
    await page.goto('/taqelah-demo-site.html');
    await expect(page.getByTestId('logout-button')).toBeVisible();
    await expect(page.getByText('Spring Collection 2025')).toBeVisible();
  });

  test('User can add first item to cart and proceed to checkout form', async ({ page }) => {
    await page.getByTestId('search-input').fill('maxi dress');

    const searchGrid = page.getByTestId('search-grid');
    await expect(searchGrid).toBeVisible();
    await searchGrid.scrollIntoViewIfNeeded();
    await expect(searchGrid.getByRole('img', { name: 'Maxi Dress' })).toBeVisible();
    
    await searchGrid.getByRole('button', { name: 'Add to Cart' }).click();

    await page.getByTestId('cart-icon').scrollIntoViewIfNeeded();
    await page.getByTestId('cart-icon').click();

    const cartItems = page.getByTestId('cart-items');
    await expect(cartItems).toBeVisible();
    await expect(cartItems.getByText('Maxi Dress')).toBeVisible();

    await page.getByTestId('checkout-button').click();
    await expect(page.getByTestId('checkout-form')).toBeVisible();

    // Take full-page screenshot for visual verification of desktop layout
    await page.screenshot({ path: 'desktop-checkout-view.png', fullPage: true });
  });
});

// Mobile tests - skip on desktop
test.describe('Mobile Shopping Experience', () => {
  test.beforeEach(async ({ page, isMobile }) => {
    test.skip(!isMobile, 'This test is for mobile only');
    await page.goto('/taqelah-demo-site.html');
    await expect(page.getByTestId('logout-button')).toBeVisible();
    await expect(page.getByText('Spring Collection 2025')).toBeVisible();
  });

  test('User can add first item to cart and proceed to checkout form on mobile view', async ({ page }) => {
    // Verify search input is visible
    await expect(page.getByTestId('search-input')).toBeVisible();
    await page.getByTestId('search-input').fill('maxi dress');

    const searchGrid = page.getByTestId('search-grid');
    await expect(searchGrid).toBeVisible();
    await searchGrid.scrollIntoViewIfNeeded();
    await expect(searchGrid.getByRole('img', { name: 'Maxi Dress' })).toBeVisible();
    
    // Use click for mobile interaction (works on all devices via actionability checks)
    await searchGrid.getByRole('button', { name: 'Add to Cart' }).click();

    // Navigate to cart
    const cartIcon = page.getByTestId('cart-icon');
    await cartIcon.scrollIntoViewIfNeeded();
    await cartIcon.click();

    const cartItems = page.getByTestId('cart-items');
    await expect(cartItems).toBeVisible();
    await expect(cartItems.getByText('Maxi Dress')).toBeVisible();

    // Proceed to checkout
    await page.getByTestId('checkout-button').click();
    await expect(page.getByTestId('checkout-form')).toBeVisible();

    // Take full-page screenshot for visual verification of mobile layout
    await page.screenshot({ path: 'mobile-checkout-view.png', fullPage: true });
  });
});