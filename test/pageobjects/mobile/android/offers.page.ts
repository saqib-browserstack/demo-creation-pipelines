import { $ } from "@wdio/globals";

class OffersPage {
  // ── Header ──────────────────────────────────────────────────────────────
  get menuButton() {
    return $("~menu");
  }

  get cartButton() {
    return $("~nav-cart");
  }

  // ── Content ──────────────────────────────────────────────────────────────
  /** Shown when location permission is denied: "Permission to access location was denied" */
  get locationDeniedError() {
    return $("~error-message");
  }

  /** Shown when location is granted but no offers in city: "Sorry we do not have any promotional offers in your city." */
  get noOffersMessage() {
    return $("~no-offers");
  }
}

export default new OffersPage();