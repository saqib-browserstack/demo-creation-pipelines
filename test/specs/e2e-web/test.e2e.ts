import {expect} from "@wdio/globals";
// Updated path to go up two levels and into the web folder
import LoginPage from "../../pageobjects/web/login.page.js";
import SecurePage from "../../pageobjects/web/secure.page.js";
describe("My Login application", () => {
  it("should login with valid credentials", async () => {
    await LoginPage.open();
    await LoginPage.login("tomsmith", "SuperSecretPassword!");
    await expect(SecurePage.flashAlert).toBeExisting();
    await expect(SecurePage.flashAlert).toHaveText(
      expect.stringContaining("You logged into a secure area!"),
    );
  });
});
