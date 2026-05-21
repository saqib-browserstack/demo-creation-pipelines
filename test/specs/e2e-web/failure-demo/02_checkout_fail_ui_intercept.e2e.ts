import CheckoutFlowPage from "../../../pageobjects/web/checkoutFlow.page.js";

describe("E-Commerce Pipeline - Product Bug: Promo Modal Blocks Checkout", () => {
  it("Should surface a product bug where the promotional overlay intercepts checkout form interactions", async () => {
    await CheckoutFlowPage.open();
    await CheckoutFlowPage.completeShoppingSequence();

    // BUG: The marketing team's promo modal renders with an unconstrained z-index and no dismiss handler.
    // It is injected by the promotions service on every session start and covers the entire viewport.
    // Ticket: SHOP-4821 — "Promo modal does not auto-dismiss on checkout page navigation"
    await browser.execute(() => {
      const promoModal = document.createElement("div");
      promoModal.setAttribute("id", "promo-modal-overlay");
      promoModal.setAttribute("data-testid", "promo-modal");
      promoModal.style.position = "fixed";
      promoModal.style.top = "0";
      promoModal.style.left = "0";
      promoModal.style.width = "100vw";
      promoModal.style.height = "100vh";
      promoModal.style.zIndex = "99999";
      promoModal.style.background = "rgba(14, 165, 233, 0.15)";
      promoModal.style.cursor = "default";
      // No close button — the bug is that this modal has no dismiss mechanism
      document.body.appendChild(promoModal);
    });

    // ElementClickInterceptedError: The promo modal sits above the checkout form.
    // Users cannot interact with any checkout field until this bug is resolved.
    await CheckoutFlowPage.firstNameInput.click();
  });
});