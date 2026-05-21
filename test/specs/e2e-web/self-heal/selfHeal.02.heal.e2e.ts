import EcommercePage from "../../pageobjects/web/ecommerce.page.js";

/**
 * SELF-HEAL STEP 2 — HEAL RUN
 * Run this AFTER the baseline to demonstrate self-healing.
 * BrowserStack uses fingerprints from the baseline session to heal #login → #signin.
 *
 * BROWSERSTACK_USERNAME="..." BROWSERSTACK_ACCESS_KEY="..." \
 * npm run wdio:web -- --spec test/specs/e2e-web/selfHeal-heal.e2e.ts
 */
describe("BrowserStack Self-Heal - Broken Selectors", () => {
  it("Execute E-Commerce Flow (Self-Heal)", async () => {
    await EcommercePage.open();

    // Toggle breaks IDs: #login → #signin
    // BrowserStack Self-Heal uses baseline fingerprints to locate the element
    await EcommercePage.toggleTestMode();

    // Use ORIGINAL broken selectors — BrowserStack Self-Heal fixes them
    await EcommercePage.executeLoginAndScanSequence();
  });
});