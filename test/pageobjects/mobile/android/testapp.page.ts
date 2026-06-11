/**
 * Android TestApp Page Object
 * Maps to: final_app_simple.apk / final_app_simple_changed.apk
 * Resource IDs sourced from live BrowserStack session inspection
 * Package: com.example.testapp
 */

import { $, browser, driver } from '@wdio/globals';

const PKG = 'com.example.testapp:id';

class TestAppAndroidPage {
  // ── Main Button ────────────────────────────────────────────────────────────
  get mainButton() {
    return $(`android=new UiSelector().resourceId("${PKG}/btnTest")`);
  }
  get buttonResult() {
    return $(`android=new UiSelector().resourceId("${PKG}/tvButtonResult")`);
  }

  // ── Checkbox ───────────────────────────────────────────────────────────────
  get checkbox() {
    return $(`android=new UiSelector().resourceId("${PKG}/cbTest")`);
  }
  get checkboxResult() {
    return $(`android=new UiSelector().resourceId("${PKG}/tvCheckboxResult")`);
  }

  // ── Radio Buttons ──────────────────────────────────────────────────────────
  get radioOption1() {
    return $(`android=new UiSelector().resourceId("${PKG}/rbOption1")`);
  }
  get radioOption2() {
    return $(`android=new UiSelector().resourceId("${PKG}/rbOption2")`);
  }
  get radioOption3() {
    return $(`android=new UiSelector().resourceId("${PKG}/rbOption3")`);
  }
  get radioGroup() {
    return $(`android=new UiSelector().resourceId("${PKG}/rgTest")`);
  }
  get radioResult() {
    return $(`android=new UiSelector().resourceId("${PKG}/tvRadioResult")`);
  }

  // ── Text Input ─────────────────────────────────────────────────────────────
  get textInput() {
    return $(`android=new UiSelector().resourceId("${PKG}/etTest")`);
  }
  get textInputResult() {
    return $(`android=new UiSelector().resourceId("${PKG}/tvInputResult")`);
  }

  // ── Spinner / Dropdown ─────────────────────────────────────────────────────
  get spinner() {
    return $(`android=new UiSelector().resourceId("${PKG}/spTest")`);
  }
  get spinnerResult() {
    return $(`android=new UiSelector().resourceId("${PKG}/tvSpinnerResult")`);
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  async scrollDown() {
    const size = await driver.getWindowSize();
    const startX = Math.floor(size.width / 2);
    const startY = Math.floor(size.height * 0.8);
    const endY = Math.floor(size.height * 0.2);

    await driver.performActions([
      {
        type: 'pointer',
        id: 'finger1',
        parameters: { pointerType: 'touch' },
        actions: [
          { type: 'pointerMove', duration: 0, x: startX, y: startY },
          { type: 'pointerDown', button: 0 },
          { type: 'pause', duration: 100 },
          { type: 'pointerMove', duration: 600, x: startX, y: endY },
          { type: 'pointerUp', button: 0 },
        ],
      },
    ]);
    await browser.pause(800);
  }

  async scrollToSpinner() {
    // Spinner is below the fold — scroll down 3 times to reach it
    await this.scrollDown();
    await this.scrollDown();
    await this.scrollDown();
  }
}

export default new TestAppAndroidPage();