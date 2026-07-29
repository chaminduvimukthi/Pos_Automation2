class RolePage {
  constructor(page) {
    this.page = page;

    this.name = page.locator('#name');
    this.code = page.locator('#code');
    this.roleType = page.locator('select').first();
    this.outletDropdown = page.locator('select').nth(1);
    this.description = page.locator('#description');

    this.saveBtn = page.getByRole('button', { name: 'Save And Add' });

    // messages
    this.successMsg = page.getByText('Role created successfully');
    this.errorMsg = page.getByText('Please check the form for errors.');
  }

  async navigateToRoles() {
    await this.page.getByRole('complementary').getByText('Users').click();
    await this.page.getByRole('link', { name: 'Roles' }).click();
    await this.page.getByRole('button', { name: 'Add Role' }).click();
  }

  async createRole({
    name = 'Test Role',
    code = `C-${Date.now()}`,
    type = 'OUTLET',
    outlet = null,
    description = 'Test Description'
  }) {
    await this.name.fill(name);
    await this.code.fill(code);
    await this.roleType.selectOption({ value: type });

    if (type === 'CUSTOM' && outlet) {
      await this.outletDropdown.selectOption({ label: outlet });
    }

    await this.description.fill(description);
    await this.saveBtn.click();
  }
}

module.exports = { RolePage };