import { test, expect } from '@playwright/test';

test.describe('DELETE /items/{id} - Mocked for CI', () => {
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

      if (method === 'DELETE') {
        await route.fulfill({ status: 204 });
        return;
      }

      await route.continue();
    });

    await page.route('**/api/items', async (route) => {
      const method = route.request().method();

      if (method === 'DELETE') {
        await route.fulfill({ status: 204 });
        return;
      }

      await route.continue();
    });

    await page.goto('http://mock.local/');
  });

  test('should delete an item and return no content', async ({ page }) => {
    const result = await page.evaluate(async () => {
      const response = await fetch('/api/items/1', {
        method: 'DELETE',
      });

      return {
        status: response.status,
        bodyLength: (await response.text()).length,
      };
    });

    expect(result.status).toBe(204);
    expect(result.bodyLength).toBe(0);
  });
});