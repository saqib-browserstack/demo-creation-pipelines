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
    // ── Snapshot 1: App Launch / Home Screen (sorted Low to High) ─────────
    await $("~filter-btn").waitForDisplayed({ timeout: 30000 });

    // Open Filter & Sort popup
    await $("~filter-btn").click();
    await $("~Low to High").waitForDisplayed({ timeout: 5000 });

    // Select Low to High sort
    await $("~Low to High").click();

    // Dismiss popup by tapping outside (above the popup area, y=400 is above the popup)
    await driver.execute("mobile: clickGesture", { x: 540, y: 400 });

    // Wait for home screen to be back (filter-btn visible, popup gone)
    await $("~filter-btn").waitForDisplayed({ timeout: 5000 });

    await percyScreenshot(browser, "Home Screen - App Launch");

    // ── Snapshot 2: After clicking Add to Cart ────────────────────────────
    // After Low-to-High sort the first visible product is add-to-cart-19 (Pixel 2, $399)
    await $("~add-to-cart-19").waitForDisplayed({ timeout: 10000 });
    await $("~add-to-cart-19").click();
    // Wait for quantity stepper to confirm item was added (add-to-cart btn replaced by stepper)
    await $("~add-to-cart-19").waitForExist({ reverse: true, timeout: 8000 }).catch(() => {});
    await percyScreenshot(browser, "Home Screen - After Add to Cart");

    // ── Snapshot 3: Cart Screen ───────────────────────────────────────────
    await $("~nav-cart").click();
    await $("~cart-item").waitForDisplayed({ timeout: 10000 });
    await percyScreenshot(browser, "Cart Screen");
  });
});