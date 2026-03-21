import { test as setup } from '@playwright/test';

setup('verify site is accessible', async ({ page }) => {
  await page.goto('/taqelah-demo-site.html');
  await page.waitForLoadState('networkidle');
});