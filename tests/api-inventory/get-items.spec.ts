import { test, expect } from '@playwright/test';

test.describe('GET /items', () => {

  test('should return 200 and JSON content type', async ({ request }) => {
    const response = await request.get('/items');

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
  });

  test('should return a valid array of items', async ({ request }) => {
    const response = await request.get('/items');
    const items = await response.json();

    expect(Array.isArray(items)).toBeTruthy();
    expect(items.length).toBeGreaterThan(0);

    const item = items[0];
    expect(item).toHaveProperty('id');
    expect(item).toHaveProperty('name');
    expect(item).toHaveProperty('description');
    expect(item).toHaveProperty('price');
    expect(item).toHaveProperty('quantity');
  });

});
