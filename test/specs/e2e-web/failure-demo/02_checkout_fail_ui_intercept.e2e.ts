import CheckoutFlowPage from "../../../pageobjects/web/checkoutFlow.page.js";

describe("E-Commerce Pipeline - UI Interception Failure", () => {
  it("Should catch Element Interception when an absolute layout modal blocks the checkout form", async () => {
    await CheckoutFlowPage.open();
    await CheckoutFlowPage.completeShoppingSequence();

    // Inject a full-screen invisible barrier mimicking a broken marketing pop-up block
    await browser.execute(() => {
      const modalShield = document.createElement("div");
      modalShield.setAttribute("id", "broken-promo-shield");
      modalShield.style.position = "absolute";
      modalShield.style.top = "0";
      modalShield.style.left = "0";
      modalShield.style.width = "100vw";
      modalShield.style.height = "100vh";
      modalShield.style.zIndex = "99999";
      modalShield.style.background = "rgba(14, 165, 233, 0.15)"; // Soft blue layout overlay
      document.body.appendChild(modalShield);
    });

    // This will instantly generate an 'ElementClickInterceptedError' on the BrowserStack Dashboard
    await CheckoutFlowPage.firstNameInput.click();
  });
});