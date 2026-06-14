/// <reference types="@wdio/globals/types" />
import {config as sharedConfig} from "./wdio.shared.conf.ts";

// Shared BrowserStack options for BOTH platforms
const baseBstackOptions = {
  buildName: "E2E Mobile Suite",
  debug: true,
  networkLogs: true,
  deviceLogs: true,
  appiumLogs: true,
  video: true,
  interactiveDebugging: true,
  selfHeal: true,
};

// Base device settings for Android
const baseAndroidCaps = {
  platformName: "android",
  "appium:deviceName": "Samsung Galaxy S23",
  "appium:platformVersion": "13.0",
  "appium:automationName": "UiAutomator2",
};

// Base device settings for iOS
const baseIosCaps = {
  platformName: "ios",
  "appium:deviceName": "iPhone 15",
  "appium:platformVersion": "17.0",
  "appium:automationName": "XCUITest",
};

export const config: WebdriverIO.Config = {
  ...sharedConfig,

  capabilities: [
    // Android: App Discovery, Checkout, Features and Failure Analysis
    {
      ...baseAndroidCaps,
      specs: [
        "../test/specs/e2e-mobile/android/app-discovery.spec.ts",
        "../test/specs/e2e-mobile/android/checkout.e2e.ts",
        "../test/specs/e2e-mobile/android/features.e2e.ts",
        "../test/specs/e2e-mobile/android/failure-analysis.e2e.ts",
      ],
      "appium:app": "bs-demo-android",
      "bstack:options": {
        ...baseBstackOptions,
        sessionName: "Checkout & Discovery (Android)",
      },
    },

    // Android: Biometrics & Image Injection
    {
      ...baseAndroidCaps,
      specs: [
        "../test/specs/e2e-mobile/android/biometrics.spec.ts",
        "../test/specs/e2e-mobile/android/image-injection.spec.ts",
      ],
      "appium:app": "bs-demo-biometrics-and-camera",
      "bstack:options": {
        ...baseBstackOptions,
        sessionName: "Biometrics & Image Injection (Android)",
        enableCameraImageInjection: true,
        enableBiometric: true,
      },
    },

    // Android: Self Heal Original
    {
      ...baseAndroidCaps,
      specs: ["../test/specs/e2e-mobile/android/selfheal.e2e.ts"],
      "appium:app": "bs-demo-self-heal-original-android",
      "bstack:options": {
        ...baseBstackOptions,
        sessionName: "Self Heal Original (Android)",
      },
    },

    // Android: Self Heal Changed
    {
      ...baseAndroidCaps,
      specs: ["../test/specs/e2e-mobile/android/selfheal.e2e.ts"],
      "appium:app": "bs-demo-self-heal-changed-android",
      "bstack:options": {
        ...baseBstackOptions,
        sessionName: "Self Heal Changed (Android)",
      },
    },

    // iOS: Self Heal Original
    {
      ...baseIosCaps,
      specs: ["../test/specs/e2e-mobile/ios/failure-analysis.e2e.ts"],
      "appium:app": "bs-demo-ios",
      "bstack:options": {
        ...baseBstackOptions,
        sessionName: "Failure Analysis (iOS)",
      },
    },

    // iOS: Self Heal Original
    {
      ...baseIosCaps,
      specs: ["../test/specs/e2e-mobile/ios/selfheal.e2e.ts"],
      "appium:app": "bs-demo-self-heal-original-ios",
      "bstack:options": {
        ...baseBstackOptions,
        sessionName: "Self Heal Original (iOS)",
      },
    },

    // iOS: Self Heal Changed
    {
      ...baseIosCaps,
      specs: ["../test/specs/e2e-mobile/ios/selfheal.e2e.ts"],
      "appium:app": "bs-demo-self-heal-changed-ios",
      "bstack:options": {
        ...baseBstackOptions,
        sessionName: "Self Heal Changed (iOS)",
      },
    },
  ] as any,
};
