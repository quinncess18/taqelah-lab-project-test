import { test, expect } from '@playwright/test';

test.describe('DELETE /items/{id} - Happy Path', () => {
  let testItemId: number;

  test.beforeEach(async ({ request }) => {
    // Create a fresh item to delete
    const response = await request.post('/items', {
      data: { name: 'Item to Delete', price: 99.99, quantity: 5 }
    });
    const createdItem = await response.json();
    testItemId = createdItem.id;
  });

  test('should delete an existing item and verify message', async ({ request }) => {
    const response = await request.delete(`/items/${testItemId}`);
    
    // Verify success status
    expect(response.status()).toBe(200);

    const responseData = await response.json();
    // Soft assertions for the response body
    expect.soft(responseData, 'Response should have message property').toHaveProperty('message');
    expect.soft(responseData.message, 'Success message mismatch').toBe('item deleted');
  });

  test('should not affect other items when one is deleted', async ({ request }) => {
    // Create a sibling item that should remain untouched
    const anotherItem = { name: 'Survivor Item', price: 10, quantity: 10 };
    const createRes = await request.post('/items', { data: anotherItem });
    const anotherItemId = (await createRes.json()).id;

    // Delete the target item
    await request.delete(`/items/${testItemId}`);

    // Workaround: Verify via GET all since GET by ID is broken
    const getAllResponse = await request.get('/items');
    const allItems = await getAllResponse.json();
    const foundItem = allItems.find((item: any) => item.id === anotherItemId);

    expect(foundItem, 'Survivor item should still exist in the list').toBeDefined();
    expect(foundItem.name).toBe(anotherItem.name);
  });

  test('should complete deletion within performance limits', async ({ request }) => {
    const start = Date.now();
    const response = await request.delete(`/items/${testItemId}`);
    const duration = Date.now() - start;

    expect(response.status()).toBe(200);
    // Ensure the API responds in under 500ms
    expect(duration, 'Response time was too slow').toBeLessThan(500);
  });
});