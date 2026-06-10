import { $ } from "@wdio/globals";

class LoginPage {
  get loginForm() {
    return $("~login-form");
  }

  get usernameSpinner() {
    return $("~username-input");
  }

  get passwordSpinner() {
    return $("~password-input");
  }

  get signInButton() {
    return $("~login-btn");
  }

  get apiError() {
    return $("~api-error");
  }

  async selectUsername(username: string) {
    await this.usernameSpinner.waitForExist({ timeout: 10000 });
    await this.usernameSpinner.click();
    const option = await $(`android=new UiSelector().text("${username}")`);
    await option.waitForExist({ timeout: 5000 });
    await option.click();
  }

  async selectPassword(password: string) {
    await this.passwordSpinner.waitForExist({ timeout: 10000 });
    await this.passwordSpinner.click();
    const option = await $(`android=new UiSelector().text("${password}")`);
    await option.waitForExist({ timeout: 5000 });
    await option.click();
  }

  async login(username: string, password: string) {
    await this.selectUsername(username);
    await this.selectPassword(password);
    await this.signInButton.waitForExist({ timeout: 10000 });
    await this.signInButton.click();
  }
}

export default new LoginPage();