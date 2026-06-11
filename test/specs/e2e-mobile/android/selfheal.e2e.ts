/**
 * Android Self-Heal E2E Test Suite
 * App: final_app_simple.apk (original) → final_app_simple_changed.apk (changed)
 * Build: self heal priyansh
 *
 * Resource IDs sourced from live BrowserStack session (com.example.testapp)
 * BrowserStack selfHeal: true adapts automatically when elements change.
 */

import { $ } from '@wdio/globals';
import TestAppPage from '../../../pageobjects/mobile/android/testapp.page.js';

describe('Android Self-Heal E2E Journey', () => {
  // ── Main Button ────────────────────────────────────────────────────────────
  it('should tap the main button and verify result text', async () => {
    const button = await TestAppPage.mainButton;
    await button.waitForDisplayed({ timeout: 30000 });
    await button.click();

    const result = await TestAppPage.buttonResult;
    await result.waitForDisplayed({ timeout: 15000 });

    const text = await result.getText();
    expect(text).not.toContain('not clicked');
  });

  // ── Checkbox ───────────────────────────────────────────────────────────────
  it('should check the checkbox and verify checked state', async () => {
    const checkbox = await TestAppPage.checkbox;
    await checkbox.waitForDisplayed({ timeout: 30000 });
    await checkbox.click();

    const result = await TestAppPage.checkboxResult;
    await result.waitForDisplayed({ timeout: 15000 });

    const text = await result.getText();
    expect(text).not.toContain('not interacted');
  });

  // ── Radio Buttons ──────────────────────────────────────────────────────────
  it('should select radio option 1 and verify radio result', async () => {
    const radio1 = await TestAppPage.radioOption1;
    await radio1.waitForDisplayed({ timeout: 30000 });
    await radio1.click();

    const result = await TestAppPage.radioResult;
    await result.waitForDisplayed({ timeout: 15000 });

    const text = await result.getText();
    expect(text).not.toContain('No radio button selected');
  });

  it('should select radio option 2 and verify radio result updates', async () => {
    const radio2 = await TestAppPage.radioOption2;
    await radio2.waitForDisplayed({ timeout: 30000 });
    await radio2.click();

    const result = await TestAppPage.radioResult;
    await result.waitForDisplayed({ timeout: 15000 });

    const text = await result.getText();
    expect(text).not.toContain('No radio button selected');
  });

  // ── Text Input ─────────────────────────────────────────────────────────────
  it('should enter text in the input field and verify result', async () => {
    const input = await TestAppPage.textInput;
    await input.waitForDisplayed({ timeout: 30000 });
    await input.clearValue();
    await input.setValue('Hello Self Heal!');

    try {
      await driver.hideKeyboard();
    } catch {
      // keyboard may already be hidden
    }

    const result = await TestAppPage.textInputResult;
    await result.waitForDisplayed({ timeout: 15000 });

    const text = await result.getText();
    expect(text).not.toContain('No text entered');
  });

  // ── Spinner / Dropdown ─────────────────────────────────────────────────────
  it('should open the spinner dropdown and select an option', async () => {
    await TestAppPage.scrollToSpinner();

    const spinner = await TestAppPage.spinner;
    await spinner.waitForDisplayed({ timeout: 30000 });
    await spinner.click();

    // Wait for dropdown list to appear (CheckedTextView in dropdown popup)
    const option = await $('android=new UiSelector().className("android.widget.CheckedTextView").textContains("Option")');
    await option.waitForDisplayed({ timeout: 10000 });
    await option.click();

    // Verify the spinner itself now shows the selected option (not the placeholder)
    const spinnerEl = await TestAppPage.spinner;
    await spinnerEl.waitForDisplayed({ timeout: 15000 });
    const spinnerText = await spinnerEl.getText();
    expect(spinnerText).not.toContain('Select an option');
  });
});