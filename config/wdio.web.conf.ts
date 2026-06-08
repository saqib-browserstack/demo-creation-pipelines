/// <reference types="@wdio/globals/types" />
import {config as sharedConfig} from "./wdio.shared.conf.js";

export const config: WebdriverIO.Config = {
  ...sharedConfig,

  // Target all web e2e test files
  specs: ["../test/specs/e2e-web/**/*.ts"],

  // Keep concurrency at 1 to avoid exhausting trial/plan parallel limits
  maxInstances: 1,

  waitforTimeout: 30000,

  capabilities: [
    {
      browserName: "chrome",
      "goog:chromeOptions": {
        args: ["--window-size=1920,1080", "--start-maximized"],
      },

      "bstack:options": {
        buildName: "E2E Web - Demo Hub",
        sessionName: "Web Functional Journey",
        selfHeal: true,
        debug: true,
        networkLogs: true, // Captures all network traffic/HAR logs
        consoleLogs: "info", // Captures browser console errors
        resolution: "1920x1080",
      } as any,
    },
  ],
};
