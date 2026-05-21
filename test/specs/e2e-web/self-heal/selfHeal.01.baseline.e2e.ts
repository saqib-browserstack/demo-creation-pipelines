import EcommercePage from "../../pageobjects/web/ecommerce.page.js";

/**
 * SELF-HEAL STEP 1 — BASELINE
 * Run this FIRST to record element fingerprints on BrowserStack.
 *
 * BROWSERSTACK_USERNAME="..." BROWSERSTACK_ACCESS_KEY="..." \
 * npm run wdio:web -- --spec test/specs/e2e-web/selfHeal-baseline.e2e.ts
 */
describe("BrowserStack Self-Heal - Baseline", () => {
  it("Execute E-Commerce Flow (Baseline)", async () => {
    await EcommercePage.open();
    // Run with original selectors — BrowserStack records element fingerprints
    await EcommercePage.executeLoginAndScanSequence();
  });
});