import { browser, $ } from "@wdio/globals";
import * as percySnapshotModule from "@percy/webdriverio";

// @percy/webdriverio is a CommonJS module; extract the callable default
const percySnapshot = (percySnapshotModule as any).default ?? percySnapshotModule;

/**
 * Percy Web — Scope-Based Snapshots
 *
 * Isolates specific UI components on the FashionStack homepage
 * for targeted visual regression testing.
 *
 * Strategy:
 * - Inject a hidden <meta> tag with a unique name into <head> before each
 *   snapshot. This changes the DOM hash so Percy cannot deduplicate them.
 * - Use Percy's `scope` option (CSS selector string) to crop the screenshot
 *   to a specific component — this is the native Percy scope-based snapshot
 *   feature.
 * - Use `percyCSS` (a plain string) to hide non-scoped elements during
 *   Percy's rendering pass for cleaner component isolation.
 *
 * Scopes captured:
 *  1. Full page baseline
 *  2. Header (navigation bar + announcement strip)
 *  3. Hero carousel section
 *  4. Featured Products section
 *  5. Footer
 */
describe("Percy Web — Scope-Based Snapshots (FashionStack Homepage)", () => {
  before(async () => {
    await browser.url("https://ecommercebs.vercel.app/");
    // Wait for React to fully hydrate
    await $("header").waitForExist({ timeout: 15000 });
    await browser.pause(3000);
    // Click the test-mode toggle (near the Login button) to activate test mode.
    // This changes the header UI state and will produce visible diffs vs the
    // approved baseline (build #5) where the toggle was OFF.
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
      // Remove any previous marker
      const existing = document.getElementById("percy-scope-marker");
      if (existing) existing.remove();
      // Add a hidden div with unique text content — changes the DOM hash
      const marker = document.createElement("div");
      marker.id = "percy-scope-marker";
      marker.setAttribute("data-percy-scope", name);
      marker.style.cssText = "position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;";
      marker.textContent = `percy-scope:${name}:${Date.now()}`;
      document.body.appendChild(marker);
    }, scopeName);
  }

  it("should capture a full-page baseline snapshot", async () => {
    await browser.execute(() => window.scrollTo(0, 0));
    await browser.pause(500);
    await injectScopeMarker("full-page-baseline");
    await percySnapshot(browser, "FashionStack — Full Page Baseline");
  });

  it("should capture a scoped snapshot of the Header component", async () => {
    await browser.execute(() => window.scrollTo(0, 0));
    await browser.pause(500);
    await injectScopeMarker("header-component");
    await percySnapshot(browser, "FashionStack — Header", {
      scope: "header",
      percyCSS: "main, footer { display: none !important; }",
    });
  });

  it("should capture a scoped snapshot of the Hero Carousel section", async () => {
    await browser.execute(() => window.scrollTo(0, 0));
    await browser.pause(500);
    await injectScopeMarker("hero-carousel-section");
    await percySnapshot(browser, "FashionStack — Hero Carousel", {
      scope: "main > div:first-child",
      percyCSS: "header, footer, main > div:not(:first-child) { display: none !important; }",
    });
  });

  it("should capture a scoped snapshot of the Featured Products section", async () => {
    await browser.execute(() => {
      const mainDivs = document.querySelectorAll("main > div");
      if (mainDivs[1]) {
        (mainDivs[1] as HTMLElement).scrollIntoView({ behavior: "instant", block: "start" });
      }
    });
    await browser.pause(800);
    await injectScopeMarker("featured-products-section");
    await percySnapshot(browser, "FashionStack — Featured Products", {
      scope: "main > div:nth-child(2)",
      percyCSS: "header, footer, main > div:first-child { display: none !important; }",
    });
  });

  it("should capture a scoped snapshot of the Footer component", async () => {
    await browser.execute(() => {
      const footer = document.querySelector("footer");
      if (footer) footer.scrollIntoView({ behavior: "instant", block: "start" });
    });
    await browser.pause(800);
    await injectScopeMarker("footer-component");
    await percySnapshot(browser, "FashionStack — Footer", {
      scope: "footer",
      percyCSS: "header, main { display: none !important; }",
    });
  });
});