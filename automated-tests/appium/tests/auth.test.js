/**
 * auth.test.js
 * Suite: Authentication Flow (iOS App)
 * Covers:
 *  1. Login page UI elements present
 *  2. Empty credentials validation
 *  3. Wrong credentials error
 *  4. Navigate to Signup page
 *  5. Signup form UI elements present
 *  6. Signup empty fields validation
 *  7. Signup invalid email validation
 *  8. Navigate to Forgot Password
 *  9. Forgot Password UI elements present
 * 10. Navigate back to Login
 */

const {
  waitForDisplayed, tapElement, typeIntoField,
  getElementText, elementExists, takeScreenshot,
  waitForSplashToFinish
} = require('../helpers/utils');
const config = require('../config');

describe('Authentication Flow', () => {
  before(async () => {
    // Wait for splash screen to finish
    await waitForSplashToFinish();
  });

  // ------------------------------------------------------------------
  // 1. Login page UI elements
  // ------------------------------------------------------------------
  it('should display all login form elements', async () => {
    expect(await elementExists('login-license-field')).toBe(true);
    expect(await elementExists('login-password-field')).toBe(true);
    expect(await elementExists('login-submit-btn')).toBe(true);
    expect(await elementExists('login-signup-link')).toBe(true);
    expect(await elementExists('login-forgot-password-link')).toBe(true);
    await takeScreenshot('auth-login-ui-elements');
  });

  // ------------------------------------------------------------------
  // 2. Empty credentials validation
  // ------------------------------------------------------------------
  it('should show error when submitting empty credentials', async () => {
    await tapElement('login-submit-btn');
    await browser.pause(500);
    const errorExists = await elementExists('login-error-text');
    expect(errorExists).toBe(true);
    const errorText = await getElementText('login-error-text');
    expect(errorText.toLowerCase()).toContain('license number and password');
    await takeScreenshot('auth-empty-credentials-error');
  });

  // ------------------------------------------------------------------
  // 3. Wrong credentials → error message shown
  // ------------------------------------------------------------------
  it('should show error for invalid credentials', async () => {
    await typeIntoField('login-license-field', 'INVALID999');
    await typeIntoField('login-password-field', 'wrongpassword');
    await tapElement('login-submit-btn');
    // Wait for network response
    await browser.pause(3000);
    const errorExists = await elementExists('login-error-text', 5000);
    expect(errorExists).toBe(true);
    await takeScreenshot('auth-wrong-credentials');
  });

  // ------------------------------------------------------------------
  // 4. Navigate to Forgot Password
  // ------------------------------------------------------------------
  it('should navigate to Forgot Password page', async () => {
    // Clear previous fields first
    await typeIntoField('login-license-field', '');
    await typeIntoField('login-password-field', '');
    await tapElement('login-forgot-password-link');
    await browser.pause(1000);
    const emailFieldExists = await elementExists('forgot-email-field', 5000);
    expect(emailFieldExists).toBe(true);
    await takeScreenshot('auth-forgot-password-page');
  });

  // ------------------------------------------------------------------
  // 5. Forgot Password UI elements
  // ------------------------------------------------------------------
  it('should display Forgot Password form elements', async () => {
    expect(await elementExists('forgot-email-field')).toBe(true);
    expect(await elementExists('forgot-submit-btn')).toBe(true);
    expect(await elementExists('forgot-back-btn')).toBe(true);
  });

  // ------------------------------------------------------------------
  // 6. Navigate back to Login from Forgot Password
  // ------------------------------------------------------------------
  it('should navigate back to Login from Forgot Password', async () => {
    await tapElement('forgot-back-btn');
    await browser.pause(1000);
    const loginExists = await elementExists('login-license-field', 5000);
    expect(loginExists).toBe(true);
    await takeScreenshot('auth-back-to-login');
  });

  // ------------------------------------------------------------------
  // 7. Navigate to Signup page
  // ------------------------------------------------------------------
  it('should navigate to Signup page', async () => {
    await tapElement('login-signup-link');
    await browser.pause(1000);
    const nameFieldExists = await elementExists('signup-name-field', 5000);
    expect(nameFieldExists).toBe(true);
    await takeScreenshot('auth-signup-page');
  });

  // ------------------------------------------------------------------
  // 8. Signup form UI elements present
  // ------------------------------------------------------------------
  it('should display all signup form elements', async () => {
    expect(await elementExists('signup-name-field')).toBe(true);
    expect(await elementExists('signup-license-field')).toBe(true);
    expect(await elementExists('signup-email-field')).toBe(true);
    expect(await elementExists('signup-password-field')).toBe(true);
    expect(await elementExists('signup-submit-btn')).toBe(true);
  });

  // ------------------------------------------------------------------
  // 9. Signup empty fields validation
  // ------------------------------------------------------------------
  it('should show error when submitting signup with empty fields', async () => {
    await tapElement('signup-submit-btn');
    await browser.pause(500);
    const errorExists = await elementExists('signup-error-text');
    expect(errorExists).toBe(true);
    const errorText = await getElementText('signup-error-text');
    expect(errorText.toLowerCase()).toContain('fill');
    await takeScreenshot('auth-signup-empty-fields');
  });

  // ------------------------------------------------------------------
  // 10. Signup invalid email validation
  // ------------------------------------------------------------------
  it('should reject invalid email format on signup', async () => {
    await typeIntoField('signup-name-field', 'Test Doctor');
    await typeIntoField('signup-license-field', 'TEST1234');
    await typeIntoField('signup-email-field', 'not-an-email');
    await typeIntoField('signup-password-field', 'Password123!');
    await tapElement('signup-submit-btn');
    await browser.pause(500);
    const errorExists = await elementExists('signup-error-text');
    expect(errorExists).toBe(true);
    const errorText = await getElementText('signup-error-text');
    expect(errorText.toLowerCase()).toContain('valid email');
    await takeScreenshot('auth-signup-invalid-email');
  });

  // ------------------------------------------------------------------
  // 11. Navigate back to Login from Signup
  // ------------------------------------------------------------------
  it('should navigate back to Login from Signup', async () => {
    await tapElement('signup-login-link');
    await browser.pause(1000);
    const loginExists = await elementExists('login-license-field', 5000);
    expect(loginExists).toBe(true);
    await takeScreenshot('auth-back-to-login-from-signup');
  });
});
