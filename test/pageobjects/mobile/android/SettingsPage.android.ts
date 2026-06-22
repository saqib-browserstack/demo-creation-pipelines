import { $ } from "@wdio/globals";
import AndroidBasePage from "./AndroidBasePage.js";

/**
 * Page object for the Android Settings screen.
 * Selectors confirmed from live page source exploration.
 */
class SettingsPageAndroid extends AndroidBasePage {
  /** Mocked data source tab — content-desc="mocked-tab" */
  get mockedTab() {
    return $("~mocked-tab");
  }

  /** URL data source tab — content-desc="url-tab" */
  get urlTab() {
    return $("~url-tab");
  }

  /** Update Configuration button — content-desc="update-configuration-button" */
  get updateConfigBtn() {
    return $("~update-configuration-button");
  }

  /** Reload Data button — content-desc="reload-data-button" */
  get reloadDataBtn() {
    return $("~reload-data-button");
  }

  /** Reset Cache button — content-desc="reset-cache-button" */
  get resetCacheBtn() {
    return $("~reset-cache-button");
  }
}

export default new SettingsPageAndroid();