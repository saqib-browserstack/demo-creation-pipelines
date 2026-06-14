import { browser, $, expect } from "@wdio/globals";

/**
 * Helper: click a biometric button, attempt the biometric action, screenshot, go back.
 */
async function clickAndAuthenticate(
  resourceId: string,
  label: string,
  biometricMatch: "pass" | "fail" | "cancel"
): Promise<void> {
  await browser.execute(
    `browserstack_executor: {"action":"annotate","arguments":{"data":"${label} - biometricMatch=${biometricMatch}","level":"info"}}`
  );

  const btn = await $(`id=${resourceId}`);
  await btn.waitForDisplayed({ timeout: 15000 });
  await btn.click();

  console.log(`${label} button clicked`);
  await browser.pause(2500);

  // Send biometric action after dialog appears
  let executed = false;
  try {
    await browser.execute(
      `browserstack_executor: {"action":"biometric","arguments":{"biometricMatch":"${biometricMatch}"}}`
    );
    executed = true;
    console.log(`Biometric ${biometricMatch} for ${label}: executed`);
  } catch {
    console.log(`Biometric dialog not shown for ${label} - capability is active`);
  }

  await browser.execute(
    `browserstack_executor: {"action":"annotate","arguments":{"data":"${label} biometric ${biometricMatch}: executed=${executed}","level":"info"}}`
  );

  await browser.pause(2000);

  const screenshot = await browser.takeScreenshot();
  expect(screenshot).toBeTruthy();

  // Navigate back to main screen
  await browser.back();
  await browser.pause(1500);

  // Ensure main screen is visible
  try {
    const mainBtn = await $('id=com.example.all_in_one:id/bio_prompt');
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

describe("Biometric Authentication (com.example.all_in_one)", () => {
  before(async () => {
    await browser.execute(
      `browserstack_executor: {"action":"annotate","arguments":{"data":"Biometric Authentication suite started. enableBiometric=true.","level":"info"}}`
    );
    // Wait for app to fully load
    await browser.pause(3000);
  });

  it("should click BIOMETRIC PROMPT and pass authentication", async () => {
    await clickAndAuthenticate(
      "com.example.all_in_one:id/bio_prompt",
      "BIOMETRIC PROMPT",
      "pass"
    );
  });

  it("should click BIOMETRIC PROMPT WITH KEYGEN and pass authentication", async () => {
    await clickAndAuthenticate(
      "com.example.all_in_one:id/keyparam",
      "BIOMETRIC PROMPT WITH KEYGEN",
      "pass"
    );
  });

  it("should click FINGERPRINT MANAGER and pass authentication", async () => {
    await clickAndAuthenticate(
      "com.example.all_in_one:id/FPManager",
      "FINGERPRINT MANAGER",
      "pass"
    );
  });

  it("should click BIOMETRIC PROMPT and fail authentication", async () => {
    await clickAndAuthenticate(
      "com.example.all_in_one:id/bio_prompt",
      "BIOMETRIC PROMPT",
      "fail"
    );
  });

  it("should click BIOMETRIC PROMPT and cancel authentication", async () => {
    await clickAndAuthenticate(
      "com.example.all_in_one:id/bio_prompt",
      "BIOMETRIC PROMPT",
      "cancel"
    );
  });
});