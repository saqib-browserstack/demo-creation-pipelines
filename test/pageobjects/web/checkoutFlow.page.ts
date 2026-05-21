import { $ } from "@wdio/globals";
import Page from "./page.js";

class CheckoutFlowPage extends Page {
  // --- SHOPPING SELECTORS ---
  public get firstItemViewDetailsButton() { return $("(//main//section//button[normalize-space(.)='View Details'])[1]"); }
  public get addToCartButton() { return $("div:nth-of-type(5) > div.flex > button"); }
  public get cartButton() { return $("header button.relative"); }
  public get proceedToCheckoutButton() { return $("div.lg\\:col-span-1 > div > div > button"); }

  // --- CHECKOUT FORM SELECTORS ---
  public get firstNameInput() { return $("#firstName"); }
  public get lastNameInput() { return $("#lastName"); }
  public get checkoutEmailInput() { return $("#email"); }
  public get addressInput() { return $("#address"); }
  public get apartmentInput() { return $("#apartment"); }
  public get cityInput() { return $("#city"); }
  public get zipCodeInput() { return $("#zipCode"); }
  public get phoneInput() { return $("#phone"); }

  // --- PAYMENT SELECTORS ---
  public get cardNumberInput() { return $("#cardNumber"); }
  public get nameOnCardInput() { return $("#nameOnCard"); }
  public get expiryDateInput() { return $("#expiryDate"); }
  public get cvvInput() { return $("#cvv"); }
  public get completeOrderButton() { return $("div.lg\\:col-span-1 button"); }

  // --- ORDER CONFIRMATION ---
  public get orderConfirmationHeading() { return $("//h1[normalize-space(.)='Order Confirmed!']"); }

  // --- BROKEN SELECTORS (intentional — for failure demo) ---
  public get brokenFirstNameInput() { return $("#firstName-broken-nonexistent"); }

  public async open() {
    await browser.maximizeWindow();
    return browser.url("https://ecommercebs.vercel.app/");
  }

  /**
   * Guest shopping flow — navigate to product detail, add to cart, proceed to checkout
   */
  public async completeShoppingSequence() {
    // Click View Details on the first item
    await this.firstItemViewDetailsButton.waitForDisplayed({ timeout: 10000 });
    await this.firstItemViewDetailsButton.click();

    // Add to Cart from product detail page
    await this.addToCartButton.waitForDisplayed({ timeout: 10000 });
    await this.addToCartButton.click();

    // Open cart
    await this.cartButton.waitForDisplayed({ timeout: 10000 });
    await this.cartButton.click();

    // Proceed to Checkout
    await this.proceedToCheckoutButton.waitForDisplayed({ timeout: 10000 });
    await this.proceedToCheckoutButton.click();
  }

  /**
   * Fill guest checkout + payment form (does NOT click Complete Order)
   */
  public async fillGuestCheckoutForm() {
    await this.checkoutEmailInput.waitForDisplayed({ timeout: 10000 });
    await this.checkoutEmailInput.setValue("Newuser1@gmail.com");
    await this.firstNameInput.setValue("F");
    await this.lastNameInput.setValue("L");
    await this.addressInput.setValue("123 Main St");
    await this.cityInput.setValue("New York");
    await this.zipCodeInput.setValue("10001");
    await this.phoneInput.setValue("5551234567");
    await this.cardNumberInput.setValue("4111111111111111");
    await this.nameOnCardInput.setValue("F L");
    await this.expiryDateInput.setValue("12/26");
    await this.cvvInput.setValue("123");
  }
}

export default new CheckoutFlowPage();