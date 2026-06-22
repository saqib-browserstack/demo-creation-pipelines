import { $ } from "@wdio/globals";
import AndroidBasePage from "./AndroidBasePage.js";

/**
 * Page object for the Android Offers screen.
 * Selectors confirmed from live page source exploration.
 */
class OffersPageAndroid extends AndroidBasePage {
  /** "No offers" message — content-desc="no-offers" */
  get noOffersMessage() {
    return $("~no-offers");
  }
}

export default new OffersPageAndroid();