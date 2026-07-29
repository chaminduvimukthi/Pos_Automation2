const { test, expect } = require('@playwright/test');

// ─── HELPER FUNCTIONS ──────────────────────────────────────────────────────────

async function fillStep1(page, email, password = '8KArI26b@OS2PZjsO') {
  await page.fill('#firstName', 'Test');
  await page.fill('#lastName', 'User');
  await page.fill('#email', email);
  await page.fill('#password', password);
  await page.click('//button[normalize-space()="Continue"]');
}

async function fillStep2(page, registrationNumber, options = {}) {
  const {
    businessName = 'ABC Corp',
    taxNumber = 'TN123456',
    phone = '0777123456',
    country = 'Sri Lanka',
    industry = 'Retail & E-commerce',
    companySize = '1-10 employees',
  } = options;

  await page.fill('#businessName', businessName);
  await page.fill('#registrationNumber', registrationNumber);
  await page.fill('#taxNumber', taxNumber);
  await page.fill('#phone', phone);
  await page.selectOption('#country', country);
  await page.selectOption('#industry', industry);
  await page.selectOption('#companySize', companySize);
  await page.click('//button[normalize-space()="Continue"]');
}

async function fillStep3AndSubmit(page, options = {}) {
  const { currency = 'US Dollar ($)', timeZone = 'Pacific Time (US)' } = options;
  await page.selectOption('#currency', currency);
  await page.selectOption('#timeZone', timeZone);
  await page.click('//button[normalize-space()="Continue"]');
  await page.click('//button[normalize-space()="Create Account"]');
}

// ─── STEP 1 TESTS — PERSONAL INFO ──────────────────────────────────────────────

// 1) Happy path - valid registration
test('TC_REG_001 - Register with valid details', async ({ page }) => {
  await page.goto('https://amenu.autodemoapps.tech/register');

  const timestamp = Date.now();
  const email = `test${timestamp}@gmail.com`;
  const registrationNumber = `REG${timestamp}`;

  await fillStep1(page, email);
  await fillStep2(page, registrationNumber, { businessName: 'AB2 Corp' });
  await fillStep3AndSubmit(page);

  await expect(page).toHaveURL('https://erp.autodemoapps.tech/shop-setup', { timeout: 500000 });
});


// 2) Empty first name
test('TC_REG_002 - Register with empty first name', async ({ page }) => {
  await page.goto('https://erp.autodemoapps.tech/register');

  const email = `test${Date.now()}@gmail.com`;

  await page.fill('#firstName', '');
  await page.fill('#lastName', 'User');
  await page.fill('#email', email);
  await page.fill('#password', '8KArI26b@OS2PZjsO');
  await page.click('//button[normalize-space()="Continue"]');

  await expect(page.getByText('First name is required')).toBeVisible();
});


// 3) Empty last name
test('TC_REG_003 - Register with empty last name', async ({ page }) => {
  await page.goto('https://erp.autodemoapps.tech/register');

  const email = `test${Date.now()}@gmail.com`;

  await page.fill('#firstName', 'test');
  await page.fill('#lastName', '');
  await page.fill('#email', email);
  await page.fill('#password', '8KArI26b@OS2PZjsO');
  await page.click('//button[normalize-space()="Continue"]');

  await expect(page.getByText('Last name is required')).toBeVisible();
});


// 4) Empty email
test('TC_REG_004 - Register with empty email', async ({ page }) => {
  await page.goto('https://erp.autodemoapps.tech/register');

  await page.fill('#firstName', 'test');
  await page.fill('#lastName', 'user');
  await page.fill('#email', '');
  await page.fill('#password', '8KArI26b@OS2PZjsO');
  await page.click('//button[normalize-space()="Continue"]');

  await expect(page.getByText('Email is required')).toBeVisible();
});


// 5) Empty password
test('TC_REG_005 - Register with empty password', async ({ page }) => {
  await page.goto('https://erp.autodemoapps.tech/register');

  const email = `test${Date.now()}@gmail.com`;

  await page.fill('#firstName', 'test');
  await page.fill('#lastName', 'user');
  await page.fill('#email', email);
  await page.fill('#password', '');
  await page.click('//button[normalize-space()="Continue"]');

  await expect(page.getByText('Password is required')).toBeVisible();
});


// 6) All step 1 fields empty
test('TC_REG_006 - Register with all step 1 fields empty', async ({ page }) => {
  await page.goto('https://erp.autodemoapps.tech/register');

  await page.click('//button[normalize-space()="Continue"]');

  await expect(page.getByText('First name is required')).toBeVisible();
  await expect(page.getByText('Last name is required')).toBeVisible();
  await expect(page.getByText('Email is required')).toBeVisible();
  await expect(page.getByText('Password is required')).toBeVisible();
});


