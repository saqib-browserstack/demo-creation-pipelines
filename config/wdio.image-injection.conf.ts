/// <reference types="@wdio/globals/types" />
import { config as sharedConfig } from "./wdio.shared.conf.js";

export const config: WebdriverIO.Config = {
  ...sharedConfig,

  specs: ["../test/specs/e2e-web/image-injection.test.ts"],

  connectionRetryCount: 0,

  mochaOpts: {
    ...(sharedConfig as any).mochaOpts,
    timeout: 120000,
  },

  capabilities: [
    {
      browserName: "chrome",
      "bstack:options": {
        osVersion: "13.0",
        deviceName: "Samsung Galaxy S23",
        realMobile: "true",
        projectName: "Demo Creation Priyansh",
        buildName: "E2E Web - Image Injection Mobile",
        sessionName: "Image Upload — Chrome Android",
        debug: true,
        networkLogs: true,
        consoleLogs: "info",
      } as Record<string, unknown>,
    },
  ],
};