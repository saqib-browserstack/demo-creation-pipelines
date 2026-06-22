import { browser, $, expect } from "@wdio/globals";
import * as https from "node:https";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BROWSERSTACK_USERNAME = process.env.BROWSERSTACK_USERNAME!;
const BROWSERSTACK_ACCESS_KEY = process.env.BROWSERSTACK_ACCESS_KEY!;

// Use download.png as the injection image
const INJECTION_IMAGE_PATH = path.resolve(
  __dirname,
  "../../../../assets/download.png"
);

/**
 * Upload an image to BrowserStack media API.
 * Returns the media:// URL to use in cameraImageInjection executor.
 */
async function uploadImageToBrowserStack(imagePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const boundary = `BrowserStackBoundary${Date.now()}`;
    const fileBuffer = fs.readFileSync(imagePath);
    const fileName = path.basename(imagePath);

    const bodyParts: Buffer[] = [
      Buffer.from(
        `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${fileName}"\r\nContent-Type: image/png\r\n\r\n`
      ),
      fileBuffer,
      Buffer.from(
        `\r\n--${boundary}\r\nContent-Disposition: form-data; name="custom_id"\r\n\r\nDownloadInjectionImage\r\n--${boundary}--\r\n`
      ),
    ];
    const body = Buffer.concat(bodyParts);

    const auth = Buffer.from(
      `${BROWSERSTACK_USERNAME}:${BROWSERSTACK_ACCESS_KEY}`
    ).toString("base64");

    const options: https.RequestOptions = {
      hostname: "api-cloud.browserstack.com",
      path: "/app-automate/upload-media",
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": `multipart/form-data; boundary=${boundary}`,
        "Content-Length": body.length,
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk: Buffer) => (data += chunk.toString()));
      res.on("end", () => {
        try {
          const parsed = JSON.parse(data) as {
            media_url?: string;
            error?: string;
          };
          if (parsed.media_url) {
            resolve(parsed.media_url);
          } else {
            reject(new Error(`Media upload failed: ${data}`));
          }
        } catch {
          reject(new Error(`Failed to parse upload response: ${data}`));
        }
      });
    });

    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

/**
 * Helper: inject image, click a button, wait, screenshot, go back.
 * Encapsulates the full inject-click-verify-back flow for each camera button.
 */
async function injectAndTrigger(
  mediaUrl: string,
  resourceId: string,
  label: string,
  waitMs = 4000
): Promise<void> {
  await browser.execute(
    `browserstack_executor: {"action":"annotate","arguments":{"data":"Injecting image for ${label}","level":"info"}}`
  );

  // Inject BEFORE clicking (BrowserStack requirement: camera captures last injected image)
  await browser.execute(
    `browserstack_executor: {"action":"cameraImageInjection","arguments":{"imageUrl":"${mediaUrl}"}}`
  );

  await browser.pause(1000);

  // Find and click the button using its resource-id
  const btn = await $(`id=${resourceId}`);
  await btn.waitForExist({ timeout: 15000 });
  // Scroll element into view in case it's partially off-screen (best-effort)
  try {
    await btn.scrollIntoView();
  } catch {
    // scrollIntoView not supported on all Appium versions — continue
  }
  await browser.pause(500);
  await btn.click();

  await browser.execute(
    `browserstack_executor: {"action":"annotate","arguments":{"data":"${label} button clicked - camera open with injected image","level":"info"}}`
  );

  // Wait for camera screen to load
  await browser.pause(waitMs);

  // Capture screenshot to record the camera screen state
  const screenshot = await browser.takeScreenshot();
  expect(screenshot).toBeTruthy();

  // Navigate back to main screen
  await browser.back();
  await browser.pause(2000);

  // Ensure main screen is back (scroll to top if needed)
  try {
    const mainBtn = await $('id=com.example.all_in_one:id/camintent');
    const visible = await mainBtn.isDisplayed();
    if (!visible) {
      await browser.execute("mobile: scroll", { direction: "up" });
      await browser.pause(1000);
    }
  } catch {
    // Main screen already visible
  }

  await browser.execute(
    `browserstack_executor: {"action":"annotate","arguments":{"data":"${label} complete","level":"info"}}`
  );
}

describe("Image Injection - Camera Feed Mock (com.example.all_in_one)", () => {
  let mediaUrl: string;

  before(async () => {
    if (!fs.existsSync(INJECTION_IMAGE_PATH)) {
      throw new Error(`Injection image not found at: ${INJECTION_IMAGE_PATH}`);
    }

    console.log(`Uploading injection image: ${path.basename(INJECTION_IMAGE_PATH)}`);
    mediaUrl = await uploadImageToBrowserStack(INJECTION_IMAGE_PATH);
    console.log(`Media upload complete. URL: ${mediaUrl}`);

    await browser.execute(
      `browserstack_executor: {"action":"annotate","arguments":{"data":"Injection image (download.png) uploaded: ${mediaUrl}","level":"info"}}`
    );

    // Wait for app to fully load
    await browser.pause(3000);
  });

  it("should inject image and trigger CAMERA INTENT", async () => {
    await injectAndTrigger(
      mediaUrl,
      "com.example.all_in_one:id/camintent",
      "CAMERA INTENT"
    );
  });

  it("should inject image and trigger CAMERA1 API", async () => {
    await injectAndTrigger(
      mediaUrl,
      "com.example.all_in_one:id/camera1",
      "CAMERA1 API"
    );
  });

  it("should inject image and trigger CAMERA2 API", async () => {
    await injectAndTrigger(
      mediaUrl,
      "com.example.all_in_one:id/camera2",
      "CAMERA2 API"
    );
  });

  it("should inject image and trigger CAMERAX API", async () => {
    await injectAndTrigger(
      mediaUrl,
      "com.example.all_in_one:id/cameraX",
      "CAMERAX API"
    );
  });

  it("should inject image and trigger CAMERA1 BARCODE AND QR scanner", async () => {
    await injectAndTrigger(
      mediaUrl,
      "com.example.all_in_one:id/camera1Bar",
      "CAMERA1 BARCODE AND QR"
    );
  });

  it("should inject image and trigger CAMERA2 BARCODE AND QR scanner", async () => {
    await injectAndTrigger(
      mediaUrl,
      "com.example.all_in_one:id/camera2bar",
      "CAMERA2 BARCODE AND QR"
    );
  });

});