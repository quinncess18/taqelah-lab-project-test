import { test, expect } from '@playwright/test';

test.describe('GET /items/{id} - Get Item by ID', () => {
  test('should return 404 for any item ID (endpoint appears broken in this PlayPI instance)', async ({ request }) => {
    const response = await request.get('/items/1');

    // 1. Check status FIRST. If this fails, the test stops here.
    expect(response.status()).toBe(404);

    // 2. Only parse JSON if you are sure it's JSON. 
    // Since it's exploratory, let's use a try-catch or check headers.
    let body: { error?: string; message?: string } = {};
    try {
      body = await response.json();
    } catch (e) {
      console.log('Response is not a valid JSON. Actual text:', await response.text());
    }

    // 3. Now you can use soft assertions safely
    if (Object.keys(body).length > 0) {
      expect.soft(body, 'Check if body has error field').toHaveProperty('error');
      expect.soft(body.message, 'Check if message is "Not Found"').toBe('Not Found');
    } else {
      // Optional: Fail softly if we expected JSON but got none
      expect.soft(response.headers()['content-type']).toContain('text/plain');
    }
  });

  test('should return 404 for non-existent item', async ({ request }) => {
    const nonExistentId = 999999;
    const response = await request.get(`/items/${nonExistentId}`);
    expect(response.status()).toBe(404);
  });
});