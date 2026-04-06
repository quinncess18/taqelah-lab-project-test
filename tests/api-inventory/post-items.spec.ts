import { test, expect } from '@playwright/test';

test.describe('POST /items', () => {
  let createdId: number;

  test.afterEach(async ({ request }) => {
    if (createdId) await request.delete(`/items/${createdId}`);
  });

  test('should create a new item and return 201', async ({ request }) => {
    const payload = { name: 'Mechanical Keyboard', description: 'Tactile switches', price: 120, quantity: 8 };

    const response = await request.post('/items', { data: payload });
    const body = await response.json();
    createdId = body.id;

    expect(response.status()).toBe(201);
    expect(response.headers()['content-type']).toContain('application/json');
    expect(body.id).toBeDefined();
    expect(body.name).toBe(payload.name);
    expect(body.description).toBe(payload.description);
    expect(body.price).toBe(payload.price);
    expect(body.quantity).toBe(payload.quantity);
  });

});
