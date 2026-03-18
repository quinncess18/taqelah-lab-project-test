import { test, expect, Page, Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartHeading: Locator;
  readonly checkoutButton: Locator;
  readonly closeCheckoutButton: Locator;
  readonly cartCount: Locator;
  readonly cartItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartHeading = page.getByRole('heading', { name: 'Shopping Cart' });
    this.checkoutButton = page.getByTestId('checkout-button');
    this.closeCheckoutButton = page.getByTestId('close-checkout-button');
    this.cartCount = page.getByTestId('cart-count');
    this.cartItems = page.getByTestId('cart-items');
  }

  cartItemName(productId: string): Locator {
    return this.page.getByTestId(`cart-item-name-${productId}`);
  }

  cartItemPrice(productId: string): Locator {
    return this.page.getByTestId(`cart-item-price-${productId}`);
  }

  async closeCheckoutForm() {
    await this.closeCheckoutButton.click();
  }

  async getCartCount() {
    const countText = await this.cartCount.textContent();
    return parseInt(countText || '0', 10);
  }

  async getCartItems() {
    const items = await this.cartItems.locator('cart-items').all();
    return items;
  }
}