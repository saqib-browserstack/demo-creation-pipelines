import { createRequire } from "module";
const require = createRequire(import.meta.url);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const percyScreenshot: (driver: any, name: string) => Promise<void> = require("@percy/appium-app");

describe("Percy Figma Comparison - BrowserStack Demo App", () => {
  before(async () => {
    // Reset app to a clean state before the test
    await driver.terminateApp("com.browserstack.demo.app");
    await driver.activateApp("com.browserstack.demo.app");
  });

  it("should capture home screen, add-to-cart state, and cart screen snapshots", async () => {
    // ── Snapshot 1: App Launch / Home Screen ──────────────────────────────
    await $("~add-to-cart-12").waitForDisplayed({ timeout: 30000 });
    await percyScreenshot(browser, "Home Screen - App Launch");

    // ── Snapshot 2: After clicking Add to Cart ────────────────────────────
    await $("~add-to-cart-12").click();
    // Wait for quantity stepper to confirm item was added (add-to-cart btn replaced by stepper)
    await $("~add-to-cart-12").waitForExist({ reverse: true, timeout: 8000 }).catch(() => {});
    await percyScreenshot(browser, "Home Screen - After Add to Cart");

    // ── Snapshot 3: Cart Screen ───────────────────────────────────────────
    await $("~nav-cart").click();
    await $("~cart-item").waitForDisplayed({ timeout: 10000 });
    await percyScreenshot(browser, "Cart Screen");
  });
});