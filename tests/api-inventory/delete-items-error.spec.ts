import { test, expect } from '@playwright/test';

test.describe('DELETE /items/{id} - Negative Path', () => {
  let testItemId: number;

  test.beforeEach(async ({ request }) => {
    const response = await request.post('/items', {
      data: { name: 'Temporary Item', price: 1, quantity: 1 }
    });
    testItemId = (await response.json()).id;
  });

  test('should return 404 when deleting a non-existent item', async ({ request }) => {
    const ghostId = 999999;
    const response = await request.delete(`/items/${ghostId}`);
    
    // API should return Not Found
    expect(response.status()).toBe(404);
  });

  test('should return 404 when deleting an item that was already deleted', async ({ request }) => {
    // First deletion (Happy Path)
    await request.delete(`/items/${testItemId}`);

    // Second deletion (Should fail)
    const secondDeleteResponse = await request.delete(`/items/${testItemId}`);
    expect(secondDeleteResponse.status()).toBe(404);
  });
});