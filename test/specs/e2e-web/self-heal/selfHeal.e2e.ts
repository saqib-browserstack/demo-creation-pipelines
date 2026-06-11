import EcommercePage from "../../../pageobjects/web/ecommerce.page.js";

/**
 * SELF-HEAL — COMBINED (Baseline + Heal)
 *
 * Step 1: Baseline run records element fingerprints on BrowserStack.
 * Step 2: Heal run uses those fingerprints to fix broken selectors.
 *         Toggle is commented out — uncomment to simulate broken selectors.
 *
 * BROWSERSTACK_USERNAME="..." BROWSERSTACK_ACCESS_KEY="..." \
 * npm run wdio:web -- --spec test/specs/e2e-web/self-heal/selfHeal.01.baseline.e2e.ts
 */
describe("BrowserStack Self-Heal", () => {
  before(async () => {
    await browser.execute(
      'browserstack_executor: {"action": "setSessionName", "arguments": {"name": "Self-Heal Demo"}}'
    );
  });

  it("Execute E-Commerce Flow (Baseline — records fingerprints)", async () => {
    await EcommercePage.open();
    // Run with original selectors — BrowserStack records element fingerprints
    await EcommercePage.executeLoginAndScanSequence();
  });

  it("Execute E-Commerce Flow (Self-Heal — broken selectors healed)", async () => {
    await EcommercePage.open();

    // Toggle breaks IDs: #login → #signin
    // Uncomment the line below to simulate broken selectors for self-heal demo
    await EcommercePage.toggleTestMode();

    // Use ORIGINAL selectors — BrowserStack Self-Heal fixes them using baseline fingerprints
    await EcommercePage.executeLoginAndScanSequence();
  });
});