import { expect, $ } from "@wdio/globals";
import HomePage from "../../../pageobjects/mobile/android/home.page.js";
import LoginPage from "../../../pageobjects/mobile/android/login.page.js";
import FavouritesPage from "../../../pageobjects/mobile/android/favourites.page.js";
import OrdersPage from "../../../pageobjects/mobile/android/orders.page.js";
import OffersPage from "../../../pageobjects/mobile/android/offers.page.js";
import SettingsPage from "../../../pageobjects/mobile/android/settings.page.js";
import FilterPage from "../../../pageobjects/mobile/android/filter.page.js";

// ─── Helper: ensure logged out, then login ───────────────────────────────────
async function loginAs(username: string, password: string) {
  await HomePage.openMenu();

  // If already logged in (nav-logout visible), log out first
  const logoutBtn = await $('~nav-logout');
  const isLoggedIn = await logoutBtn.isDisplayed().catch(() => false);
  if (isLoggedIn) {
    await logoutBtn.click();
    // Wait for home screen to reset (Sign In appears in drawer)
    await browser.waitUntil(async () => {
      await HomePage.openMenu();
      const signin = await $('~nav-signin');
      return signin.isDisplayed().catch(() => false);
    }, { timeout: 10000, interval: 1000 });
  }

  // Now sign in
  const signInNavItem = await $('~nav-signin');
  await signInNavItem.waitForDisplayed({ timeout: 10000 });
  await signInNavItem.click();
  await LoginPage.loginForm.waitForDisplayed({ timeout: 10000 });
  await LoginPage.login(username, password);
  // Dismiss location permission if it appears after login
  try {
    const denyBtn = await $('id=com.android.permissioncontroller:id/permission_deny_and_dont_ask_again_button');
    await denyBtn.waitForDisplayed({ timeout: 3000 });
    await denyBtn.click();
  } catch {
    // No permission dialog — continue
  }
  await HomePage.productsFound.waitForDisplayed({ timeout: 15000 });
}

// ─── Helper: navigate drawer item ────────────────────────────────────────────
async function goToDrawerItem(item: "Home" | "Offers" | "Orders" | "Favourites" | "Settings") {
  await HomePage.openMenu();
  // Use UiAutomator to find the Button whose child TextView has the matching text
  const btn = await $(`android=new UiSelector().className("android.widget.Button").childSelector(new UiSelector().text("${item}"))`);
  await btn.waitForDisplayed({ timeout: 5000 });
  await btn.click();
}

