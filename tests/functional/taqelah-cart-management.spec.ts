import { test, expect } from '@playwright/test';
import { CartPage, ShopPage } from '../pages';

test.use({ storageState: '.auth/taqelah-user.json' });

test.describe('Cart Management @functional', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/taqelah-demo-site.html');
    await expect(page.getByTestId('logout-button')).toBeVisible();
    await page.evaluate(() => localStorage.setItem('taqelahCart', '[]'));
  });

  test('User can add multiple products, update quantity, remove an item, and keep totals consistent', async ({ page }) => {
    const shopPage = new ShopPage(page);
    const cartPage = new CartPage(page);

    await shopPage.addProductToCart('Maxi Dress');
    await shopPage.hideToast();

    await shopPage.addProductToCart('Wide Leg Pants');
    await shopPage.hideToast();

    await shopPage.openCart();
    await expect(cartPage.cartHeading).toBeVisible();
    await expect(cartPage.getCartItemByName('Maxi Dress')).toBeVisible();
    await expect(cartPage.getCartItemByName('Wide Leg Pants')).toBeVisible();

    const totalBefore = await cartPage.getCartTotal();
    
    const maxidDressItem = cartPage.getCartItemByName('Maxi Dress');
    await cartPage.updateQuantityByCartItem(maxidDressItem, 2);
    await expect(cartPage.cartTotal).toBeVisible();
    await page.waitForTimeout(500);
    const totalAfter = await cartPage.getCartTotal();
    expect(totalAfter).toBeGreaterThanOrEqual(totalBefore);

    await shopPage.hideToast();
    await page.waitForTimeout(300);
    const removeButton = maxidDressItem.getByText('Remove');
    await removeButton.click();
    await page.waitForTimeout(300);
    
    await expect(maxidDressItem).not.toBeVisible();
    await expect(cartPage.getCartItemByName('Wide Leg Pants')).toBeVisible();
    await expect(cartPage.checkoutButton).toBeVisible();
  });
});
