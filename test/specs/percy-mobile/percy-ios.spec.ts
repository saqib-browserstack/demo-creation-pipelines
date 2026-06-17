import { createRequire } from "node:module";
import { $, browser } from "@wdio/globals";
import loginPage from "../../pageobjects/mobile/ios/LoginPage.ios.js";
import productsPage from "../../pageobjects/mobile/ios/ProductsPage.ios.js";
import cartPage from "../../pageobjects/mobile/ios/CartPage.ios.js";
import offersPage from "../../pageobjects/mobile/ios/OffersPage.ios.js";
import ordersPage from "../../pageobjects/mobile/ios/OrdersPage.ios.js";
import favouritesPage from "../../pageobjects/mobile/ios/FavouritesPage.ios.js";
import settingsPage from "../../pageobjects/mobile/ios/SettingsPage.ios.js";

/**
 * Percy Visual Tests — iOS BrowserStack Demo App
 *
 * 8 modules × multiple snapshots = maximum visual coverage.
 *
 * Ignore regions exclude dynamic elements from visual diffs:
 *   - STATUS_BAR: system clock/signal icons (top 0–35px on iPhone 15)
 *   - Per-snapshot regions for dynamic text (counts, prices, usernames)
 *
 * Device: iPhone 15, iOS 17, screen 390×844.
 */

// Load Percy via require() — @percy/appium-app uses CommonJS exports
const require = createRequire(import.meta.url);
const percyScreenshot = require("@percy/appium-app") as (
  driver: unknown,
  name: string,
  options?: object
) => Promise<object>;
const { IgnoreRegion } = require("@percy/appium-app/percy/util/ignoreRegion") as {
  IgnoreRegion: new (top: number, bottom: number, left: number, right: number) => object;
};

// ─── Reusable Ignore Regions ─────────────────────────────────────────────────
/** iOS status bar: clock, signal, battery icons (top 0–35px) */
const statusBar = () => new IgnoreRegion(0, 35, 0, 390);
/** App bar title area (dynamic screen name) */
const appBarTitle = () => new IgnoreRegion(35, 80, 52, 339);
/** Products-found count label: "21 Product(s) found." */
const productsCount = () => new IgnoreRegion(124, 142, 128, 262);
/** Cart subtotal + installment price rows (approximate iOS coords) */
const cartSubtotal = () => new IgnoreRegion(480, 560, 40, 350);
/** Drawer username greeting: "Welcome demouser" */
const drawerUsername = () => new IgnoreRegion(50, 88, 0, 280);
/** Orders count label */
const ordersCount = () => new IgnoreRegion(124, 142, 128, 262);
/** Favourites count label */
const favouritesCount = () => new IgnoreRegion(124, 142, 128, 262);
/** Add to cart buttons on all visible product listing cards (full right column) */
const addToCartBtn = () => new IgnoreRegion(124, 844, 270, 390);

// ─── Helper ───────────────────────────────────────────────────────────────────
async function percySnap(
  name: string,
  testCase: string,
  ignoreList: object[] = []
): Promise<void> {
  await percyScreenshot(browser, name, {
    testCase,
    customIgnoreRegions: [statusBar(), ...ignoreList],
  });
}

/**
 * Dismiss any system alerts (permissions, etc.) that may block the app.
 */
async function dismissAnyAlerts(): Promise<void> {
  try {
    await browser.dismissAlert();
  } catch {
    // No alert present — that's fine
  }
}

/**
 * Check if the app is on the Home/Products screen.
 * On iOS, ~menu exists but may not be "displayed" (it's always in the DOM).
 */
async function isOnHomeScreen(): Promise<boolean> {
  const byMenu = await $("~menu").isExisting().catch(() => false);
  if (byMenu) return true;
  const byProducts = await $("~products-found").isExisting().catch(() => false);
  return byProducts;
}

/**
 * Navigate back to the Home screen from any app state.
 * Always terminates and relaunches the app to guarantee a clean home state.
 * ~menu exists on many screens (always in DOM), so we cannot use it as a
 * fast-path check — we must always relaunch to avoid false positives.
 */
async function getBundleId(): Promise<string> {
  try {
    const caps = await browser.getSession() as Record<string, unknown>;
    const bundleId = (caps["appium:bundleId"] ?? caps["bundleId"]) as string | undefined;
    if (bundleId) return bundleId;
    const appPath = (caps["appium:app"] ?? "") as string;
    const match = appPath.match(/([a-zA-Z][a-zA-Z0-9._-]+)\.ipa$/);
    if (match) return match[1];
  } catch { /* fall through */ }
  return "com.browserstack.Sample";
}

