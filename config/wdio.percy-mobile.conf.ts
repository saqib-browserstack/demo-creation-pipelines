/// <reference types="@wdio/globals/types" />
import { config as sharedConfig } from "./wdio.shared.conf.js";

export const config: WebdriverIO.Config = {
  ...sharedConfig,
  user: process.env.G2_BROWSERSTACK_USERNAME,
  key: process.env.G2_BROWSERSTACK_ACCESS_KEY,
  specs: ["../test/specs/percy-mobile/**/*.ts"],
  mochaOpts: {
    ui: "bdd",
    timeout: 180000,
  },
  services: [
    [
      "browserstack",
      {
        app: "bs://c94d623e9070441fff20d8fa05663f0cc9987ff9",
        percy: true,
        percyCaptureMode: "manual",
      },
    ],
  ],
  capabilities: [
    {
      platformName: "android",
      "bstack:options": {
        deviceName: "Samsung Galaxy S23",
        osVersion: "13.0",
        buildName: "Percy Figma Comparison - Android",
        sessionName: "Percy Figma Snapshot Run",
        projectName: "BrowserStack Demo App",
        debug: true,
        networkLogs: true,
        appiumVersion: "2.0.0",
      },
    },
    {
      platformName: "android",
      "bstack:options": {
        deviceName: "Google Pixel 7",
        osVersion: "13.0",
        buildName: "Percy Figma Comparison - Android",
        sessionName: "Percy Figma Snapshot Run",
        projectName: "BrowserStack Demo App",
        debug: true,
        networkLogs: true,
        appiumVersion: "2.0.0",
      },
    },
    {
      platformName: "android",
      "bstack:options": {
        deviceName: "OnePlus 11R",
        osVersion: "13.0",
        buildName: "Percy Figma Comparison - Android",
        sessionName: "Percy Figma Snapshot Run",
        projectName: "BrowserStack Demo App",
        debug: true,
        networkLogs: true,
        appiumVersion: "2.0.0",
      },
    },
  ],
};