import { test, expect } from '@playwright/test';

// GET /items/{id} is not a supported endpoint — returns 404 for all IDs.
// This test verifies a created item is retrievable by finding it in GET /items.

test.describe('GET /items — find by id', () => {
  let createdId: number;

  test.beforeEach(async ({ request }) => {
    const response = await request.post('/items', {
      data: { name: 'Find Me', description: 'retrieval test', price: 10, quantity: 3 },
    });
    const body = await response.json();
    createdId = body.id;
  });

  test.afterEach(async ({ request }) => {
    await request.delete(`/items/${createdId}`);
  });

  test('should find a created item by id in the items list', async ({ request }) => {
    const response = await request.get('/items');
    const items = await response.json();

    const found = items.find((i: { id: number }) => i.id === createdId);

    expect(found).toBeDefined();
    expect(found.name).toBe('Find Me');
    expect(found.description).toBe('retrieval test');
    expect(found.price).toBe(10);
    expect(found.quantity).toBe(3);
  });

});
