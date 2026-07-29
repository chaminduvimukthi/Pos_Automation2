import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/Login';
import path from 'path';

// ─── Auth ──────────────────────────────────────────────────────────────────────

test.beforeEach(async ({ page }) => {
  const login = new LoginPage(page);
  await login.gotoLoginPage();
  await login.login('supun2@gmail.com', '12345678');
  await expect(page).toHaveURL('https://erp.autodemoapps.tech/dashboard');
});

// ─── Helpers ───────────────────────────────────────────────────────────────────

async function openProductForm(page) {
  await page.getByRole('link', { name: 'Products' }).click();
  await page.getByRole('button', { name: 'Add Product' }).click();
  await page.getByRole('button', { name: 'Restaurant Menu Item' }).click();
}

async function fillBasicDetails(page, overrides = {}) {
  const {
    name = 'Company Product 1',
    description = 'Company Level Product',
    price = '20',
  } = overrides;
  await page.getByPlaceholder('Enter menu item name').fill(name);
  await page.getByPlaceholder('Describe the dish').fill(description);
  await page.getByRole('textbox', { name: '0.00' }).fill(price);
}

async function uploadImage(page, filename = 'As.PNG') {
  const filePath = path.resolve(`test-data/${filename}`);
  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.getByRole('button', { name: 'Choose File' }).first().click(),
  ]);
  await fileChooser.setFiles(filePath);
  await page.waitForResponse(
    (res) => res.url().includes('upload') && res.status() === 200,
    { timeout: 30000 }
  );
}

async function selectDietaryTags(page, tags = []) {
  for (const tag of tags) {
    await page.getByRole('button', { name: tag, exact: true }).click();
  }
}

async function fillNutritionalDetails(page, overrides = {}) {
  const {
    ingredients = 'fish,chicken',
    preparationTime = '10',
    spiceLevel = 'Hot',
    servingSize = '100',
    calories = '123',
  } = overrides;
  await page.locator("//div[@data-field-code='ingredients']//textarea").fill(ingredients);
  await page.locator("(//input[@type='number'])[1]").fill(preparationTime);
  await page.locator('[data-field-code="spice_level"] select').selectOption(spiceLevel);
  await page.locator("//div[@data-field-code='serving_size']//input[@type='text']").fill(servingSize);
  await page.locator("//div[@data-field-code='calories']//input[@type='number']").fill(calories);
}

// ─── Test Cases ────────────────────────────────────────────────────────────────

/**
 * TC-01 – Happy path: all valid details → product created successfully
 */
test('TC-01: Create product with all valid details', async ({ page }) => {
  await openProductForm(page);
  await fillBasicDetails(page);
  await uploadImage(page);
  await selectDietaryTags(page, ['Dairy', 'Eggs', 'Vegan', 'Halal']);
  await fillNutritionalDetails(page);

  await expect(page.getByText('Image is required')).not.toBeVisible({ timeout: 10000 });
  await page.getByRole('button', { name: 'Create Product', exact: true }).click();
  await expect(page.getByText('Product created successfully')).toBeVisible({ timeout: 50000 });
});

/**
 * TC-02 – Validation: submit without image → "Image is required" shown
 */
test('TC-02: Should show error when image is not uploaded', async ({ page }) => {
  await openProductForm(page);
  await fillBasicDetails(page);
  await fillNutritionalDetails(page);

  await page.getByRole('button', { name: 'Create Product', exact: true }).click();
  await expect(page.getByText('Image is required')).toBeVisible({ timeout: 10000 });
});

/**
 * TC-03 – Validation: submit completely empty form → required errors appear
 */
test('TC-03: Should show validation errors when form is submitted empty', async ({ page }) => {
  await openProductForm(page);
  await page.getByRole('button', { name: 'Create Product', exact: true }).click();
  

  await expect(
    page.getByText("Please fix validation errors — Item Name is required").first()
  ).toBeVisible({ timeout: 10000 });
});

/**
 * TC-04 – Validation: submit without product name → name error shown
 */
test('TC-04: Should show error when product name is missing', async ({ page }) => {
  await openProductForm(page);
  await page.getByPlaceholder('Describe the dish').fill('Company Level Product');
  await page.getByRole('textbox', { name: '0.00' }).fill('20');
  await uploadImage(page);
  await fillNutritionalDetails(page);

  await page.getByRole('button', { name: 'Create Product', exact: true }).click();
  await expect(
    page.getByText("Please fix validation errors — Item Name is required")
  ).toBeVisible({ timeout: 10000 });
});

/**
 * TC-05 – Validation: price field with non-numeric input → field stays clean
 */
test('TC-05: Price field should reject non-numeric input', async ({ page }) => {
  await openProductForm(page);

  const priceField = page.getByRole('textbox', { name: '0.00' });
  await priceField.fill('abc!@#');

    await page.getByRole('button', { name: 'Create Product', exact: true }).click();
  await expect(page.getByText("Enter only numeric value ") )// must be empty or numeric only
});

/**
 * TC-06 – Dietary tags: create product with NO dietary tags selected
 */
