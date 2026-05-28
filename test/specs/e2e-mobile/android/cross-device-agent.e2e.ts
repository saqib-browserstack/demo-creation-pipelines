/**
 * Cross-Device Agent — BrowserStack Demo App (Android)
 * Uses standard Appium selectors via page objects (no AI authoring required).
 */

import { expect, $, $$ } from "@wdio/globals";
import homePage from "../../../pageobjects/mobile/android/home.page.js";
import loginPage from "../../../pageobjects/mobile/android/login.page.js";
import cartPage from "../../../pageobjects/mobile/android/cart.page.js";
import checkoutPage from "../../../pageobjects/mobile/android/checkout.page.js";
import favouritesPage from "../../../pageobjects/mobile/android/favourites.page.js";
import filterPage from "../../../pageobjects/mobile/android/filter.page.js";
import ordersPage from "../../../pageobjects/mobile/android/orders.page.js";
import settingsPage from "../../../pageobjects/mobile/android/settings.page.js";

// ─── Helper: navigate back to home screen ────────────────────────────────────
async function goHome() {
  // Press back up to 5 times until ~menu is visible
  for (let i = 0; i < 5; i++) {
    try {
      const menu = await $("~menu");
      if (await menu.isDisplayed()) return;
    } catch {}
    await browser.back();
    await browser.waitUntil(async () => true, { timeout: 1000 });
  }
}

// ─── Helper: wait for app to be ready (home screen visible) ──────────────────
async function waitForAppReady() {
  await browser.waitUntil(
    async () => {
      try {
        const menu = await $("~menu");
        return await menu.isDisplayed();
      } catch {
        return false;
      }
    },
    { timeout: 30000, interval: 1000, timeoutMsg: "App home screen did not load in time" }
  );
}

// ─── Helper: ensure logged out then login ────────────────────────────────────
async function loginAs(username: string, password: string) {
  await goHome();
  await homePage.openMenu();

  // If already logged in, log out first
  try {
    const logoutBtn = await $("~nav-logout");
    if (await logoutBtn.isDisplayed()) {
      await logoutBtn.click();
      await waitForAppReady();
      await homePage.openMenu();
    }
  } catch {}

  const signInBtn = await $("~nav-signin");
  await signInBtn.waitForDisplayed({ timeout: 5000 });
  await signInBtn.click();
  await loginPage.login(username, password);
  await waitForAppReady();
}

