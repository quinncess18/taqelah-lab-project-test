import { expect, Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ShopPage extends BasePage {
  readonly searchInput: Locator;
  readonly searchGrid: Locator;
  readonly confirmationMessage: Locator;
  readonly cartIcon: Locator;
  readonly productDetailsTitle: Locator;
  readonly productDetailsAddToCart: Locator;

  constructor(page: Page) {
    super(page);
    this.searchInput = page.getByTestId('search-input');
    this.searchGrid = page.getByTestId('search-grid');
    this.confirmationMessage = page.getByTestId('toast-message');
    this.cartIcon = page.getByTestId('cart-icon');
    this.productDetailsTitle = page.locator('[data-testid="product-details-title"]:visible').first();
    this.productDetailsAddToCart = page.locator('[data-testid="product-details-add-to-cart"]:visible').first();
  }

  private async hideToastIfPresent() {
    await this.page.evaluate(() => {
      const toast = document.getElementById('toastMessage');
      if (toast && toast.parentElement) {
        (toast.parentElement as HTMLElement).style.display = 'none';
      }
    });
  }

  async searchProduct(term: string) {
    await expect(this.searchInput).toBeVisible();
    await this.searchInput.fill('');
    await this.searchInput.fill(term);
  }

  async clickProduct(productTestId: string) {
    await this.searchGrid.getByTestId(productTestId).click();
  }

  async addToCart() {
    await this.productDetailsAddToCart.click();
  }

  async addProductToCart(productName: string) {
    await this.hideToastIfPresent();
    await this.searchProduct(productName);
    await expect(this.searchGrid).toBeVisible();

    const imageCard = this.searchGrid.getByRole('img', { name: new RegExp(productName, 'i') }).first();
    if (await imageCard.isVisible().catch(() => false)) {
      await imageCard.click();
    } else {
      await this.searchGrid.getByText(new RegExp(productName, 'i')).first().click();
    }

    await expect(this.productDetailsTitle).toBeVisible();
    await expect(this.productDetailsAddToCart).toBeVisible();
    await expect(this.productDetailsAddToCart).toBeEnabled();
    await this.productDetailsAddToCart.scrollIntoViewIfNeeded();
    await this.hideToastIfPresent();
    await this.productDetailsAddToCart.click({ trial: true });
    await this.productDetailsAddToCart.click();
  }

  async getConfirmationMessage(): Promise<string> {
    await expect(this.confirmationMessage).toBeVisible();
    return this.confirmationMessage.innerText();
  }

  async openCart() {
    await this.hideToastIfPresent();
    await this.cartIcon.click();
  }
}