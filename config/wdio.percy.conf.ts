/// <reference types="@wdio/globals/types" />
import { config as sharedConfig } from "./wdio.shared.conf.js";

export const config: WebdriverIO.Config = {
  ...sharedConfig,

  // Target only Percy web spec files
  specs: ["../test/specs/percy-web/**/*.ts"],

  maxInstances: 1,

  waitforTimeout: 30000,

  capabilities: [
    {
      "bstack:options": {
        browserName: "chrome",
        os: "Windows",
        osVersion: "10",
        buildName: "Percy Web — Scope-Based Snapshots",
        sessionName: "FashionStack Homepage — Scope Snapshots",
        debug: true,
        networkLogs: true,
        consoleLogs: "info",
        resolution: "1920x1080",
      } as any,
    },
  ],
};