import { test, expect } from '@playwright/test';

test.describe('GET /items — error scenarios', () => {

  test('should return 404 for a non-existent path', async ({ request }) => {
    const response = await request.get('/nonexistent');

    expect(response.status()).toBe(404);
  });

});
