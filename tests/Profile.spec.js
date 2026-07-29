import { test, expect } from '@playwright/test';

test('Update Display Currency', async ({ page }) => {
  await page.goto('https://erp.autodemoapps.tech/login');
  await page.getByRole('textbox', { name: 'Username or Email' }).click();
  await page.getByRole('textbox', { name: 'Username or Email' }).fill('supun2@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('1234567');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByRole('button', { name: 's supun madushanka tenant admin' }).click();
  await page.getByRole('menuitem', { name: 'Profile' }).click();
  await expect(page).toHaveURL('https://erp.autodemoapps.tech/profile')

  await page.selectOption('#preferred-currency', 'USD');
  await page.click('//button[normalize-space()="Save Currency"]');
  await expect(
  page.getByText('Display currency updated. Re-login to see prices updated in product lists')
  ).toBeVisible();
});


test('Update Display popup message for Password ', async ({ page }) => {

    const OLD_PASSWORD = '1234567';
    const NEW_PASSWORD = '123456';
  await page.goto('https://erp.autodemoapps.tech/login');
  await page.getByRole('textbox', { name: 'Username or Email' }).click();
  await page.getByRole('textbox', { name: 'Username or Email' }).fill('supun2@gmail.com');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('1234567');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await page.getByRole('button', { name: 's supun madushanka tenant admin' }).click();
  await page.getByRole('menuitem', { name: 'Profile' }).click();
  await expect(page).toHaveURL('https://erp.autodemoapps.tech/profile')


await page.locator('#currentPassword').fill(OLD_PASSWORD);
await page.locator('#newPassword').fill(NEW_PASSWORD);
await page.locator('#confirmNewPassword').fill(NEW_PASSWORD);

await page.getByRole('button', { name: 'Update password' }).click();

await expect(page.getByText('Password updated')).toBeVisible();
});