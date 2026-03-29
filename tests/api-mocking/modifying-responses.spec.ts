import { test, expect } from '@playwright/test';

/**
 * Modifying Responses for Inventory API
 *
 * Demonstrates how to mock and modify responses
 */

test.describe('Modifying Inventory API Responses', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('about:blank');
  });

  test('Fetch real response and add metadata', async ({ page }) => {
    // Since there's no real server, we'll mock the response and add metadata
    const mockItems = [
      { id: 1, name: 'Item 1', description: 'First item', price: 100, quantity: 10 },
    ];

    await page.route('**/items', async (route) => {
      // Simulate adding metadata to items
      const modifiedItems = mockItems.map((item: any) => ({
        ...item,
        fetchedAt: new Date().toISOString(),
        source: 'modified',
      }));

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(modifiedItems),
      });
    });

    const result = await page.evaluate(async () => {
      const response = await fetch('http://localhost:8080/items');
      return { status: response.status, data: await response.json() };
    });

    // Items should have the added metadata
    if (result.data.length > 0) {
      expect(result.data[0]).toHaveProperty('fetchedAt');
      expect(result.data[0].source).toBe('modified');
    }
  });

  test('Filter response data', async ({ page }) => {
    const mockItems = [
      { id: 1, name: 'Low Stock', description: 'Item', price: 100, quantity: 3 },
      { id: 2, name: 'High Stock', description: 'Item', price: 100, quantity: 10 },
      { id: 3, name: 'Medium Stock', description: 'Item', price: 100, quantity: 7 },
    ];

    await page.route('**/items', async (route) => {
      // Filter to only items with quantity > 5
      const filteredItems = mockItems.filter((item: any) => item.quantity > 5);

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(filteredItems),
      });
    });

    const result = await page.evaluate(async () => {
      const response = await fetch('http://localhost:8080/items');
      return { status: response.status, data: await response.json() };
    });

    // All returned items should have quantity > 5
    result.data.forEach((item: any) => {
      expect(item.quantity).toBeGreaterThan(5);
    });
  });

  test('Transform response structure', async ({ page }) => {
    const mockItems = [
      { id: 1, name: 'Item 1', description: 'First', price: 100, quantity: 10 },
      { id: 2, name: 'Item 2', description: 'Second', price: 200, quantity: 20 },
    ];

    await page.route('**/items', async (route) => {
      // Transform array to paginated response
      const paginatedResponse = {
        data: mockItems,
        pagination: {
          total: mockItems.length,
          page: 1,
          pageSize: mockItems.length,
        },
      };

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(paginatedResponse),
      });
    });

    const result = await page.evaluate(async () => {
      const response = await fetch('http://localhost:8080/items');
      return { status: response.status, data: await response.json() };
    });

    expect(result.data).toHaveProperty('data');
    expect(result.data).toHaveProperty('pagination');
    expect(result.data.pagination).toHaveProperty('total');
  });

  test('Add custom response headers', async ({ page }) => {
    let responseHeaders: Record<string, string> = {};

    await page.route('**/items', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        headers: {
          'X-Custom-Header': 'custom-value',
          'X-Response-Time': Date.now().toString(),
          'Access-Control-Expose-Headers': 'X-Custom-Header, X-Response-Time',
        },
        body: JSON.stringify([]),
      });
    });

    // Capture headers via response event
    page.on('response', (response) => {
      if (response.url().includes('/items')) {
        const headers = response.headers();
        responseHeaders = headers;
      }
    });

    await page.evaluate(async () => {
      await fetch('http://localhost:8080/items');
    });

    expect(responseHeaders['x-custom-header']).toBe('custom-value');
  });

  test('Simulate slow response', async ({ page }) => {
    await page.route('**/items', async (route) => {
      // Add 1 second delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{ id: 1, name: 'Delayed Item', description: 'Test', price: 10, quantity: 1 }]),
      });
    });

    const start = Date.now();
    const result = await page.evaluate(async () => {
      const response = await fetch('http://localhost:8080/items');
      return { status: response.status, data: await response.json() };
    });
    const duration = Date.now() - start;

    expect(result.status).toBe(200);
    expect(duration).toBeGreaterThanOrEqual(1000);
  });
});