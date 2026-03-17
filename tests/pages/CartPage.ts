import { test, expect, Page, Locator } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartHeading: Locator;
  readonly checkoutButton: Locator;
  readonly closeCheckoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartHeading = page.getByRole('heading', { name: 'Shopping Cart' });
    this.checkoutButton = page.getByTestId('checkout-button');
    this.closeCheckoutButton = page.getByTestId('close-checkout-button');
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
}