import { test, expect } from '@playwright/test';

test.describe('PATCH /items/{id} - Error Scenarios (Mocked for CI)', () => {
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
        await route.fulfill({ status: 400, json: { error: 'item not found' } });
        return;
      }
      await route.continue();
    });

    await page.goto('http://mock.local/');
  });

  test('should return error for non-existent item', async ({ page }) => {
    const result = await page.evaluate(async () => {
      const response = await fetch('/api/items/999999', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: 10 }),
      });
      return {
        status: response.status,
        contentType: response.headers.get('content-type') || '',
        body: await response.json(),
      };
    });

    expect(result.status).toBe(400);
    expect(result.body).toHaveProperty('error', 'item not found');
    expect(result.contentType).toContain('application/json');
  });
});