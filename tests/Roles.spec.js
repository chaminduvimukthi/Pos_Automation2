import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/Login';

// ─── BEFORE EACH ──────────────────────────────────────────────────────────────

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.gotoLoginPage();
  await loginPage.login('supun2@gmail.com', '12345678');
  await page.waitForTimeout(5000);
  await expect(page).toHaveURL('https://amenu.autodemoapps.tech/dashboard');

  await page.getByRole('complementary').getByText('Users').click();
  await page.getByRole('link', { name: 'Roles' }).click();
  await expect(page).toHaveURL('https://amenu.autodemoapps.tech/user-roles');
});

// ─── CREATE ROLE — HAPPY PATH ─────────────────────────────────────────────────

// TC_RF_001 - Create role with valid details (OUTLET scope)
test('TC_RF_001 - Create role with valid details', async ({ page }) => {
  const code = `C-${Date.now()}`;
  const name = `outlet manager${Date.now()}`;

  await page.getByRole('button', { name: 'Add Role' }).click();
  await page.locator('#name').fill(name);
  await page.locator('#code').fill(code);
  await page.selectOption('select', { value: 'OUTLET' });
  await page.locator('#description').fill('Manager role description');

  await page.getByRole('button', { name: 'Save And Add' }).click();
  await expect(page.getByText('Role created successfully')).toBeVisible();
});

// TC_RF_018 - Create role with GLOBAL scope (default)
test('TC_RF_018 - Create role with GLOBAL scope', async ({ page }) => {
  const code = `C-${Date.now()}`;
  const name = `global role${Date.now()}`;

  await page.getByRole('button', { name: 'Add Role' }).click();
  await page.locator('#name').fill(name);
  await page.locator('#code').fill(code);
  // GLOBAL is the default scope — no outlet selection needed
  await page.locator('#description').fill('Global scope test');

  await page.getByRole('button', { name: 'Save And Add' }).click();
  await expect(page.getByText('Role created successfully')).toBeVisible();
});

// TC_RF_019 - Create role with CUSTOM scope and outlet selected
test('TC_RF_019 - Create role with CUSTOM scope and outlet selected', async ({ page }) => {
  const name = `outlet manager${Date.now()}`;
  const code = `C-${Date.now()}`;

  await page.getByRole('button', { name: 'Add Role' }).click();
  await page.locator('#name').fill(name);
  await page.locator('#code').fill(code);
  await page.selectOption('select', { value: 'CUSTOM' });
  await page.locator('select').nth(1).selectOption({ label: 'down south' });
  await page.locator('#description').fill('Custom outlet role');

  await page.getByRole('button', { name: 'Save And Add' }).click();
  await expect(page.getByText('Role created successfully')).toBeVisible();
});

// TC_RF_012 - Create role without description (optional field)
test('TC_RF_012 - Create role without description (optional field)', async ({ page }) => {
  const name = `outlet manager${Date.now()}`;
  const code = `C-${Date.now()}`;

  await page.getByRole('button', { name: 'Add Role' }).click();
  await page.locator('#name').fill(name);
  await page.locator('#code').fill(code);
  await page.selectOption('select', { value: 'OUTLET' });
  // description intentionally left empty

  await page.getByRole('button', { name: 'Save And Add' }).click();
  await expect(page.getByText('Role created successfully')).toBeVisible();
});

// ─── CREATE ROLE — VALIDATION ─────────────────────────────────────────────────

// TC_RF_002 - Submit form with all fields blank
test('TC_RF_002 - Submit form with all fields blank', async ({ page }) => {
  await page.getByRole('button', { name: 'Add Role' }).click();

  await page.getByRole('button', { name: 'Save And Add' }).click();

  await expect(page.getByText('Role name is required')).toBeVisible();
  await expect(page.getByText('Role code is required')).toBeVisible();
  await expect(page.getByText('Please check the form for errors.')).toBeVisible();
});

