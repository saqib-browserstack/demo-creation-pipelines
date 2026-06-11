import { $, $$ } from "@wdio/globals";

class OrdersPage {
  // ── Header ──────────────────────────────────────────────────────────────
  get menuButton() {
    return $("~menu");
  }

  get cartButton() {
    return $("~nav-cart");
  }

  // ── Content ──────────────────────────────────────────────────────────────
  /** e.g. "0 order(s) found." or "3 order(s) found." */
  get numberOfOrders() {
    return $("~number-of-orders");
  }

  /** Collection of all order items in the list */
  get orderItems() {
    return $$("~order-item");
  }
}

export default new OrdersPage();