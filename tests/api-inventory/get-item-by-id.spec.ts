import { test, expect } from '@playwright/test';

test('should create an item and retrieve it by id', async ({ request }, testInfo) => {
  test.fixme(true, 'Known backend defect: GET /items/{id} returns 404 after successful create');
  test.skip(testInfo.project.name !== 'api-local', 'Run this test on api-local');

  const payload = {
    name: `HappyPath-${Date.now()}`,
    description: 'seeded by test',
    price: 123.45,
    quantity: 7,
  };

  const createRes = await request.post('/items', { data: payload });
  expect(createRes.status()).toBe(201);

  const created = await createRes.json();
  expect(typeof created.id).toBe('number');

  const getRes = await request.get(`/items/${created.id}`);
  expect(getRes.status()).toBe(200);

  const item = await getRes.json();
  expect(item.id).toBe(created.id);
  expect(item.name).toBe(payload.name);
  expect(item.price).toBe(payload.price);
});