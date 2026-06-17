import { $ } from "@wdio/globals";
import IOSBasePage from "./IOSBasePage.js";

/**
 * Page object for the iOS Settings screen.
 */
class SettingsPageIOS extends IOSBasePage {
  /** Mocked data source tab — accessibility-id="mocked-tab" */
  get mockedTab() {
    return $("~mocked-tab");
  }

  /** URL data source tab — accessibility-id="url-tab" */
  get urlTab() {
    return $("~url-tab");
  }

  /** Update Configuration button — accessibility-id="update-configuration-button" */
  get updateConfigBtn() {
    return $("~update-configuration-button");
  }

  /** Reload Data button — accessibility-id="reload-data-button" */
  get reloadDataBtn() {
    return $("~reload-data-button");
  }

  /** Reset Cache button — accessibility-id="reset-cache-button" */
  get resetCacheBtn() {
    return $("~reset-cache-button");
  }
}

export default new SettingsPageIOS();