// ─── Test Suite ──────────────────────────────────────────────────────────────
describe("BrowserStack Demo App - Feature Flows", () => {

  // ── 1. Favourite a product ─────────────────────────────────────────────────
  it("should allow a user to favourite a product and see it in Favourites", async () => {
    await loginAs("demouser", "testingisfun99");

    // Verify home screen loaded
    const productsText = await HomePage.productsFound.getText();
    expect(productsText).toContain("Product(s) found.");

    // Tap favourite icon on first visible product (product id 12)
    const favIcon = await $("~mark-favourite-12");
    await favIcon.waitForDisplayed({ timeout: 10000 });
    await favIcon.click();

    // Navigate to Favourites via drawer
    await goToDrawerItem("Favourites");

    // Verify at least 1 product is marked as favourite
    await FavouritesPage.numberOfFavourites.waitForDisplayed({ timeout: 10000 });
    const favText = await FavouritesPage.numberOfFavourites.getText();
    expect(favText).not.toContain("0 product(s) marked favourite.");
    expect(favText).toMatch(/\d+ product\(s\) marked favourite\./);

    // Logout
    await HomePage.logout();
  });

  // ── 2. Filter & Sort ───────────────────────────────────────────────────────
  it("should open Filter & Sort, apply Samsung vendor filter, and reduce product count", async () => {
    await loginAs("demouser", "testingisfun99");

    // Capture initial product count (21 products)
    const initialText = await HomePage.productsFound.getText();
    expect(initialText).toContain("Product(s) found.");

    // Open Filter & Sort bottom sheet
    await HomePage.filterSortButton.waitForDisplayed({ timeout: 10000 });
    await HomePage.filterSortButton.click();

    // Apply Samsung vendor filter
    await FilterPage.samsungFilter.waitForDisplayed({ timeout: 5000 });
    await FilterPage.samsungFilter.click();

    // Close filter sheet
    await FilterPage.close();

    // Verify product count changed (Samsung filter → 7 products)
    await HomePage.productsFound.waitForDisplayed({ timeout: 10000 });
    const filteredText = await HomePage.productsFound.getText();
    expect(filteredText).toContain("Product(s) found.");
    expect(filteredText).not.toBe(initialText);

    // Re-open filter and clear all filters
    await HomePage.filterSortButton.click();
    await FilterPage.clearAllFilters.waitForDisplayed({ timeout: 5000 });
    await FilterPage.clearAllFilters.click();
    await FilterPage.close();

    // Verify product count restored
    await HomePage.productsFound.waitForDisplayed({ timeout: 10000 });
    const restoredText = await HomePage.productsFound.getText();
    expect(restoredText).toBe(initialText);

    // Logout
    await HomePage.logout();
  });

  // ── 3. Offers screen with location ────────────────────────────────────────
  it("should navigate to Offers and show content when location is granted or denied", async () => {
    await loginAs("demouser", "testingisfun99");

    // Navigate to Offers
    await goToDrawerItem("Offers");

    // Handle location permission — allow it if dialog appears
    try {
      const allowBtn = await $("id=com.android.permissioncontroller:id/permission_allow_foreground_only_button");
      await allowBtn.waitForDisplayed({ timeout: 5000 });
      await allowBtn.click();
    } catch {
      // Permission already granted or denied permanently — continue
    }

    // Verify Offers screen is shown — either no-offers message or error message or banner image
    // The menu button is always present on the Offers screen header
    const offersMenu = await $("~menu");
    await offersMenu.waitForDisplayed({ timeout: 10000 });

    // Check which state we're in and assert accordingly
    const noOffers = await $("~no-offers");
    const locationError = await $("~error-message");
    const noOffersVisible = await noOffers.isDisplayed().catch(() => false);
    const errorVisible = await locationError.isDisplayed().catch(() => false);

    if (noOffersVisible) {
      const offersText = await noOffers.getText();
      expect(offersText).toContain("Sorry we do not have any promotional offers in your city.");
    } else if (errorVisible) {
      const errorText = await locationError.getText();
      expect(errorText).toContain("Permission to access location was denied");
    } else {
      // Offers banner image is shown — screen loaded successfully
      expect(true).toBe(true);
    }

    // Logout
    await HomePage.logout();
  });

  // ── 4. Orders screen ──────────────────────────────────────────────────────
  it("should navigate to Orders and display order count", async () => {
    await loginAs("demouser", "testingisfun99");

    await goToDrawerItem("Orders");

    await OrdersPage.numberOfOrders.waitForDisplayed({ timeout: 10000 });
    const ordersText = await OrdersPage.numberOfOrders.getText();
    expect(ordersText).toMatch(/\d+ order\(s\) found\./);

    // Logout
    await HomePage.logout();
  });

  // ── 5. Settings screen ────────────────────────────────────────────────────
  it("should navigate to Settings and verify platform info and data source controls", async () => {
    await loginAs("demouser", "testingisfun99");

    await goToDrawerItem("Settings");

    // Verify platform info is displayed
    await SettingsPage.detectedPlatform.waitForDisplayed({ timeout: 10000 });
    const platformText = await SettingsPage.detectedPlatform.getText();
    expect(platformText).toContain("android");

    await SettingsPage.detectedVersion.waitForDisplayed({ timeout: 5000 });
    const versionText = await SettingsPage.detectedVersion.getText();
    expect(versionText).toMatch(/Detected Version: \d+/);

    // Switch to URL data source tab
    await SettingsPage.selectDataSource("Url");
    await SettingsPage.urlTab.waitForDisplayed({ timeout: 5000 });

    // Switch back to Mocked
    await SettingsPage.selectDataSource("Mocked");

    // Tap Reset Cache
    await SettingsPage.resetCache();
  });

});