import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/Login';

test.beforeEach(async ({ page }) => {
  const login = new LoginPage(page);

  await login.gotoLoginPage();
  await login.login('supun2@gmail.com', '12345678');

  await expect(page).toHaveURL('https://amenu.autodemoapps.tech/dashboard');
 await page.getByRole('complementary').getByText('Outlets').click();
});


test('Outlet create with valid details', async ({page}) => {
const email = `test${Date.now()}@gmail.com`;

await page.getByRole('button', { name: 'Add Outlet' }).click();

await page.getByPlaceholder('Enter outlet name').fill('mr kottu Branch');
await page.getByPlaceholder('Enter city').fill('kandy');
await page.getByPlaceholder('Enter phone number').fill('0708182634');
await page.getByPlaceholder('Enter full address').fill('maradampitiya, kandy');

// await page.getByRole('button', { name: 'Create Outlet' }).click();

await page.getByRole('button', { name: 'Add Manager' }).click();

await page.getByPlaceholder('Enter first name').fill('samira');
await page.getByPlaceholder('Enter last name').fill('dahanayaka');
await page.getByPlaceholder('manager@example.com').fill(email);
await page.getByPlaceholder('Enter password (min 6 characters)').fill('1234567');

await page.getByRole('button', { name: 'Create with Manager' }).click();
await expect(page.getByText('Outlet created with manager successfully')).toBeVisible({ timeout: 100000 });

});

test('Outlet Required Field Validation', async ({page}) => {
await page.getByRole('button', { name: 'Add Outlet' }).click();


await page.getByRole('button', { name: 'Add Manager' }).click();
// await page.getByRole('button', { name: 'Create Outlet' }).click();

await expect(page.getByText('Outlet name is required')).toBeVisible();
await expect(page.getByText('City is required')).toBeVisible();
await expect(page.getByText('Phone is required')).toBeVisible();
await expect(page.getByText('address is required')).toBeVisible();


await expect(page.getByText('please fix the errors in the form')).toBeVisible();


});


test('Outlet managers details Required Field Validation', async ({page}) => {
const email = `test${Date.now()}@gmail.com`;
await page.getByRole('button', { name: 'Add Outlet' }).click();

await page.getByPlaceholder('Enter outlet name').fill('mr kottu Branch');
await page.getByPlaceholder('Enter city').fill('kandy');
await page.getByPlaceholder('Enter phone number').fill('0708182634');
await page.getByPlaceholder('Enter full address').fill('maradampitiya, kandy');

// await page.getByRole('button', { name: 'Create Outlet' }).click();

await page.getByRole('button', { name: 'Add Manager' }).click();

await page.getByRole('button', { name: 'Create with Manager' }).click();

await expect(page.getByText('First name is required')).toBeVisible();
await expect(page.getByText('Last name is required')).toBeVisible();
await expect(page.getByText('Email is required')).toBeVisible();
await expect(page.getByText('Password is required')).toBeVisible();

await expect(page.getByText('please fix the errors in the form')).toBeVisible();

});


test('phone number validation check ', async ({page}) => {
const email = `test${Date.now()}@gmail.com`;
await page.getByRole('button', { name: 'Add Outlet' }).click();

await page.getByPlaceholder('Enter outlet name').fill('mr kottu Branch');
await page.getByPlaceholder('Enter city').fill('kandy');
await page.getByPlaceholder('Enter phone number').fill('2233');
await page.getByPlaceholder('Enter full address').fill('maradampitiya, kandy');

// await page.getByRole('button', { name: 'Create Outlet' }).click();

await page.getByRole('button', { name: 'Add Manager' }).click();

await page.getByPlaceholder('Enter first name').fill('samira');
await page.getByPlaceholder('Enter last name').fill('dahanayaka');
await page.getByPlaceholder('manager@example.com').fill(email);
await page.getByPlaceholder('Enter password (min 6 characters)').fill('1234567');

await page.getByRole('button', { name: 'Create with Manager' }).click();
await expect(page.getByText('please fix the errors in the form')).toBeVisible();

});


