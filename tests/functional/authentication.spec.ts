import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages';
import customers from '../../test-data/users.json';

const testData = customers.filter(user => user.expectedRole === 'customer');
const guestUser = customers.find(user => user.expectedRole === 'guest');

test.describe('Authentication Funnel', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test.describe('Happy Path', () => {
    testData.forEach(({ username, password }) => {
      test(`User can login with ${username} account`, async ({ page }) => {
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

    test('User session persists after navigation (Happy Path Persistence)', async ({ page }) => {
      const loginPage = new LoginPage(page);
      const user = testData[0];
      
      await loginPage.login(user.username, user.password);
      await expect(loginPage.logoutButton).toBeVisible();

      // Navigate away and back
      await page.goto('https://google.com');
      await loginPage.goto();

      // Verify session is maintained
      await expect(loginPage.logoutButton).toBeVisible();
    });
  });

  test.describe('Negative Scenarios', () => {
    test('User cannot login with invalid password', async ({ page }) => {
      const loginPage = new LoginPage(page);

      await loginPage.usernameInput.fill('ladies');
      await loginPage.passwordInput.fill('wrongpassword');
      await loginPage.loginButton.click();

      await expect(page.locator('text=Password must be username_GO')).toBeVisible();
      await expect(loginPage.logoutButton).not.toBeVisible();
    });

    test('User cannot login with non-existent account', async ({ page }) => {
      const loginPage = new LoginPage(page);

      await loginPage.usernameInput.fill('abc12');
      await loginPage.passwordInput.fill('nopassword');
      await loginPage.loginButton.click();

      await expect(page.locator('text=Username must be exactly 6 letters')).toBeVisible();
    });

    test('User cannot login with guest credentials (incorrect format)', async ({ page }) => {
      const loginPage = new LoginPage(page);

      await loginPage.usernameInput.fill(guestUser!.username);
      await loginPage.passwordInput.fill('wrongpassword');
      await loginPage.loginButton.click();

      await expect(page.locator('text=Username must be exactly 6 letters')).toBeVisible();
      await expect(loginPage.logoutButton).not.toBeVisible();
    });
  });
});
