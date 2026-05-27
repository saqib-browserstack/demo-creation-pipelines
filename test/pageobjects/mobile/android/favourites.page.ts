import { $, $$ } from "@wdio/globals";

class FavouritesPage {
  // ── Header ──────────────────────────────────────────────────────────────
  get menuButton() {
    return $("~menu");
  }

  get cartButton() {
    return $("~nav-cart");
  }

  // ── Content ──────────────────────────────────────────────────────────────
  /** e.g. "0 product(s) marked favourite." */
  get numberOfFavourites() {
    return $("~number-of-favourites");
  }

  /** Collection of all favourite product items */
  get favouriteItems() {
    return $$('[content-desc^="mark-favourite-"]');
  }
}

export default new FavouritesPage();