test('manager email format and password validation check ', async ({page}) => {
await page.getByRole('button', { name: 'Add Outlet' }).click();

await page.getByPlaceholder('Enter outlet name').fill('mr kottu Branch');
await page.getByPlaceholder('Enter city').fill('kandy');
await page.getByPlaceholder('Enter phone number').fill('adsdsd');
await page.getByPlaceholder('Enter full address').fill('maradampitiya, kandy');

// await page.getByRole('button', { name: 'Create Outlet' }).click();

await page.getByRole('button', { name: 'Add Manager' }).click();

await page.getByPlaceholder('Enter first name').fill('samira');
await page.getByPlaceholder('Enter last name').fill('dahanayaka');
await page.getByPlaceholder('manager@example.com').fill('invalidemail');
await page.getByPlaceholder('Enter password (min 6 characters)').fill('123');
await page.getByRole('button', { name: 'Create with Manager' }).click();

await expect(page.getByText('invalid email format')).toBeVisible();
await expect(page.getByText('Password must be at least 6 characters')).toBeVisible();


await expect(page.getByText('please fix the errors in the form')).toBeVisible();

});


test('Back Button Functionality check', async ({page}) => {
await page.getByRole('button', { name: 'Add Outlet' }).click();

await page.getByPlaceholder('Enter outlet name').fill('mr kottu Branch');
await page.getByPlaceholder('Enter city').fill('kandy');
await page.getByPlaceholder('Enter phone number').fill('adsdsd');
await page.getByPlaceholder('Enter full address').fill('maradampitiya, kandy');

// await page.getByRole('button', { name: 'Create Outlet' }).click();

await page.getByRole('button', { name: 'Add Manager' }).click();

await page.getByRole('button', { name: 'Back' }).click();

await expect(page.getByText('Outlet Information')).toBeVisible();

});




test('duplicate mail outlet creation', async ({page}) => {

await page.getByRole('button', { name: 'Add Outlet' }).click();

await page.getByPlaceholder('Enter outlet name').fill('mr kottu Branch');
await page.getByPlaceholder('Enter city').fill('kandy');
await page.getByPlaceholder('Enter phone number').fill('0708182634');
await page.getByPlaceholder('Enter full address').fill('maradampitiya, kandy');

// await page.getByRole('button', { name: 'Create Outlet' }).click();

await page.getByRole('button', { name: 'Add Manager' }).click();

await page.getByPlaceholder('Enter first name').fill('samira');
await page.getByPlaceholder('Enter last name').fill('dahanayaka');
await page.getByPlaceholder('manager@example.com').fill('chaminduvimukthi7@gmail.com');
await page.getByPlaceholder('Enter password (min 6 characters)').fill('1234567');

await page.getByRole('button', { name: 'Create with Manager' }).click();
await expect(page.getByText('User with email chaminduvimukthi7@gmail.com already exists')).toBeVisible({ timeout: 100000 });

});


test('Edge case testing', async ({page}) => {
const email = `test${Date.now()}@gmail.com`;
await page.getByRole('button', { name: 'Add Outlet' }).click();

await page.getByPlaceholder('Enter outlet name').fill('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaasdsddddddaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq qq qq qq qq qq qq qq qq qq qq qq qq qq qq qq qq qq qq qq qq qq qq qq qq qq qq qq qq qq qq qq qq qq qq qq qq qq qq qq qq qq.qq.qq.qq.qq.qq.qq.qq.qq.qq.qq.qq.qq.qq.qq.qq.qq.qq.qq.qq.qq.qq.qq.qq.qq.qq.qq.qq.qq.qq.qq.qq.qq.qq.qq.qq QQ QQ QQ QQ QQ QQ QQ QQ QQ QQ QQ QQ QQ QQ QQ QQ QQ QQ QQ QQ QQ QQ QQ QQ QQ QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQAAADSD');
await page.getByPlaceholder('Enter city').fill('kandy');
await page.getByPlaceholder('Enter phone number').fill('dfsf');
await page.getByPlaceholder('Enter full address').fill('maradampitiya, kandy');

// await page.getByRole('button', { name: 'Create Outlet' }).click();

await page.getByRole('button', { name: 'Add Manager' }).click();

await page.getByPlaceholder('Enter first name').fill('r');
await page.getByPlaceholder('Enter last name').fill('d');
await page.getByPlaceholder('manager@example.com').fill(email);
await page.getByPlaceholder('Enter password (min 6 characters)').fill('1234567');

await page.getByRole('button', { name: 'Create with Manager' }).click();
await expect(page.getByText('An unexpected error occurred')).toBeVisible({ timeout: 100000 });

});


