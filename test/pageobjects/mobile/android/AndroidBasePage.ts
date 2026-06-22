import { $ } from "@wdio/globals";

/**
 * Base page object for Android — shared selectors and navigation helpers
 * used across all Android screen page objects.
 */
export default class AndroidBasePage {
  /**
   * Hamburger menu button.
   * Tries content-desc="menu" first (original app), then falls back to
   * XPath position (top-left button in the app bar) for changed app versions.
   */
  get menuBtn() {
    return $("~menu");
  }

  /** Fallback menu button selector using XPath for changed app versions */
  get menuBtnFallback() {
    return $('//android.view.ViewGroup[@content-desc="menu"] | //android.view.ViewGroup[contains(@bounds,"[45,") and contains(@bounds,",198]") and @clickable="true"]');
  }

  /** Cart icon in the top-right app bar — content-desc="nav-cart" */
  get navCartBtn() {
    return $("~nav-cart");
  }

  /** Sign In nav item inside the drawer (logged-out state) */
  get navSignInBtn() {
    return $("~nav-signin");
  }

  /** Logout nav item inside the drawer (logged-in state) */
  get navLogoutBtn() {
    return $("~nav-logout");
  }

  /**
   * Opens the side navigation drawer.
   * Tries content-desc="menu" first; if not found, falls back to
   * finding the first clickable button in the top-left of the app bar.
   */
  async openDrawer(): Promise<void> {
    const menuExists = await this.menuBtn.isExisting().catch(() => false);
    if (menuExists) {
      await this.menuBtn.click();
    } else {
      // Fallback: first clickable ViewGroup in the top app bar area
      const fallback = await $('//android.view.ViewGroup[@clickable="true"][1]');
      await fallback.waitForExist({ timeout: 20000 });
      await fallback.click();
    }
  }

  /**
   * Navigates to the Sign In screen via the drawer (logged-out state).
   */
  async goToSignIn(): Promise<void> {
    await this.openDrawer();
    await this.navSignInBtn.waitForDisplayed({ timeout: 10000 });
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
   * @param section - exact text of the drawer item (e.g. "Home", "Offers", "Orders", "Favourites", "Settings")
   */
  async goToSection(section: string): Promise<void> {
    await this.openDrawer();
    const btn = await $(`android=new UiSelector().text("${section}")`);
    await btn.waitForDisplayed({ timeout: 10000 });
    await btn.click();
  }
}