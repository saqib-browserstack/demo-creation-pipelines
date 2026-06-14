import { $ } from "@wdio/globals";

class CartPage {
  get pageTitle() {
    return $('android=new UiSelector().text("Cart")');
  }

  get numberOfProducts() {
    return $("~number-of-products");
  }

  get cartItem() {
    return $("~cart-item");
  }

  get checkoutButton() {
    return $("~checkout-btn");
  }

  async waitForCartToLoad() {
    await this.pageTitle.waitForDisplayed({ timeout: 10000 });
  }

  async proceedToCheckout() {
    await this.checkoutButton.waitForDisplayed({ timeout: 10000 });
    await this.checkoutButton.click();
  }
}

export default new CartPage();