import { $ } from "@wdio/globals";
import AndroidBasePage from "./AndroidBasePage.js";

/**
 * Page object for the Android Products / Home listing screen.
 * Selectors confirmed from live page source exploration.
 */
class ProductsPageAndroid extends AndroidBasePage {
  /** Filter & Sort button — content-desc="filter-btn" */
  get filterSortBtn() {
    return $("~filter-btn");
  }

  /** First product card — content-desc="12" (confirmed in page source) */
  get firstProductCard() {
    return $("~12");
  }

  /**
   * Taps the "Add to cart" button for a product by its product ID.
   * @param productId - the numeric product ID string (e.g. "12")
   */
  async addToCart(productId: string): Promise<void> {
    const addBtn = await $(`~add-to-cart-${productId}`);
    await addBtn.waitForDisplayed({ timeout: 10000 });
    await addBtn.click();
  }

  /**
   * Marks a product as favourite by its product ID.
   * @param productId - the numeric product ID string (e.g. "12")
   */
  async markFavourite(productId: string): Promise<void> {
    const favBtn = await $(`~mark-favourite-${productId}`);
    await favBtn.waitForDisplayed({ timeout: 10000 });
    await favBtn.click();
  }
}

export default new ProductsPageAndroid();