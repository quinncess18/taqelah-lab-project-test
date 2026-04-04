import { expect, Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ShopPage extends BasePage {
  readonly searchInput: Locator;
  readonly searchGrid: Locator;
  readonly confirmationMessage: Locator;
  readonly cartIcon: Locator;
  readonly cartCount: Locator;
  readonly productDetailsAddToCart: Locator;
  readonly productDetailsModal: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.getByTestId('search-input');
    this.searchGrid = page.getByTestId('search-grid');
    this.confirmationMessage = page.getByTestId('toast-message');
    this.cartIcon = page.getByTestId('cart-icon');
    this.cartCount = page.getByTestId('cart-count');
    this.productDetailsModal = page.getByTestId('product-details-modal');
    this.productDetailsAddToCart = page.locator('[data-testid="product-details-modal"] [data-testid="product-details-add-to-cart"]').first();
  }

  async hideToast() {
    await this.page.evaluate(() => {
      const toast = document.getElementById('toastMessage');
      if (toast?.parentElement) {
        toast.parentElement.style.display = 'none';
      }
    });
  }

  async searchProduct(term: string) {
    await expect(this.searchInput).toBeVisible();
    await this.searchInput.fill('');
    await this.searchInput.fill(term);
  }

  async addProductToCart(productName: string): Promise<string> {
    await this.searchProduct(productName);
    await expect(this.searchGrid).toBeVisible();

    const productCard = this.searchGrid
      .locator('[data-testid*="product"], [data-testid*="card"]')
      .filter({ has: this.page.getByText(new RegExp(productName, 'i')) })
      .first();

    if (await productCard.isVisible({ timeout: 5000 }).catch(() => false)) {
      await productCard.click();
    } else {
      await this.searchGrid.getByText(new RegExp(productName, 'i')).first().click();
    }

    await expect(this.productDetailsModal).toBeVisible({ timeout: 10000 });
    await this.productDetailsAddToCart.scrollIntoViewIfNeeded();
    await this.productDetailsAddToCart.click();

    return this.getConfirmationMessage();
  }

  async getConfirmationMessage(): Promise<string> {
    const handle = await this.page.waitForFunction(
      () => document.getElementById('toastMessage')?.textContent?.trim() || null,
      { timeout: 10000 }
    );
    return String(await handle.jsonValue());
  }

  async openCart() {
    await this.hideToast();
    await this.cartIcon.click();
  }
}