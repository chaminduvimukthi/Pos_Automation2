import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/Login';

test.beforeEach(async ({ page }) => {
  const login = new LoginPage(page);
  await login.gotoLoginPage();
  await login.login('supun2@gmail.com', '12345678');
  await expect(page).toHaveURL('https://amenu.autodemoapps.tech/dashboard');
});


// ─── Reusable: navigate to Product Types ────────────────────────────────────
async function openProductType(page) {
  await page.getByRole('complementary').getByText('Product Config').click();
  await page.getByRole('link', { name: 'Product Types' }).click();
}


// ─── Reusable: select wizard fields ─────────────────────────────────────────
async function selectFields(page) {
  await page.getByRole('button', { name: 'Product Test' }).click();
  await page.getByRole('button', { name: 'Product Description' }).click();
  await page.getByRole('button', { name: 'Cost Price' }).click();
  await page.getByRole('button', { name: 'Minimum Stock Level' }).click();
  await page.getByRole('button', { name: 'Weight' }).click();
}


// ────────────────────────────────────────────────────────────────────────────
// 1. Create valid product type
// ────────────────────────────────────────────────────────────────────────────
test('Create product type with valid details', async ({ page }) => {
  await openProductType(page);

  await page.getByRole('button', { name: 'Create Product Type' }).click();

  // Random letters-only name to avoid duplicate errors
  const words = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Sigma'];
  const productName = `Product Type ${words[Math.floor(Math.random() * words.length)]}`;

  await page.getByPlaceholder('e.g., Grocery Product, Electronics Item').fill(productName);
  await page.getByPlaceholder('Describe this product type and when it should be used...').fill('Company Level Product Type');

  await page.getByRole('button', { name: 'Continue' }).last().click();

  await selectFields(page);
  await page.getByRole('button', { name: 'Continue' }).last().click();

  await page.getByRole('checkbox').first().check();
  await page.getByRole('button', { name: 'Continue' }).last().click();

  await page.getByRole('button', { name: 'Create Product Type' }).click();

  await expect(
    page.getByText('Product type created successfully')
  ).toBeVisible({ timeout: 150000 });
});


// ────────────────────────────────────────────────────────────────────────────
// 2. Duplicate name validation
// ────────────────────────────────────────────────────────────────────────────
test('Create duplicate product type', async ({ page }) => {
  await openProductType(page);

  await page.getByRole('button', { name: 'Create Product Type' }).click();

  // Use a name that already exists in the system
  await page.getByPlaceholder('e.g., Grocery Product, Electronics Item').fill('Food Itemss');
  await page.getByPlaceholder('Describe this product type and when it should be used...').fill('Duplicate check');

  await page.getByRole('button', { name: 'Continue' }).last().click();

  await selectFields(page);
  await page.getByRole('button', { name: 'Continue' }).last().click();

  await page.getByRole('checkbox').first().check();
  await page.getByRole('button', { name: 'Continue' }).last().click();

  await page.getByRole('button', { name: 'Create Product Type' }).click();

  await expect(
    page.getByText('Failed to save product type')
  ).toBeVisible({ timeout: 10000 });
});


// ────────────────────────────────────────────────────────────────────────────
// 3. Spaces-only input validation
//    Fill spaces → try to proceed → expect validation error OR Continue disabled
// ────────────────────────────────────────────────────────────────────────────
test('Create space only product type', async ({ page }) => {
  await openProductType(page);

  await page.getByRole('button', { name: 'Create Product Type' }).click();

  await page.getByPlaceholder('e.g., Grocery Product, Electronics Item').fill('         ');

  // FIX: Check that Continue/Next button is disabled — do NOT click it first
  const continueBtn = page.getByRole('button', { name: 'Continue' }).last();
  await expect(continueBtn).toBeDisabled();
});


// ────────────────────────────────────────────────────────────────────────────
// 4. Empty required field — Continue button should be disabled
// ────────────────────────────────────────────────────────────────────────────
test('Empty required field validation', async ({ page }) => {
  await openProductType(page);

  await page.getByRole('button', { name: 'Create Product Type' }).click();

  // FIX: Check Continue is disabled when name field is empty — not the Create button
  const continueBtn = page.getByRole('button', { name: 'Continue' }).last();
  await expect(continueBtn).toBeDisabled();
});


// ────────────────────────────────────────────────────────────────────────────
// 5. Search existing product type
// ────────────────────────────────────────────────────────────────────────────
test('Search existing product type', async ({ page }) => {
  await openProductType(page);

  await page.getByPlaceholder('Search').fill('Restaurant Menu Item');

  await expect(
    page.getByText('Restaurant Menu Item')
  ).toBeVisible({ timeout: 10000 });
});


// ────────────────────────────────────────────────────────────────────────────
// 6. Update product type
// ────────────────────────────────────────────────────────────────────────────
test('Update product type', async ({ page }) => {
  await openProductType(page);

  await page.getByRole('button', { name: 'Edit' }).first().click();

  // Clear field and enter new name
  const nameField = page.getByPlaceholder('e.g., Grocery Product, Electronics Item');
  await nameField.clear();
  await nameField.fill('Updated Product Type');

  // Step 1 → Step 2
  await page.locator("//button[normalize-space()='Next']").click();

  // Wait for Step 2 to load, then click fields
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: 'Spice Level spice_level ·' }).click();
  await page.getByRole('button', { name: 'Product Images images · json' }).click();

  // Step 2 → Step 3
  await page.locator("//button[normalize-space()='Next']").click();

  // Step 3 → Review
  await page.waitForTimeout(500);
  await page.locator("//button[normalize-space()='Next']").click();

  await page.getByRole('button', { name: 'Update Product Type' }).click();

  await expect(
    page.getByText('Product type updated successfully')
  ).toBeVisible({ timeout: 150000 });
});


// ────────────────────────────────────────────────────────────────────────────
// 7. Deactivate an active product type (toggle Active → Inactive)
// ────────────────────────────────────────────────────────────────────────────
test('Product type deactivate status toggle', async ({ page }) => {
  await openProductType(page);

  // FIX: Click 'Active' button to deactivate, and assert deactivation message
await page.getByRole('button', { name: 'Active' }).nth(2).click();

  await expect(
    page.getByText('Product type deactivated successfully')
  ).toBeVisible({ timeout: 10000 });
});