/// <reference types="@wdio/globals/types" />
import {config as sharedConfig} from "./wdio.shared.conf.js";

// Shared BrowserStack options for the unified build
const baseBstackOptions = {
  buildName: "Percy Mobile Visual - Demo App",
  appiumVersion: "2.0.0",
  debug: true,
  networkLogs: true,
  idleTimeout: 300,
};

export const config: WebdriverIO.Config = {
  ...sharedConfig,

  capabilities: [
    /* =========================================================
       ANDROID CAPABILITY
       ========================================================= */
    {
      platformName: "android",
      "appium:app": "bs-demo-android",
      //  "appium:app": "bs-demo-app-percy-changed-android",
      "appium:automationName": "UiAutomator2",
      "appium:allowInvisibleElements": true,

      specs: ["../test/specs/percy-mobile/percy-android.spec.ts"],

      "bstack:options": {
        ...baseBstackOptions,
        sessionName: "Android Percy Visual Journey",
        deviceName: "Samsung Galaxy S23",
        osVersion: "13.0",
      },
    },

    /* =========================================================
       IOS CAPABILITY
       ========================================================= */
    {
      platformName: "ios",
      "appium:app": "bs-demo-ios",
      //  "appium:app": "bs-demo-app-percy-changed-ios",
      "appium:automationName": "XCUITest",

      specs: ["../test/specs/percy-mobile/percy-ios.spec.ts"],

      "bstack:options": {
        ...baseBstackOptions,
        sessionName: "iOS Percy Visual Journey",
        deviceName: "iPhone 15",
        osVersion: "17",
      },
    },
  ] as any,
};
