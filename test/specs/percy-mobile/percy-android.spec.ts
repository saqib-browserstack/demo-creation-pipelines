import { createRequire } from "node:module";
import { $, browser } from "@wdio/globals";
import loginPage from "../../pageobjects/mobile/android/LoginPage.android.js";
import productsPage from "../../pageobjects/mobile/android/ProductsPage.android.js";
import cartPage from "../../pageobjects/mobile/android/CartPage.android.js";
import offersPage from "../../pageobjects/mobile/android/OffersPage.android.js";
import ordersPage from "../../pageobjects/mobile/android/OrdersPage.android.js";
import favouritesPage from "../../pageobjects/mobile/android/FavouritesPage.android.js";
import settingsPage from "../../pageobjects/mobile/android/SettingsPage.android.js";

/**
 * Percy Visual Tests — Android BrowserStack Demo App
 *
 * 8 modules × multiple snapshots = maximum visual coverage.
 *
 * Test case grouping: each snapshot passes `testCase` matching its module name.
 * This groups snapshots under named test cases in the Percy dashboard.
 *
 * Ignore regions use IgnoreRegion instances (top, bottom, left, right) to
 * exclude dynamic elements (status bar, counts, prices, usernames) from diffs.
 *
 * Device: Samsung Galaxy S23, Android 13, screen 1080×2115.
 */

// Load Percy + IgnoreRegion via require() — CommonJS package in NodeNext project
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
/** System status bar: clock, signal, battery icons (top 0–105px) */
const statusBar = () => new IgnoreRegion(0, 105, 0, 1080);
/** App bar title area (dynamic screen name) */
const appBarTitle = () => new IgnoreRegion(105, 211, 153, 927);
/** Products-found count label: "21 Product(s) found." */
const productsCount = () => new IgnoreRegion(378, 435, 347, 733);
/** Cart subtotal + installment price rows */
const cartSubtotal = () => new IgnoreRegion(1102, 1216, 93, 987);
/** Drawer username greeting: "Welcome demouser" */
const drawerUsername = () => new IgnoreRegion(90, 212, 0, 840);
/** Orders count label */
const ordersCount = () => new IgnoreRegion(270, 327, 384, 696);
/** Favourites count label */
const favouritesCount = () => new IgnoreRegion(270, 327, 258, 823);
/** Add to cart buttons on all visible product listing cards (full right column) */
const addToCartBtn = () => new IgnoreRegion(378, 2115, 750, 1080);

// ─── Helper ───────────────────────────────────────────────────────────────────
/**
 * Take a Percy snapshot with test case grouping and ignore regions.
 *
 * @param name       - unique snapshot name shown in Percy
 * @param testCase   - test case group name for Percy dashboard grouping
 * @param ignoreList - IgnoreRegion instances to exclude from visual diffs
 */
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
 * Navigate back to the Home screen from any app state.
 * Checks for the menu button (by content-desc OR by position) and presses
 * back up to 5 times until the home screen is reached.
 */
async function isOnHomeScreen(): Promise<boolean> {
  // Check for menu by content-desc (original app)
  const byDesc = await $("~menu").isExisting().catch(() => false);
  if (byDesc) return true;
  // Check for products-found label as alternative home screen indicator
  const byProducts = await $("~products-found").isExisting().catch(() => false);
  return byProducts;
}

async function goHome(): Promise<void> {
  for (let i = 0; i < 5; i++) {
    if (await isOnHomeScreen()) return;
    await browser.back();
    try {
      await browser.waitUntil(() => isOnHomeScreen(), { timeout: 4000, interval: 500 });
      return;
    } catch {
      // not home yet — loop again
    }
  }
  // Last resort: verify we're home or throw
  if (!(await isOnHomeScreen())) {
    throw new Error("Could not navigate to home screen after 5 back presses");
  }
}

