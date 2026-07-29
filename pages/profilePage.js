class ProfilePage {

    constructor(page){
        this.page = page;

        // Currency section
        this.currencyDropdown = page.locator('#preferred-currency');
        this.saveCurrencyBtn = page.locator('button:has-text("Save Currency")');

        // Password section
        this.currentPassword = page.locator('#currentPassword');
        this.newPassword = page.locator('#newPassword');
        this.confirmPassword = page.locator('input[placeholder="Enter confirm new password"]');

        this.updatePasswordBtn = page.locator('#confirmNewPassword');
    }

    async selectCurrency(currency){
        await this.currencyDropdown.selectOption(currency);
    }

    async saveCurrency(){
        await this.saveCurrencyBtn.click();
    }

    async changePassword(currentPwd, newPwd){
        await this.currentPassword.fill(currentPwd);
        await this.newPassword.fill(newPwd);
        await this.confirmPassword.fill(newPwd);
        await this.updatePasswordBtn.click();
    }

}

module.exports = { ProfilePage };