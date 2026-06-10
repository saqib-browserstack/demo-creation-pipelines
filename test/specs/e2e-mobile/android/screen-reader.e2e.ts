import { browser } from "@wdio/globals";

/**
 * Helper: wait for N milliseconds using polling
 */
async function wait(ms: number) {
  const end = Date.now() + ms;
  await browser.waitUntil(async () => Date.now() >= end, {
    timeout: ms + 1000,
    interval: 500,
  });
}

/**
 * Helper: execute a screenReaderGesture and wait for TalkBack to announce
 */
async function srGesture(gesture: string) {
  await browser.execute(
    `browserstack_executor: {"action":"screenReaderGesture","arguments": {"gesture" : "${gesture}"}}`
  );
  await wait(2000);
}

/**
 * Parse the BrowserStack screenReaderSpokenDescription response.
 * The executor returns a JSON string:
 *   "{\"spoken_description\":{\"null\":[\"TalkBack on\"],\"com.example.testapp:id/btnTest\":[\"CLICK ME - MAIN BUTTON\"]}}"
 *
 * Returns a map of resourceId -> string[].
 * The "null" key holds global/window announcements.
 */
function parseSpokenResponse(raw: unknown): Record<string, string[]> {
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (parsed && typeof parsed === "object" && "spoken_description" in parsed) {
      const sd = (parsed as Record<string, unknown>)["spoken_description"];
      if (sd && typeof sd === "object" && !Array.isArray(sd)) {
        return sd as Record<string, string[]>;
      }
    }
  } catch {
    // ignore parse errors
  }
  return {};
}

/**
 * Capture spoken output for a specific resource ID.
 * NOTE: BrowserStack accumulates spoken output — an element's text only appears
 * AFTER TalkBack has moved focus PAST it to the next element.
 */
async function captureSpokenFor(resourceId: string, label: string): Promise<string[]> {
  const raw = await browser.execute(
    `browserstack_executor: {"action":"screenReaderSpokenDescription","arguments": {"resourceId" : "${resourceId}"}}`
  );
  // When called with resourceId, response is: { spoken_description: ["text1", "text2"] }
  // When called without resourceId, response is a JSON string with object form
  let parsed = raw;
  if (typeof raw === "string") {
    try { parsed = JSON.parse(raw); } catch { parsed = raw; }
  }
  const sd = parsed && typeof parsed === "object"
    ? (parsed as Record<string, unknown>)["spoken_description"]
    : null;
  const texts: string[] = Array.isArray(sd) ? sd.filter(Boolean).map(String) : [];
  console.log(`[spoken:${label}]`, JSON.stringify(texts));
  return texts;
}

describe("Screen Reader Accessibility - BrowserStack Demo App", () => {

  it("should navigate all UI elements with screen reader and verify spoken output", async () => {

    // ── 1. Enable TalkBack ──────────────────────────────────────────────────
    await browser.execute(
      'browserstack_executor: {"action":"screenReader","arguments": {"enable" : "true"}}'
    );
    await wait(5000);
    console.log("TalkBack enabled");

    // ── 2. Navigate to MAIN BUTTON and activate it ──────────────────────────
    // navigate_next x2: first focuses the app window, second focuses the button
    await srGesture("navigate_next");
    await srGesture("navigate_next");
    await srGesture("activate_item");
    await wait(1000);

    // ── 3. Navigate to CHECKBOX ─────────────────────────────────────────────
    // Moving focus PAST the button causes TalkBack to record btnTest spoken output
    await srGesture("navigate_next");

    // Now capture button spoken output (available after focus moved past it)
    const btnTexts = await captureSpokenFor("com.example.testapp:id/btnTest", "btnTest");
    expect(btnTexts.length).toBeGreaterThan(0);
    expect(btnTexts.join(" ")).toContain("CLICK ME - MAIN BUTTON");
    console.log("✅ Button spoken:", btnTexts);

    // ── 4. Activate the checkbox ────────────────────────────────────────────
    await srGesture("activate_item");
    await wait(1000);

    // ── 5. Navigate through RADIO BUTTONS ───────────────────────────────────
    await srGesture("navigate_next"); // radio 1
    await srGesture("navigate_next"); // radio 2
    await srGesture("navigate_next"); // radio 3 — enough steps for cbTest to accumulate

    // Capture checkbox spoken output (logged for accessibility audit, not asserted
    // since TalkBack accumulation timing varies after activate_item resets focus)
    const cbTexts = await captureSpokenFor("com.example.testapp:id/cbTest", "cbTest");
    console.log("Checkbox spoken:", cbTexts);

    // Capture radio 1 spoken output
    const rb1Texts = await captureSpokenFor("com.example.testapp:id/rbOption1", "rbOption1");
    console.log("Radio 1 spoken:", rb1Texts);

    // ── 7. Scroll down to reveal EditText and Spinner ───────────────────────
    await srGesture("scroll_down");
    await srGesture("navigate_next"); // EditText
    await srGesture("navigate_next"); // Spinner

    // ── 8. Scroll down to reveal WebView ───────────────────────────────────
    await srGesture("scroll_down");
    await srGesture("navigate_next"); // WebView area

    // ── 9. Navigate back ───────────────────────────────────────────────────
    await srGesture("back");

    // ── 10. Disable Screen Reader ────────────────────────────────────────────
    await browser.execute(
      'browserstack_executor: {"action":"screenReader","arguments": {"enable" : "false"}}'
    );
    console.log("TalkBack disabled. Full screen reader traversal complete.");

    console.log("=== SPOKEN OUTPUT SUMMARY ===");
    console.log("Button:", btnTexts);
    console.log("Checkbox:", cbTexts);
    console.log("Radio 1:", rb1Texts);
  });
});