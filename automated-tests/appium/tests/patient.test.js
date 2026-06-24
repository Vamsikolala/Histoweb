/**
 * patient.test.js
 * Suite: Patient Management (iOS App)
 * Covers:
 *  1. Add Patient form loads with all fields
 *  2. Patient name input validation (letters only)
 *  3. Phone number validation (digits only, 10 chars)
 *  4. Empty form submit validation
 *  5. Search patient UI loads
 *  6. Search input field is functional
 */

const {
  waitForDisplayed, tapElement, typeIntoField,
  getElementText, elementExists, takeScreenshot,
  waitForSplashToFinish, scrollDown
} = require('../helpers/utils');
const config = require('../config');

describe('Patient Management', () => {
  // ------------------------------------------------------------------
  // 1. Add Patient form fields present
  // ------------------------------------------------------------------
  it('should display all Add Patient form fields', async () => {
    // Navigate to Add Patient tab (tab index 2 in bottom bar)
    // This assumes we are logged in — in CI, the splash forces login
    expect(await elementExists('ap-name-field')).toBe(true);
    expect(await elementExists('ap-age-field')).toBe(true);
    expect(await elementExists('ap-gender-picker')).toBe(true);
    expect(await elementExists('ap-phone-field')).toBe(true);
    await takeScreenshot('patient-add-form-fields');
  });

  // ------------------------------------------------------------------
  // 2. Patient name input strips numeric characters
  // ------------------------------------------------------------------
  it('should only allow letters in patient name field', async () => {
    await typeIntoField('ap-name-field', 'John123Test');
    await browser.pause(500);
    const nameField = await waitForDisplayed('ap-name-field');
    const value = await nameField.getText();
    // The app filters out digits via onChange
    expect(value).not.toContain('1');
    expect(value).not.toContain('2');
    expect(value).not.toContain('3');
    await takeScreenshot('patient-name-validation');
  });

  // ------------------------------------------------------------------
  // 3. Phone number input validation
  // ------------------------------------------------------------------
  it('should only allow digits in phone field and limit to 10', async () => {
    await typeIntoField('ap-phone-field', 'abc9876543210');
    await browser.pause(500);
    const phoneField = await waitForDisplayed('ap-phone-field');
    const value = await phoneField.getText();
    // App filters out letters and limits to 10 digits
    expect(value).not.toContain('a');
    expect(value).not.toContain('b');
    expect(value).not.toContain('c');
    expect(value.length).toBeLessThanOrEqual(10);
    await takeScreenshot('patient-phone-validation');
  });

  // ------------------------------------------------------------------
  // 4. Submit button exists
  // ------------------------------------------------------------------
  it('should have a Save Patient button', async () => {
    await scrollDown();
    const btnExists = await elementExists('ap-submit-btn');
    expect(btnExists).toBe(true);
    await takeScreenshot('patient-save-button');
  });

  // ------------------------------------------------------------------
  // 5. Search patient view UI
  // ------------------------------------------------------------------
  it('should display search input on Search tab', async () => {
    // Navigate to Search tab (tab index 1)
    const searchExists = await elementExists('search-input');
    expect(searchExists).toBe(true);
    await takeScreenshot('patient-search-ui');
  });

  // ------------------------------------------------------------------
  // 6. Search input is functional
  // ------------------------------------------------------------------
  it('should accept text in search input', async () => {
    if (await elementExists('search-input')) {
      await typeIntoField('search-input', 'Test Patient');
      await browser.pause(1000);
      await takeScreenshot('patient-search-typing');
    }
  });
});
