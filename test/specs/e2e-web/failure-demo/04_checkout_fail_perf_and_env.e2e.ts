import { expect } from "@wdio/globals";
import CheckoutFlowPage from "../../../pageobjects/web/checkoutFlow.page.js";

describe("E-Commerce Pipeline - Performance Timeout Failure", () => {
  it("Should flag an execution breach when order confirmations lag beyond SLA metrics", async () => {
    await CheckoutFlowPage.open();
    await CheckoutFlowPage.completeShoppingSequence();
    await CheckoutFlowPage.fillGuestCheckoutForm();

    // Start timer immediately before clicking — measures true end-to-end confirmation latency
    const startTime = Date.now();
    await CheckoutFlowPage.completeOrderButton.click();

    // Enforce a strict 1ms SLA window — guaranteed to fail since React state update + render
    // takes at minimum several milliseconds even on localhost
    const elapsed = Date.now() - startTime;
    if (elapsed > 1) {
      throw new Error(`SLA alert: API execution took longer than 1ms! Actual: ${elapsed}ms`);
    }

    await CheckoutFlowPage.orderConfirmationHeading.waitForDisplayed({
      timeout: 20,
      timeoutMsg: "SLA alert: API execution took longer than 20ms!",
    });
    await expect(CheckoutFlowPage.orderConfirmationHeading).toBeDisplayed();
  });
});

describe("E-Commerce Pipeline - Environment Configuration Failure", () => {
  it("Should expose a missing environment variable causing the payment gateway base URL to be undefined", async () => {
    // Simulate reading a critical env variable that is not set in this environment
    const paymentGatewayUrl = process.env.PAYMENT_GATEWAY_URL;

    if (!paymentGatewayUrl) {
      throw new Error(
        "EnvironmentError: PAYMENT_GATEWAY_URL is not defined. " +
        "This variable must be set in the CI/CD pipeline environment before running checkout tests. " +
        "Check your .env file or pipeline secrets configuration."
      );
    }

    // This code is unreachable in a misconfigured environment — included to show intent
    await CheckoutFlowPage.open();
    await CheckoutFlowPage.completeShoppingSequence();
    await CheckoutFlowPage.fillGuestCheckoutForm();
    await CheckoutFlowPage.completeOrderButton.click();
    await CheckoutFlowPage.orderConfirmationHeading.waitForDisplayed({ timeout: 15000 });
  });
});