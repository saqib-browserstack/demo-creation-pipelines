## Self Heal Demo

### Step 1 — Baseline (records element fingerprints on BrowserStack)
```bash
BROWSERSTACK_USERNAME="$BROWSERSTACK_USERNAME" BROWSERSTACK_ACCESS_KEY="$BROWSERSTACK_ACCESS_KEY" npm run wdio:web -- --spec test/specs/e2e-web/self-heal/selfHeal.01.baseline.e2e.ts
```

### Step 2 — Heal Run (toggle breaks #login → #signin, BrowserStack heals it)
```bash
BROWSERSTACK_USERNAME="$BROWSERSTACK_USERNAME" BROWSERSTACK_ACCESS_KEY="$BROWSERSTACK_ACCESS_KEY" npm run wdio:web -- --spec test/specs/e2e-web/self-heal/selfHeal.02.heal.e2e.ts
```

---

## AI Failure and RCA Analysis

### Run full failure-demo suite (01 passes, 02–04 fail intentionally)
```bash
BROWSERSTACK_USERNAME="$BROWSERSTACK_USERNAME" BROWSERSTACK_ACCESS_KEY="$BROWSERSTACK_ACCESS_KEY" npm run wdio:web -- --spec test/specs/e2e-web/failure-demo/
```


## Android App - E2E Test
```bash
BROWSERSTACK_USERNAME=$G2_BROWSERSTACK_USERNAME BROWSERSTACK_ACCESS_KEY=$G2_BROWSERSTACK_ACCESS_KEY npx --loglevel error wdio run config/wdio.android.conf.ts --spec test/specs/e2e-mobile/android/features.e2e.ts
```