// 7) Invalid email format (no @)
test('TC_REG_007 - Register with invalid email format', async ({ page }) => {
  await page.goto('https://erp.autodemoapps.tech/register');

  await page.fill('#firstName', 'test');
  await page.fill('#lastName', 'user');
  await page.fill('#email', 'testemail.com');
  await page.fill('#password', '8KArI26b@OS2PZjsO');
  await page.click('//button[normalize-space()="Continue"]');

  await expect(page.getByText('Enter a valid email')).toBeVisible();
});


// 8) Email without domain
test('TC_REG_008 - Register with email without domain', async ({ page }) => {
  await page.goto('https://erp.autodemoapps.tech/register');

  const email = `test${Date.now()}@`;

  await page.fill('#firstName', 'test');
  await page.fill('#lastName', 'user');
  await page.fill('#email', email);
  await page.fill('#password', '8KArI26b@OS2PZjsO');
  await page.click('//button[normalize-space()="Continue"]');

  await expect(page.getByText('Enter a valid email')).toBeVisible();
});


// 9) Already registered email
test('TC_REG_009 - Register with already registered email', async ({ page }) => {
  await page.goto('https://erp.autodemoapps.tech/register');

  const registrationNumber = `REG${Date.now()}`;

  await page.fill('#firstName', 'Test');
  await page.fill('#lastName', 'User');
  await page.fill('#email', 'hgp.ashi@gmail.com'); // existing email
  await page.fill('#password', '8KArI26b@OS2PZjsO');
  await page.click('//button[normalize-space()="Continue"]');

  await fillStep2(page, registrationNumber);
  await fillStep3AndSubmit(page);

  await expect(page.getByText('User with email hgp.ashi@gmail.com already exists')).toBeVisible({ timeout: 500000 });
});


// ─── STEP 1 TESTS — PASSWORD ────────────────────────────────────────────────────

// 10) Password less than minimum length
test('TC_REG_010 - Register with password less than minimum length', async ({ page }) => {
  await page.goto('https://erp.autodemoapps.tech/register');

  const email = `test${Date.now()}@gmail.com`;

  await page.fill('#firstName', 'Test');
  await page.fill('#lastName', 'User');
  await page.fill('#email', email);
  await page.fill('#password', 'abc'); // too short
  await page.click('//button[normalize-space()="Continue"]');

  await expect(page.getByText('Password must be at least 8 characters')).toBeVisible();
});


// 11) Password without special characters
test('TC_REG_011 - Register with password without special characters', async ({ page }) => {
  await page.goto('https://erp.autodemoapps.tech/register');

  const email = `test${Date.now()}@gmail.com`;

  await page.fill('#firstName', 'Test');
  await page.fill('#lastName', 'User');
  await page.fill('#email', email);
  await page.fill('#password', 'Password123'); // no special char
  await page.click('//button[normalize-space()="Continue"]');

  await expect(page.getByText('Password must contain at least one special character')).toBeVisible();
});


// 12) Password without uppercase letters
test('TC_REG_012 - Register with password without uppercase letters', async ({ page }) => {
  await page.goto('https://erp.autodemoapps.tech/register');

  const email = `test${Date.now()}@gmail.com`;

  await page.fill('#firstName', 'Test');
  await page.fill('#lastName', 'User');
  await page.fill('#email', email);
  await page.fill('#password', 'password@123'); // no uppercase
  await page.click('//button[normalize-space()="Continue"]');

  await expect(page.getByText('Password must contain at least one uppercase letter')).toBeVisible();
});


// 13) Password with numbers only
test('TC_REG_013 - Register with password numbers only', async ({ page }) => {
  await page.goto('https://erp.autodemoapps.tech/register');

  const email = `test${Date.now()}@gmail.com`;

  await page.fill('#firstName', 'Test');
  await page.fill('#lastName', 'User');
  await page.fill('#email', email);
  await page.fill('#password', '12345678'); // numbers only
  await page.click('//button[normalize-space()="Continue"]');

  await expect(page.getByText('Password must contain at least one uppercase letter')).toBeVisible();
});


// ─── STEP 2 TESTS — BUSINESS INFO ──────────────────────────────────────────────

