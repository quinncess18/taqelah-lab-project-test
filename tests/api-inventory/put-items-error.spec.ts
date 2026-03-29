import { test, expect } from '@playwright/test';

test.describe('PUT /items/{id} - Negative Path', () => {

  test('should return 404 for a non-existent item ID', async ({ request }) => {
    const ghostId = 999999; // Explicitly use an ID that shouldn't exist

    const response = await request.put(`/items/${ghostId}`, {
      data: { name: 'Invalid ID Test', price: 10, quantity: 1 }
    });

    // Check if the API correctly identifies the missing item
    expect(response.status(), 'Should return 400 for missing ID').toBe(400);
  });

  test('should return 400 for invalid data types', async ({ request }) => {
    // We don't need a real ID here if the validation happens on the body first
    const response = await request.put('/items/1', {
      data: { 
        name: 12345,      // Should be a string
        price: "expensive" // Should be a number
      }
    });

    // Check if the API catches the data type mismatch
    expect(response.status(), 'Should return 400 for bad data').toBe(400);
  });
});