async function goHome(): Promise<void> {
  const bundleId = await getBundleId();
  // Always terminate and relaunch to guarantee clean home state
  await browser.terminateApp(bundleId);
  await browser.activateApp(bundleId);

  // Wait for home screen, dismissing any permission alerts along the way
  await browser.waitUntil(
    async () => {
      await dismissAnyAlerts();
      return isOnHomeScreen();
    },
    { timeout: 30000, interval: 1000 }
  );

  // Extra dismiss pass: alerts (e.g. Motion & Fitness) can appear AFTER the
  // home screen elements are already in the DOM. Give them up to 5 seconds.
  await browser.waitUntil(
    async () => {
      await dismissAnyAlerts();
      return true;
    },
    { timeout: 5000, interval: 500 }
  ).catch(() => { /* alert window may not appear — that's fine */ });
}

// ─────────────────────────────────────────────────────────────────────────────
describe("Percy iOS Visual Tests", () => {

  // ── 1. Login Module ─────────────────────────────────────────────────────────
  describe("Login Module", () => {
    before(async () => {
      await goHome();
      await loginPage.goToSignIn();
      await loginPage.loginBtn.waitForDisplayed({ timeout: 10000 });
    });

    it("should capture the Sign In screen (empty state)", async () => {
      await percySnap("iOS - Sign In Screen", "Login Module");
    });

    it("should capture the Sign In screen with username selected", async () => {
      await loginPage.selectUsername("demouser");
      await loginPage.loginBtn.waitForDisplayed({ timeout: 5000 });
      await percySnap("iOS - Sign In Screen Username Selected", "Login Module");
    });
  });

  // ── 2. Products Module ──────────────────────────────────────────────────────
  describe("Products Module", () => {
    before(async () => {
      // goHome() always relaunches — app starts on home screen (logged out)
      await goHome();
      // Login via drawer to reach the products listing
      await loginPage.goToSignIn();
      await loginPage.login("demouser", "testingisfun99");
      await productsPage.firstProductCard.waitForDisplayed({ timeout: 15000 });
    });

    it("should capture the Products listing screen", async () => {
      await percySnap("iOS - Products Listing Screen", "Products Module", [productsCount(), addToCartBtn()]);
    });

    it("should capture the Products listing with Filter & Sort visible", async () => {
      await productsPage.filterSortBtn.waitForDisplayed({ timeout: 5000 });
      await percySnap("iOS - Products Listing With Filter Sort", "Products Module", [productsCount(), addToCartBtn()]);
    });

    it("should capture the Products listing after adding item to cart", async () => {
      await productsPage.addToCart("12");
      await cartPage.navCartBtn.waitForDisplayed({ timeout: 10000 });
      await percySnap("iOS - Products Listing After Add To Cart", "Products Module", [productsCount(), addToCartBtn()]);
    });
  });

  // ── 3. Cart Module ──────────────────────────────────────────────────────────
  describe("Cart Module", () => {
    before(async () => {
      // goHome() relaunches — login, add item to cart, then navigate to cart
      await goHome();
      await loginPage.goToSignIn();
      await loginPage.login("demouser", "testingisfun99");
      await productsPage.firstProductCard.waitForDisplayed({ timeout: 15000 });
      await productsPage.addToCart("12");
      await cartPage.navCartBtn.waitForDisplayed({ timeout: 10000 });
      await cartPage.goToCart();
      await cartPage.waitForCartLoaded();
    });

    it("should capture the Cart screen with item", async () => {
      await percySnap("iOS - Cart Screen With Item", "Cart Module", [cartSubtotal()]);
    });

    it("should capture the Cart screen showing checkout button", async () => {
      await cartPage.checkoutBtn.waitForDisplayed({ timeout: 10000 });
      await percySnap("iOS - Cart Screen Checkout CTA", "Cart Module", [cartSubtotal()]);
    });
  });

  // ── 4. Offers Module ────────────────────────────────────────────────────────
  describe("Offers Module", () => {
    before(async () => {
      // goHome() relaunches — login first so drawer has full nav items
      await goHome();
      await loginPage.goToSignIn();
      await loginPage.login("demouser", "testingisfun99");
      await productsPage.firstProductCard.waitForDisplayed({ timeout: 15000 });
      await offersPage.goToSection("Offers");
      // iOS: Offers screen triggers a location permission alert — dismiss it
      // Alert may take a moment to appear; retry dismiss up to 3 times
      for (let i = 0; i < 3; i++) {
        await dismissAnyAlerts();
      }
      // Wait for the Offers screen to be ready — use waitUntil to check both
      // possible ready indicators (nav-cart or no-offers)
      await browser.waitUntil(
        async () => {
          await dismissAnyAlerts();
          const navCart = await $("~nav-cart").isExisting().catch(() => false);
          const noOffers = await $("~no-offers").isExisting().catch(() => false);
          return navCart || noOffers;
        },
        { timeout: 20000, interval: 1000 }
      );
    });

    it("should capture the Offers screen (no offers state)", async () => {
      await percySnap("iOS - Offers Screen No Offers", "Offers Module", [appBarTitle()]);
    });
  });

  // ── 5. Orders Module ────────────────────────────────────────────────────────
  describe("Orders Module", () => {
    before(async () => {
      // goHome() relaunches — login first so drawer has full nav items
      await goHome();
      await loginPage.goToSignIn();
      await loginPage.login("demouser", "testingisfun99");
      await productsPage.firstProductCard.waitForDisplayed({ timeout: 15000 });
      await ordersPage.goToSection("Orders");
      await ordersPage.numberOfOrdersLabel.waitForDisplayed({ timeout: 10000 });
    });

    it("should capture the Orders screen (empty state)", async () => {
      await percySnap("iOS - Orders Screen Empty", "Orders Module", [ordersCount(), appBarTitle()]);
    });
  });

  // ── 6. Favourites Module ────────────────────────────────────────────────────
  describe("Favourites Module", () => {
    before(async () => {
      // goHome() relaunches — login first so drawer has full nav items
      await goHome();
      await loginPage.goToSignIn();
      await loginPage.login("demouser", "testingisfun99");
      await productsPage.firstProductCard.waitForDisplayed({ timeout: 15000 });
      await favouritesPage.goToSection("Favourites");
      await favouritesPage.numberOfFavouritesLabel.waitForDisplayed({ timeout: 10000 });
    });

    it("should capture the Favourites screen (empty state)", async () => {
      await percySnap("iOS - Favourites Screen Empty", "Favourites Module", [favouritesCount(), appBarTitle()]);
    });
  });

  // ── 7. Settings Module ──────────────────────────────────────────────────────
  describe("Settings Module", () => {
    before(async () => {
      // goHome() relaunches — login first so drawer has full nav items
      await goHome();
      await loginPage.goToSignIn();
      await loginPage.login("demouser", "testingisfun99");
      await productsPage.firstProductCard.waitForDisplayed({ timeout: 15000 });
      await settingsPage.goToSection("Settings");
      await settingsPage.mockedTab.waitForDisplayed({ timeout: 10000 });
    });

    it("should capture the Settings screen (Mocked tab active)", async () => {
      await percySnap("iOS - Settings Screen Mocked Tab", "Settings Module", [appBarTitle()]);
    });

    it("should capture the Settings screen with URL tab selected", async () => {
      await settingsPage.urlTab.click();
      await settingsPage.updateConfigBtn.waitForDisplayed({ timeout: 5000 });
      await percySnap("iOS - Settings Screen URL Tab", "Settings Module", [appBarTitle()]);
    });
  });

  // ── 8. Navigation Drawer Module ─────────────────────────────────────────────
  describe("Navigation Drawer Module", () => {
    before(async () => {
      // goHome() relaunches — login so we can capture the logged-in drawer state
      await goHome();
      await loginPage.goToSignIn();
      await loginPage.login("demouser", "testingisfun99");
      await productsPage.firstProductCard.waitForDisplayed({ timeout: 15000 });
    });

    it("should capture the navigation drawer (logged-in state)", async () => {
      await productsPage.openDrawer();
      // iOS drawer items are off-screen (negative x bounds) — use waitForExist
      await loginPage.navLogoutBtn.waitForExist({ timeout: 10000 });
      await percySnap("iOS - Navigation Drawer Logged In", "Navigation Drawer Module", [drawerUsername()]);
    });

    it("should capture the navigation drawer (logged-out state)", async () => {
      // Close drawer and logout cleanly via goHome() relaunch
      // This guarantees a fresh app state distinct from the logged-in snapshot
      await loginPage.navLogoutBtn.waitForExist({ timeout: 5000 });
      await loginPage.navLogoutBtn.click();
      // Relaunch app to get a completely clean logged-out home screen
      await goHome();
      // Open drawer fresh — will show Sign In (logged-out state)
      await productsPage.openDrawer();
      // iOS drawer items are off-screen — use waitForExist
      await loginPage.navSignInBtn.waitForExist({ timeout: 10000 });
      await percySnap("iOS - Navigation Drawer Logged Out", "Navigation Drawer Module");
    });
  });
});