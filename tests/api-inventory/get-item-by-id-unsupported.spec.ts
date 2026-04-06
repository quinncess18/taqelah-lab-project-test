import { test, expect } from '@playwright/test';

// GET /items/{id} is not a supported endpoint on this API.
// Kept for future reference — if the backend adds this endpoint, update this file
// to test real by-ID retrieval and move it to get-item-by-id.spec.ts.

test.describe('GET /items/{id} — unsupported endpoint', () => {

  test('should return 404 for GET /items/{id} (endpoint not supported)', async ({ request }) => {
    const response = await request.get('/items/1');

    expect(response.status()).toBe(404);
  });

});
