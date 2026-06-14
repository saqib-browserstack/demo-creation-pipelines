import { browser } from "@wdio/globals";

/**
 * Failure Analysis — iOS
 *
 * Intentionally demonstrates different failure categories for
 * BrowserStack's AI Failure Analysis (Test Observability).
 *
 * Categories: no_defect, automation_bug, product_bug,
 *             environment_issue, to_be_investigated
 */

/* ── helpers ── */

function bsExec(action: string, args: Record<string, string>): string {
  const payload = { action, arguments: args };
  return `browserstack_executor: ${JSON.stringify(payload)}`;
}

async function setStatus(status: "passed" | "failed", reason: string): Promise<void> {
  await browser.execute(bsExec("setSessionStatus", { status, reason }));
}

async function annotate(data: string, level = "info"): Promise<void> {
  await browser.execute(bsExec("annotate", { data, level }));
}

/* ── suite ── */

describe("Failure Analysis — iOS", () => {

  it("App launches and home screen is displayed", async () => {
    try {
      await browser.execute("mobile: activateApp", { bundleId: "com.browserstack.demo-app" });
    } catch {
      /* already active */
    }

    let launched = false;
    try {
      await browser.waitUntil(
        async () => {
          try {
            const s = await browser.getPageSource();
            return s != null && s.length > 100;
          } catch {
            return false;
          }
        },
        { timeout: 40000, interval: 2000, timeoutMsg: "App did not load within 40 s" }
      );
      launched = true;
    } catch {
      launched = false;
    }

    await browser.takeScreenshot();
    await annotate("no_defect");
    await setStatus("passed", launched ? "App launched successfully" : "App session established");
  });

  it("Login button is present and tappable", async () => {
    await annotate("automation_bug");
    await setStatus("failed", "Accessibility ID 'loginButton_v2' not found — locator needs updating");
    throw new Error("Element not found: accessibility ID is outdated and needs to be updated in the test script");
  });

  it("Product listing displays correct item count", async () => {
    let src = "";
    try {
      src = await browser.getPageSource();
    } catch {
      /* app may not be in foreground */
    }

    const expected = "EXPECTED_ITEM_COUNT_MISSING";
    if (!src.includes(expected)) {
      await annotate("product_bug");
      await setStatus("failed", `Expected content '${expected}' not found — possible build issue or missing data`);
      throw new Error(`Product bug: '${expected}' not present in app`);
    }
    await annotate("no_defect");
    await setStatus("passed", "Item count verified");
  });

  it("Network connectivity check passes on device", async () => {
    await annotate("environment_issue");
    await setStatus("failed", "Network status element unreachable — possible device or infrastructure issue");
    throw new Error("Network status element not found — infrastructure issue suspected");
  });

  it("App state is stable after navigation", async () => {
    try {
      await browser.execute("mobile: pressButton", { name: "home" });
    } catch {
      /* ignore */
    }
    await annotate("to_be_investigated");
    await setStatus("failed", "Unexpected app state after navigation — requires root cause analysis");
    throw new Error("Unexpected app state after navigation — needs investigation");
  });
});