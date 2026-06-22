import { $ } from "@wdio/globals";
import AndroidBasePage from "./AndroidBasePage.js";

/**
 * Page object for the Android Cart screen.
 * Selectors confirmed from live page source exploration.
 */
class CartPageAndroid extends AndroidBasePage {
  /** Number-of-products label — content-desc="number-of-products" */
  get numberOfProductsLabel() {
    return $("~number-of-products");
  }

  /** First cart item container — content-desc="cart-item" */
  get cartItem() {
    return $("~cart-item");
  }

  /** Checkout button — content-desc="checkout-btn" */
  get checkoutBtn() {
    return $("~checkout-btn");
  }

  /**
   * Waits for the cart screen to be fully loaded.
   */
  async waitForCartLoaded(): Promise<void> {
    await this.checkoutBtn.waitForDisplayed({ timeout: 15000 });
  }
}

export default new CartPageAndroid();