import { test, expect } from '@playwright/test';
import { CartPage, ShopPage } from '../pages';

test.use({ storageState: '.auth/taqelah-user.json' });

test.describe('Cart Management - Negative Scenarios @functional', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/taqelah-demo-site.html');
    await expect(page.getByTestId('logout-button')).toBeVisible();
    await page.evaluate(() => localStorage.setItem('taqelahCart', '[]'));
  });

  test('Cart shows empty state message when no items are added', async ({ page }) => {
    const shopPage = new ShopPage(page);
    const cartPage = new CartPage(page);

    await shopPage.openCart();
    
    await expect(page.locator('.cart-empty')).toContainText(/empty|Your cart is empty/i);
    await expect(cartPage.checkoutButton).toBeDisabled();
  });

  test('Cart count badge shows 0 when cart is empty', async ({ page }) => {
    const cartCount = page.getByTestId('cart-count');
    await expect(cartCount).toContainText('0');
  });

  test('User can remove all items from cart and see empty state', async ({ page }) => {
    const shopPage = new ShopPage(page);
    const cartPage = new CartPage(page);

    await shopPage.addProductToCart('Maxi Dress');
    await shopPage.hideToast();

    await shopPage.addProductToCart('Silk Cami');
    await shopPage.hideToast();

    await shopPage.openCart();

    const cartItems = page.locator('[data-testid^="cart-item-"]');
    await expect(cartItems.first()).toBeVisible();

    await cartPage.getCartItemByName('Maxi Dress').getByText('Remove').click();
    await page.waitForTimeout(300);
    await cartPage.getCartItemByName('Silk Cami').getByText('Remove').click();
    await page.waitForTimeout(300);

    await expect(cartItems).toHaveCount(0, { timeout: 5000 });
    await expect(page.locator('.cart-empty')).toContainText(/empty|Your cart is empty/i);
    await expect(cartPage.checkoutButton).toBeDisabled();
  });

  test('Clicking decrease button when quantity is 1 removes the item', async ({ page }) => {
    const shopPage = new ShopPage(page);
    const cartPage = new CartPage(page);

    await shopPage.addProductToCart('Maxi Dress');
    await shopPage.hideToast();

    await shopPage.openCart();

    const maxidDressItem = cartPage.getCartItemByName('Maxi Dress');
    await expect(maxidDressItem).toBeVisible();
    
    const decreaseButton = cartPage.getDecreaseButtonForCartItem(maxidDressItem);
    await expect(decreaseButton).toBeVisible();
    
    await decreaseButton.click();
    await page.waitForTimeout(300);
    
    await expect(page.locator('.cart-empty')).toContainText(/empty|Your cart is empty/i);
  });

  test('Adding product adds item to cart with correct count', async ({ page }) => {
    const shopPage = new ShopPage(page);

    await shopPage.addProductToCart('Maxi Dress');
    await shopPage.hideToast();

    await shopPage.openCart();
    
    const cartCount = await page.getByTestId('cart-count').textContent();
    const count = parseInt(cartCount!.trim());
    expect(count).toBeGreaterThanOrEqual(1);
    
    const itemCount = await page.locator('[data-testid^="cart-item-"]').count();
    expect(itemCount).toBeGreaterThanOrEqual(1);
  });

  test('Cart persists after page reload within same session', async ({ page }) => {
    const shopPage = new ShopPage(page);
    const cartPage = new CartPage(page);

    await shopPage.addProductToCart('Maxi Dress');
    await shopPage.hideToast();

    await page.waitForTimeout(500);

    await page.reload({ waitUntil: 'domcontentloaded' });
    await expect(page.getByTestId('logout-button')).toBeVisible();

    await shopPage.openCart();
    await expect(cartPage.getCartItemByName('Maxi Dress')).toBeVisible();
  });

  test('Close checkout modal and verify cart is preserved', async ({ page }) => {
    const shopPage = new ShopPage(page);
    const cartPage = new CartPage(page);

    await shopPage.addProductToCart('Maxi Dress');
    await shopPage.hideToast();

    await shopPage.openCart();
    await cartPage.checkoutButton.click();
    await expect(page.getByTestId('checkout-modal')).toBeVisible();

    await cartPage.closeCheckoutForm();
    await expect(page.getByTestId('checkout-modal')).not.toBeVisible();

    await shopPage.openCart();
    await expect(cartPage.getCartItemByName('Maxi Dress')).toBeVisible();
  });
});
