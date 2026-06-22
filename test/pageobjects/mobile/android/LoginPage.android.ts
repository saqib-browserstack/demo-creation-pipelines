import { $ } from "@wdio/globals";
import AndroidBasePage from "./AndroidBasePage.js";

/**
 * Page object for the Android Login / Sign-In screen.
 * Selectors confirmed from live page source exploration.
 */
class LoginPageAndroid extends AndroidBasePage {
  /** Login form container — content-desc="login-form" */
  get loginForm() {
    return $("~login-form");
  }

  /** Username dropdown (Spinner) — content-desc="username-input" */
  get usernameInput() {
    return $("~username-input");
  }

  /** Password dropdown (Spinner) — content-desc="password-input" */
  get passwordInput() {
    return $("~password-input");
  }

  /** Sign In submit button — content-desc="login-btn" */
  get loginBtn() {
    return $("~login-btn");
  }

  /** API / validation error message — content-desc="api-error" */
  get apiError() {
    return $("~api-error");
  }

  /**
   * Selects a username from the dropdown spinner.
   * @param username - exact text of the username option (e.g. "demouser")
   */
  async selectUsername(username: string): Promise<void> {
    await this.usernameInput.waitForDisplayed({ timeout: 10000 });
    await this.usernameInput.click();
    const option = await $(`android=new UiSelector().text("${username}")`);
    await option.waitForDisplayed({ timeout: 5000 });
    await option.click();
  }

  /**
   * Selects a password from the dropdown spinner.
   * @param password - exact text of the password option (e.g. "testingisfun99")
   */
  async selectPassword(password: string): Promise<void> {
    await this.passwordInput.waitForDisplayed({ timeout: 10000 });
    await this.passwordInput.click();
    const option = await $(`android=new UiSelector().text("${password}")`);
    await option.waitForDisplayed({ timeout: 5000 });
    await option.click();
  }

  /**
   * Performs a full login flow.
   * @param username - username option text
   * @param password - password option text
   */
  async login(username: string, password: string): Promise<void> {
    await this.selectUsername(username);
    await this.selectPassword(password);
    await this.loginBtn.waitForDisplayed({ timeout: 10000 });
    await this.loginBtn.click();
  }
}

export default new LoginPageAndroid();