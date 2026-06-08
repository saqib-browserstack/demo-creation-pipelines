/// <reference types="@wdio/globals/types" />
import { config as sharedConfig } from "./wdio.shared.conf.js";

export const config: WebdriverIO.Config = {
  ...sharedConfig,
  specs: ["../test/specs/e2e-mobile/ios/failure.analysis.ios.e2e.ts"],
  capabilities: [
    {
      platformName: "ios",
      "appium:app": "bs://eb18cbee3d11e87477857b8695d195fd9ba505de",
      "appium:deviceName": "iPhone 14",
      "appium:platformVersion": "16",
      "appium:automationName": "XCUITest",
      "appium:noReset": false,
      "appium:fullReset": true,
      "appium:autoLaunch": true,
      "bstack:options": {
        projectName: "App E2E Priyansh",
        buildName: "AI Failure Analysis - iOS",
        sessionName: "iOS Failure Analysis Suite",
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