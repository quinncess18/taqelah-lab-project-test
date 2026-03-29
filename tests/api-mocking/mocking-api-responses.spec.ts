import { test, expect } from '@playwright/test';

/**
 * Mocking Inventory API Responses for CI
 *
 * Demonstrates how to mock the /api/items endpoint responses
 * using page.route() for deterministic, backend-independent testing
 */

test.describe('Mocking Inventory API Responses', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to about:blank to establish a browser context for fetch interception
    await page.goto('about:blank');
  });

  test('Mock GET /api/items with custom data', async ({ page }) => {
    const mockItems = [
      { id: 1, name: 'Laptop', description: 'Gaming laptop', price: 999.99, quantity: 5 },
      { id: 2, name: 'Mouse', description: 'Wireless mouse', price: 29.99, quantity: 20 },
    ];

    await page.route('**/api/items', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockItems),
      });
    });

    // Trigger the mocked route via page context using evaluate
    const result = await page.evaluate(async () => {
      const response = await fetch('http://localhost:8080/api/items');
      return { status: response.status, data: await response.json() };
    });

    expect(result.status).toBe(200);
    expect(result.data).toHaveLength(2);
    expect(result.data[0].name).toBe('Laptop');
  });

  test('Mock GET /api/items with empty array', async ({ page }) => {
    await page.route('**/api/items', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    const result = await page.evaluate(async () => {
      const response = await fetch('http://localhost:8080/api/items');
      return { status: response.status, data: await response.json() };
    });

    expect(result.status).toBe(200);
    expect(result.data).toEqual([]);
  });

  test('Mock GET /api/items/{id} - item found', async ({ page }) => {
    const mockItem = { id: 1, name: 'Laptop', description: 'Gaming laptop', price: 999.99, quantity: 5 };

    await page.route('**/api/items/1', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockItem),
      });
    });

    const result = await page.evaluate(async () => {
      const response = await fetch('http://localhost:8080/api/items/1');
      return { status: response.status, data: await response.json() };
    });

    expect(result.status).toBe(200);
    expect(result.data.name).toBe('Laptop');
  });

  test('Mock GET /api/items/{id} - item not found (404)', async ({ page }) => {
    await page.route('**/api/items/999', (route) => {
      route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'item not found' }),
      });
    });

    const result = await page.evaluate(async () => {
      const response = await fetch('http://localhost:8080/api/items/999');
      return { status: response.status, data: await response.json() };
    });

    expect(result.status).toBe(404);
    expect(result.data.error).toBe('item not found');
  });

  test('Mock POST /api/items - create item', async ({ page }) => {
    await page.route('**/api/items', (route) => {
      if (route.request().method() === 'POST') {
        const requestBody = route.request().postDataJSON();
        route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ id: 100, ...requestBody }),
        });
      } else {
        route.continue();
      }
    });

    const newItem = { name: 'Keyboard', description: 'Mechanical keyboard', price: 79.99, quantity: 10 };
    const result = await page.evaluate(async (item) => {
      const response = await fetch('http://localhost:8080/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      return { status: response.status, data: await response.json() };
    }, newItem);

    expect(result.status).toBe(201);
    expect(result.data.id).toBe(100);
    expect(result.data.name).toBe('Keyboard');
  });

  test('Mock 500 Internal Server Error', async ({ page }) => {
    await page.route('**/api/items', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' }),
      });
    });

    const result = await page.evaluate(async () => {
      const response = await fetch('http://localhost:8080/api/items');
      return { status: response.status };
    });
    expect(result.status).toBe(500);
  });
});