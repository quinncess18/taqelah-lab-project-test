import { test, expect } from '@playwright/test';

/**
 * Monitoring Network Traffic for Inventory API
 *
 * Demonstrates how to monitor and track API calls
 */

test.describe('Monitoring Inventory API Traffic', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('about:blank');
    // Set up a default mock to prevent connection errors
    await page.route('**/items**', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });
  });

  test('Track all API requests', async ({ page }) => {
    const requests: string[] = [];

    page.on('request', (request) => {
      if (request.url().includes('/items')) {
        requests.push(`${request.method()} ${request.url()}`);
      }
    });

    // Make several API calls
    await page.evaluate(async () => {
      await fetch('http://localhost:8080/items');
      await fetch('http://localhost:8080/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Test', description: 'Test item', price: 10, quantity: 1 }),
      });
    });

    expect(requests.length).toBe(2);
    expect(requests[0]).toContain('GET');
    expect(requests[1]).toContain('POST');
  });

  test('Track API responses', async ({ page }) => {
    const responses: { url: string; status: number }[] = [];

    page.on('response', (response) => {
      if (response.url().includes('/items')) {
        responses.push({
          url: response.url(),
          status: response.status(),
        });
      }
    });

    await page.evaluate(async () => {
      await fetch('http://localhost:8080/items');
    });

    expect(responses.length).toBe(1);
    expect(responses[0].status).toBe(200);
  });

  test('Wait for specific API response', async ({ page }) => {
    // Start waiting for response before making request
    const responsePromise = page.waitForResponse((response) => response.url().includes('/items') && response.status() === 200);

    // Make the request (don't await, as we want to wait for response separately)
    page.evaluate(async () => {
      await fetch('http://localhost:8080/items');
    });

    // Wait for the response
    const response = await responsePromise;

    expect(response.status()).toBe(200);
  });

  test('Count requests by method', async ({ page }) => {
    const methodCounts: Record<string, number> = {};

    page.on('request', (request) => {
      if (request.url().includes('/items')) {
        const method = request.method();
        methodCounts[method] = (methodCounts[method] || 0) + 1;
      }
    });

    // Make various requests
    await page.evaluate(async () => {
      await fetch('http://localhost:8080/items');
      await fetch('http://localhost:8080/items');
      await fetch('http://localhost:8080/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Test', description: 'Test', price: 10, quantity: 1 }),
      });
    });

    expect(methodCounts['GET']).toBe(2);
    expect(methodCounts['POST']).toBe(1);
  });

  test('Track request timing', async ({ page }) => {
    let requestStart = 0;
    let responseEnd = 0;

    page.on('request', (request) => {
      if (request.url().includes('/items')) {
        requestStart = Date.now();
      }
    });

    page.on('response', (response) => {
      if (response.url().includes('/items')) {
        responseEnd = Date.now();
      }
    });

    await page.evaluate(async () => {
      await fetch('http://localhost:8080/items');
    });

    const duration = responseEnd - requestStart;
    expect(duration).toBeGreaterThanOrEqual(0);
    console.log(`Request duration: ${duration}ms`);
  });

  test('Verify request body content', async ({ page }) => {
    let capturedBody: any;

    page.on('request', (request) => {
      if (request.url().includes('/items') && request.method() === 'POST') {
        capturedBody = request.postDataJSON();
      }
    });

    const newItem = { name: 'Laptop', description: 'Gaming laptop', price: 999.99, quantity: 5 };
    await page.evaluate(async (item) => {
      await fetch('http://localhost:8080/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
    }, newItem);

    expect(capturedBody).toEqual(newItem);
  });
});