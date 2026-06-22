import { $ } from "@wdio/globals";
import AndroidBasePage from "./AndroidBasePage.js";

/**
 * Page object for the Android Orders screen.
 * Selectors confirmed from live page source exploration.
 */
class OrdersPageAndroid extends AndroidBasePage {
  /** Number-of-orders label — content-desc="number-of-orders" */
  get numberOfOrdersLabel() {
    return $("~number-of-orders");
  }
}

export default new OrdersPageAndroid();