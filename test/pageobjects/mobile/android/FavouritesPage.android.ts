import { $ } from "@wdio/globals";
import AndroidBasePage from "./AndroidBasePage.js";

/**
 * Page object for the Android Favourites screen.
 * Selectors confirmed from live page source exploration.
 */
class FavouritesPageAndroid extends AndroidBasePage {
  /** Number-of-favourites label — content-desc="number-of-favourites" */
  get numberOfFavouritesLabel() {
    return $("~number-of-favourites");
  }
}

export default new FavouritesPageAndroid();