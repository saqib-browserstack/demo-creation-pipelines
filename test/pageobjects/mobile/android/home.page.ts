import { $, $$ } from "@wdio/globals";

class HomePage {
  // ── Header ──────────────────────────────────────────────────────────────
  get menuButton() {
    return $("~menu");
  }

  get cartButton() {
    return $("~nav-cart");
  }

  // ── Product listing ──────────────────────────────────────────────────────
  get productsFound() {
    return $("~products-found");
  }

  get filterSortButton() {
    return $("~filter-btn");
  }

  get productList() {
    return $$("~add-to-cart-12"); // base pattern; use productItems() for collection
  }

  // ── Drawer ───────────────────────────────────────────────────────────────
  get drawerUsername() {
    return $("~username"); // shows "Welcome <name>" when logged in
  }

  // ── Actions ──────────────────────────────────────────────────────────────
  async openMenu() {
    await this.menuButton.waitForDisplayed({ timeout: 10000 });
    await this.menuButton.click();
  }

  async openCart() {
    await this.cartButton.waitForDisplayed({ timeout: 10000 });
    await this.cartButton.click();
  }

  async addFirstProductToCart() {
    const addBtns = await $$('[content-desc^="add-to-cart-"]');
    await addBtns[0].waitForDisplayed({ timeout: 10000 });
    await addBtns[0].click();
  }

  async navigateToDrawerItem(itemText: "Home" | "Offers" | "Orders" | "Favourites" | "Settings") {
    await this.openMenu();
    const item = await $(`xpath=//android.widget.Button[./android.widget.TextView[@text="${itemText}"]]`);
    await item.waitForDisplayed({ timeout: 5000 });
    await item.click();
  }

  async logout() {
    await this.openMenu();
    const logoutBtn = await $("~nav-logout");
    await logoutBtn.waitForDisplayed({ timeout: 5000 });
    await logoutBtn.click();
  }
}

export default new HomePage();