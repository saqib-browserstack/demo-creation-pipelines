/// <reference types="@wdio/globals/types" />
import {config as sharedConfig} from "./wdio.shared.conf.js";

export const config: WebdriverIO.Config = {
  ...sharedConfig,
  mochaOpts: {
    ui: "bdd",
    timeout: 180000, // 3 min — AI authoring steps can take longer than default 60s
  },
  specs: ["../test/specs/e2e-mobile/ios/**/*.ts"],
  services: [
    [
      "browserstack",
      {
        app: "bs://1f9f6120bb54c422391e84121dcc6b25edf9bff9",
      },
    ],
  ],
  capabilities: [
    {
      platformName: "ios",
      "bstack:options": {
        buildName: "E2E iOS - Demo Hub",
        sessionName: "iOS AI Cross-Device Agent",
        deviceName: "iPhone 15",
        osVersion: "17",
        debug: true,
        networkLogs: true,
        // @ts-ignore — aiAuthoring is a valid BrowserStack capability not yet in type definitions
        aiAuthoring: true,
      },
    },
  ],
};