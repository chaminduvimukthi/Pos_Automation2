class RegisterPage {
  constructor(page) {
    this.page = page;

    // Step 1
    this.firstName = page.locator('#firstName');
    this.lastName = page.locator('#lastName');
    this.email = page.locator('#email');
    this.password = page.locator('#password');
    this.continueBtn = page.getByRole('button', { name: 'Continue' });

    // Step 2
    this.businessName = page.locator('#businessName');
    this.registrationNumber = page.locator('#registrationNumber');
    this.taxNumber = page.locator('#taxNumber');
    this.phone = page.locator('#phone');
    this.country = page.locator('#country');
    this.industry = page.locator('#industry');
    this.companySize = page.locator('#companySize');

    // Step 3
    this.currency = page.locator('#currency');
    this.timeZone = page.locator('#timeZone');

    // Final
    this.createAccountBtn = page.getByRole('button', { name: 'Create Account' });
  }

  async goto() {
    await this.page.goto('https://erp.autodemoapps.tech/register');
  }

  async fillStep1(email, password = 'Password123') {
    await this.firstName.fill('Test');
    await this.lastName.fill('User');
    await this.email.fill(email);
    await this.password.fill(password);
    await this.continueBtn.click();
  }

  async fillStep2({
    businessName = 'ABC Corp',
    regNo = Date.now().toString(), // dynamic (important 🔥)
    taxNo = 'TN123456',
    phone = '0777123456'
  }) {
    await this.businessName.fill(businessName);
    await this.registrationNumber.fill(regNo);
    await this.taxNumber.fill(taxNo);
    await this.phone.fill(phone);
    await this.country.selectOption('Sri Lanka');
    await this.industry.selectOption('Retail & E-commerce');
    await this.companySize.selectOption('1-10 employees');
    await this.continueBtn.click();
  }

  async fillStep3() {
    await this.currency.selectOption('US Dollar ($)');
    await this.timeZone.selectOption('Pacific Time (US)');
    await this.continueBtn.click();
  }

  async submit() {
    await this.createAccountBtn.click();
  }
}

module.exports = { RegisterPage };