// TC_RF_004 - Save with empty Name field
test('TC_RF_004 - Save with empty Name field', async ({ page }) => {
const code = `C-${Date.now()}`;
  

  await page.getByRole('button', { name: 'Add Role' }).click();
  await page.locator('#name').fill("");
  await page.locator('#code').fill(code);
  await page.selectOption('select', { value: 'OUTLET' });
  await page.locator('#description').fill('Manager role description');

  await page.getByRole('button', { name: 'Save And Add' }).click();
  await expect(page.getByText('Role name is required')).toBeVisible();
  await expect(page.getByText('Please check the form for errors.')).toBeVisible();
});

// TC_RF_005 - Save with empty Code field
test('TC_RF_005 - Save with empty Code field', async ({ page }) => {
  await page.getByRole('button', { name: 'Add Role' }).click();
  await page.locator('#name').fill('sample role');
  await page.locator('#code').fill('');
  await page.selectOption('select', { value: 'OUTLET' });
  await page.locator('#description').fill('Manager role description');

  await page.getByRole('button', { name: 'Save And Add' }).click();
  await expect(page.getByText('Role code is required')).toBeVisible();
  await expect(page.getByText('Please check the form for errors.')).toBeVisible();
});

// TC_RF_006 - Create role with duplicate role code
test('TC_RF_006 - Create role with duplicate role code', async ({ page }) => {
  await page.getByRole('button', { name: 'Add Role' }).click();
  await page.locator('#name').fill('duplicate code test');
  await page.locator('#code').fill('C-250'); // existing code
  await page.selectOption('select', { value: 'OUTLET' });
  await page.locator('#description').fill('Duplicate code test');

  await page.getByRole('button', { name: 'Save And Add' }).click();
  await expect(page.getByText('Failed to create role')).toBeVisible();
});

// TC_RF_003 - Duplicate role name
test('TC_RF_003 - Create role with duplicate name', async ({ page }) => {
  const code = `C-${Date.now()}`;

  await page.getByRole('button', { name: 'Add Role' }).click();
  await page.locator('#name').fill('driver'); // existing role name
  await page.locator('#code').fill(code);
  await page.selectOption('select', { value: 'OUTLET' });
  await page.locator('#description').fill('Manager role description');

  await page.getByRole('button', { name: 'Save And Add' }).click();
  await expect(page.getByText('Failed to create role')).toBeVisible();
});

// TC_RF_008 - Role Name with maximum character limit (256 chars)
test('TC_RF_008 - Role Name with maximum character limit (256 chars)', async ({ page }) => {
  const code = `C-${Date.now()}`;

  await page.getByRole('button', { name: 'Add Role' }).click();
  await page.locator('#name').fill('A'.repeat(256));
  await page.locator('#code').fill(code);
  await page.selectOption('select', { value: 'OUTLET' });

  await page.getByRole('button', { name: 'Save And Add' }).click();
  await expect(page.getByText('Failed to create role')).toBeVisible({ timeout: 10000 });
});

// TC_RF_009 - Role Name with special characters
test('TC_RF_009 - Role Name with special characters', async ({ page }) => {
  const code = `C-${Date.now()}`;
  const name = `@@#$%%${Date.now()}`;

  await page.getByRole('button', { name: 'Add Role' }).click();
  await page.locator('#name').fill(name);
  await page.locator('#code').fill(code);
  await page.selectOption('select', { value: 'CUSTOM' });
  await page.locator('select').nth(1).selectOption({ label: 'down south' });
  await page.locator('#description').fill('Special chars test');

  await page.getByRole('button', { name: 'Save And Add' }).click();
  await expect(page.getByText('Role name cannot contain special characters like')).toBeVisible();
  await expect(page.getByText('Please check the form for errors.')).toBeVisible();
});

// TC_RF_010 - Name with only spaces
test('TC_RF_010 - Name with only spaces should fail', async ({ page }) => {
  const code = `C-${Date.now()}`;
  const name = `        ${Date.now()}`;

  await page.getByRole('button', { name: 'Add Role' }).click();
  await page.locator('#name').fill(name);
  await page.locator('#code').fill(code);
  await page.selectOption('select', { value: 'CUSTOM' });
  await page.locator('select').nth(1).selectOption({ label: 'down south' });
  await page.locator('#description').fill('Spaces only test');

  await page.getByRole('button', { name: 'Save And Add' }).click();
  await expect(page.getByText('Role name is required')).toBeVisible();
  await expect(page.getByText('Please check the form for errors.')).toBeVisible();
});

