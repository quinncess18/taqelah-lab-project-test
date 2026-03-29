import { test, expect } from '@playwright/test';

test.describe('GET /items - Get All Items (Optimized)', () => {
  let response: any;
  let items: any[];

  // 1. Fetch data once before running the tests in this block
  test.beforeAll(async ({ playwright }) => {
    const apiRequest = await playwright.request.newContext();
    response = await apiRequest.get('/items');
    items = await response.json();
  });

  test('should return 200 and JSON content type', async () => {
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
  });

  test('should return a valid array of items', async () => {
    expect(Array.isArray(items)).toBeTruthy();
    expect(items.length).toBeGreaterThan(0);
  });

  test('should validate first item structure and types', async () => {
    const firstItem = items[0];
    const expectedProperties = ['id', 'name', 'description', 'price', 'quantity'];

    expectedProperties.forEach(prop => {
      expect(firstItem).toHaveProperty(prop);
    });

    expect(typeof firstItem.id).toBe('number');
    expect(typeof firstItem.name).toBe('string');
  });

  // Keep the forEach loop for deep data validation!
  test('should validate all items values in the list', async () => {
    items.forEach((item: any) => {
      expect(item.id, `Item ${item.id} should have positive ID`).toBeGreaterThan(0);
      expect(item.price).toBeGreaterThanOrEqual(0);
    });
  });
});