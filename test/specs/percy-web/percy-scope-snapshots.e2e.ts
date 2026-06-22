import {createRequire} from "node:module";
import {browser, $} from "@wdio/globals";

// Bypass @percy/webdriverio block by using sdk-utils directly for Automate
const require = createRequire(import.meta.url);
const {captureAutomateScreenshot} = require("@percy/sdk-utils") as {
  captureAutomateScreenshot: (
    options: Record<string, unknown>,
  ) => Promise<void>;
};

/**
 * Helper function to safely trigger Percy on BrowserStack Automate.
 * Matches the signature: snap(snapshotName, testCaseGroup, options)
 */
async function snap(
  name: string,
  testCase: string,
  options: Record<string, unknown> = {},
) {
  try {
    await captureAutomateScreenshot({
      sessionId: browser.sessionId,
      commandExecutorUrl: `https://hub.browserstack.com/wd/hub`,
      capabilities: browser.capabilities as Record<string, unknown>,
      snapshotName: name,
      options: {
        ...options,
        testCase: testCase, // 👈 Injects the Test Case Grouping name
      },
      clientInfo: "@percy/webdriverio/3.3.2",
      environmentInfo: `webdriverio/${(browser as any).version ?? "unknown"}`,
    });
  } catch (err) {
    console.warn(
      `[Percy] Snapshot "${name}" skipped: ${(err as Error).message}`,
    );
  }
}

/**
 * Percy Web — Scope-Based Snapshots
 *
 * Isolates specific UI components on the FashionStack homepage
 * for targeted visual regression testing.
 */
describe("Percy Web — Scope-Based Snapshots (FashionStack Homepage)", () => {
  before(async () => {
    await browser.url("https://ecommercebs.vercel.app/");
    // Wait for React to fully hydrate
    await $("header").waitForExist({timeout: 15000});
    await browser.pause(3000);

    // Click the test-mode toggle (near the Login button) to activate test mode.
    const toggle = await $("#test-mode-switch");
    await toggle.click();
    await browser.pause(500);
  });

  /**
   * Injects a unique hidden marker into the DOM so Percy's content-hash
   * deduplication treats each snapshot as distinct.
   */
  async function injectScopeMarker(scopeName: string) {
    await browser.execute((name: string) => {
      const existing = document.getElementById("percy-scope-marker");
      if (existing) existing.remove();

      const marker = document.createElement("div");
      marker.id = "percy-scope-marker";
      marker.setAttribute("data-percy-scope", name);
      marker.style.cssText =
        "position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;";
      marker.textContent = `percy-scope:${name}:${Date.now()}`;
      document.body.appendChild(marker);
    }, scopeName);
  }

  // ─── T005: Scope Based Snapshots ───────────────────────────────────────────

  it("should capture a full-page baseline snapshot", async () => {
    await browser.execute(() => window.scrollTo(0, 0));
    await browser.pause(500);
    await injectScopeMarker("full-page-baseline");

    await snap(
      "FashionStack — Full Page Baseline",
      "T005: Scope Based Snapshots",
      {
        fullPage: true,
      },
    );
  });

  it("should capture a scoped snapshot of the Header component", async () => {
    await browser.execute(() => window.scrollTo(0, 0));
    await browser.pause(500);
    await injectScopeMarker("header-component");

    await snap("FashionStack — Header", "T005: Scope Based Snapshots", {
      scope: "header",
      percyCSS: "main, footer { display: none !important; }",
    });
  });

  it("should capture a scoped snapshot of the Hero Carousel section", async () => {
    await browser.execute(() => window.scrollTo(0, 0));
    await browser.pause(500);
    await injectScopeMarker("hero-carousel-section");

    await snap("FashionStack — Hero Carousel", "T005: Scope Based Snapshots", {
      scope: "main > div:first-child",
      percyCSS:
        "header, footer, main > div:not(:first-child) { display: none !important; }",
    });
  });

  it("should capture a scoped snapshot of the Featured Products section", async () => {
    await browser.execute(() => {
      const mainDivs = document.querySelectorAll("main > div");
      if (mainDivs[1]) {
        (mainDivs[1] as HTMLElement).scrollIntoView({
          behavior: "instant",
          block: "start",
        });
      }
    });
    await browser.pause(800);
    await injectScopeMarker("featured-products-section");

    await snap(
      "FashionStack — Featured Products",
      "T005: Scope Based Snapshots",
      {
        scope: "main > div:nth-child(2)",
        percyCSS:
          "header, footer, main > div:first-child { display: none !important; }",
      },
    );
  });

  it("should capture a scoped snapshot of the Footer component", async () => {
    await browser.execute(() => {
      const footer = document.querySelector("footer");
      if (footer) footer.scrollIntoView({behavior: "instant", block: "start"});
    });
    await browser.pause(800);
    await injectScopeMarker("footer-component");

    await snap("FashionStack — Footer", "T005: Scope Based Snapshots", {
      scope: "footer",
      percyCSS: "header, main { display: none !important; }",
    });
  });
});
