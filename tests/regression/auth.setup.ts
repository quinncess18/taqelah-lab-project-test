import { test as setup } from '@playwright/test';
import path from 'path';
import customers from '../../test-data/users.json';

const authDir = path.join(__dirname, '../../.auth');
const testUsers = customers.filter(u => u.expectedRole === 'customer' && u.promoCode);

for (const user of testUsers) {
  setup(`save storage state for ${user.username}`, async ({ page }) => {
    await page.goto('/taqelah-demo-site.html');
    await page.getByTestId('username-input').fill(user.username);
    await page.getByTestId('password-input').fill(user.password);
    await page.getByTestId('login-button').click();
    await page.getByText('Spring Collection 2025').waitFor();
    await page.context().storageState({ path: path.join(authDir, `${user.username}.json`) });
  });
}
