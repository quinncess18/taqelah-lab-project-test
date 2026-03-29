import { test, expect } from '@playwright/test';

test.describe('PATCH /items/{id} - Negative Path', () => {

  test('should return error for non-existent item', async ({ request }) => {
    const nonExistentId = 999999;
    
    const response = await request.patch(`/items/${nonExistentId}`, {
      data: { quantity: 10 }
    });

    // Note: Adjust status to 404 if your API returns 404 like the PUT test
    expect(response.status(), 'Should reject non-existent ID').toBe(400); 
    
    const errorBody = await response.json();
    expect.soft(errorBody, 'Response should contain error property').toHaveProperty('error');
    expect.soft(errorBody.error).toBe('item not found');
  });

  test('should return correct content-type header on patch', async ({ request }) => {
    const response = await request.patch('/items/1', {
        data: { name: 'Header Check' }
    });
    // Ensure the API still responds with JSON
    expect(response.headers()['content-type']).toContain('application/json');
  });
});