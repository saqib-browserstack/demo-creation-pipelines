import { expect } from "@wdio/globals";
import CheckoutFlowPage from "../../../pageobjects/web/checkoutFlow.page.js";

describe("E-Commerce Pipeline - Golden Path", () => {
  it("Should shop as a guest and submit an order successfully", async () => {
    await CheckoutFlowPage.open();
    await CheckoutFlowPage.completeShoppingSequence();
    await CheckoutFlowPage.fillGuestCheckoutForm();
    
    await CheckoutFlowPage.completeOrderButton.click();
    
    // Verify user hits a success confirmation state
    await CheckoutFlowPage.orderConfirmationHeading.waitForDisplayed({ timeout: 15000 });
    await expect(CheckoutFlowPage.orderConfirmationHeading).toBeDisplayed();
  });
});