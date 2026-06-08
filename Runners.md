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
