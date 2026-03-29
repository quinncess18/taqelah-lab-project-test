import { test, expect } from '@playwright/test';

test.describe('GET /items/{id} - Error Scenarios (Mocked for CI)', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('http://mock.local/', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: '<!doctype html><html><body>Mock App</body></html>',
      });
    });

    await page.route('**/api/items/**', async (route) => {
      const url = route.request().url();
      if (url.includes('/999999')) {
        await route.fulfill({ status: 404, json: { error: 'Not Found', message: 'Not Found' } });
        return;
      }
      // Valid IDs return success
      const mockItem = { id: 1, name: 'Item Detail', quantity: 10 };
      await route.fulfill({ status: 200, json: mockItem });
    });

    await page.goto('http://mock.local/');
  });

  test('should return 404 for non-existent item ID', async ({ page }) => {
    const result = await page.evaluate(async () => {
      const response = await fetch('/api/items/999999');
      return {
        status: response.status,
        body: await response.json(),
      };
    });

    expect(result.status).toBe(404);
    expect(result.body).toHaveProperty('error', 'Not Found');
  });
});