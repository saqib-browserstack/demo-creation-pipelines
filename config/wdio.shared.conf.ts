export const config: WebdriverIO.Config = {
  user: process.env.BROWSERSTACK_USERNAME!,
  key: process.env.BROWSERSTACK_ACCESS_KEY!,

  capabilities: [],

  services: ["browserstack"],

  maxInstances: 10,
  logLevel: "info",
  bail: 0,
  waitforTimeout: 30000,
  connectionRetryTimeout: 180000,
  connectionRetryCount: 3,

  framework: "mocha",
  reporters: ["spec"],

  mochaOpts: {
    ui: "bdd",
    timeout: 300000,
  },
};
