import { $ } from "@wdio/globals";
import IOSBasePage from "./IOSBasePage.js";

/**
 * Page object for the iOS Orders screen.
 */
class OrdersPageIOS extends IOSBasePage {
  /** Number-of-orders label — accessibility-id="number-of-orders" */
  get numberOfOrdersLabel() {
    return $("~number-of-orders");
  }
}

export default new OrdersPageIOS();