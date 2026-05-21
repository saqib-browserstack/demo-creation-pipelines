## Self Heal

1. Normal Run
BROWSERSTACK_USERNAME="" BROWSERSTACK_ACCESS_KEY="" npm run wdio:web -- --spec test/specs/e2e-web/selfHealDemo.e2e.ts

2. Broken Locators Run
TRIGGER_HEAL="true" BROWSERSTACK_USERNAME="" BROWSERSTACK_ACCESS_KEY="" npm run wdio:web -- --spec test/specs/e2e-web/selfHealDemo.e2e.ts