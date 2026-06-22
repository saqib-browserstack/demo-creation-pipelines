import { $ } from "@wdio/globals";

/**
 * Base page object for iOS — shared selectors and navigation helpers.
 * iOS uses the same accessibility IDs as Android for this app.
 * Screen dimensions: 390×844 (iPhone 15).
 */
export default class IOSBasePage {
  /** Hamburger menu button — accessibility-id="menu", bounds: 16,35,52,70 */
  get menuBtn() {
    return $("~menu");
  }

  /** Cart icon in the top-right app bar — accessibility-id="nav-cart" */
  get navCartBtn() {
    return $("~nav-cart");
  }

  /** Sign In nav item inside the drawer (logged-out state) */
  get navSignInBtn() {
    return $("~Sign In");
  }

  /** Logout nav item inside the drawer (logged-in state) */
  get navLogoutBtn() {
    return $("~Logout");
  }

  /**
   * Opens the side navigation drawer on iOS.
   * On iOS, the drawer opens via a swipe-right gesture from the left edge.
   * Clicking ~menu does NOT open the drawer — it only toggles.
   * After swiping, drawer items move from negative x bounds to positive (visible).
   * Confirmed: swipe from (10,400) to (300,400) opens the drawer.
   */
  async openDrawer(): Promise<void> {
    // Wait for the app to be ready (menu button confirms home screen is loaded)
    await this.menuBtn.waitForExist({ timeout: 20000 });
    // Swipe right from left edge to open the drawer
    // Using W3C Actions API for touch swipe
    await browser.performActions([
      {
        type: "pointer",
        id: "finger1",
        parameters: { pointerType: "touch" },
        actions: [
          { type: "pointerMove", duration: 0, x: 10, y: 400 },
          { type: "pointerDown", button: 0 },
          { type: "pointerMove", duration: 500, x: 300, y: 400 },
          { type: "pointerUp", button: 0 },
        ],
      },
    ]);
    // Wait for drawer items to become visible after swipe
    await $("~Offers").waitForExist({ timeout: 5000 });
  }

  /**
   * Navigates to the Sign In screen via the drawer.
   * If the user is already logged in (Logout visible), logs out first.
   */
  async goToSignIn(): Promise<void> {
    await this.openDrawer();
    // Check if already logged in
    const logoutExists = await this.navLogoutBtn.isExisting().catch(() => false);
    if (logoutExists) {
      // Logout first, then re-open drawer to get Sign In
      await this.navLogoutBtn.click();
      await this.menuBtn.waitForExist({ timeout: 10000 });
      await this.openDrawer();
    }
    // iOS drawer items have negative x bounds (off-screen) — use waitForExist not waitForDisplayed
    await this.navSignInBtn.waitForExist({ timeout: 10000 });
    await this.navSignInBtn.click();
  }

  /**
   * Navigates to the Cart screen via the top-right cart icon.
   */
  async goToCart(): Promise<void> {
    await this.navCartBtn.waitForDisplayed({ timeout: 10000 });
    await this.navCartBtn.click();
  }

  /**
   * Navigates to a named section via the drawer.
   * @param section - exact label of the drawer item (e.g. "Offers", "Orders", "Favourites", "Settings")
   */
  async goToSection(section: string): Promise<void> {
    await this.openDrawer();
    const btn = await $(`~${section}`);
    // iOS drawer items have negative x bounds (off-screen) — use waitForExist not waitForDisplayed
    await btn.waitForExist({ timeout: 10000 });
    await btn.click();
  }
}