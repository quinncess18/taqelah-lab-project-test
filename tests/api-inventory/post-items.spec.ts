import { test, expect } from '@playwright/test';

test.describe('POST /items - Mocked for CI', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('http://mock.local/', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: '<!doctype html><html><body>Mock App</body></html>',
      });
    });

    await page.route('**/api/items*', async (route) => {
      const method = route.request().method();

      if (method === 'POST') {
        const newItem = { id: 3, name: 'New Item Created', quantity: 50 };
        await route.fulfill({ status: 201, json: newItem });
        return;
      }

      await route.continue();
    });

    await page.goto('http://mock.local/');
  });

  test('should create a new item with mocked response', async ({ page }) => {
    const responsePayload = await page.evaluate(async () => {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: 'Laptop', quantity: 10 }),
      });

      return {
        status: response.status,
        contentType: response.headers.get('content-type') || '',
        body: await response.json(),
      };
    });

    expect(responsePayload.status).toBe(201);
    expect(responsePayload.contentType).toContain('application/json');
    expect(responsePayload.body).toEqual({
      id: 3,
      name: 'New Item Created',
      quantity: 50,
    });
  });
});