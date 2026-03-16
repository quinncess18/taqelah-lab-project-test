import { chromium } from '@playwright/test';
import path from 'path';
import fs from 'fs/promises';

const authDir = path.join(__dirname, '.auth');
const authFile = path.join(authDir, 'taqelah-user.json');
const demoSiteUrl = 'https://taqelah.sg/taqelah-demo-site.html';

async function globalSetup() {
  await fs.mkdir(authDir, { recursive: true });

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();

    await page.goto(demoSiteUrl);
    await page.getByTestId('username-input').fill('ladies');
    await page.getByTestId('password-input').fill('ladies_GO');
    await page.getByTestId('login-button').click();
    await page.getByText('Spring Collection 2025').waitFor();

    await page.context().storageState({ path: authFile });
  } finally {
    await browser.close();
  }
}

export default globalSetup;