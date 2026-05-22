/// <reference types="@wdio/globals/types" />
import {config as sharedConfig} from "./wdio.shared.conf.js";

export const config: WebdriverIO.Config = {
  ...sharedConfig,

  // Target the specific web test files we just moved
  specs: ["../test/specs/e2e-web/**/*.ts"],

  // Define the browser capabilities for the demo
  capabilities: [
    {
      browserName: "chrome",
      "bstack:options": {
        buildName: "E2E Web - Demo Hub",
        sessionName: "Web Functional Journey",
        // These AI features look great on a demo dashboard
        debug: true,
        networkLogs: true,
        consoleLogs: "info",
      },
    },
  ],
};