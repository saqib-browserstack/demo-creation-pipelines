/// <reference types="@wdio/globals/types" />
import {config as sharedConfig} from "./wdio.shared.conf.js";

export const config: WebdriverIO.Config = {
  ...sharedConfig,
  mochaOpts: {
    ui: "bdd",
    timeout: 180000, // 3 min — AI authoring steps can take longer than default 60s
  },
  specs: ["../test/specs/e2e-mobile/android/**/*.ts"],
  services: [
    [
      "browserstack",
      {
        app: "bs://340e1932c831859e59114ac4e3e75cf686412d7a",
      },
    ],
  ],
  capabilities: [
    {
      platformName: "android",
      "bstack:options": {
        buildName: "E2E Android - Demo Hub",
        sessionName: "Android Functional Journey",
        deviceName: "Samsung Galaxy S23",
        osVersion: "13.0",
        debug: true,
        networkLogs: true,        // Captures all network traffic/HAR logs
        consoleLogs: "info",      // Captures browser console errors
        appiumVersion: "2.0.0",
      },
    },
  ],
};