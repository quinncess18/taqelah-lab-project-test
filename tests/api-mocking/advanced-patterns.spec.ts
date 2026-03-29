import { test, expect } from '@playwright/test';

/**
 * Advanced Mocking Patterns for Inventory API
 *
 * Demonstrates advanced techniques like stateful mocks and conditional responses
 */

test.describe('Advanced Inventory API Mocking Patterns', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('about:blank');
  });

  test('Stateful mock - simulate full CRUD operations', async ({ page }) => {
    // In-memory store
    let items = [
      { id: 1, name: 'Initial Item', description: 'First item', price: 100, quantity: 10 },
    ];
    let nextId = 2;

    // Handle /items endpoint
    await page.route('**/items', (route) => {
      const method = route.request().method();

      if (method === 'GET') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(items),
        });
      } else if (method === 'POST') {
        const newItem = { id: nextId++, ...route.request().postDataJSON() };
        items.push(newItem);
        route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify(newItem),
        });
      } else {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([]),
        });
      }
    });

    // Handle /items/{id} endpoint
    await page.route(/\/items\/\d+$/, (route) => {
      const method = route.request().method();
      const id = parseInt(route.request().url().split('/').pop() || '0');

      if (method === 'GET') {
        const item = items.find((i) => i.id === id);
        if (item) {
          route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(item) });
        } else {
          route.fulfill({ status: 404, contentType: 'application/json', body: JSON.stringify({ error: 'item not found' }) });
        }
      } else if (method === 'PUT') {
        const index = items.findIndex((i) => i.id === id);
        if (index !== -1) {
          items[index] = { id, ...route.request().postDataJSON() };
          route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(items[index]) });
        } else {
          route.fulfill({ status: 404, contentType: 'application/json', body: JSON.stringify({ error: 'item not found' }) });
        }
      } else if (method === 'DELETE') {
        const index = items.findIndex((i) => i.id === id);
        if (index !== -1) {
          items.splice(index, 1);
          route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ message: 'item deleted' }) });
        } else {
          route.fulfill({ status: 404, contentType: 'application/json', body: JSON.stringify({ error: 'item not found' }) });
        }
      } else {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([]),
        });
      }
    });

    // Test the stateful mock
    // GET all items
    let result = await page.evaluate(async () => {
      const response = await fetch('http://localhost:8080/items');
      return { status: response.status, data: await response.json() };
    });
    expect(result.data).toHaveLength(1);

    // POST new item
    result = await page.evaluate(async () => {
      const response = await fetch('http://localhost:8080/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'New Item', description: 'Added item', price: 50, quantity: 5 }),
      });
      return { status: response.status, data: await response.json() };
    });
    expect(result.data.id).toBe(2);

    // GET all items - should have 2 now
    result = await page.evaluate(async () => {
      const response = await fetch('http://localhost:8080/items');
      return { status: response.status, data: await response.json() };
    });
    expect(result.data).toHaveLength(2);

    // DELETE item
    const deleteResult = await page.evaluate(async () => {
      const response = await fetch('http://localhost:8080/items/1', { method: 'DELETE' });
      return { status: response.status };
    });
    expect(deleteResult.status).toBe(200);

    // GET all items - should have 1 now
    result = await page.evaluate(async () => {
      const response = await fetch('http://localhost:8080/items');
      return { status: response.status, data: await response.json() };
    });
    expect(result.data).toHaveLength(1);
  });

  test('Mock with request counter', async ({ page }) => {
    let requestCount = 0;

    await page.route('**/items', (route) => {
      requestCount++;
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          items: [],
          meta: { requestNumber: requestCount },
        }),
      });
    });

    // Make multiple requests
    await page.evaluate(async () => {
      await fetch('http://localhost:8080/items');
      await fetch('http://localhost:8080/items');
      await fetch('http://localhost:8080/items');
    });

    expect(requestCount).toBe(3);
  });

  test('Conditional mock based on request content', async ({ page }) => {
    await page.route('**/items', (route) => {
      if (route.request().method() === 'POST') {
        const data = route.request().postDataJSON();

        // Validate required fields
        if (!data?.name || data.price === undefined) {
          route.fulfill({
            status: 400,
            contentType: 'application/json',
            body: JSON.stringify({ error: 'name and price are required' }),
          });
          return;
        }

        // Validate price is positive
        if (data.price <= 0) {
          route.fulfill({
            status: 400,
            contentType: 'application/json',
            body: JSON.stringify({ error: 'price must be positive' }),
          });
          return;
        }

        // Success
        route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ id: 1, ...data }),
        });
      } else {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([]),
        });
      }
    });

    // Test validation - missing name
    let result = await page.evaluate(async () => {
      const response = await fetch('http://localhost:8080/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: 100, quantity: 1 }),
      });
      return { status: response.status };
    });
    expect(result.status).toBe(400);

    // Test validation - negative price
    result = await page.evaluate(async () => {
      const response = await fetch('http://localhost:8080/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Test', description: 'Test', price: -10, quantity: 1 }),
      });
      return { status: response.status };
    });
    expect(result.status).toBe(400);

    // Test success
    result = await page.evaluate(async () => {
      const response = await fetch('http://localhost:8080/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Test', description: 'Test', price: 100, quantity: 1 }),
      });
      return { status: response.status };
    });
    expect(result.status).toBe(201);
  });

  test('Mock with fallback to real API', async ({ page }) => {
    await page.route('**/items/**', async (route) => {
      const url = route.request().url();
      const itemId = url.split('/').pop();

      // Mock specific ID, let others through (but we'll mock them too since no real server)
      if (itemId === '999') {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ id: 999, name: 'Mocked Item', description: 'This is mocked', price: 0, quantity: 0 }),
        });
      } else {
        // Mock other IDs with a generic response (simulating fallback)
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ id: parseInt(itemId || '0'), name: 'Fallback Item', description: 'Fallback', price: 10, quantity: 1 }),
        });
      }
    });

    // This will return mocked data
    const result = await page.evaluate(async () => {
      const response = await fetch('http://localhost:8080/items/999');
      return { status: response.status, data: await response.json() };
    });
    expect(result.data.name).toBe('Mocked Item');
  });

  test('Simulate network failure', async ({ page }) => {
    await page.route('**/items', (route) => {
      route.abort('failed');
    });

    const result = await page.evaluate(async () => {
      try {
        await fetch('http://localhost:8080/items');
        return { error: false };
      } catch (error: any) {
        return { error: true, message: error.message };
      }
    });

    expect(result.error).toBe(true);
  });
});