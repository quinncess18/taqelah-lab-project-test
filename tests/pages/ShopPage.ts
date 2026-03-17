import { test, expect, Page, Locator } from '@playwright/test';

export class ShopPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly searchGrid: Locator;
  readonly cartIcon: Locator;
  readonly productDetailsAddToCart: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByTestId('search-input');
    this.searchGrid = page.getByTestId('search-grid');
    this.cartIcon = page.getByTestId('cart-icon');
    this.productDetailsAddToCart = page.getByTestId('product-details-add-to-cart');
  }

  async searchProduct(term: string) {
    await this.searchInput.click();
    await this.searchInput.fill(term);
  }

  async clickProduct(productTestId: string) {
    await this.searchGrid.getByTestId(productTestId).click();
  }

  async addToCart() {
    await this.productDetailsAddToCart.click();
  }

  async openCart() {
    await this.cartIcon.click();
  }
}