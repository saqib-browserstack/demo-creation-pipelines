/// <reference types="@wdio/globals/types" />

/**
 * Percy Web — Scope-Based Snapshots (Local Chrome)
 * Runs tests locally without BrowserStack Automate.
 * Requires: PERCY_TOKEN env var
 */
export const config: WebdriverIO.Config = {
  specs: ["../test/specs/percy-web/**/*.ts"],

  maxInstances: 1,

  capabilities: [
    {
      browserName: "chrome",
      "goog:chromeOptions": {
        args: ["--headless", "--no-sandbox", "--disable-dev-shm-usage"],
      },
    },
  ],

  services: [],

  framework: "mocha",
  reporters: ["spec"],

  waitforTimeout: 30000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,

  mochaOpts: {
    ui: "bdd",
    timeout: 60000,
  },
};