// 14) Empty business name
test('TC_REG_014 - Register with empty business name', async ({ page }) => {
  await page.goto('https://erp.autodemoapps.tech/register');

  const timestamp = Date.now();
  const email = `test${timestamp}@gmail.com`;
  const registrationNumber = `REG${timestamp}`;

  await fillStep1(page, email);

  await page.fill('#businessName', ''); // empty
  await page.fill('#registrationNumber', registrationNumber);
  await page.fill('#taxNumber', 'TN123456');
  await page.fill('#phone', '0773467888');
  await page.selectOption('#country', 'Sri Lanka');
  await page.selectOption('#industry', 'Retail & E-commerce');
  await page.selectOption('#companySize', '1-10 employees');
  await page.click('//button[normalize-space()="Continue"]');

  await expect(page.getByText('Business name is required')).toBeVisible({ timeout: 10000 });
});


// 15) Empty registration number
test('TC_REG_015 - Register with empty registration number', async ({ page }) => {
  await page.goto('https://erp.autodemoapps.tech/register');

  const email = `test${Date.now()}@gmail.com`;

  await fillStep1(page, email);

  await page.fill('#businessName', 'ABC Corp');
  await page.fill('#registrationNumber', ''); // empty
  await page.fill('#taxNumber', 'TN123456');
  await page.fill('#phone', '0773467888');
  await page.selectOption('#country', 'Sri Lanka');
  await page.selectOption('#industry', 'Retail & E-commerce');
  await page.selectOption('#companySize', '1-10 employees');
  await page.click('//button[normalize-space()="Continue"]');

  await expect(page.getByText('Registration number is required')).toBeVisible({ timeout: 10000 });
});


//16) Duplicate registration number
test('TC_REG_016 - Register with duplicate registration number', async ({ page }) => {
  await page.goto('h ttps://erp.autodemoapps.tech/register');

  const email = `test${Date.now()}@gmail.com`;

  await fillStep1(page, email);

  await page.fill('#businessName', 'ABC Corp');
  await page.fill('#registrationNumber', 'REG-123459'); // intentionally duplicate
  await page.fill('#taxNumber', 'TN123456');
  await page.fill('#phone', '0773467888');
  await page.selectOption('#country', 'Sri Lanka');
  await page.selectOption('#industry', 'Retail & E-commerce');
  await page.selectOption('#companySize', '1-10 employees');
  await page.click('//button[normalize-space()="Continue"]');
  await page.click('//button[normalize-space()="Continue"]');
  await page.click("//button[normalize-space()='Create Account']//*[name()='svg']");

  await expect(page.getByText("A business with registration number 'REG-123459' is already registered")).toBeVisible({ timeout: 10000 });
});


// 17) Invalid tax number format
test('TC_REG_017 - Register with invalid tax number format', async ({ page }) => {
  await page.goto('https://erp.autodemoapps.tech/register');

  const timestamp = Date.now();
  const email = `test${timestamp}@gmail.com`;
  const registrationNumber = `REG${timestamp}`;

  await fillStep1(page, email);
  await fillStep2(page, registrationNumber, { taxNumber: 'T156' }); // invalid tax
  await fillStep3AndSubmit(page);

  await expect(page.getByText('Enter valid format  tax number')).toBeVisible({ timeout: 500000 });
});


// 18) Empty tax number (optional - should pass)
test('TC_REG_018 - Register with empty tax number - optional field', async ({ page }) => {
  await page.goto('https://erp.autodemoapps.tech/register');

  const timestamp = Date.now();
  const email = `test${timestamp}@gmail.com`;
  const registrationNumber = `REG${timestamp}`;

  await fillStep1(page, email);
  await fillStep2(page, registrationNumber, { taxNumber: '' }); // empty tax

  // Should proceed to step 3 with no error
  await expect(page.locator('#currency')).toBeVisible({ timeout: 10000 });
});


// // 19) Phone number with letters
test('TC_REG_019 - Register with phone number containing letters', async ({ page }) => {
  await page.goto('https://erp.autodemoapps.tech/register');

  const timestamp = Date.now();
  const email = `test${timestamp}@gmail.com`;
  const registrationNumber = `REG${timestamp}`;

  await fillStep1(page, email);
  await fillStep2(page, registrationNumber, { phone: '077abc1234' });
  await fillStep3AndSubmit(page);

  await expect(page.getByText('Phone number can only contain digits, spaces, and + - ( )')).toBeVisible({ timeout: 500000 });
});


// 20) Phone number too short
test('TC_REG_020 - Register with phone number too short', async ({ page }) => {
  await page.goto('https://erp.autodemoapps.tech/register');

  const timestamp = Date.now();
  const email = `test${timestamp}@gmail.com`;
  const registrationNumber = `REG${timestamp}`;

  await fillStep1(page, email);
  await fillStep2(page, registrationNumber, { phone: '07712' }); // too short
  await fillStep3AndSubmit(page);

  await expect(page.getByText('Phone number is too short')).toBeVisible({ timeout: 500000 });
});


