import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/Login';

test.beforeEach(async ({ page }) => {

 const login = new LoginPage(page);

 await login.gotoLoginPage();
 await login.login('hgp.ashi@gmail.com','vendor@1234');

 await expect(page).toHaveURL('https://amenu.autodemoapps.tech/dashboard');

});


//Reusable function
async function openCategoryPage(page){

 await page.getByRole('complementary')
 .getByText('Product Config').click();

 await page.getByRole('link',
 { name:'Categories'}).click();

}


//---------------------------------------------------
//1 Create category with valid details
//---------------------------------------------------

test('Create product category with valid details', async ({ page }) => {

 await openCategoryPage(page);

 await page.getByRole('button',
 {name:'Add Category'}).click();

 const categoryName=`Company Product ${Date.now()}`;

 await page.getByPlaceholder('Enter category name')
 .fill(categoryName);

 await page.locator('select')
 .selectOption({label:'Beverages'});

 await page.getByPlaceholder(
 'Optional description for this category...'
 ).fill('Company Level Product Category');

 await page.getByRole('button',
 {name:'Save Category'}).click();

 await expect(
 page.getByText('Category created successfully')
 ).toBeVisible();

});


//---------------------------------------------------
//2 Duplicate category validation
//---------------------------------------------------

test('Create duplicate product category', async ({ page }) => {

 await openCategoryPage(page);

 await page.getByRole('button',
 {name:'Add Category'}).click();

 await page.getByPlaceholder('Enter category name')
 .fill('Beverages');

 await page.getByPlaceholder(
 'Optional description for this category...'
 ).fill('Duplicate category test');

 await page.getByRole('button',
 {name:'Save Category'}).click();

 await expect(
 page.getByText("A category with the name 'Beverages' already exists")
 ).toBeVisible();

});


// ---------------------------------------------------
// 3 Active/Inactive status check
// ---------------------------------------------------

test('Check existing category active status', async ({ page }) => {

 await openCategoryPage(page);

 await page.getByRole('button', { name: 'Active' }).nth(1).click();

 await expect(
 page.getByText('Category status updated')
 ).toBeVisible({timeout:10000});

});


//---------------------------------------------------
//4 Minimum character validation
//---------------------------------------------------

test('Create category one word validation', async ({ page }) => {

 await openCategoryPage(page);

 await page.getByRole('button',
 {name:'Add Category'}).click();

 await page.getByPlaceholder('Enter category name')
 .fill('a');

 await page.getByRole('button',
 {name:'Save Category'}).click();

 await expect(
 page.getByText('Category name must be at least 3 characters')
 ).toBeVisible();

});


//---------------------------------------------------
//5 Empty field validation
//---------------------------------------------------

test('Category required field validation', async ({ page }) => {

 await openCategoryPage(page);

 await page.getByRole('button',
 {name:'Add Category'}).click();

 await page.getByRole('button',
 {name:'Save Category'}).click();

 await expect(
 page.getByText('Category name is required')
 ).toBeVisible();

});


//---------------------------------------------------
//6 Search category
//---------------------------------------------------

test('Search existing category', async ({ page }) => {

 await openCategoryPage(page);

 await page.getByPlaceholder('Search')
 .fill('Beverages');

 await expect(
 page.getByText('Beverages')
 ).toBeVisible();

});


// ---------------------------------------------------
// 7 Update category
// ---------------------------------------------------

test('Update category successfully', async ({ page }) => {

 await openCategoryPage(page);

  await page.locator('div').filter({ hasText: 'Beverages' }).click();

 const categoryName=`Company Product ${Date.now()}`;

 await page.locator('input[name="categoryName"]')
 .fill(categoryName);

 await page.getByRole('button',
 {name:'Save Category'}).click({delay:1000});

 await expect(
 page.getByText('Category updated successfully')
 ).toBeVisible();

});


//---------------------------------------------------
//8 Delete category
//---------------------------------------------------

test('Delete category successfully', async ({ page }) => {

 await openCategoryPage(page);

 await page.getByRole('button',
 {name:'Delete'}).last().click();

 await page.getByRole('button',
 {name:'Confirm'}).click();

 await expect(
 page.getByText('Category deleted successfully')
 ).toBeVisible();

});