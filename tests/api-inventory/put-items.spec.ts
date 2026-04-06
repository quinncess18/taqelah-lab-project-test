import { test, expect } from '@playwright/test';

test.describe('PUT /items/{id}', () => {
  let createdId: number;

  test.beforeEach(async ({ request }) => {
    const response = await request.post('/items', {
      data: { name: 'Original Name', description: 'original desc', price: 50, quantity: 5 },
    });
    const body = await response.json();
    createdId = body.id;
  });

  test.afterEach(async ({ request }) => {
    await request.delete(`/items/${createdId}`);
  });

  test('should fully update an existing item', async ({ request }) => {
    const updated = { name: 'Updated Name', description: 'updated desc', price: 99, quantity: 20 };

    const response = await request.put(`/items/${createdId}`, { data: updated });
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    expect(body.id).toBe(createdId);
    expect(body.name).toBe(updated.name);
    expect(body.description).toBe(updated.description);
    expect(body.price).toBe(updated.price);
    expect(body.quantity).toBe(updated.quantity);
  });

});
