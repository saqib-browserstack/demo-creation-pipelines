import { $ } from "@wdio/globals";
import Page from "./page.js"; // Using .js per project NodeNext rules

class EcommercePage extends Page {
  // --- BASE SELECTORS (Original / Without Toggle) ---
  public get toggleSwitch() { return $("#test-mode-switch"); }
  public get loginButton() { return $("#login"); }
  public get emailInput() { return $("#email"); }
  public get passwordInput() { return $("#password"); }
  public get backToHomeButton() { return $("main > div > div > button"); }
  public get scanImageButton() { return $("header div > div:nth-of-type(2) span"); }

  /**
   * Navigates to the E-commerce app
   */
  public async open() {
    await browser.maximizeWindow();
    return browser.url("https://ecommercebs.vercel.app/");
  }

  /**
   * Toggles the test mode switch to break selectors
   */
  public async toggleTestMode() {
    await this.toggleSwitch.waitForDisplayed();
    await this.toggleSwitch.click();
  }

  /**
   * Reusable flow execution block utilizing original locators
   */
  public async executeLoginAndScanSequence() {
    // 1. Click Login
    await this.loginButton.waitForDisplayed();
    await this.loginButton.click();

    // 2. Click Email Field
    await this.emailInput.waitForDisplayed();
    await this.emailInput.click();

    // 3. Click Password Field
    await this.passwordInput.waitForDisplayed();
    await this.passwordInput.click();

    // 4. Click Back to Home
    await this.backToHomeButton.waitForDisplayed();
    await this.backToHomeButton.click();
  }
}

export default new EcommercePage();