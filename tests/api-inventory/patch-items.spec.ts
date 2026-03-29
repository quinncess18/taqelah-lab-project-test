import { test, expect } from '@playwright/test';

test.describe('PATCH /items/{id} - Happy Path', () => {
  let testItemId: number;
  const originalItemData = {
    name: 'Original Patch Item',
    description: 'Original description for patch',
    price: 100.0,
    quantity: 10
  };

  test.beforeEach(async ({ request }) => {
    // Create a fresh item to ensure we have a valid ID to partially update
    const response = await request.post('/items', {
      data: originalItemData
    });

    const createdItem = await response.json();
    testItemId = createdItem.id;
  });

  test('should partially update only the name', async ({ request }) => {
    const patchData = { name: 'Updated Name Only' };

    const response = await request.patch(`/items/${testItemId}`, {
      data: patchData
    });

    expect(response.status()).toBe(200);
    const updatedItem = await response.json();

    // Soft assertions to verify the update and preservation of other fields
    expect.soft(updatedItem.name, 'Name update failed').toBe(patchData.name);
    expect.soft(updatedItem.description, 'Description should be unchanged').toBe(originalItemData.description);
    expect.soft(updatedItem.price, 'Price should be unchanged').toBe(originalItemData.price);
    expect.soft(updatedItem.quantity, 'Quantity should be unchanged').toBe(originalItemData.quantity);
  });

  test('should partially update multiple fields but not all', async ({ request }) => {
    const patchData = {
      price: 249.99,
      quantity: 25
    };

    const response = await request.patch(`/items/${testItemId}`, {
      data: patchData
    });

    expect(response.status()).toBe(200);
    const updatedItem = await response.json();

    // Verify specifically updated fields
    expect.soft(updatedItem.price, 'Price update failed').toBe(patchData.price);
    expect.soft(updatedItem.quantity, 'Quantity update failed').toBe(patchData.quantity);
    // Verify untouched fields
    expect.soft(updatedItem.name, 'Name should be unchanged').toBe(originalItemData.name);
  });

  test('should handle setting quantity to zero via PATCH', async ({ request }) => {
    const response = await request.patch(`/items/${testItemId}`, {
      data: { quantity: 0 }
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.quantity).toBe(0);
  });
});