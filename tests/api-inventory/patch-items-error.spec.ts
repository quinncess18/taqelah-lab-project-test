import { test, expect } from '@playwright/test';

test.describe('PATCH /items/{id} — error scenarios', () => {

  test('should return 400 for a non-existent item ID', async ({ request }) => {
    const response = await request.patch('/items/999999', {
      data: { quantity: 10 },
    });
    const body = await response.json();

    expect(response.status()).toBe(400);
    expect(body.error).toBe('item not found');
  });

});
