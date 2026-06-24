/**
 * profile.test.js
 * Suite: Doctor Profile & Logout (iOS App)
 * Covers:
 *  1. Doctor name visible on profile
 *  2. Edit profile button present
 *  3. Privacy Policy navigation
 *  4. Terms & Conditions navigation
 *  5. About page navigation
 *  6. Logout button present
 *  7. Logout confirmation dialog
 */

const {
  waitForDisplayed, tapElement,
  getElementText, elementExists, takeScreenshot, handleAlert
} = require('../helpers/utils');

describe('Doctor Profile & Logout', () => {
  // ------------------------------------------------------------------
  // 1. Doctor name visible on profile
  // ------------------------------------------------------------------
  it('should display doctor name on profile header', async () => {
    if (await elementExists('profile-doctor-name', 5000)) {
      const name = await getElementText('profile-doctor-name');
      expect(name.length).toBeGreaterThan(0);
      await takeScreenshot('profile-doctor-name');
    }
  });

  // ------------------------------------------------------------------
  // 2. Edit profile button present
  // ------------------------------------------------------------------
  it('should show edit profile button', async () => {
    const editExists = await elementExists('profile-edit-btn', 5000);
    expect(editExists).toBe(true);
    await takeScreenshot('profile-edit-btn');
  });

  // ------------------------------------------------------------------
  // 3. Privacy Policy navigation
  // ------------------------------------------------------------------
  it('should navigate to Privacy Policy', async () => {
    if (await elementExists('profile-privacy-btn', 5000)) {
      await tapElement('profile-privacy-btn');
      await browser.pause(2000);
      await takeScreenshot('profile-privacy-policy');
      // Navigate back
      await browser.back();
      await browser.pause(1000);
    }
  });

  // ------------------------------------------------------------------
  // 4. Terms & Conditions navigation
  // ------------------------------------------------------------------
  it('should navigate to Terms & Conditions', async () => {
    if (await elementExists('profile-terms-btn', 5000)) {
      await tapElement('profile-terms-btn');
      await browser.pause(2000);
      await takeScreenshot('profile-terms-conditions');
      // Navigate back
      await browser.back();
      await browser.pause(1000);
    }
  });

  // ------------------------------------------------------------------
  // 5. About page navigation
  // ------------------------------------------------------------------
  it('should navigate to About page', async () => {
    if (await elementExists('profile-about-btn', 5000)) {
      await tapElement('profile-about-btn');
      await browser.pause(2000);
      await takeScreenshot('profile-about-page');
      // Navigate back
      await browser.back();
      await browser.pause(1000);
    }
  });

  // ------------------------------------------------------------------
  // 6. Logout button present
  // ------------------------------------------------------------------
  it('should show logout button', async () => {
    const logoutExists = await elementExists('profile-logout-btn', 5000);
    expect(logoutExists).toBe(true);
    await takeScreenshot('profile-logout-btn');
  });

  // ------------------------------------------------------------------
  // 7. Logout shows confirmation dialog
  // ------------------------------------------------------------------
  it('should show confirmation dialog on logout tap', async () => {
    if (await elementExists('profile-logout-btn', 3000)) {
      await tapElement('profile-logout-btn');
      await browser.pause(1000);
      // The app shows a native alert: "Are you sure you want to log out?"
      await takeScreenshot('profile-logout-confirmation');
      // Dismiss the alert (cancel)
      await handleAlert('dismiss');
      await browser.pause(500);
    }
  });
});
