import { $, browser } from "@wdio/globals";

class CheckoutPage {
  get pageTitle() {
    return $('android=new UiSelector().text("Checkout")');
  }

  get firstNameInput() {
    return $("~firstNameInput");
  }

  get lastNameInput() {
    return $("~lastNameInput");
  }

  get addressInput() {
    return $("~addressInput");
  }

  get stateInput() {
    return $("~stateInput");
  }

  get postalCodeInput() {
    return $("~postalCodeInput");
  }

  get submitButton() {
    return $("~submit-btn");
  }

  async waitForCheckoutToLoad() {
    await this.pageTitle.waitForDisplayed({ timeout: 10000 });
  }

  async fillShippingAddress(details: {
    firstName: string;
    lastName: string;
    address: string;
    state: string;
    postalCode: string;
  }) {
    await this.firstNameInput.waitForDisplayed({ timeout: 10000 });
    await this.firstNameInput.click();
    await this.firstNameInput.setValue(details.firstName);
    await browser.hideKeyboard();

    await this.lastNameInput.waitForExist({ timeout: 10000 });
    await this.lastNameInput.click();
    await this.lastNameInput.setValue(details.lastName);
    await browser.hideKeyboard();

    await this.addressInput.waitForExist({ timeout: 10000 });
    await this.addressInput.click();
    await this.addressInput.setValue(details.address);
    await browser.hideKeyboard();

    await this.stateInput.waitForExist({ timeout: 10000 });
    await this.stateInput.click();
    await this.stateInput.setValue(details.state);
    await browser.hideKeyboard();

    await this.postalCodeInput.waitForExist({ timeout: 10000 });
    await this.postalCodeInput.click();
    await this.postalCodeInput.setValue(details.postalCode);
    await browser.hideKeyboard();
  }

  async submitOrder() {
    await this.submitButton.waitForExist({ timeout: 10000 });
    await this.submitButton.click();
  }
}

export default new CheckoutPage();