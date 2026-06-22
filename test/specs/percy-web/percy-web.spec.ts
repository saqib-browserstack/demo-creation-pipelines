import {createRequire} from "node:module";
import {expect, browser, $} from "@wdio/globals";
import FashionStackPage from "../../pageobjects/web/fashionstack.page.js";
import CategoryPage from "../../pageobjects/web/category.page.js";
import ProductPage from "../../pageobjects/web/product.page.js";
import CartPage from "../../pageobjects/web/cart.page.js";
import CheckoutPage from "../../pageobjects/web/checkout.page.js";
import AuthPage from "../../pageobjects/web/auth.page.js";

// Load Percy SDK utils via require() — CommonJS package in NodeNext project
// @percy/webdriverio blocks BrowserStack Automate sessions; we use
// captureAutomateScreenshot from @percy/sdk-utils directly instead.
const require = createRequire(import.meta.url);
const {captureAutomateScreenshot} = require("@percy/sdk-utils") as {
  captureAutomateScreenshot: (
    options: Record<string, unknown>,
  ) => Promise<void>;
};
const sdkUtils = require("@percy/sdk-utils") as {
  isPercyEnabled: () => Promise<boolean>;
  logger: (name: string) => {warn: (msg: string) => void};
};

const homePage = new FashionStackPage();
const categoryPage = new CategoryPage();
const productPage = new ProductPage();
const cartPage = new CartPage();
const checkoutPage = new CheckoutPage();
const authPage = new AuthPage();

const SHIPPING = {
  firstName: "John",
  lastName: "Doe",
  address: "123 Main Street",
  city: "New York",
  zipCode: "10001",
  phone: "5551234567",
};

const PAYMENT = {
  cardNumber: "4111111111111111",
  nameOnCard: "John Doe",
  expiryDate: "12/26",
  cvv: "123",
};

// ─── Ignore Regions ───────────────────────────────────────────────────────────
// CSS selector-based ignore regions — compatible with BrowserStack Automate Percy.
// Coordinate-based regions only work with DOM-based percySnapshot; for screenshot-
// based captureAutomateScreenshot we must use ignore_region_selectors (CSS) or
// ignore_region_xpaths.

/** Cart icon button in header — contains dynamic cart count badge */
const ignoreCartBadge = ["header div div button:last-child"];

/** Full header — use when nav bar is NOT part of the visual story */
const ignoreHeader = ["header"];

/** Product count label — e.g. "16 Products found" changes per filter */
const ignoreProductCount = ['p[class*="text"]'];

/** Cart subtotal row — price changes with quantity */
const ignoreCartSubtotal = [
  '[class*="subtotal"], p:has(span[class*="font-bold"])',
];

/** Timestamp / order number on confirmation page */
const ignoreOrderMeta = ['[class*="order-id"], [class*="timestamp"], time'];

// ─── Helper ───────────────────────────────────────────────────────────────────
/**
 * Wrapper around percySnapshot that enforces:
 *  - testCase grouping (groups snapshots under a named test case in Percy UI)
 *  - scope-based snapshot (captures only the specified CSS selector when provided)
 *  - ignore regions (excludes dynamic elements from pixel-by-pixel comparison)
 */
