/// <reference types="@wdio/globals/types" />
import {config as sharedConfig} from "./wdio.shared.conf.ts";

export const config: WebdriverIO.Config = {
  ...sharedConfig,

  specs: ["../test/specs/percy-web/**/*.ts"],

  capabilities: [
    {
      "bstack:options": {
        browserName: "chrome",
        os: "Windows",
        osVersion: "10",
        buildName: "E2E Web - Demo Hub",
        sessionName: "Web Functional Journey",
        debug: true,
        networkLogs: false,
        consoleLogs: "info",
      } as any,
    },
    {
      "bstack:options": {
        browserName: "safari",
        os: "OS X",
        osVersion: "Sequoia",
        buildName: "E2E Web - Demo Hub",
        sessionName: "Web Functional Journey - Mac",
        debug: true,
        networkLogs: false,
        consoleLogs: "info",
      } as any,
    },
  ],
};
