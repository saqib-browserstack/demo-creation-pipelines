import { $ } from "@wdio/globals";
import IOSBasePage from "./IOSBasePage.js";

/**
 * Page object for the iOS Products / Home listing screen.
 * Selectors confirmed from live iOS page source exploration.
 */
class ProductsPageIOS extends IOSBasePage {
  /** Filter & Sort button — accessibility-id="filter-btn" */
  get filterSortBtn() {
    return $("~filter-btn");
  }

  /** Products-found count label — accessibility-id="products-found" */
  get productsFoundLabel() {
    return $("~products-found");
  }

  /** First product card — accessibility-id="12" (confirmed in page source) */
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

export default new ProductsPageIOS();