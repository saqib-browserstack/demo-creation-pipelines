import CheckoutFlowPage from "../../../pageobjects/web/checkoutFlow.page.js";

describe("E-Commerce Pipeline - Broken Selector Failure", () => {
  it("Should drop validation due to an unresolvable or modified element selector", async () => {
    await CheckoutFlowPage.open();
    await CheckoutFlowPage.completeShoppingSequence();

    // Call an explicitly non-existent selector instance to trigger a crisp Timeout Locator error
    await CheckoutFlowPage.brokenFirstNameInput.waitForDisplayed({ timeout: 4000 });
    await CheckoutFlowPage.brokenFirstNameInput.setValue("F");
  });
});