// TC_RF_011 - CUSTOM scope without selecting outlet
test('TC_RF_011 - CUSTOM scope without selecting outlet should fail', async ({ page }) => {
  const code = `C-${Date.now()}`;
  const name = `custom scope no outlet${Date.now()}`;

  await page.getByRole('button', { name: 'Add Role' }).click();
  await page.locator('#name').fill(name);
  await page.locator('#code').fill(code);
  await page.selectOption('select', { value: 'CUSTOM' });
  await page.locator('select').nth(1).selectOption({ label: 'Select Outlet' });
  await page.locator('#description').fill('No outlet selected');

  await page.getByRole('button', { name: 'Save And Add' }).click();
  await expect(page.getByText('Failed to create role')).toBeVisible();
});

// ─── CREATE ROLE — BEHAVIOUR ──────────────────────────────────────────────────

// TC_RF_022 - Reset button clears all form fields
test('TC_RF_022 - Reset button clears all form fields', async ({ page }) => {
  await page.getByRole('button', { name: 'Add Role' }).click();
  await page.locator('#name').fill('test role name');
  await page.locator('#code').fill('TEST-001');
  await page.locator('#description').fill('some description');

  await page.getByRole('button', { name: 'Reset' }).click();

  await expect(page.locator('#name')).toHaveValue('');
  await expect(page.locator('#code')).toHaveValue('');
  await expect(page.locator('#description')).toHaveValue('');
});


// ─── SEARCH TESTS ─────────────────────────────────────────────────────────────

// TC_RF_013 - Search existing role by name
test('TC_RF_013 - Search existing role by name', async ({ page }) => {
  await page.getByPlaceholder('Search roles...').fill('driver');
  await expect(page.getByText('driver')).toBeVisible({ timeout: 10000 });
});

// TC_RF_014 - Search with non-existing role name shows no results
test('TC_RF_014 - Search with non-existing role name shows no results', async ({ page }) => {
  await page.getByPlaceholder('Search roles...').fill('xyznotexist');
  await expect(page.getByText("Not found")).toBeVisible({ timeout: 10000 });
});

// ─── VIEW / EDIT / DELETE TESTS ───────────────────────────────────────────────

// TC_RF_015 - View role details via eye icon
test('TC_RF_015 - View role details via eye icon', async ({ page }) => {
  await page.locator('button:has(svg.lucide-eye)').first().click();
  await expect(page.getByText("Spaces only test")).toBeVisible({ timeout: 10000 });
});

// TC_RF_016 - Edit existing role name successfully
test('TC_RF_016 - Edit existing role name successfully', async ({ page }) => {

    const newName = `Updated Role ${Date.now()}`;

  await page.locator('svg.lucide-square-pen').first().click();
  await page.locator('#name').clear();
  await page.locator('#name').fill(newName);

  await page.getByRole('button', { name: 'Save And Update' }).click();
  await expect(page.getByText('Role updated successfully')).toBeVisible({ timeout: 10000 });
// });

// // TC_RF_017 - Delete role via delete icon
// test('TC_RF_017 - Delete role via delete icon', async ({ page }) => {
//   const rolesBefore = await page.locator('table tbody tr').count();

//   // Step 1 — trash icon click
//   await page.locator('button[title="common.delete"]').first().click();

//   // Step 2 — dialog ලා "Delete" button specifically target කරන්න
//   await page.locator('dialog, [role="dialog"], [ref=e529]')
//     .getByRole('button', { name: 'Delete' })
//     .click();

//   // Step 3 — success message verify
//   await expect(page.getByText('User Role deleted successfully.')).toBeVisible({ timeout: 10000 });

//   // Step 4 — row count verify
//   const rolesAfter = await page.locator('table tbody tr').count();
//   expect(rolesAfter).toBeLessThan(rolesBefore);
});



