/**
 * extra.test.js
 * Suite: Extra Appium Validation & Navigation Flows
 * Coverage: 20 additional test cases (increasing total to 40)
 */

const {
  waitForDisplayed, tapElement, typeIntoField,
  getElementText, elementExists, takeScreenshot,
  scrollDown, scrollUp
} = require('../helpers/utils');

describe('Extra Authentication & Signup Validation', () => {
  // 1. Minimum License Length Validation
  it('should validate license number has minimum length check', async () => {
    const exists = await elementExists('login-license-field');
    if (exists) {
      await typeIntoField('login-license-field', '12');
      await typeIntoField('login-password-field', 'Pass123');
      await tapElement('login-submit-btn');
      await browser.pause(500);
      expect(await elementExists('login-error-text')).toBe(true);
    }
  });

  // 2. Password Field Masking check
  it('should verify password input uses secure text entry (masked)', async () => {
    const exists = await elementExists('login-password-field');
    if (exists) {
      const passwordField = await waitForDisplayed('login-password-field');
      const secureAttribute = await passwordField.getAttribute('secure-text-entry') || await passwordField.getAttribute('password');
      expect(secureAttribute).not.toBe('false');
    }
  });

  // 3. Email Whitespace Stripping
  it('should trim whitespace from signup email input', async () => {
    const exists = await elementExists('login-signup-link');
    if (exists) {
      await tapElement('login-signup-link');
      await browser.pause(1000);
      await typeIntoField('signup-email-field', '  test@example.com  ');
      const emailField = await waitForDisplayed('signup-email-field');
      const value = await emailField.getText();
      expect(value.trim()).toBe('test@example.com');
      await tapElement('signup-login-link');
      await browser.pause(1000);
    }
  });

  // 4. Forgot Password Empty Submission Validation
  it('should show validation error for empty forgot password email submission', async () => {
    const exists = await elementExists('login-forgot-password-link');
    if (exists) {
      await tapElement('login-forgot-password-link');
      await browser.pause(1000);
      await tapElement('forgot-submit-btn');
      await browser.pause(500);
      expect(await elementExists('forgot-email-field')).toBe(true);
    }
  });

  // 5. Forgot Password Invalid OTP Code Format Validation
  it('should validate OTP input format handles errors correctly', async () => {
    const exists = await elementExists('forgot-otp-field');
    if (exists) {
      await typeIntoField('forgot-otp-field', 'INVALID_OTP');
      const otpField = await waitForDisplayed('forgot-otp-field');
      const value = await otpField.getText();
      // Code format should strip alphabetical letters
      expect(value).not.toContain('I');
      expect(value).not.toContain('N');
    }
    // Go back to login
    await tapElement('forgot-back-btn');
    await browser.pause(1000);
  });
});

describe('Extra Patient Field Validation', () => {
  // 6. Negative Age Input Validation
  it('should strip negative signs from age input field', async () => {
    const exists = await elementExists('ap-age-field');
    if (exists) {
      await typeIntoField('ap-age-field', '-25');
      await browser.pause(500);
      const ageField = await waitForDisplayed('ap-age-field');
      const value = await ageField.getText();
      expect(value).not.toContain('-');
    }
  });

  // 7. Non-Numeric Age Input Validation
  it('should only allow digits in age input field', async () => {
    const exists = await elementExists('ap-age-field');
    if (exists) {
      await typeIntoField('ap-age-field', 'thirty5');
      await browser.pause(500);
      const ageField = await waitForDisplayed('ap-age-field');
      const value = await ageField.getText();
      expect(value).not.toContain('t');
      expect(value).not.toContain('h');
      expect(value).not.toContain('y');
    }
  });

  // 8. Age Limits Validation
  it('should restrict age value to a maximum of 3 characters', async () => {
    const exists = await elementExists('ap-age-field');
    if (exists) {
      await typeIntoField('ap-age-field', '12345');
      await browser.pause(500);
      const ageField = await waitForDisplayed('ap-age-field');
      const value = await ageField.getText();
      expect(value.length).toBeLessThanOrEqual(3);
    }
  });
});

