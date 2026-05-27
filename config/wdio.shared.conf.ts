export const config: WebdriverIO.Config = {
  // These will be securely injected by GitHub Actions later!
  user: process.env.BROWSERSTACK_USERNAME,
  key: process.env.BROWSERSTACK_ACCESS_KEY,

  // Add this empty array to satisfy TypeScript's strict requirements
  capabilities: [],

  services: [
    [
      "browserstack",
      {},
    ],
  ],

  maxInstances: 10,
  logLevel: "info",
  bail: 0,
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,

  framework: "mocha",
  reporters: ["spec"],

  mochaOpts: {
    ui: "bdd",
    timeout: 60000,
  },
};