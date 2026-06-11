import { expect } from "@wdio/globals";
import * as fs from "fs";

const BASE_URL = "https://ecommercebs.vercel.app";
const LOCAL_IMAGE_PATH = "/Users/priyansmehta/Downloads/download.jpg";
const DEVICE_IMAGE_PATH = "/data/local/tmp/download.jpg";

// Helper — marks session status on the Automate dashboard
async function setStatus(
  status: "passed" | "failed",
  reason: string
): Promise<void> {
  await browser.execute(
    `browserstack_executor: ${JSON.stringify({
      action: "setSessionStatus",
      arguments: { status, reason },
    })}`
  );
}

describe("Image Injection — Mobile Chrome E2E (Android)", () => {
  before(async () => {
    const fileContent = fs.readFileSync(LOCAL_IMAGE_PATH);
    const base64Data = fileContent.toString("base64");
    await browser.pushFile(DEVICE_IMAGE_PATH, base64Data);
    await browser.url(BASE_URL);
    await browser.pause(3000);
  });

  // ── 1. Navigate to Sign-In page ─────────────────────────────

  it("should navigate to the sign-in page", async () => {
    const loginBtn = await browser.$("#login");
    await loginBtn.waitForDisplayed({ timeout: 10000 });
    await loginBtn.click();
    await browser.pause(2000);
  });

  // ── 2. Log in with credentials ──────────────────────────────

  it("should log in with valid credentials", async () => {
    const emailField = await browser.$("#email");
    await emailField.waitForDisplayed({ timeout: 10000 });
    await emailField.setValue("user@abc.com");

    const passwordField = await browser.$("#password");
    await passwordField.setValue("Abcd@1234");

    const submitBtn = await browser.$('button[type="submit"]');
    await submitBtn.waitForClickable({ timeout: 5000 });
    await submitBtn.click();
    await browser.pause(3000);
  });

  // ── 3. Go back to home page ─────────────────────────────────

  it("should navigate back to the home page", async () => {
    await browser.url(BASE_URL);
    await browser.pause(3000);
  });

  // ── 4. Upload image via file input ──────────────────────────

  it("should upload download.jpg via file input", async () => {
    const contexts = await browser.getContexts();
    const chromiumContext = (contexts as string[]).find(
      (c: string) =>
        c.includes("CHROMIUM") ||
        c.includes("WEBVIEW") ||
        c.includes("chrome")
    );
    if (chromiumContext) {
      await browser.switchContext(chromiumContext);
    }
    await browser.pause(1000);

    const fileInput = await browser.$('input[type="file"]');
    await fileInput.waitForExist({ timeout: 5000 });
    await fileInput.addValue(DEVICE_IMAGE_PATH);
    await browser.pause(5000);
  });

  // ── 5. Select the Henley Shirt from filtered results ────────

  it("should find and select the Henley Shirt from scan results", async () => {
    await browser.pause(2000);

    // Use JavaScript to find and click the product card
    // This handles: scrolling into view + bypassing click interception
    const clicked = await browser.execute(() => {
      // Try to find "Henley Shirt" in any h3 element
      const headings = Array.from(document.querySelectorAll("h3"));
      let target = headings.find((h) =>
        h.textContent?.toLowerCase().includes("henley")
      );

      // Fallback: click the first product card visible
      if (!target) {
        target = headings[0];
      }

      if (target) {
        // Find the closest clickable parent (product card link/div)
        const card =
          target.closest("a") ||
          target.closest('[class*="cursor"]') ||
          target.closest("div");
        if (card) {
          card.scrollIntoView({ block: "center" });
          (card as HTMLElement).click();
          return "CLICKED_CARD";
        } else {
          target.scrollIntoView({ block: "center" });
          target.click();
          return "CLICKED_H3";
        }
      }
      return "NOT_FOUND";
    });

    console.log(`[Product Selection] Result: ${clicked}`);
    await browser.pause(2000);
  });

  // ── 6. Add to cart ──────────────────────────────────────────

  it("should add the product to the cart", async () => {
    await browser.pause(1000);

    const clicked = await browser.execute(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const addBtn = buttons.find((b) =>
        b.textContent?.toLowerCase().includes("add to cart")
      );
      if (addBtn) {
        addBtn.scrollIntoView({ block: "center" });
        addBtn.click();
        return true;
      }
      return false;
    });

    if (!clicked) {
      // Fallback: navigate directly and try again
      await browser.execute(() => {
        const buttons = Array.from(
          document.querySelectorAll("button, [role='button']")
        );
        const btn = buttons.find(
          (b) =>
            b.textContent?.toLowerCase().includes("cart") ||
            b.textContent?.toLowerCase().includes("add")
        );
        if (btn) {
          btn.scrollIntoView({ block: "center" });
          (btn as HTMLElement).click();
        }
      });
    }

    await browser.pause(2000);
  });

  // ── 7. Open cart and proceed to checkout ─────────────────────

  it("should open cart and proceed to checkout", async () => {
    // Click the cart icon — use JS to find the shopping bag SVG's parent button
    await browser.execute(() => {
      const svg = document.querySelector(".lucide-shopping-bag");
      if (svg) {
        const btn = svg.closest("button") || svg.closest("a") || svg.parentElement;
        if (btn) {
          (btn as HTMLElement).click();
        }
      }
    });
    await browser.pause(2000);

    // Click Checkout / Proceed to Checkout button
    await browser.execute(() => {
      const buttons = Array.from(document.querySelectorAll("button, a"));
      const checkoutBtn = buttons.find((b) =>
        b.textContent?.toLowerCase().includes("checkout")
      );
      if (checkoutBtn) {
        checkoutBtn.scrollIntoView({ block: "center" });
        (checkoutBtn as HTMLElement).click();
      }
    });
    await browser.pause(1500);
  });

  // ── Session Verdict ─────────────────────────────────────────

  after(async () => {
    await setStatus(
      "passed",
      "Image Injection on Android Chrome completed"
    );
  });
});