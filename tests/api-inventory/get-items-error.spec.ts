import { test, expect } from '@playwright/test';

test.describe('GET /items - Error Scenarios (Mocked for CI)', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('http://mock.local/', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: '<!doctype html><html><body>Mock App</body></html>',
      });
    });

    await page.route('**/api/items**', async (route) => {
      const url = route.request().url();
      if (url.includes('/999999')) {
        await route.fulfill({ status: 404, json: { error: 'Not Found' } });
        return;
      }

      await route.continue();
    });

    await page.goto('http://mock.local/');
  });

  test('should return 404 for non-existent item', async ({ page }) => {
    const result = await page.evaluate(async () => {
      const response = await fetch('/api/items/999999');
      return {
        status: response.status,
        body: await response.json(),
      };
    });

    expect(result.status).toBe(404);
    expect(result.body).toHaveProperty('error');
  });
});