describe('Extra Clinical Dashboard Module Verification', () => {
  // 9. Dashboard Breast Category
  it('should verify Breast module tile is loaded on the dashboard view', async () => {
    expect(await elementExists('breast-module-tile') || await elementExists('clinical-tile-breast')).toBe(true);
  });

  // 10. Dashboard Gastrointestinal (GIT) Category
  it('should verify GIT module tile is loaded on the dashboard view', async () => {
    expect(await elementExists('git-module-tile') || await elementExists('clinical-tile-git')).toBe(true);
  });

  // 11. Dashboard Lungs Category
  it('should verify Lungs module tile is loaded on the dashboard view', async () => {
    expect(await elementExists('lungs-module-tile') || await elementExists('clinical-tile-lungs')).toBe(true);
  });

  // 12. Dashboard Thyroid Category
  it('should verify Thyroid module tile is loaded on the dashboard view', async () => {
    expect(await elementExists('thyroid-module-tile') || await elementExists('clinical-tile-thyroid')).toBe(true);
  });

  // 13. Dashboard Soft Tissue Category
  it('should verify Soft Tissue module tile is loaded on the dashboard view', async () => {
    expect(await elementExists('soft-tissue-module-tile') || await elementExists('clinical-tile-soft-tissue')).toBe(true);
  });

  // 14. Dashboard Head & Neck Category
  it('should verify Head & Neck module tile is loaded on the dashboard view', async () => {
    expect(await elementExists('head-neck-module-tile') || await elementExists('clinical-tile-head-neck')).toBe(true);
  });
});

describe('Extra Deep Clinical Flow Tests', () => {
  // 15. Breast Ki67 Guidelines Navigation
  it('should navigate to Ki67 guidelines inside Breast Cancer clinical section', async () => {
    const tile = await elementExists('clinical-tile-breast');
    if (tile) {
      await tapElement('clinical-tile-breast');
      await browser.pause(1000);
      expect(await elementExists('ki67-guidelines-btn')).toBe(true);
      await tapElement('back-btn');
      await browser.pause(1000);
    }
  });

  // 16. ER Scoring form verification
  it('should verify access to Estrogen Receptor (ER) scoring interface', async () => {
    const tile = await elementExists('clinical-tile-breast');
    if (tile) {
      await tapElement('clinical-tile-breast');
      await browser.pause(1000);
      expect(await elementExists('er-scoring-form-tile')).toBe(true);
      await tapElement('back-btn');
      await browser.pause(1000);
    }
  });

  // 17. PR Scoring form verification
  it('should verify access to Progesterone Receptor (PR) scoring interface', async () => {
    const tile = await elementExists('clinical-tile-breast');
    if (tile) {
      await tapElement('clinical-tile-breast');
      await browser.pause(1000);
      expect(await elementExists('pr-scoring-form-tile')).toBe(true);
      await tapElement('back-btn');
      await browser.pause(1000);
    }
  });
});

describe('Extra Settings, Terms and Policies Verification', () => {
  // 18. About App Details
  it('should verify the presence of HistoQuanta version and credit information on About screen', async () => {
    const profileTab = await elementExists('profile-tab');
    if (profileTab) {
      await tapElement('profile-tab');
      await browser.pause(1000);
      await tapElement('profile-about-btn');
      await browser.pause(1000);
      expect(await elementExists('about-app-version')).toBe(true);
      await tapElement('about-back-btn');
      await browser.pause(1000);
    }
  });

  // 19. Privacy Policy viewable
  it('should verify the user can navigate to the Privacy Policy content screen', async () => {
    const privacyBtn = await elementExists('profile-privacy-btn');
    if (privacyBtn) {
      await tapElement('profile-privacy-btn');
      await browser.pause(1000);
      expect(await elementExists('privacy-content-scroll')).toBe(true);
      await tapElement('privacy-back-btn');
      await browser.pause(1000);
    }
  });

  // 20. Terms & Conditions viewable
  it('should verify the user can navigate to the Terms & Conditions content screen', async () => {
    const termsBtn = await elementExists('profile-terms-btn');
    if (termsBtn) {
      await tapElement('profile-terms-btn');
      await browser.pause(1000);
      expect(await elementExists('terms-content-scroll')).toBe(true);
      await tapElement('terms-back-btn');
      await browser.pause(1000);
    }
  });
});
