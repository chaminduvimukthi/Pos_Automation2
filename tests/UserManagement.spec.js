import {test, expect} from '@playwright/test';
import {LoginPage} from '../pages/Login';


test.beforeEach(async ({ page }) => {

  const loginPage = new LoginPage(page);

  await loginPage.gotoLoginPage();

  await loginPage.login(
    'supun2@gmail.com',
    '12345678'
  );

  await loginPage.verifyLoginSuccess();

await expect(page).toHaveURL('https://amenu.autodemoapps.tech/dashboard',{ timeout: 50000});

await page.getByRole('complementary').getByText('Users').click();

  
await page.getByRole('link', { name: 'Users' }).click();
await expect(page).toHaveURL('https://amenu.autodemoapps.tech/users');

await page.getByRole('button', { name: 'Add User' }).click();
});

function generatePassword() {
  const random = Math.random().toString(36).slice(-8);
  return `Test@${random}A1`;
}
function generateRandomEmail() {
  return `tester${Date.now()}@test.com`;
}

function generateRandomName() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

  let name = 'Tester';

  for (let i = 0; i < 5; i++) {
    name += letters.charAt(Math.floor(Math.random() * letters.length));
  }

  return name;
}
test('Add users with valid details', async ({ page }) => {

  const password = generatePassword();
  const firstName = generateRandomName();
  const lastName = generateRandomName();
  const email = generateRandomEmail();

await page.getByPlaceholder('Enter first name').fill(firstName);
await page.getByPlaceholder('Enter last name').fill(lastName);
await page.getByPlaceholder('Enter email address').fill(email);
await page.getByPlaceholder('Enter password').fill(password);
await page.getByPlaceholder('Confirm password').fill(password);

// Role dropdown
await page.getByRole('button', { name: 'Assign Role*' }).click();
  await page.getByRole('option', { name: 'Outlet Manager (Chamindu Vimukthi)' }).click();
  
  await page.getByRole('button', { name: 'Assign Outlet*' }).click();
  await page.getByRole('option', { name: 'Chamindu Vimukthi' }).click();

await page.getByRole('button', { name: 'Save And Add' }).click({ timeout: 5000 });

await expect(page.getByText('User created successfully')).toBeVisible();


});

test('Check required field validations', async ({ page }) => {

  await page.getByRole('button', { name: 'Save And Add' }).click();

  await expect(page.getByText('First name is required')).toBeVisible();

  await expect(page.getByText('Last name is required')).toBeVisible();

  await expect(page.getByText('Email is required')).toBeVisible();

  await expect(page.getByText('Password is required')).toBeVisible();

});
test('Check invalid email validation', async ({ page }) => {

  await page.getByPlaceholder('Enter email address').fill('invalidemail');

  await page.getByRole('button', { name: 'Save And Add' }).click();

  await expect(page.getByText('Invalid email format')).toBeVisible();

});

test('Check password mismatch validation', async ({ page }) => {

  await page.getByPlaceholder('Enter password').fill('Test@123');

  await page.getByPlaceholder('Confirm password').fill('Test@456');

  await page.getByRole('button', { name: 'Save And Add' }).click();

  await expect(page.getByText('Passwords do not match')).toBeVisible();

});

test('Check duplicate email validation', async ({ page }) => {

  await page.getByPlaceholder('Enter first name').fill('Tester');

  await page.getByPlaceholder('Enter last name').fill('User');

  await page.getByPlaceholder('Enter email address').fill('chaminduvimukthi234@gmail.com');

  await page.getByPlaceholder('Enter password').fill('Test@123');

  await page.getByPlaceholder('Confirm password').fill('Test@123');

  await page.getByRole('button', { name: 'Assign Role*' }).click();
  await page.getByRole('option', { name: 'Outlet Manager (Chamindu Vimukthi)' }).click();
  
  await page.getByRole('button', { name: 'Assign Outlet*' }).click();
  await page.getByRole('option', { name: 'Chamindu Vimukthi' }).click();
  await page.getByRole('button', { name: 'Save And Add' }).click();

  await expect(page.getByText('Failed to create user')).toBeVisible();

});

test('Check password minimum length validation', async ({ page }) => {

  await page.getByPlaceholder('Enter password').fill('Tes1@');

  await page.getByPlaceholder('Confirm password').fill('Tes1@');

  await page.getByRole('button', { name: 'Save And Add' }).click();

  await expect(
    page.getByText('Password must be at least 8 characters')
  ).toBeVisible();

});

test('Check role required validation', async ({ page }) => {

  const password = generatePassword();

  await page.getByPlaceholder('Enter first name').fill('Tester');

  await page.getByPlaceholder('Enter last name').fill('User');

  await page.getByPlaceholder('Enter email address').fill(generateRandomEmail());

  await page.getByPlaceholder('Enter password').fill(password);

  await page.getByPlaceholder('Confirm password').fill(password);

  await page.getByRole('button', { name: 'Save And Add' }).click();

  await expect(page.getByText('Role is required')).toBeVisible();

});

test('Check outlet required validation', async ({ page }) => {

  const password = generatePassword();

  await page.getByPlaceholder('Enter first name').fill('Tester');

  await page.getByPlaceholder('Enter last name').fill('User');

  await page.getByPlaceholder('Enter email address').fill(generateRandomEmail());

  await page.getByPlaceholder('Enter password').fill(password);

  await page.getByPlaceholder('Confirm password').fill(password);

  await page.getByRole('button', { name: 'Assign Role*' }).click();

  await page.getByRole('option', { name: 'Outlet Manager (Chamindu Vimukthi)' }).click();

  await page.getByRole('button', { name: 'Save And Add' }).click();

  await expect(page.getByText('Outlet is required')).toBeVisible();

});

test('Successfully create user', async ({ page }) => {

  const password = generatePassword();

  await page.getByPlaceholder('Enter first name').fill(generateRandomName());

  await page.getByPlaceholder('Enter last name').fill(generateRandomName());

  await page.getByPlaceholder('Enter email address').fill(generateRandomEmail());

  await page.getByPlaceholder('Enter password').fill(password);

  await page.getByPlaceholder('Confirm password').fill(password);

  await page.getByRole('button', { name: 'Assign Role*' }).click();

  await page.getByRole('option', { name: 'Outlet Manager (Chamindu Vimukthi)' }).click();

  await page.getByRole('button', { name: 'Assign Outlet*' }).click();

  await page.getByRole('option', { name: 'Chamindu Vimukthi' }).click();

  await page.getByRole('button', { name: 'Save And Add' }).click();

  await expect(
    page.getByText('User created successfully')
  ).toBeVisible();

});