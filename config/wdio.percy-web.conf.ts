/// <reference types="@wdio/globals/types" />
import {config as sharedConfig} from "./wdio.shared.conf.js";

export const config: WebdriverIO.Config = {
  ...sharedConfig,

  specs: ["../test/specs/percy-web/**/*.ts"],

  capabilities: [
    {
      "bstack:options": {
        browserName: "chrome",
        os: "Windows",
        osVersion: "10",
        buildName: "Percy Web - Demo Hub",
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
  ],

  mochaOpts: {
    ui: "bdd",
    timeout: 180000,
  },
};
