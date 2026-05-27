import { $ } from "@wdio/globals";

/**
 * Filter & Sort bottom sheet — opened via the Filter & Sort button on the Home screen.
 * Locators captured from live session exploration.
 */
class FilterPage {
  // ── Vendor filter buttons ────────────────────────────────────────────────
  get appleFilter() {
    return $("~Apple");
  }

  get samsungFilter() {
    return $("~Samsung");
  }

  get googleFilter() {
    return $("~Google");
  }

  get onePlusFilter() {
    return $("~OnePlus");
  }

  // ── Sort by Price buttons ────────────────────────────────────────────────
  get highToLowSort() {
    return $("~High to Low");
  }

  get lowToHighSort() {
    return $("~Low to High");
  }

  // ── Clear button ─────────────────────────────────────────────────────────
  get clearAllFilters() {
    return $("~clear-btn");
  }

  // ── Actions ──────────────────────────────────────────────────────────────
  async filterByVendor(vendor: "Apple" | "Samsung" | "Google" | "OnePlus") {
    const btn = await $(`~${vendor}`);
    await btn.waitForDisplayed({ timeout: 5000 });
    await btn.click();
  }

  async sortByPrice(order: "High to Low" | "Low to High") {
    const btn = await $(`~${order}`);
    await btn.waitForDisplayed({ timeout: 5000 });
    await btn.click();
  }

  async clearFilters() {
    await this.clearAllFilters.waitForDisplayed({ timeout: 5000 });
    await this.clearAllFilters.click();
  }

  async close() {
    await browser.back();
  }
}

export default new FilterPage();