import { test, expect } from '@playwright/test';

test.describe('PUT /items/{id} - Full Update Item', () => {
  let testItemId: number;

  // Create a fresh item before each test to ensure isolation
  test.beforeEach(async ({ request }) => {
    const newItem = {
      name: 'Original Item',
      description: 'Original description',
      price: 100.0,
      quantity: 10
    };

    const response = await request.post('/items', {
      data: newItem
    });

    const createdItem = await response.json();
    testItemId = createdItem.id;
  });

  test('should fully update an existing item', async ({ request }) => {
    const updatedData = {
      name: 'Updated Item Name',
      description: 'Updated description',
      price: 150.0,
      quantity: 20
    };

    const response = await request.put(`/items/${testItemId}`, {
      data: updatedData
    });

    // Verify successful status code
    expect(response.status()).toBe(200);

    const updatedItem = await response.json();
    
    // Validate all fields are updated correctly
    expect.soft(updatedItem.id, 'ID should remain the same').toBe(testItemId);
    expect.soft(updatedItem.name, 'Name should be updated').toBe(updatedData.name);
    expect.soft(updatedItem.description, 'Description should be updated').toBe(updatedData.description);
    expect.soft(updatedItem.price, 'Price should be updated').toBe(updatedData.price);
    expect.soft(updatedItem.quantity, 'Quantity should be updated').toBe(updatedData.quantity);
  });

  test('should return JSON content type', async ({ request }) => {
    const response = await request.put(`/items/${testItemId}`, {
      data: { name: 'Header Test', price: 10, quantity: 1 }
    });

    // Check if response header is correct
    expect(response.headers()['content-type']).toContain('application/json');
  });

  test('should update item with zero price', async ({ request }) => {
    const updatedData = {
      name: 'Free Item',
      description: 'No charge',
      price: 0,
      quantity: 50
    };

    const response = await request.put(`/items/${testItemId}`, {
      data: updatedData
    });

    expect(response.status()).toBe(200);
    const updatedItem = await response.json();
    // Validate that 0 is accepted as a valid price
    expect(updatedItem.price).toBe(0);
  });

  test('should update item with zero quantity', async ({ request }) => {
    const updatedData = {
      name: 'Out of Stock',
      description: 'No items available',
      price: 49.99,
      quantity: 0
    };

    const response = await request.put(`/items/${testItemId}`, {
      data: updatedData
    });

    expect(response.status()).toBe(200);
    const updatedItem = await response.json();
    // Validate that 0 is accepted as a valid quantity
    expect(updatedItem.quantity).toBe(0);
  });

  test('should update item with long description', async ({ request }) => {
    const longDesc = 'A'.repeat(200);
    const updatedData = {
      name: 'Long Description Item',
      description: longDesc,
      price: 199.99,
      quantity: 5
    };

    const response = await request.put(`/items/${testItemId}`, {
      data: updatedData
    });

    expect(response.status()).toBe(200);
    const updatedItem = await response.json();
    // Validate that the system handles long strings correctly
    expect(updatedItem.description).toBe(longDesc);
  });
});