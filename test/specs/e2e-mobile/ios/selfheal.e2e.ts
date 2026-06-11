/**
 * iOS Self-Heal E2E Test Suite
 * Build: self heal priyansh
 *
 * STEP 1 — Run with original IPA (establishes self-heal baseline):
 *   npm run wdio:selfheal:ios
 *   App: testapp_ios_og.ipa (bs://55312b98db24e8cdac0f042a17d2002b3097ebce)
 *   Expected: 4/4 PASS ✅
 *
 * STEP 2 — Run with changed IPA (self-heal kicks in):
 *   BROWSERSTACK_IOS_APP_URL="bs://e6b759f1618a13f1f7721f0aec3b78bfd36360b4" npm run wdio:selfheal:ios
 *   App: testapp_changed.ipa — accessibility IDs changed
 *   Expected: 4/4 PASS ✅ (self-heal heals all changed IDs)
 *
 * ID mapping (original → changed):
 *   radio_option_2       → radio_choice_second
 *   checkbox             → toggle_checkbox
 *   text_input_field     → input_text_field
 *   action_button        → primary_action_btn
 */

import TestAppPage from '../../../pageobjects/mobile/ios/testapp.page.js';

describe('iOS Self-Heal E2E Journey', () => {
  // ── Radio Button ───────────────────────────────────────────────────────────
  it('should select radio button option 2', async () => {
    const radioBtn2 = await TestAppPage.radioOption2;
    await radioBtn2.waitForDisplayed({ timeout: 30000 });
    await radioBtn2.click();
    const isDisplayed = await radioBtn2.isDisplayed();
    expect(isDisplayed).toBe(true);
  });

  // ── Checkbox ───────────────────────────────────────────────────────────────
  it('should check the checkbox', async () => {
    const checkbox = await TestAppPage.checkbox;
    await checkbox.waitForDisplayed({ timeout: 30000 });
    await checkbox.click();
    const isDisplayed = await checkbox.isDisplayed();
    expect(isDisplayed).toBe(true);
  });

  // ── Text Input ─────────────────────────────────────────────────────────────
  it('should enter text in the input field', async () => {
    const input = await TestAppPage.textInputField;
    await input.waitForDisplayed({ timeout: 30000 });
    await input.clearValue();
    await input.setValue('Hello Self Heal!');
    const value = await input.getValue();
    expect(value).toContain('Hello Self Heal!');
  });

  // ── Action Button ──────────────────────────────────────────────────────────
  it('should tap the action button', async () => {
    const button = await TestAppPage.actionButton;
    await button.waitForDisplayed({ timeout: 30000 });
    await button.click();
    const isDisplayed = await button.isDisplayed();
    expect(isDisplayed).toBe(true);
  });
});