async function snap(
  name: string,
  testCase: string,
  opts: {
    scope?: string; // CSS selector — scope-based snapshot
    ignoreSelectors?: string[]; // CSS selectors — elements excluded from diff
  } = {},
): Promise<void> {
  const percyOptions: Record<string, unknown> = {
    // ── Test Case Grouping ──────────────────────────────────────────────
    // Groups all snapshots with the same testCase label together in the
    // Percy dashboard, making it easy to review a full journey at once.
    testCase,
  };

  // ── Scope-Based Snapshot ────────────────────────────────────────────────
  // When a CSS selector is provided, Percy captures only that DOM subtree
  // instead of the full page — useful for component-level visual regression.
  if (opts.scope) {
    percyOptions.scope = opts.scope;
  }

  // ── Ignore Regions by CSS Selector ─────────────────────────────────────
  // CSS selector-based regions work with BrowserStack Automate Percy
  // (captureAutomateScreenshot). Elements matching these selectors are
  // excluded fssadf rom the pixel diff so dynamic content never causes false failures.
  if (opts.ignoreSelectors && opts.ignoreSelectors.length > 0) {
    percyOptions.ignore_region_selectors = opts.ignoreSelectors;
  }

  // ── Percy Automate Screenshot ───────────────────────────────────────────
  // On BrowserStack Automate, @percy/webdriverio's percySnapshot is blocked.
  // We use captureAutomateScreenshot from @percy/sdk-utils directly, which
  // is the same underlying call used by @percy/appium-app for mobile Percy.
  // All Percy calls are wrapped in a hard 8s timeout so a stale/missing
  // Percy agent never blocks the functional test flow.
  const PERCY_TIMEOUT = 5000;
  const withTimeout = <T>(
    p: Promise<T>,
    ms: number,
    label: string,
  ): Promise<T> =>
    Promise.race([
      p,
      new Promise<T>((_, reject) =>
        setTimeout(
          () => reject(new Error(`Percy timed out after ${ms}ms — ${label}`)),
          ms,
        ),
      ),
    ]);

  try {
    const enabled = await withTimeout(
      sdkUtils.isPercyEnabled() as Promise<boolean>,
      PERCY_TIMEOUT,
      "isPercyEnabled",
    );
    if (!enabled) {
      console.warn(`[Percy] Snapshot "${name}" skipped: Percy is not enabled`);
      return;
    }
    const sessionId = browser.sessionId;
    const caps = browser.capabilities as Record<string, unknown>;
    const hubUrl = `https://hub-aps.browserstack.com/wd/hub`;
    await withTimeout(
      captureAutomateScreenshot({
        sessionId,
        commandExecutorUrl: hubUrl,
        capabilities: caps,
        snapshotName: name,
        options: percyOptions,
        clientInfo: "@percy/webdriverio/3.3.2",
        environmentInfo: `webdriverio/${(browser as unknown as {version?: string}).version ?? "unknown"}`,
      }) as Promise<void>,
      PERCY_TIMEOUT,
      "captureAutomateScreenshot",
    );
  } catch (err) {
    console.warn(
      `[Percy] Snapshot "${name}" skipped: ${(err as Error).message}`,
    );
  }
  // Keep-alive: ping the session after every Percy call (success or failure)
  // to prevent the BrowserStack session from going idle after Percy proxy errors.
  try {
    await browser.execute(() => true);
  } catch {
    /* session may be gone */
  }
}

