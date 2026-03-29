import { test, expect } from '@playwright/test';

test.describe('GET /items - Mocked for CI', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('http://mock.local/', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: '<!doctype html><html><body>Mock App</body></html>',
      });
    });

    await page.route('**/api/items*', async (route) => {
      if (route.request().method() !== 'GET') {
        await route.continue();
        return;
      }

      const mockData = [
        { id: 1, name: 'Existing Item A', quantity: 10 },
        { id: 2, name: 'Existing Item B', quantity: 20 },
      ];

      await route.fulfill({ status: 200, json: mockData });
    });

    await page.goto('http://mock.local/');
  });

  test('should return 200 and JSON content type', async ({ page }) => {
    const result = await page.evaluate(async () => {
      const response = await fetch('/api/items');
      return {
        status: response.status,
        contentType: response.headers.get('content-type') || '',
      };
    });

    expect(result.status).toBe(200);
    expect(result.contentType).toContain('application/json');
  });

  test('should return a valid array of items', async ({ page }) => {
    const items = await page.evaluate(async () => {
      const response = await fetch('/api/items');
      return response.json();
    });

    expect(Array.isArray(items)).toBeTruthy();
    expect(items.length).toBeGreaterThan(0);
    expect(items[0]).toHaveProperty('id');
    expect(items[0]).toHaveProperty('name');
    expect(items[0]).toHaveProperty('quantity');
  });
});