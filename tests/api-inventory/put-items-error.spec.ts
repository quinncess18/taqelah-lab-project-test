import { test, expect } from '@playwright/test';

test.describe('PUT /items/{id} — error scenarios', () => {

  test('should return 400 for a non-existent item ID', async ({ request }) => {
    const response = await request.put('/items/999999', {
      data: { name: 'Ghost', description: 'does not exist', price: 1, quantity: 1 },
    });
    const body = await response.json();

    expect(response.status()).toBe(400);
    expect(body.error).toBe('item not found');
  });

});
