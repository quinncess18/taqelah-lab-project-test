import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';
import customers from '../test-data/users.json';

const testData = customers.filter(user => user.expectedRole === 'customer');
const guestUser = customers.find(user => user.expectedRole === 'guest');

test.describe('Taqelah login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/taqelah-demo-site.html');
  });

  testData.forEach(({ username, password }) => {
    test(`user can login to Taqelah Boutique with ${username} account`, async ({ page }) => {
      const loginPage = new LoginPage(page);

      // Perform login
      await loginPage.login(username, password);

      // Verify successful login
      await expect(page.getByText('Spring Collection 2025')).toBeVisible();
      await expect(loginPage.logoutButton).toBeVisible();

      // Logout
      await loginPage.logoutButton.click();
      await expect(page.locator('#loginPage')).toBeVisible();
    });
  });

  test('user cannot login with invalid password', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Try to login with invalid password
    await loginPage.usernameInput.fill('ladies');
    await loginPage.passwordInput.fill('wrongpassword');
    await loginPage.loginButton.click();

    // Verify error message appears
    await expect(page.locator('text=Password must be username_GO')).toBeVisible();
    // Verify logout button is not visible (login failed)
    await expect(loginPage.logoutButton).not.toBeVisible();
  });

  test('user cannot login with guest credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    // Try to login with guest credentials but wrong password
    await loginPage.usernameInput.fill(guestUser!.username);
    await loginPage.passwordInput.fill('wrongpassword');
    await loginPage.loginButton.click();

    // Verify error message appears
    await expect(page.locator('text=Username must be exactly 6 letters')).toBeVisible();
    // Verify logout button is not visible (login failed)
    await expect(loginPage.logoutButton).not.toBeVisible();
  });
});