test('TC-06: Should create product without selecting any dietary tag', async ({ page }) => {
  await openProductForm(page);
  await fillBasicDetails(page, { name: 'No Tag Product' });
  await uploadImage(page);
  await fillNutritionalDetails(page);

  await page.getByRole('button', { name: 'Create Product', exact: true }).click();
  await expect(page.getByText('Product created successfully')).toBeVisible({ timeout: 50000 });
});

/**
 * TC-07 – Dietary tags: toggle a tag on then off → tag is deselected
 */
test('TC-07: Should be able to deselect a dietary tag after selecting it', async ({ page }) => {
  await openProductForm(page);

  const dairyBtn = page.getByRole('button', { name: 'Dairy', exact: true });

  // Select
  await dairyBtn.click();
  await expect(dairyBtn).toHaveClass(/active|selected|bg-/);

  // Deselect
  await dairyBtn.click();
  await expect(dairyBtn).not.toHaveClass(/active|selected|bg-/);
});

/**
 * TC-08 – Spice level: create product with "Mild" spice level
 */
test('TC-08: Should create product with Mild spice level', async ({ page }) => {
  await openProductForm(page);
  await fillBasicDetails(page, { name: 'Mild Spice Product' });
  await uploadImage(page);
  await selectDietaryTags(page, ['Vegan']);
  await fillNutritionalDetails(page, { spiceLevel: 'Mild' });

  await page.getByRole('button', { name: 'Create Product', exact: true }).click();
  await expect(page.getByText('Product created successfully')).toBeVisible({ timeout: 50000 });
});

// /**
 //TC-09 – Spice level: create product with "Medium" spice level
 
test('TC-09: Should create product with Medium spice level', async ({ page }) => {
  await openProductForm(page);
  await fillBasicDetails(page, { name: 'Medium Spice Product' });
  await uploadImage(page);
  await selectDietaryTags(page, ['Halal']);
  await fillNutritionalDetails(page, { spiceLevel: 'Medium' });

  await page.getByRole('button', { name: 'Create Product', exact: true }).click();
  await expect(page.getByText('Product created successfully')).toBeVisible({ timeout: 50000 });
});

// /**
 // TC-10 – Duplicate product: creating same product name twice → error or handled gracefully
test('TC-10: Should handle duplicate product name appropriately', async ({ page }) => {
  const productName = `Duplicate Product ${Date.now()}`;

  // ── First creation (should succeed) ──
  await openProductForm(page);
  await fillBasicDetails(page, { name: productName });
  await uploadImage(page);
  await selectDietaryTags(page, ['Dairy']);
  await fillNutritionalDetails(page);
  await page.getByRole('button', { name: 'Create Product', exact: true }).click();
  await expect(page.getByText('Product created successfully')).toBeVisible({ timeout: 50000 });

  // ── Second creation with same name ──
  await openProductForm(page);
  await fillBasicDetails(page, { name: productName });
  await uploadImage(page);
  await selectDietaryTags(page, ['Dairy']);
  await fillNutritionalDetails(page);
  await page.getByRole('button', { name: 'Create Product', exact: true }).click();

  // App should either block it or warn — must NOT silently succeed with no feedback
  const duplicateError = page.getByText('Already have ');
  const unexpectedSuccess = page.getByText('Product created successfully');
  await expect(duplicateError.or(unexpectedSuccess)).toBeVisible({ timeout: 50000 });
});

// /**
//  * TC-11 – Boundary: product name at maximum character length (255 chars)
//  */
 test('TC-11: Should handle maximum length product name gracefully', async ({ page }) => {
   const longName = 'A'.repeat(500);

   await openProductForm(page);
   await fillBasicDetails(page, { name: longName });
   await uploadImage(page);
   await fillNutritionalDetails(page);

   await page.getByRole('button', { name: 'Create Product', exact: true }).click();

   const outcome = page
     .getByText('Enter a name with 255 characters or fewer');
   await expect(outcome).toBeVisible({ timeout: 50000 });
});

/**

// /**
//  * TC-14 – Special characters in ingredients field
//  */
 test('TC-14: Should accept special characters in ingredients field', async ({ page }) => {
   await openProductForm(page);
  await fillBasicDetails(page, { name: 'Special Ingredient Product' });
  await uploadImage(page);
  await selectDietaryTags(page, ['Vegan']);
  await fillNutritionalDetails(page, {
    ingredients: 'fish & chips, jalapeño, garlic (roasted), soy-sauce',
   });

   await page.getByRole('button', { name: 'Create Product', exact: true }).click();
  await expect(page.getByText('Product created successfully')).toBeVisible({ timeout: 50000 });
 });

/**
 * TC-15 – Minimum valid price (0.01)
 */
test('TC-15: Should create product with minimum valid price of 0.01', async ({ page }) => {
  await openProductForm(page);
  await fillBasicDetails(page, { name: 'Cheapest Product', price: '0.01' });
  await uploadImage(page);
  await selectDietaryTags(page, ['Halal']);
  await fillNutritionalDetails(page);

  await page.getByRole('button', { name: 'Create Product', exact: true }).click();

  const outcome = page
    .getByText('Product created successfully')
    .or(page.getByText("Enter a price of at least 0.01"));
  await expect(outcome).toBeVisible({ timeout: 50000 });
});