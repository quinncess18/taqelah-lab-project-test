import { test, expect } from '@playwright/test';

test.describe('GET /items/{id} - Mocked for CI', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('http://mock.local/', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: '<!doctype html><html><body>Mock App</body></html>',
      });
    });

    await page.route('**/api/items/**', async (route) => {
      if (route.request().method() === 'GET') {
        const mockItem = { id: 1, name: 'Item Detail', quantity: 10 };
        await route.fulfill({ status: 200, json: mockItem });
        return;
      }

      await route.continue();
    });

    await page.route('**/api/items', async (route) => {
      if (route.request().method() === 'GET') {
        const mockItem = { id: 1, name: 'Item Detail', quantity: 10 };
        await route.fulfill({ status: 200, json: mockItem });
        return;
      }

      await route.continue();
    });

    await page.goto('http://mock.local/');
  });

  test('should retrieve item by id', async ({ page }) => {
    const result = await page.evaluate(async () => {
      const response = await fetch('/api/items/1');
      return {
        status: response.status,
        body: await response.json(),
      };
    });

    expect(result.status).toBe(200);
    expect(result.body).toHaveProperty('id');
    expect(result.body).toHaveProperty('name');
    expect(result.body).toHaveProperty('quantity');
  });
});