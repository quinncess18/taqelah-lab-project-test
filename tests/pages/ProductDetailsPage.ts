import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductDetailsPage extends BasePage {
  readonly productName: Locator;
  readonly productPrice: Locator;
  readonly productDescription: Locator;
  readonly addToCartButton: Locator;

  constructor(page: Page) {
    super(page);
    this.productName = page.getByTestId('product-details-title');
    this.productPrice = page.getByTestId('product-details-price');
    this.productDescription = page.getByTestId('product-details-description');
    this.addToCartButton = page.getByTestId('product-details-add-to-cart');
  }

  async expectProductDetailsToBeVisible() {
    await expect(this.productName).toBeVisible();
    await expect(this.productPrice).toBeVisible();
    await expect(this.productDescription).toBeVisible();
    await expect(this.addToCartButton).toBeVisible();
  }
}