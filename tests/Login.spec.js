const { test, expect } = require('@playwright/test');

test.describe('Login Page Tests', () => {

  // 1)Positive Test Case
  test('Login with valid username and password', async ({ page }) => {

    await page.goto('https://amenu.autodemoapps.tech/login');

    await page.fill('#email', 'hgp.ashi@gmail.com');
    await page.fill('#password', 'vendor@1234');

    await page.click('//button[normalize-space()="Sign in"]');

    
    await expect(page).toHaveURL('https://erp.autodemoapps.tech/dashboard');
        
  });


//  2)Negative Test Case
  test('Valid username + invalid password', async ({ page }) => {

    await page.goto('https://amenu.autodemoapps.tech/login');

    await page.fill('#email', 'hgp.ashi@gmail.com');
    await page.fill('#password', 'vendor@123');

    await page.click('//button[normalize-space()="Sign in"]');

    
    await expect(page.locator('//p[@class=\'text-sm text-red-600\']')).toHaveText('Invalid email or password');
  });


  // 3)Empty Username
  test('Empty username + valid password', async ({ page }) => {

    await page.goto('https://amenu.autodemoapps.tech/login');

    await page.fill('#password', 'vendor@1234');

    await page.click('//button[normalize-space()="Sign in"]');

    await expect(page.locator('//p[@class=\'mt-1.5 text-sm text-red-500 flex items-center gap-1\']')).toHaveText('Username or email is required.');
  });


  // 4)Empty Password
  test('Valid username + empty password', async ({ page }) => {

    await page.goto('https://amenu.autodemoapps.tech/login');

    await page.fill('#email', 'hgp.ashi@gmail.com');

    await page.click('//button[normalize-space()="Sign in"]');

    await expect(page.locator('//p[@class=\'mt-1.5 text-sm text-red-500 flex items-center gap-1\']')).toHaveText('Password is required.');
  });


  // 5)Both Empty
  test('Both username and password empty', async ({ page }) => {

    await page.goto('https://amenu.autodemoapps.tech/login');

    await page.click('//button[normalize-space()="Sign in"]');

    await expect(page.locator('//p[@class="text-sm text-red-600"]')).toHaveText('Both username/email and password are required.');
    
  });
  // 6)Login using Enter key
  test('Login using Enter key', async ({ page }) => {

  await page.goto('https://amenu.autodemoapps.tech/login');

  await page.fill('#email', 'hgp.ashi@gmail.com');
  await page.fill('#password', 'vendor@1234');

  await page.press('#password', 'Enter');

  await expect(page).toHaveURL('https://erp.autodemoapps.tech/dashboard');

});
    // 7)Username  with only spaces
   test('Username with only spaces', async ({ page }) => {

  await page.goto('https://amenu.autodemoapps.tech/login');

  await page.fill('#email', '   ');
  await page.fill('#password', 'vendor@1234');

  await page.click('//button[normalize-space()="Sign in"]');

  await expect(page.getByText('Invalid username or email format.')).toBeVisible();

});
// 8)Password with only spaces
test('Password with only spaces', async ({ page }) => {

  await page.goto('https://amenu.autodemoapps.tech/login');

  await page.fill('#email', 'hgp.ashi@gmail.com');
  await page.fill('#password', '   ');

  await page.click('//button[normalize-space()="Sign in"]');

  await expect(page.getByText('Validation failed')).toBeVisible();

});
// 9)Username with leading spaces
test('Username with leading spaces', async ({ page }) => {

  await page.goto('https://amenu.autodemoapps.tech/login');

  await page.fill('#email', '   hgp.ashi@gmail.com');
  await page.fill('#password', 'vendor@1234');

  await page.click('//button[normalize-space()="Sign in"]');

  
  await expect(page.getByText('Invalid username or email format.')).toBeVisible();

});
//10)Password with trailing spaces
test('Password with trailing spaces', async ({ page }) => {

  await page.goto('https://amenu.autodemoapps.tech/login');

  await page.fill('#email', 'hgp.ashi@gmail.com');
  await page.fill('#password', 'vendor@1234   ');

  await page.click('//button[normalize-space()="Sign in"]');

  await expect(page.getByText('Invalid email or password')).toBeVisible();

});
//11)Username with special characters
test('Username with special characters', async ({ page }) => {

  await page.goto('https://amenu.autodemoapps.tech/login');

  await page.fill('#email', '@@@###');
  await page.fill('#password', 'vendor@1234');

  await page.click('//button[normalize-space()="Sign in"]');

  await expect(page.getByText('Invalid username or email format.')).toBeVisible();

});
//12)Boundary Test – Very Long Username
test('Very long username', async ({ page }) => {

  await page.goto('https://amenu.autodemoapps.tech/login');

  const longUsername = 'a'.repeat(500);

  await page.fill('#email', longUsername);
  await page.fill('#password', 'vendor@1234');

  await page.click('//button[normalize-space()="Sign in"]');

  await expect(page.getByText('Invalid username or email format.')).toBeVisible();

});

//13)Username Case Sensitivity Test
test('Verify username case sensitivity', async ({ page }) => {

  await page.goto('https://amenu.autodemoapps.tech/login');

  await page.fill('#email', 'HGP.ASHI@gmail.com');  // uppercase
  await page.fill('#password', 'vendor@1234');

  await page.click('//button[normalize-space()="Sign in"]');

  await expect(page).toHaveURL('https://amenu.autodemoapps.tech/dashboard');

});

//14)Password Case Sensitivity Test
test('Verify password case sensitivity', async ({ page }) => {

  await page.goto('https://amenu.autodemoapps.tech/login');

  await page.fill('#email', 'hgp.ashi@gmail.com');  // uppercase
  await page.fill('#password', 'VENDOR@1234');

  await page.click('//button[normalize-space()="Sign in"]');

  await expect(page).toHaveURL('https://amenu.autodemoapps.tech/login');

});
//15)Username mixed case
test('Verify username mixed case sensitivity', async ({ page }) => {

  await page.goto('https://amenu.autodemoapps.tech/login');

  await page.fill('#email', 'Hgp.ashi@gmail.com');  // uppercase
  await page.fill('#password', 'vendor@1234');

  await page.click('//button[normalize-space()="Sign in"]');

  await expect(page).toHaveURL('https://amenu.autodemoapps.tech/dashboard');

});
//16)Click eye → password should show
test('Click eye icon should show password', async ({ page }) => {

  await page.goto('https://amenu.autodemoapps.tech/login');

  await page.fill('#password', 'Password123');

  await page.click('//*[name()="path" and contains(@d,"M2.062 12.")]');

  await expect(page.locator('#password')).toHaveAttribute('type', 'text');

});
//17)Verify password shows and eye becomes crossed

test('Password visible and eye icon crossed', async ({ page }) => {

  await page.goto('https://amenu.autodemoapps.tech/login');

  await page.fill('#password', 'vendor@1234');

 
  await page.click('//*[name()="path" and contains(@d,"M2.062 12.")]');

  await expect(page.locator('#password')).toHaveAttribute('type', 'text');

  
  await expect(page.locator('//button[@class=\'absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600\']//*[name()=\'svg\']')).toBeVisible();

});

});