// ─────────────────────────────────────────────────────────────────────────────
describe("Percy Android Visual Tests", () => {

  // ── 1. Login Module ─────────────────────────────────────────────────────────
  describe("Login Module", () => {
    before(async () => {
      await goHome();
      await loginPage.goToSignIn();
      await loginPage.loginBtn.waitForDisplayed({ timeout: 10000 });
    });

    it("should capture the Sign In screen (empty state)", async () => {
      await percySnap("Android - Sign In Screen", "Login Module");
    });

    it("should capture the Sign In screen with username selected", async () => {
      await loginPage.selectUsername("demouser");
      await loginPage.loginBtn.waitForDisplayed({ timeout: 5000 });
      await percySnap("Android - Sign In Screen Username Selected", "Login Module");
    });
  });

  // ── 2. Products Module ──────────────────────────────────────────────────────
  describe("Products Module", () => {
    before(async () => {
      await goHome();
      const menuExists = await $("~menu").isExisting().catch(() => false);
      if (!menuExists) {
        await loginPage.goToSignIn();
        await loginPage.login("demouser", "testingisfun99");
      } else {
        await productsPage.openDrawer();
        const logoutExists = await $("~nav-logout").isExisting().catch(() => false);
        if (!logoutExists) {
          await browser.back();
          await loginPage.goToSignIn();
          await loginPage.login("demouser", "testingisfun99");
        } else {
          await browser.back();
        }
      }
      await productsPage.firstProductCard.waitForDisplayed({ timeout: 15000 });
    });

    it("should capture the Products listing screen", async () => {
      await percySnap("Android - Products Listing Screen", "Products Module", [productsCount(), addToCartBtn()]);
    });

    it("should capture the Products listing with Filter & Sort visible", async () => {
      await productsPage.filterSortBtn.waitForDisplayed({ timeout: 5000 });
      await percySnap("Android - Products Listing With Filter Sort", "Products Module", [productsCount(), addToCartBtn()]);
    });

    it("should capture the Products listing after adding item to cart", async () => {
      await productsPage.addToCart("12");
      await cartPage.navCartBtn.waitForDisplayed({ timeout: 10000 });
      await percySnap("Android - Products Listing After Add To Cart", "Products Module", [productsCount(), addToCartBtn()]);
    });
  });

  // ── 3. Cart Module ──────────────────────────────────────────────────────────
  describe("Cart Module", () => {
    before(async () => {
      await goHome();
      await productsPage.firstProductCard.waitForDisplayed({ timeout: 15000 });
      const addBtnExists = await $("~add-to-cart-12").isExisting().catch(() => false);
      if (addBtnExists) {
        await productsPage.addToCart("12");
        await cartPage.navCartBtn.waitForDisplayed({ timeout: 10000 });
      }
      await cartPage.goToCart();
      await cartPage.waitForCartLoaded();
    });

    it("should capture the Cart screen with item", async () => {
      await percySnap("Android - Cart Screen With Item", "Cart Module", [cartSubtotal()]);
    });

    it("should capture the Cart screen showing checkout button", async () => {
      await cartPage.checkoutBtn.waitForDisplayed({ timeout: 10000 });
      await percySnap("Android - Cart Screen Checkout CTA", "Cart Module", [cartSubtotal()]);
    });
  });

  // ── 4. Offers Module ────────────────────────────────────────────────────────
  describe("Offers Module", () => {
    before(async () => {
      await goHome();
      await offersPage.goToSection("Offers");
      await offersPage.noOffersMessage.waitForDisplayed({ timeout: 10000 });
    });

    it("should capture the Offers screen (no offers state)", async () => {
      await percySnap("Android - Offers Screen No Offers", "Offers Module", [appBarTitle()]);
    });
  });

  // ── 5. Orders Module ────────────────────────────────────────────────────────
  describe("Orders Module", () => {
    before(async () => {
      await goHome();
      await ordersPage.goToSection("Orders");
      await ordersPage.numberOfOrdersLabel.waitForDisplayed({ timeout: 10000 });
    });

    it("should capture the Orders screen (empty state)", async () => {
      await percySnap("Android - Orders Screen Empty", "Orders Module", [ordersCount(), appBarTitle()]);
    });
  });

  // ── 6. Favourites Module ────────────────────────────────────────────────────
  describe("Favourites Module", () => {
    before(async () => {
      await goHome();
      await favouritesPage.goToSection("Favourites");
      await favouritesPage.numberOfFavouritesLabel.waitForDisplayed({ timeout: 10000 });
    });

    it("should capture the Favourites screen (empty state)", async () => {
      await percySnap("Android - Favourites Screen Empty", "Favourites Module", [favouritesCount(), appBarTitle()]);
    });
  });

  // ── 7. Settings Module ──────────────────────────────────────────────────────
  describe("Settings Module", () => {
    before(async () => {
      await goHome();
      await settingsPage.goToSection("Settings");
      await settingsPage.mockedTab.waitForDisplayed({ timeout: 10000 });
    });

    it("should capture the Settings screen (Mocked tab active)", async () => {
      await percySnap("Android - Settings Screen Mocked Tab", "Settings Module", [appBarTitle()]);
    });

    it("should capture the Settings screen with URL tab selected", async () => {
      await settingsPage.urlTab.click();
      await settingsPage.updateConfigBtn.waitForDisplayed({ timeout: 5000 });
      await percySnap("Android - Settings Screen URL Tab", "Settings Module", [appBarTitle()]);
    });
  });

  // ── 8. Navigation Drawer Module ─────────────────────────────────────────────
  describe("Navigation Drawer Module", () => {
    before(async () => {
      await goHome();
    });

    it("should capture the navigation drawer (logged-in state)", async () => {
      await productsPage.openDrawer();
      await loginPage.navLogoutBtn.waitForDisplayed({ timeout: 10000 });
      await percySnap("Android - Navigation Drawer Logged In", "Navigation Drawer Module", [drawerUsername()]);
    });

    it("should capture the navigation drawer (logged-out state)", async () => {
      // navLogoutBtn is inside the drawer — click it directly (drawer already open from previous test)
      await loginPage.navLogoutBtn.waitForDisplayed({ timeout: 5000 });
      await loginPage.navLogoutBtn.click();
      // After logout, app returns to home — open drawer again to capture logged-out state
      await $("~menu").waitForExist({ timeout: 10000 });
      await productsPage.openDrawer();
      await loginPage.navSignInBtn.waitForDisplayed({ timeout: 10000 });
      await percySnap("Android - Navigation Drawer Logged Out", "Navigation Drawer Module");
    });
  });
});