// ═════════════════════════════════════════════════════════════════════════════
describe("FashionStack Percy Visual — Browse, Cart, and Checkout Journeys", () => {
  // ─── T001 ─────────────────────────────────────────────────────────────────
  // Demonstrates: full-page pixel diff + ignore header + test case grouping
  it("should capture visual snapshots — browse Men category, add Polo Shirt to cart with Navy color and size L, and complete checkout", async () => {
    await homePage.open();
    // Wait for the page to be fully loaded — use the theme toggle as the ready signal
    // (id="test-mode-switch" is always present in the header once the app hydrates)
    await $("#test-mode-switch").waitForExist({timeout: 15000});

    // If PERCY_DARK_MODE=true, toggle to dark mode before the snapshot.
    // Run once without the flag (light baseline), then with it (dark comparison)
    // — Percy compares the same snapshot name across builds and shows the diff.
    const darkMode = process.env.PERCY_DARK_MODE === "true";
    if (darkMode) {
      await homePage.toggleTheme();
      // Wait for the theme CSS transition to complete (dark mode is CSS-only, no navigation)
      await browser.pause(2000);
    }

    // Full-page snapshot — nav bar IS included in the diff so Percy detects
    // the dark mode colour change. Only the cart badge (top-right) is ignored
    // since it's a dynamic number that changes between runs.
    await snap("T001 — Home Page", "T001: Men → Polo Shirt → Checkout", {
      ignoreSelectors: [...ignoreCartBadge],
    });

    await homePage.clickNavButton("Men");
    await expect($("h1*=Men")).toBeExisting();

    // Scope-based: capture only the product grid, not the full page
    await snap(
      "T001 — Men Category Grid",
      "T001: Men → Polo Shirt → Checkout",
      {
        scope: "main",
        ignoreSelectors: [...ignoreProductCount],
      },
    );

    await categoryPage.clickProductByName("Polo Shirt");
    await expect($("h1=Polo Shirt")).toBeExisting();

    await snap(
      "T001 — Polo Shirt Product Page",
      "T001: Men → Polo Shirt → Checkout",
      {
        ignoreSelectors: [...ignoreHeader],
      },
    );

    await productPage.selectColorByIndex(1);
    await expect($("h3*=Color: Navy")).toBeExisting();
    await productPage.selectSize("L");
    await expect($("h3*=Size: L")).toBeExisting();
    await productPage.increaseQuantity(1);

    // Scope-based: capture only the product detail panel
    await snap(
      "T001 — Polo Shirt Variants Selected",
      "T001: Men → Polo Shirt → Checkout",
      {
        scope: '[data-testid="product-detail"], main',
      },
    );

    await productPage.clickAddToCart();
    // Wait for "View Cart" button to confirm item was added to cart, then click it
    const viewCartBtn = await $("button=View Cart");
    await viewCartBtn.waitForExist({timeout: 10000});
    await browser.execute(
      (el: HTMLElement) => el.click(),
      viewCartBtn as unknown as HTMLElement,
    );
    await expect(cartPage.heading).toBeExisting();

    await snap(
      "T001 — Cart with Polo Shirt",
      "T001: Men → Polo Shirt → Checkout",
      {
        ignoreSelectors: [...ignoreHeader, ...ignoreCartSubtotal],
      },
    );

    await cartPage.clickProceedToCheckout();
    await expect(checkoutPage.heading).toBeExisting();

    await snap("T001 — Checkout Page", "T001: Men → Polo Shirt → Checkout", {
      ignoreSelectors: [...ignoreHeader],
    });

    await checkoutPage.completeCheckout("test@example.com", SHIPPING, PAYMENT);
    await browser.pause(2000);
    await expect($("h1*=Order")).toBeExisting();

    await snap(
      "T001 — Order Confirmation",
      "T001: Men → Polo Shirt → Checkout",
      {
        ignoreSelectors: [...ignoreHeader, ...ignoreOrderMeta],
      },
    );
  });

  // ─── T002 ─────────────────────────────────────────────────────────────────
  // Demonstrates: scope-based component snapshot (product card) + test case grouping
  it("should capture visual snapshots — browse Women category, select first product variants, and add to cart", async () => {
    await homePage.open();
    await expect($("button=Scan Image")).toBeExisting();

    await snap("T002 — Home Page", "T002: Women → First Product → Cart", {
      ignoreSelectors: [...ignoreHeader],
    });

    await homePage.clickNavButton("Women");
    await expect($("h1*=Women")).toBeExisting();

    // Scope-based: product grid only
    await snap(
      "T002 — Women Category Grid",
      "T002: Women → First Product → Cart",
      {
        scope: "main",
        ignoreSelectors: [...ignoreProductCount],
      },
    );

    await categoryPage.clickFirstProduct();
    await expect($("h1")).toBeExisting();

    await snap(
      "T002 — Product Detail Page",
      "T002: Women → First Product → Cart",
      {
        ignoreSelectors: [...ignoreHeader],
      },
    );

    await productPage.selectColorByIndex(1);
    await productPage.selectSize("M");

    // Scope-based: variant selector panel only
    await snap(
      "T002 — Variants Selected",
      "T002: Women → First Product → Cart",
      {
        scope: "main",
      },
    );

    await productPage.clickAddToCart();
    await browser.pause(1000);

    await homePage.clickCartButton();
    await expect(cartPage.heading).toBeExisting();

    await snap("T002 — Cart Page", "T002: Women → First Product → Cart", {
      ignoreSelectors: [...ignoreHeader, ...ignoreCartSubtotal],
    });
  });

  // ─── T003 ─────────────────────────────────────────────────────────────────
  // Demonstrates: ignore regions on auth forms + full journey test case grouping
  it("should capture visual snapshots — register new account, search for dress, add to cart, and complete purchase", async () => {
    await homePage.open();

    await snap("T003 — Home Page", "T003: Register → Search Dress → Checkout", {
      ignoreSelectors: [...ignoreHeader],
    });

    await homePage.clickLogin();
    await browser.pause(500);

    // Scope-based: modal only, not the blurred background
    await snap(
      "T003 — Login Modal",
      "T003: Register → Search Dress → Checkout",
      {
        scope: '[role="dialog"], form',
      },
    );

    await browser.execute(() => {
      const btn = Array.from(document.querySelectorAll("button")).find(
        (b) => b.textContent?.trim() === "Sign up here",
      );
      if (btn) (btn as HTMLElement).click();
    });
    await browser.pause(500);

    await snap(
      "T003 — Registration Form",
      "T003: Register → Search Dress → Checkout",
      {
        scope: '[role="dialog"], form',
      },
    );

    const uniqueEmail = `testuser_${Date.now()}@example.com`;
    await authPage.register({
      firstName: "Jane",
      lastName: "Smith",
      email: uniqueEmail,
      password: "Password123!",
      confirmPassword: "Password123!",
    });
    await browser.pause(2000);

    await homePage.open();
    await $("h1*=FashionStack").waitForExist({timeout: 10000});

    await snap(
      "T003 — Home Page After Registration",
      "T003: Register → Search Dress → Checkout",
      {
        ignoreSelectors: [...ignoreHeader],
      },
    );

    await homePage.searchInput.setValue("dress");
    await browser.keys("Enter");
    await browser.pause(1000);
    await expect($("h3")).toBeExisting();

    await snap(
      "T003 — Dress Search Results",
      "T003: Register → Search Dress → Checkout",
      {
        scope: "main",
        ignoreSelectors: [...ignoreProductCount],
      },
    );

    await categoryPage.clickFirstProduct();
    await expect($("h1")).toBeExisting();
    await productPage.selectColorByIndex(1);
    await productPage.selectSize("M");

    await snap(
      "T003 — Dress Variants Selected",
      "T003: Register → Search Dress → Checkout",
      {
        ignoreSelectors: [...ignoreHeader],
      },
    );

    await productPage.clickAddToCart();
    await browser.pause(1000);

    await homePage.clickCartButton();
    await expect(cartPage.heading).toBeExisting();
    await cartPage.clickProceedToCheckout();
    await expect(checkoutPage.heading).toBeExisting();

    await snap(
      "T003 — Checkout Page",
      "T003: Register → Search Dress → Checkout",
      {
        ignoreSelectors: [...ignoreHeader],
      },
    );

    await checkoutPage.completeCheckout(uniqueEmail, SHIPPING, PAYMENT);
    await browser.pause(2000);
    await expect($("h1*=Order")).toBeExisting();

    await snap(
      "T003 — Order Confirmation",
      "T003: Register → Search Dress → Checkout",
      {
        ignoreSelectors: [...ignoreHeader, ...ignoreOrderMeta],
      },
    );
  });

  // ─── T004 ─────────────────────────────────────────────────────────────────
  // Demonstrates: geo-dynamic content excluded via ignore regions
  it("should capture visual snapshots — geo-location special offers, select sale product, and complete checkout", async () => {
    await homePage.open();

    await snap("T004 — Home Page", "T004: Offers → Sale Product → Checkout", {
      ignoreSelectors: [...ignoreHeader],
    });

    await homePage.clickNavButton("Offers");
    await expect($("h1*=Special Offers")).toBeExisting();
    await browser.pause(3000);
    await $('[data-slot="card-content"]').waitForExist({timeout: 15000});

    // Ignore product count — geo-targeted results vary by location
    await snap(
      "T004 — Special Offers Page",
      "T004: Offers → Sale Product → Checkout",
      {
        scope: "main",
        ignoreSelectors: [...ignoreProductCount],
      },
    );

    await categoryPage.clickFirstProduct();
    await $("button*=Add to Cart").waitForExist({timeout: 15000});

    await snap(
      "T004 — Offer Product Detail",
      "T004: Offers → Sale Product → Checkout",
      {
        ignoreSelectors: [...ignoreHeader],
      },
    );

    const hasColorOptions = await $("h3*=Color:").isExisting();
    if (hasColorOptions) await productPage.selectColorByIndex(1);
    const hasSizeOptions = await $("h3*=Size:").isExisting();
    if (hasSizeOptions) await productPage.selectSize("M");

    await productPage.clickAddToCart();
    await browser.pause(1000);

    await homePage.clickCartButton();
    await expect(cartPage.heading).toBeExisting();

    await snap(
      "T004 — Cart with Offer Product",
      "T004: Offers → Sale Product → Checkout",
      {
        ignoreSelectors: [...ignoreHeader, ...ignoreCartSubtotal],
      },
    );

    await cartPage.clickProceedToCheckout();
    await expect(checkoutPage.heading).toBeExisting();

    await checkoutPage.completeCheckout(
      "offers@example.com",
      SHIPPING,
      PAYMENT,
    );
    await browser.pause(2000);
    await expect($("h1*=Order")).toBeExisting();

    await snap(
      "T004 — Order Confirmation",
      "T004: Offers → Sale Product → Checkout",
      {
        ignoreSelectors: [...ignoreHeader, ...ignoreOrderMeta],
      },
    );
  });
});
