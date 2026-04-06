import { test, expect } from '@playwright/test';

test.describe('DELETE /items/{id}', () => {
  let createdId: number;

  test.beforeEach(async ({ request }) => {
    const response = await request.post('/items', {
      data: { name: 'Delete Target', description: 'to be deleted', price: 25, quantity: 1 },
    });
    const body = await response.json();
    createdId = body.id;
  });

  test('should delete an existing item and return confirmation', async ({ request }) => {
    const response = await request.delete(`/items/${createdId}`);
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.message).toBe('item deleted');

    // Verify item no longer appears in the list
    const listResponse = await request.get('/items');
    const items = await listResponse.json();
    const found = items.find((i: { id: number }) => i.id === createdId);
    expect(found).toBeUndefined();
  });

});