test('Update outlet with valid data', async ({page}) => {

await page.getByRole('button', { name: 'common.edit' }).first().click();
await page.locator('#name').fill('yapana branch');
await page.locator('#city').fill('yapana city');
await page.locator('#phone').fill('0701234567');
await page.locator('#address').fill('yapana address');

await page.getByRole('button', { name: 'Update Outlet' }).click();
await expect(page.getByText('Outlet updated successfully')).toBeVisible();
});

test('Update Update only one field', async ({page}) => {

await page.getByRole('button', { name: 'common.edit' }).first().click();
await page.locator('#name').fill('yapana branch');

await page.getByRole('button', { name: 'Update Outlet' }).click();
await expect(page.getByText('Outlet updated successfully')).toBeVisible();
});


test('Update with maximum character length', async ({page}) => {

await page.getByRole('button', { name: 'common.edit' }).first().click();
await page.locator('#name').fill('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa');
await page.locator('#city').fill('yapana city');
await page.locator('#phone').fill('0701234567');
await page.locator('#address').fill('yapana address');
await page.getByRole('button', { name: 'Update Outlet' }).click();
await expect(page.getByText('An unexpected error occurred')).toBeVisible();

});

test('Submit with all fields empty', async ({page}) => {

await page.getByRole('button', { name: 'common.edit' }).first().click();

await page.locator('#name').clear();
await page.locator('#city').clear();
await page.locator('#phone').clear();
await page.locator('#address').clear();

await page.getByRole('button', { name: 'Update Outlet' }).click();

await expect(page.getByText('Outlet name is required')).toBeVisible();
await expect(page.getByText('City is required')).toBeVisible();
await expect(page.getByText('Phone is required')).toBeVisible();
await expect(page.getByText('address is required')).toBeVisible();

await expect(page.getByText('please fix the errors in the form')).toBeVisible();
});


test('Required field empty (Outlet Name)', async ({page}) => {

await page.getByRole('button', { name: 'common.edit' }).first().click();
await page.locator('#name').clear;
await page.locator('#city').fill('yapana city');
await page.locator('#phone').fill('0701234567');
await page.locator('#address').fill('yapana address');

await page.getByRole('button', { name: 'Update Outlet' }).click();

await expect(page.getByText('Outlet name is required')).toBeVisible();



});
test('Invalid phone number ', async ({page}) => {

await page.getByRole('button', { name: 'common.edit' }).first().click();
await page.locator('#name').fill('yapana branch');
await page.locator('#city').fill('yapana city');
await page.locator('#phone').fill('aaaaaa');
await page.locator('#address').fill('yapana address');

await page.getByRole('button', { name: 'Update Outlet' }).click();

await expect(page.getByText('Phone is invalid')).toBeVisible();
});

test('Leading/trailing spaces', async ({page}) => {

await page.getByRole('button', { name: 'common.edit' }).first().click();
await page.locator('#name').fill('          ');
await page.locator('#city').fill('yapana city');
await page.locator('#phone').fill('0701234567');
await page.locator('#address').fill('yapana address');

await page.getByRole('button', { name: 'Update Outlet' }).click();
await expect(page.getByText('Please fix the errors in the form')).toBeVisible();
});

test('trailing spaces', async ({page}) => {

await page.getByRole('button', { name: 'common.edit' }).first().click();
await page.locator('#name').fill('          vimukthi');
await page.locator('#city').fill('yapana city');
await page.locator('#phone').fill('0701234567');
await page.locator('#address').fill('yapana address');

await page.getByRole('button', { name: 'Update Outlet' }).click();
await expect(page.getByText('Please fix the errors in the form')).toBeVisible();
});


test('Search outlet by name', async ({ page }) => {
  await page.getByPlaceholder('Search').fill('updated outlet name');

  await expect(page.getByText('updated outlet name')).toBeVisible();
});

