import { $ } from "@wdio/globals";
import IOSBasePage from "./IOSBasePage.js";

/**
 * Page object for the iOS Login / Sign-In screen.
 * Selectors confirmed from live iOS page source exploration.
 *
 * iOS login uses a PickerWheel (XCUIElementTypePickerWheel) for username/password.
 * To select a value: click the input to open the picker, then setValue() on the wheel.
 */
class LoginPageIOS extends IOSBasePage {
  /** Login form container — accessibility-id="login-form" */
  get loginForm() {
    return $("~login-form");
  }

  /** Username input container — accessibility-id="username-input" */
  get usernameInput() {
    return $("~username-input");
  }

  /** Password input container — accessibility-id="password-input" */
  get passwordInput() {
    return $("~password-input");
  }

  /** Sign In submit button — accessibility-id="login-btn" */
  get loginBtn() {
    return $("~login-btn");
  }

  /** API / validation error message — accessibility-id="api-error" */
  get apiError() {
    return $("~api-error");
  }

  /** iOS picker wheel — accessibility-id="ios_picker" */
  get iosPicker() {
    return $("~ios_picker");
  }

  /** Done button to confirm picker selection — accessibility-id="done_button" */
  get doneBtn() {
    return $("~done_button");
  }

  /**
   * Selects a username from the iOS picker wheel.
   * @param username - exact text of the username option (e.g. "demouser")
   */
  async selectUsername(username: string): Promise<void> {
    await this.usernameInput.waitForDisplayed({ timeout: 10000 });
    await this.usernameInput.click();
    // iOS shows a PickerWheel — use setValue to select the option
    const pickerWheel = await $("//XCUIElementTypePickerWheel");
    await pickerWheel.waitForExist({ timeout: 5000 });
    await pickerWheel.setValue(username);
    // Tap Done to confirm selection
    await this.doneBtn.waitForExist({ timeout: 5000 });
    await this.doneBtn.click();
  }

  /**
   * Selects a password from the iOS picker wheel.
   * @param password - exact text of the password option (e.g. "testingisfun99")
   */
  async selectPassword(password: string): Promise<void> {
    await this.passwordInput.waitForDisplayed({ timeout: 10000 });
    await this.passwordInput.click();
    const pickerWheel = await $("//XCUIElementTypePickerWheel");
    await pickerWheel.waitForExist({ timeout: 5000 });
    await pickerWheel.setValue(password);
    await this.doneBtn.waitForExist({ timeout: 5000 });
    await this.doneBtn.click();
  }

  /**
   * Performs a full login flow on iOS.
   */
  async login(username: string, password: string): Promise<void> {
    await this.selectUsername(username);
    await this.selectPassword(password);
    await this.loginBtn.waitForDisplayed({ timeout: 10000 });
    await this.loginBtn.click();
  }
}

export default new LoginPageIOS();