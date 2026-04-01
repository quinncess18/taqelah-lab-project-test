import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  readonly cartHeading: Locator;
  readonly checkoutButton: Locator;
  readonly closeCheckoutButton: Locator;
  readonly cartCount: Locator;
  readonly cartItems: Locator;
  readonly cartSubtotal: Locator;
  readonly cartTotal: Locator;

  constructor(page: Page) {
    super(page);
    this.cartHeading = page.getByRole('heading', { name: 'Shopping Cart' });
    this.checkoutButton = page.getByTestId('checkout-button');
    this.closeCheckoutButton = page.getByTestId('close-checkout-button');
    this.cartCount = page.getByTestId('cart-count');
    this.cartItems = page.getByTestId('cart-items');
    this.cartSubtotal = page.getByTestId('cart-subtotal').or(page.getByTestId('checkout-subtotal')).first();
    this.cartTotal = page.getByTestId('cart-total').or(page.getByTestId('checkout-total')).first();
  }

  cartItemName(productId: string): Locator {
    return this.page.getByTestId(`cart-item-name-${productId}`);
  }

  cartItemPrice(productId: string): Locator {
    return this.page.getByTestId(`cart-item-price-${productId}`);
  }

  removeItemButton(productId: string): Locator {
    return this.page.getByTestId(`remove-cart-item-${productId}`);
  }

  itemQuantityInput(productId: string): Locator {
    return this.page
      .getByTestId(`quantity-${productId}`)
      .or(this.page.getByTestId(`cart-item-${productId}`).getByTestId('quantity-input'))
      .first();
  }

  increaseQuantityButton(productId: string): Locator {
    return this.page.getByTestId(`increase-quantity-${productId}`);
  }

  decreaseQuantityButton(productId: string): Locator {
    return this.page.getByTestId(`decrease-quantity-${productId}`);
  }

  async closeCheckoutForm() {
    await this.closeCheckoutButton.click();
  }

  async getCartCount() {
    const countText = await this.cartCount.textContent();
    return parseInt(countText || '0', 10);
  }

  async getCartItems() {
    const items = await this.cartItems.locator('[data-testid^="cart-item-"]').all();
    return items;
  }

  async removeItem(productId: string) {
    const removeById = this.removeItemButton(productId);
    if (await removeById.isVisible().catch(() => false)) {
      await removeById.click();
      return;
    }

    await this.page.getByTestId(`cart-item-${productId}`).getByText('Remove').click();
  }

  async updateQuantity(productId: string, amount: number) {
    const quantityDisplay = this.itemQuantityInput(productId);
    await quantityDisplay.waitFor({ state: 'visible' });

    const currentText = (await quantityDisplay.textContent()) || '1';
    const current = parseInt(currentText.trim(), 10) || 1;
    const delta = amount - current;

    if (delta > 0) {
      for (let i = 0; i < delta; i++) {
        await this.increaseQuantityButton(productId).click();
      }
    }

    if (delta < 0) {
      for (let i = 0; i < Math.abs(delta); i++) {
        await this.decreaseQuantityButton(productId).click();
      }
    }
  }

  async getCartTotal() {
    const totalText = (await this.cartTotal.textContent()) || '';
    const numeric = totalText.replace(/[^\d.]/g, '');
    return parseFloat(numeric || '0');
  }
}