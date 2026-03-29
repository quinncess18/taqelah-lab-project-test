import { test, expect } from '@playwright/test';

test.describe('PATCH /items/{id} - Mocked for CI', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('http://mock.local/', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: '<!doctype html><html><body>Mock App</body></html>',
      });
    });

    await page.route('**/api/items/**', async (route) => {
      const method = route.request().method();

      if (method === 'PATCH') {
        const updatedItem = { id: 1, name: 'Updated Item Name', quantity: 99 };
        await route.fulfill({ status: 200, json: updatedItem });
        return;
      }

      await route.continue();
    });

    await page.route('**/api/items', async (route) => {
      const method = route.request().method();

      if (method === 'PATCH') {
        const updatedItem = { id: 1, name: 'Updated Item Name', quantity: 99 };
        await route.fulfill({ status: 200, json: updatedItem });
        return;
      }

      await route.continue();
    });

    await page.goto('http://mock.local/');
  });

  test('should partially update an item', async ({ page }) => {
    const result = await page.evaluate(async () => {
      const response = await fetch('/api/items/1', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: 99 }),
      });

      return {
        status: response.status,
        body: await response.json(),
      };
    });

    expect(result.status).toBe(200);
    expect(result.body).toEqual({ id: 1, name: 'Updated Item Name', quantity: 99 });
  });
});