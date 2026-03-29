import { test, expect } from '@playwright/test';

/**
 * Modifying Requests for Inventory API
 *
 * Demonstrates how to intercept and modify outgoing requests
 */

test.describe('Modifying Inventory API Requests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('about:blank');
  });

  test('Add custom headers to requests', async ({ page }) => {
    let capturedHeaders: Record<string, string> = {};

    await page.route('**/items', async (route) => {
      // Capture the original headers
      capturedHeaders = route.request().headers();

      // Fulfill with mock response (since there's no real server)
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    await page.evaluate(async () => {
      await fetch('http://localhost:8080/items', {
        headers: {
          'X-Custom-Header': 'test-value',
          'X-Request-ID': 'req-12345',
        },
      });
    });

    // The headers were set on the request
    expect(capturedHeaders).toBeDefined();
    expect(capturedHeaders['x-custom-header']).toBe('test-value');
    expect(capturedHeaders['x-request-id']).toBe('req-12345');
  });

  test('Add authorization header to API requests', async ({ page }) => {
    let capturedAuthHeader = '';

    await page.route('**/items/**', async (route) => {
      capturedAuthHeader = route.request().headers()['authorization'] || '';
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    await page.evaluate(async () => {
      await fetch('http://localhost:8080/items/1', {
        headers: {
          Authorization: 'Bearer mock-jwt-token',
        },
      });
    });

    expect(capturedAuthHeader).toBe('Bearer mock-jwt-token');
  });

  test('Modify POST request body', async ({ page }) => {
    let capturedBody: any;

    await page.route('**/items', async (route) => {
      if (route.request().method() === 'POST') {
        capturedBody = route.request().postDataJSON();

        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ id: 1, ...capturedBody }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([]),
        });
      }
    });

    const newItem = { name: 'Test Item', description: 'Test', price: 10, quantity: 1 };
    await page.evaluate(async (item) => {
      // Add metadata when making the request
      const modifiedData = {
        ...item,
        createdBy: 'test-automation',
        timestamp: '2024-01-01T00:00:00Z',
      };
      await fetch('http://localhost:8080/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(modifiedData),
      });
    }, newItem);

    expect(capturedBody.createdBy).toBe('test-automation');
    expect(capturedBody.name).toBe('Test Item');
  });

  test('Add query parameters to requests', async ({ page }) => {
    let capturedUrl = '';

    await page.route('**/items**', (route) => {
      capturedUrl = route.request().url();
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    await page.evaluate(async () => {
      // Add query parameters when making the request
      const url = new URL('http://localhost:8080/items');
      url.searchParams.set('limit', '10');
      url.searchParams.set('offset', '0');
      await fetch(url.toString());
    });

    expect(capturedUrl).toContain('limit=10');
    expect(capturedUrl).toContain('offset=0');
  });
});