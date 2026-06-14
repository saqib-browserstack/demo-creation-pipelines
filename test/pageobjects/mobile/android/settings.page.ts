import { $ } from "@wdio/globals";

class SettingsPage {
  // ── Header ──────────────────────────────────────────────────────────────
  get menuButton() {
    return $("~menu");
  }

  get cartButton() {
    return $("~nav-cart");
  }

  // ── Platform info ────────────────────────────────────────────────────────
  /** e.g. "Detected Platform: android" */
  get detectedPlatform() {
    return $('android=new UiSelector().textContains("Detected Platform")');
  }

  /** e.g. "Detected Version: 33" */
  get detectedVersion() {
    return $('android=new UiSelector().textContains("Detected Version")');
  }

  // ── Data source tabs ─────────────────────────────────────────────────────
  get mockedTab() {
    return $("~mocked-tab");
  }

  get urlTab() {
    return $("~url-tab");
  }

  // ── Action buttons ───────────────────────────────────────────────────────
  get updateConfigurationButton() {
    return $("~update-configuration-button");
  }

  get reloadDataButton() {
    return $("~reload-data-button");
  }

  get resetCacheButton() {
    return $("~reset-cache-button");
  }

  // ── Actions ──────────────────────────────────────────────────────────────
  async selectDataSource(source: "Mocked" | "Url") {
    const tab = source === "Mocked" ? this.mockedTab : this.urlTab;
    await tab.waitForDisplayed({ timeout: 5000 });
    await tab.click();
  }

  async updateConfiguration() {
    await this.updateConfigurationButton.waitForDisplayed({ timeout: 5000 });
    await this.updateConfigurationButton.click();
  }

  async reloadData() {
    await this.reloadDataButton.waitForDisplayed({ timeout: 5000 });
    await this.reloadDataButton.click();
  }

  async resetCache() {
    await this.resetCacheButton.waitForDisplayed({ timeout: 5000 });
    await this.resetCacheButton.click();
  }
}

export default new SettingsPage();