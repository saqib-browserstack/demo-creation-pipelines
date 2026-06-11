/**
 * iOS TestApp Page Object
 * Uses ORIGINAL IPA accessibility IDs.
 * BrowserStack selfHeal: true automatically maps these to changed IDs when running testapp_changed.ipa
 *
 * Original IPA (testapp_ios_og.ipa):  bs://55312b98db24e8cdac0f042a17d2002b3097ebce
 * Changed IPA (testapp_changed.ipa):  bs://e6b759f1618a13f1f7721f0aec3b78bfd36360b4
 */

import { $ } from '@wdio/globals';

class TestAppIOSPage {
  get radioOption2() {
    return $('~radio_option_2');
  }
  get checkbox() {
    return $('~checkbox');
  }
  get textInputField() {
    return $('~text_input_field');
  }
  get actionButton() {
    return $('~action_button');
  }
}

export default new TestAppIOSPage();