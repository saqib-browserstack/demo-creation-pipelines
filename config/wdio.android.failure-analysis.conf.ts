/// <reference types="@wdio/globals/types" />
import { config as sharedConfig } from "./wdio.shared.conf.js";

export const config: WebdriverIO.Config = {
  ...sharedConfig,
  specs: ["../test/specs/e2e-mobile/android/failure.analysis.android.e2e.ts"],
  capabilities: [
    {
      platformName: "android",
      "appium:app": "bs://f75ee83ff531fd51e27e8da55d9a60eaf5330e09",
      "appium:deviceName": "Samsung Galaxy S23",
      "appium:platformVersion": "13.0",
      "appium:automationName": "UiAutomator2",
      "bstack:options": {
        projectName: "App E2E Priyansh",
        buildName: "AI Failure Analysis - Android",
        sessionName: "Android Failure Analysis Suite",
        debug: true,
        networkLogs: true,
        deviceLogs: true,
        appiumLogs: true,
        video: true,
      } as WebdriverIO.Capabilities["bstack:options"] & Record<string, unknown>,
      "bstack:testObservability": true,
    } as WebdriverIO.Capabilities,
  ],
  mochaOpts: { ui: "bdd", timeout: 120000 },
};