import { test as base, expect, Page } from '@playwright/test';

export const test = base.extend<{}, { uniqueEmail: string }>({
  uniqueEmail: [async ({}, use, workerInfo) => {
    const email = `test-worker-${workerInfo.workerIndex}-${Date.now()}@example.com`;
    await use(email);
  }, { scope: 'worker' }],
});

export { expect, Page };