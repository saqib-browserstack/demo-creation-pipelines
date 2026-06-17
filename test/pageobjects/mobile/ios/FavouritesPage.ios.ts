import { $ } from "@wdio/globals";
import IOSBasePage from "./IOSBasePage.js";

/**
 * Page object for the iOS Favourites screen.
 */
class FavouritesPageIOS extends IOSBasePage {
  /** Number-of-favourites label — accessibility-id="number-of-favourites" */
  get numberOfFavouritesLabel() {
    return $("~number-of-favourites");
  }
}

export default new FavouritesPageIOS();