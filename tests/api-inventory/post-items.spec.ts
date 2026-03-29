import { test, expect } from '@playwright/test';

test.describe('POST /items - Create New Item', () => {
  let createdItemId: number;

  test('should create a new item with valid data (Refactored with Soft)', async ({ request }) => {
    const newItem = {
      name: 'Test Laptop',
      description: 'High-end gaming laptop',
      price: 2499.99,
      quantity: 5
    };

    const response = await request.post('/items', {
      data: newItem
    });

    expect(response.status(), 'Check status code').toBe(201);

    const createdItem = await response.json();
    createdItemId = createdItem.id;

    expect.soft(createdItem, 'Should have an auto-generated ID').toHaveProperty('id');
    expect.soft(createdItem.name, 'Check name match').toBe(newItem.name);
    expect.soft(createdItem.description, 'Check description match').toBe(newItem.description);
    expect.soft(createdItem.price, 'Check price match').toBe(newItem.price);
    expect.soft(createdItem.quantity, 'Check quantity match').toBe(newItem.quantity);
  });

  test('should return JSON content type', async ({ request }) => {
    const newItem = {
      name: 'Test Mouse',
      description: 'Wireless mouse',
      price: 49.99,
      quantity: 20
    };

    const response = await request.post('/items', {
      data: newItem
    });

    expect(response.headers()['content-type']).toContain('application/json');
  });

  test('should create item with minimum required fields', async ({ request }) => {
    const newItem = {
      name: 'Basic Item',
      description: 'Simple description',
      price: 10.0,
      quantity: 1
    };

    const response = await request.post('/items', {
      data: newItem
    });

    expect(response.status()).toBe(201);
    const createdItem = await response.json();
    expect(createdItem.id).toBeGreaterThan(0);
  });

  test('should handle decimal prices correctly', async ({ request }) => {
    const newItem = {
      name: 'Decimal Price Item',
      description: 'Item with decimal price',
      price: 99.99,
      quantity: 10
    };

    const response = await request.post('/items', {
      data: newItem
    });

    expect(response.status()).toBe(201);
    const createdItem = await response.json();
    expect(createdItem.price).toBe(99.99);
  });

  test('should handle zero quantity', async ({ request }) => {
    const newItem = {
      name: 'Out of Stock Item',
      description: 'Currently unavailable',
      price: 199.99,
      quantity: 0
    };

    const response = await request.post('/items', {
      data: newItem
    });

    expect(response.status()).toBe(201);
    const createdItem = await response.json();
    expect(createdItem.quantity).toBe(0);
  });

  test('should handle large quantities', async ({ request }) => {
    const newItem = {
      name: 'Bulk Item',
      description: 'Large quantity item',
      price: 5.99,
      quantity: 10000
    };

    const response = await request.post('/items', {
      data: newItem
    });

    expect(response.status()).toBe(201);
    const createdItem = await response.json();
    expect(createdItem.quantity).toBe(10000);
  });

  test('should create item with special characters in name', async ({ request }) => {
    const newItem = {
      name: 'Item-Name & Special_Chars (Test)',
      description: 'Testing special characters: @#$%',
      price: 29.99,
      quantity: 5
    };

    const response = await request.post('/items', {
      data: newItem
    });

    expect(response.status()).toBe(201);
    const createdItem = await response.json();
    expect(createdItem.name).toBe(newItem.name);
  });

  test('should return error for missing required fields', async ({ request }) => {
  const invalidItem = {
    // Missing name, price, and quantity
    description: 'This item is missing required fields'
  };

  const response = await request.post('/items', {
    data: invalidItem
  });

  expect(response.status()).toBe(400);
  const errorResponse = await response.json();
  expect(errorResponse).toHaveProperty('error');
  expect(errorResponse.error).toContain('name must be between 3 and 50 characters');
});
  
  test('should return error for negative price', async ({ request }) => {
  const invalidItem = {
    name: 'Negative Price Item',
    description: 'This should fail validation',
    price: -10.00,
    quantity: 5
  };

  const response = await request.post('/items', {
    data: invalidItem
  });

  expect(response.status()).toBe(400);
    const errorResponse = await response.json();
  
  expect(errorResponse).toHaveProperty('error');
  expect(errorResponse.error).toContain('price must be a positive number');
});

  test('should return error for negative quantity', async ({ request }) => {
  const invalidItem = {
    name: 'Negative Quantity Item',
    description: 'This should fail validation',
    price: 29.99,
    quantity: -5
  };

  const response = await request.post('/items', {
    data: invalidItem
  });

  expect(response.status()).toBe(400);
    const errorResponse = await response.json();
  
  expect(errorResponse).toHaveProperty('error');
  expect(errorResponse.error).toContain('quantity must be at least 0');
});

  test('should return error for empty name', async ({ request }) => {
  const invalidItem = {
    name: '',
    description: 'Item with empty name',
    price: 19.99,
    quantity: 10
  };

  const response = await request.post('/items', {
    data: invalidItem
  });

  expect(response.status()).toBe(400);
    const errorResponse = await response.json(); 
  expect(errorResponse).toHaveProperty('error');
  expect(errorResponse.error).toContain('name must be between 3 and 50 characters');
  });

  test('should return error for invalid price type', async ({ request }) => {
  const invalidItem = {
    name: 'Invalid Type Item',
    description: 'Price is a string instead of number',
    price: 'not-a-number',
    quantity: 5
  };

  const response = await request.post('/items', {
    data: invalidItem
  });

  expect(response.status()).toBe(400);
    const errorResponse = await response.json(); 
  expect(errorResponse).toHaveProperty('error');
  expect(errorResponse.error).toContain('invalid input format');
});
});