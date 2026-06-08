/// <reference types="@wdio/globals/types" />
import {config as sharedConfig} from "./wdio.shared.conf.js";

export const config: WebdriverIO.Config = {
  ...sharedConfig,

  // Target all web e2e test files
  specs: ["../test/specs/e2e-web/**/*.ts"],

  maxInstances: 10,

  waitforTimeout: 30000,

  capabilities: [
    {
      "bstack:options": {
        browserName: "chrome",
        os: "Windows",
        osVersion: "10",
        buildName: "E2E Web - Demo Hub",
        sessionName: "Web Functional Journey",
        aiAuthoring: "true",
        selfHeal: true,
        debug: true,
        performance: "report",
        networkLogs: true,
        consoleLogs: "info",
        resolution: "1920x1080",
      } as any,
    },
    {
      "bstack:options": {
        browserName: "safari",
        os: "OS X",
        osVersion: "Sequoia",
        buildName: "E2E Web - Demo Hub",
        sessionName: "Web Functional Journey - Mac",
        aiAuthoring: "true",
        selfHeal: true,
        debug: true,
        performance: "report",
        networkLogs: true,
        consoleLogs: "info",
        resolution: "1920x1080",
      } as any,
    },
  ],
};
