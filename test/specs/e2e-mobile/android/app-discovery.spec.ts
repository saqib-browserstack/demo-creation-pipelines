/**
 * App Discovery Spec
 * Used to explore the regression.apk UI hierarchy and confirm available buttons.
 * Run with: npx wdio run config/wdio.android.discovery.conf.ts
 *
 * Confirmed app buttons (com.example.all_in_one):
 *   id/camintent       - CAMERA INTENT
 *   id/camera1         - CAMERA1 API
 *   id/camera2         - CAMERA2 API
 *   id/cameraX         - CAMERAX API
 *   id/bio_prompt      - BIOMETRIC PROMPT
 *   id/keyparam        - BIOMETRIC PROMPT WITH KEYGEN
 *   id/FPManager       - FINGERPRINT MANAGER
 *   id/camera1Bar      - CAMERA1 BARCODE AND QR
 *   id/camera2bar      - CAMERA2 BARCODE AND QR
 *   id/zxing           - ZXING BARCODE AND QRCODE SCANNER (below fold)
 */

import { browser } from "@wdio/globals";

describe("App Discovery - UI Hierarchy", () => {
  it("should capture app launch screen and list all buttons", async () => {
    await browser.pause(4000);

    const pageSource = await browser.getPageSource();
    console.log("=== PAGE SOURCE (first 2000 chars) ===");
    console.log(pageSource.substring(0, 2000));

    const clickables = await browser.$$('//*[@clickable="true"]');
    const count = clickables.length;
    console.log(`\n=== CLICKABLE ELEMENTS: ${count} ===`);

    for (let i = 0; i < await count; i++) {
      try {
        const text = await clickables[i].getText();
        const resourceId = await clickables[i].getAttribute("resource-id");
        if (text && text.trim()) {
          console.log(`[${i}] text="${text}" | resource-id="${resourceId}"`);
        }
      } catch {
        // skip
      }
    }
  });
});