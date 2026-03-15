import { test, expect } from '@playwright/test';

const testData = [
  { username: 'ladies', password: 'ladies_GO' },
  { username: 'autumn', password: 'autumn_GO' },
  { username: 'spring', password: 'spring_GO' },
  { username: 'winter', password: 'winter_GO' }
];

testData.forEach(({ username, password }) => {
  test(`user can login to Taqelah Boutique with ${username} account`, async ({ page }) => {
    await page.goto('https://taqelah.sg/taqelah-demo-site.html');
    await page.getByTestId('username-input').click();
    await page.getByTestId('username-input').fill(username);
    await page.getByTestId('password-input').click();
    await page.getByTestId('password-input').fill(password);
    await page.getByTestId('login-button').click();
    await expect(page.getByTestId('logout-button')).toBeVisible();
    await page.getByTestId('logout-button').click();
    await expect(page.locator('#loginPage')).toBeVisible();
  });
});

test('user cannot login with username less than 6 characters', async ({ page }) => {
  await page.goto('https://taqelah.sg/taqelah-demo-site.html');
  await page.getByTestId('username-input').click();
  await page.getByTestId('username-input').fill('test');
  await page.getByTestId('password-input').click();
  await page.getByTestId('password-input').fill('ladies_GO');
  await page.getByTestId('login-button').click();
  // Verify error message appears
  await expect(page.locator('text=Username must be exactly 6 letters')).toBeVisible();
  // Verify logout button is not visible (login failed)
  await expect(page.getByTestId('logout-button')).not.toBeVisible();
});

test('user cannot login with invalid password', async ({ page }) => {
  await page.goto('https://taqelah.sg/taqelah-demo-site.html');
  await page.getByTestId('username-input').click();
  await page.getByTestId('username-input').fill('ladies');
  await page.getByTestId('password-input').click();
  await page.getByTestId('password-input').fill('wrongpassword');
  await page.getByTestId('login-button').click();
  // Verify error message appears
  await expect(page.locator('text=Password must be username_GO')).toBeVisible();
  // Verify logout button is not visible (login failed)
  await expect(page.getByTestId('logout-button')).not.toBeVisible();
});