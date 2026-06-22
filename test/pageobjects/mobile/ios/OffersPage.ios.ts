import { $ } from "@wdio/globals";
import IOSBasePage from "./IOSBasePage.js";

/**
 * Page object for the iOS Offers screen.
 */
class OffersPageIOS extends IOSBasePage {
  /** "No offers" message — accessibility-id="no-offers" */
  get noOffersMessage() {
    return $("~no-offers");
  }
}

export default new OffersPageIOS();