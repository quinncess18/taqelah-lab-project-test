import { test, expect } from '@playwright/test';

test.describe('PATCH /items/{id}', () => {
  let createdId: number;

  test.beforeEach(async ({ request }) => {
    const response = await request.post('/items', {
      data: { name: 'Patch Target', description: 'original desc', price: 75, quantity: 10 },
    });
    const body = await response.json();
    createdId = body.id;
  });

  test.afterEach(async ({ request }) => {
    await request.delete(`/items/${createdId}`);
  });

  test('should partially update an existing item', async ({ request }) => {
    const response = await request.patch(`/items/${createdId}`, {
      data: { quantity: 99 },
    });
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    expect(body.id).toBe(createdId);
    expect(body.quantity).toBe(99);
    // Unchanged fields should be preserved
    expect(body.name).toBe('Patch Target');
    expect(body.price).toBe(75);
  });

});
