import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(path: string) {
    await this.page.goto(path);
  }

  async wait(ms: number) {
    await this.page.waitForTimeout(ms);
  }

  // Asserts that the given locator is visible on the page
  async isElementVisible(locator: Locator) {
    await expect(locator).toBeVisible();
  }
}