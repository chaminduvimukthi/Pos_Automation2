exports.LoginPage = class LoginPage {

  constructor(page) {

    this.page = page;

    this.usernameInput = page.locator('#email');

    this.passwordInput = page.locator('#password');

    this.signInButton = page.getByRole('button', { name: 'Sign in' });

  }

  async gotoLoginPage() {

    await this.page.goto('https://amenu.autodemoapps.tech/login');

  }

  async login(username, password) {

    await this.usernameInput.fill(username);

    await this.passwordInput.fill(password);

    await this.signInButton.click();

  }

  async verifyLoginSuccess() {

    await this.page.waitForURL(
      '**/dashboard',
      { timeout: 15000 }
    );

  }

}