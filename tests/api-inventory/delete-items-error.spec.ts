import { test, expect } from '@playwright/test';

test.describe('DELETE /items/{id} — error scenarios', () => {

  test('should return 404 for a non-existent item ID', async ({ request }) => {
    const response = await request.delete('/items/999999');
    const body = await response.json();

    expect(response.status()).toBe(404);
    expect(body.error).toBe('item not found');
  });

});
