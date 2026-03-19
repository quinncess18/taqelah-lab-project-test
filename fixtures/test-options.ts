import { test as base } from '@playwright/test';

type TestOptions = {
  environment: 'staging' | 'production';
  userType: 'customer' | 'guest';
};

export const test = base.extend<TestOptions>({
  environment: ['staging', { option: true }],
  userType: ['customer', { option: true }],
});

export { expect } from '@playwright/test';