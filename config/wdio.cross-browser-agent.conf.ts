// /// <reference types="@wdio/globals/types" />
// import { config as sharedConfig } from "./wdio.shared.conf.js";

// export const config: WebdriverIO.Config = {
//   ...sharedConfig,
//   specs: ["../test/specs/e2e-web/cross-browser-agent.test.ts"],

//   // Disable WDIO connection retries — AI agent handles its own retries internally
//   // Without this, a single AI call can take 3×30s = 90s before failing, causing Mocha timeouts
//   connectionRetryCount: 0,

//   // Chrome Desktop + Chrome Android Mobile — AI Cross-Browser Agent
//   capabilities: [
//     // Desktop — Chrome on Windows 11
//     {
//       browserName: "chrome",
//       "bstack:options": {
//         os: "Windows",
//         osVersion: "11",
//         browserVersion: "latest",
//         projectName: "Demo Creation Priyansh",
//         buildName: "E2E Web - AI Cross-Browser Agent",
//         sessionName: "AI Agent — Chrome Desktop",
//         aiAuthoring: "true",
//         debug: true,
//         networkLogs: true,
//         consoleLogs: "info",
//       } as Record<string, unknown>,
//     },
//     // Mobile — Chrome on Samsung Galaxy S23 (Android 13)
//     {
//       browserName: "chrome",
//       "bstack:options": {
//         osVersion: "13.0",
//         deviceName: "Samsung Galaxy S23",
//         realMobile: "true",
//         projectName: "Demo Creation Priyansh",
//         buildName: "E2E Web - AI Cross-Browser Agent",
//         sessionName: "AI Agent — Chrome Android",
//         aiAuthoring: "true",
//         debug: true,
//         networkLogs: true,
//         consoleLogs: "info",
//       } as Record<string, unknown>,
//     },
//   ],
// };

/// <reference types="@wdio/globals/types" />
import { config as sharedConfig } from "./wdio.shared.conf.js";

export const config: WebdriverIO.Config = {
  ...sharedConfig,
  specs: ["../test/specs/e2e-web/cross-browser-agent.test.ts"],

  // Disable WDIO connection retries — AI agent handles its own retries internally
  // Without this, a single AI call can take 3×30s = 90s before failing, causing Mocha timeouts
  connectionRetryCount: 0,

  // 5 min per test — mobile AI calls take ~20-60s each, retries can stack up.
  // browse catalogue on mobile: 2 AI calls × (1 retry × 60s) + pauses = ~150s
  mochaOpts: {
    ...(sharedConfig as any).mochaOpts,
    timeout: 300000,
  },

  // Chrome Desktop + Chrome Android Mobile — AI Cross-Browser Agent
  capabilities: [
    // Desktop — Chrome on Windows 11
    {
      browserName: "chrome",
      "bstack:options": {
        os: "Windows",
        osVersion: "11",
        browserVersion: "latest",
        projectName: "Demo Creation Priyansh",
        buildName: "E2E Web - AI Cross-Browser Agent",
        sessionName: "AI Agent — Chrome Desktop",
        aiAuthoring: "true",
        debug: true,
        networkLogs: true,
        consoleLogs: "info",
      } as Record<string, unknown>,
    },
    // Mobile — Chrome on Samsung Galaxy S23 (Android 13)
    {
      browserName: "chrome",
      "bstack:options": {
        osVersion: "13.0",
        deviceName: "Samsung Galaxy S23",
        realMobile: "true",
        projectName: "Demo Creation Priyansh",
        buildName: "E2E Web - AI Cross-Browser Agent",
        sessionName: "AI Agent — Chrome Android",
        aiAuthoring: "true",
        debug: true,
        networkLogs: true,
        consoleLogs: "info",
      } as Record<string, unknown>,
    },
  ],
};