// 21) Empty phone number
test('TC_REG_021 - Register with empty phone number', async ({ page }) => {
  await page.goto('https://erp.autodemoapps.tech/register');

  const timestamp = Date.now();
  const email = `test${timestamp}@gmail.com`;
  const registrationNumber = `REG${timestamp}`;

  await fillStep1(page, email);
  await fillStep2(page, registrationNumber, { phone: '' }); // empty phone

  await expect(page.getByText("Phone number is required")).toBeVisible({ timeout: 10000 });
});


// 22) Without selecting country
test('TC_REG_022 - Register without selecting country', async ({ page }) => {
  await page.goto('https://erp.autodemoapps.tech/register');

  const timestamp = Date.now();
  const email = `test${timestamp}@gmail.com`;
  const registrationNumber = `REG${timestamp}`;

  await fillStep1(page, email);
  await fillStep2(page, registrationNumber, { country: '', industry: '', companySize: '' });

  await expect(page.getByText('Country is required')).toBeVisible({ timeout: 10000 });
});


// 23) Without selecting industry
test('TC_REG_023 - Register without selecting industry', async ({ page }) => {
  await page.goto('https://erp.autodemoapps.tech/register');

  const timestamp = Date.now();
  const email = `test${timestamp}@gmail.com`;
  const registrationNumber = `REG${timestamp}`;

  await fillStep1(page, email);

  await page.fill('#businessName', 'ABC Corp');
  await page.fill('#registrationNumber', registrationNumber);
  await page.fill('#taxNumber', 'TN123456');
  await page.fill('#phone', '0777123456');
  await page.selectOption('#country', 'Sri Lanka');
  // industry left empty
  await page.selectOption('#companySize', '1-10 employees');
  await page.click('//button[normalize-space()="Continue"]');

  await expect(page.getByText("Industry is required")).toBeVisible({ timeout: 10000 });
});


// 24) Without selecting company size
test('TC_REG_024 - Register without selecting company size', async ({ page }) => {
  await page.goto('https://erp.autodemoapps.tech/register');

  const timestamp = Date.now();
  const email = `test${timestamp}@gmail.com`;
  const registrationNumber = `REG${timestamp}`;

  await fillStep1(page, email);

  await page.fill('#businessName', 'ABC Corp');
  await page.fill('#registrationNumber', registrationNumber);
  await page.fill('#taxNumber', 'TN123456');
  await page.fill('#phone', '0777123456');
  await page.selectOption('#country', 'Sri Lanka');
  await page.selectOption('#industry', 'Retail & E-commerce');
  // companySize left empty
  await page.click('//button[normalize-space()="Continue"]');

  await expect(page.getByText("Company size is required")).toBeVisible({ timeout: 10000 });
});




// ─── NAVIGATION TESTS ──────────────────────────────────────────────────────────

// 27) Back button from step 3 returns to step 2 with data
test('TC_REG_027 - Back button from step 3 returns to step 2 with data preserved', async ({ page }) => {
  await page.goto('https://erp.autodemoapps.tech/register');

  const timestamp = Date.now();
  const email = `test${timestamp}@gmail.com`;
  const registrationNumber = `REG${timestamp}`;

  await fillStep1(page, email);
  await fillStep2(page, registrationNumber);

  // Now on step 3, go back
  await page.click('//button[normalize-space()="Back"]');

  // Step 2 data should still be there
  await expect(page.locator('#businessName')).toHaveValue('ABC Corp');
});


// ─── SUBMIT BEHAVIOR TESTS ──────────────────────────────────────────────────────

// 28) Multiple clicks on Create Account button
test('TC_REG_028 - Multiple clicks on Create Account button', async ({ page }) => {
  await page.goto('https://erp.autodemoapps.tech/register');

  const timestamp = Date.now();
  const email = `test${timestamp}@gmail.com`;
  const registrationNumber = `REG${timestamp}`;

  await fillStep1(page, email);
  await fillStep2(page, registrationNumber);

  await page.selectOption('#currency', 'US Dollar ($)');
  await page.selectOption('#timeZone', 'Pacific Time (US)');
  await page.click('//button[normalize-space()="Continue"]');

  // Multiple clicks - should not create duplicate accounts
  const registerButton = page.locator('//button[normalize-space()="Create Account"]');
  await registerButton.click();
  await registerButton.click();
  await registerButton.click();

  await expect(page).toHaveURL('https://erp.autodemoapps.tech/shop-setup', { timeout: 500000 });
});