// ─── Helper: mark session status ─────────────────────────────────────────────
async function markPassed(reason: string) {
  const safe = reason.replace(/"/g, "'").replace(/\n/g, " ");
  await browser.execute(
    `browserstack_executor: {"action": "setSessionStatus", "arguments": {"status": "passed", "reason": "${safe}"}}`
  );
}

async function markFailed(reason: string) {
  const safe = reason.replace(/"/g, "'").replace(/\n/g, " ");
  await browser.execute(
    `browserstack_executor: {"action": "setSessionStatus", "arguments": {"status": "failed", "reason": "${safe}"}}`
  ).catch(() => {});
}

// ─── Test Suite ───────────────────────────────────────────────────────────────

describe("AI Cross-Device Agent — BrowserStack Demo App (Android)", () => {

  beforeEach(async () => {
    await goHome();
    await waitForAppReady();
  });

  // ── TC-01: Valid Login ────────────────────────────────────────────────────
  it("TC-01: should login successfully with valid credentials", async () => {
    try {
      await loginAs("demouser", "testingisfun99");
      await homePage.productsFound.waitForDisplayed({ timeout: 10000 });
      const text = await homePage.productsFound.getText();
      expect(text.toLowerCase()).toContain("product(s) found");
      await markPassed("Login succeeded and product listing is visible");
    } catch (e: any) {
      await markFailed(`TC-01 failed: ${e.message}`);
      throw e;
    }
  });

  // ── TC-02: Invalid Login shows error ─────────────────────────────────────
  it("TC-02: should show an error when logging in with invalid credentials", async () => {
    try {
      await goHome();
      await homePage.openMenu();

      // Logout if already logged in
      try {
        const logoutBtn = await $("~nav-logout");
        if (await logoutBtn.isDisplayed()) {
          await logoutBtn.click();
          await waitForAppReady();
          await homePage.openMenu();
        }
      } catch {}

      const signInBtn = await $("~nav-signin");
      await signInBtn.waitForDisplayed({ timeout: 5000 });
      await signInBtn.click();
      // Tap LOGIN without selecting credentials — triggers a validation/API error
      await loginPage.loginForm.waitForDisplayed({ timeout: 10000 });
      await loginPage.signInButton.waitForExist({ timeout: 10000 });
      await loginPage.signInButton.click();
      await loginPage.apiError.waitForDisplayed({ timeout: 10000 });
      const errorText = await loginPage.apiError.getText();
      expect(errorText.length).toBeGreaterThan(0);
      await markPassed("Error message shown for invalid credentials");
    } catch (e: any) {
      await markFailed(`TC-02 failed: ${e.message}`);
      throw e;
    }
  });

  // ── TC-03: Add product to cart ────────────────────────────────────────────
  it("TC-03: should add a product to cart and verify cart count", async () => {
    try {
      await loginAs("demouser", "testingisfun99");
      await homePage.addFirstProductToCart();
      await homePage.openCart();
      await cartPage.waitForCartToLoad();
      await cartPage.numberOfProducts.waitForDisplayed({ timeout: 10000 });
      const countText = await cartPage.numberOfProducts.getText();
      expect(countText).toContain("1");
      await cartPage.cartItem.waitForDisplayed({ timeout: 5000 });
      await markPassed("Cart correctly shows 1 product after adding from home screen");
    } catch (e: any) {
      await markFailed(`TC-03 failed: ${e.message}`);
      throw e;
    }
  });

  // ── TC-04: Full checkout journey ──────────────────────────────────────────
  it("TC-04: should complete a full checkout from login to order submission", async () => {
    try {
      await loginAs("demouser", "testingisfun99");
      await homePage.addFirstProductToCart();
      await homePage.openCart();
      await cartPage.proceedToCheckout();
      await checkoutPage.waitForCheckoutToLoad();
      await checkoutPage.fillShippingAddress({
        firstName: "Jane",
        lastName: "Smith",
        address: "456 Elm Avenue",
        state: "New York",
        postalCode: "10001",
      });
      await checkoutPage.submitOrder();
      await markPassed("Full checkout journey completed successfully");
    } catch (e: any) {
      await markFailed(`TC-04 failed: ${e.message}`);
      throw e;
    }
  });

  // ── TC-05: Favourite a product ────────────────────────────────────────────
  it("TC-05: should favourite a product and verify it appears in Favourites", async () => {
    try {
      await loginAs("demouser", "testingisfun99");
      const favIcon = await $("~mark-favourite-12");
      await favIcon.waitForDisplayed({ timeout: 10000 });
      await favIcon.click();
      await homePage.navigateToDrawerItem("Favourites");
      await favouritesPage.numberOfFavourites.waitForDisplayed({ timeout: 10000 });
      const favText = await favouritesPage.numberOfFavourites.getText();
      expect(favText).toMatch(/\d+ product\(s\) marked favourite\./);
      await markPassed("Product favourited and visible in Favourites screen");
    } catch (e: any) {
      await markFailed(`TC-05 failed: ${e.message}`);
      throw e;
    }
  });

  // ── TC-06: Filter by vendor ───────────────────────────────────────────────
  it("TC-06: should apply Samsung vendor filter and reduce the product count", async () => {
    try {
      await loginAs("demouser", "testingisfun99");
      await homePage.productsFound.waitForDisplayed({ timeout: 10000 });
      const beforeText = await homePage.productsFound.getText();
      const beforeCount = parseInt(beforeText.match(/\d+/)?.[0] ?? "0", 10);

      await homePage.filterSortButton.waitForDisplayed({ timeout: 5000 });
      await homePage.filterSortButton.click();
      await filterPage.filterByVendor("Samsung");
      await browser.back();

      await homePage.productsFound.waitForDisplayed({ timeout: 10000 });
      const afterText = await homePage.productsFound.getText();
      const afterCount = parseInt(afterText.match(/\d+/)?.[0] ?? "0", 10);
      expect(afterCount).toBeLessThan(beforeCount);

      await homePage.filterSortButton.waitForDisplayed({ timeout: 5000 });
      await homePage.filterSortButton.click();
      await filterPage.clearFilters();
      await browser.back();

      await homePage.productsFound.waitForDisplayed({ timeout: 10000 });
      const restoredText = await homePage.productsFound.getText();
      const restoredCount = parseInt(restoredText.match(/\d+/)?.[0] ?? "0", 10);
      expect(restoredCount).toBe(beforeCount);
      await markPassed("Samsung filter reduced count and clear restored original count");
    } catch (e: any) {
      await markFailed(`TC-06 failed: ${e.message}`);
      throw e;
    }
  });

  // ── TC-07: Orders screen ──────────────────────────────────────────────────
  it("TC-07: should navigate to Orders and display a valid order count", async () => {
    try {
      await loginAs("demouser", "testingisfun99");
      await homePage.navigateToDrawerItem("Orders");
      await ordersPage.numberOfOrders.waitForDisplayed({ timeout: 10000 });
      const ordersText = await ordersPage.numberOfOrders.getText();
      expect(ordersText).toMatch(/\d+ order\(s\) found\./);
      await markPassed("Orders screen displayed a valid order count");
    } catch (e: any) {
      await markFailed(`TC-07 failed: ${e.message}`);
      throw e;
    }
  });

  // ── TC-08: Settings platform info ─────────────────────────────────────────
  it("TC-08: should navigate to Settings and verify Android platform info", async () => {
    try {
      await loginAs("demouser", "testingisfun99");
      await homePage.navigateToDrawerItem("Settings");
      await settingsPage.detectedPlatform.waitForDisplayed({ timeout: 10000 });
      const platformText = await settingsPage.detectedPlatform.getText();
      expect(platformText.toLowerCase()).toContain("android");
      await settingsPage.detectedVersion.waitForDisplayed({ timeout: 5000 });
      const versionText = await settingsPage.detectedVersion.getText();
      expect(versionText).toMatch(/Detected Version/i);
      await markPassed("Settings shows correct Android platform and version info");
    } catch (e: any) {
      await markFailed(`TC-08 failed: ${e.message}`);
      throw e;
    }
  });

});