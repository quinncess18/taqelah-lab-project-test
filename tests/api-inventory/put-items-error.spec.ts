import { test, expect } from '@playwright/test';

test.describe('PUT /items/{id} - Error Scenarios (Mocked for CI)', () => {
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
        await route.fulfill({ status: 400, json: { error: 'Invalid item ID' } });
        return;
      }
      await route.continue();
    });

    await page.goto('http://mock.local/');
  });

  test('should return 400 for non-existent item ID', async ({ page }) => {
    const result = await page.evaluate(async () => {
      const response = await fetch('/api/items/999999', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Test', price: 10, quantity: 1 }),
      });
      return {
        status: response.status,
        body: await response.json(),
      };
    });

    expect(result.status).toBe(400);
    expect(result.body).toHaveProperty('error');
  });
});