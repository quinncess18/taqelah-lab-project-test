import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly cartHeading: Locator;
  readonly checkoutButton: Locator;
  readonly closeCheckoutButton: Locator;
  readonly cartCount: Locator;
  readonly cartItems: Locator;
  readonly cartTotal: Locator;

  constructor(page: Page) {
    super(page);
    this.cartHeading = page.getByRole('heading', { name: 'Shopping Cart' });
    this.checkoutButton = page.getByTestId('checkout-button');
    this.closeCheckoutButton = page.getByTestId('close-checkout-button');
    this.cartCount = page.getByTestId('cart-count');
    this.cartItems = page.getByTestId('cart-items');
    this.cartTotal = page.getByTestId('cart-total').or(page.getByTestId('checkout-total')).first();
  }

  getCartItemByName(productName: string): Locator {
    return this.cartItems.locator('[data-testid^="cart-item-"]').filter({ hasText: new RegExp(productName, 'i') }).first();
  }

  getDecreaseButtonForCartItem(cartItem: Locator): Locator {
    return cartItem.getByTestId(/^decrease-quantity/i)
      .or(cartItem.locator('button').filter({ hasText: /[-–]/ }))
      .first();
  }

  getIncreaseButtonForCartItem(cartItem: Locator): Locator {
    return cartItem.getByTestId(/^increase-quantity/i)
      .or(cartItem.locator('button').filter({ hasText: /[+]/ }))
      .first();
  }

  async updateQuantityByCartItem(cartItem: Locator, amount: number) {
    const quantityDisplay = cartItem.locator('[data-testid*="quantity"], [data-testid*="qty"], input[type="number"]').first();
    await quantityDisplay.waitFor({ state: 'visible' });

    const currentText = (await quantityDisplay.textContent()) || (await quantityDisplay.inputValue()) || '1';
    const current = parseInt(currentText.trim(), 10) || 1;
    const delta = amount - current;

    if (delta > 0) {
      for (let i = 0; i < delta; i++) {
        const increaseBtn = this.getIncreaseButtonForCartItem(cartItem);
        await increaseBtn.click();
        await this.page.waitForTimeout(200);
      }
    }

    if (delta < 0) {
      for (let i = 0; i < Math.abs(delta); i++) {
        const decreaseBtn = this.getDecreaseButtonForCartItem(cartItem);
        await decreaseBtn.click();
        await this.page.waitForTimeout(200);
      }
    }
  }

  async closeCheckoutForm() {
    await this.closeCheckoutButton.click();
  }

  async getCartTotal() {
    const totalText = (await this.cartTotal.textContent()) || '';
    const numeric = totalText.replace(/[^\d.]/g, '');
    return parseFloat(numeric || '0');
  }
}