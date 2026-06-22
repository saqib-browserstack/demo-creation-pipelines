import { $ } from "@wdio/globals";
import IOSBasePage from "./IOSBasePage.js";

/**
 * Page object for the iOS Cart screen.
 */
class CartPageIOS extends IOSBasePage {
  /** Number-of-products label — accessibility-id="number-of-products" */
  get numberOfProductsLabel() {
    return $("~number-of-products");
  }

  /** First cart item container — accessibility-id="cart-item" */
  get cartItem() {
    return $("~cart-item");
  }

  /** Checkout button — accessibility-id="checkout-btn" */
  get checkoutBtn() {
    return $("~checkout-btn");
  }

  async waitForCartLoaded(): Promise<void> {
    await this.checkoutBtn.waitForDisplayed({ timeout: 15000 });
  }
}

export default new CartPageIOS();