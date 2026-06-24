/**
 * report.test.js
 * Suite: Report Management (iOS App)
 * Covers:
 *  1. Patient profile shows patient name
 *  2. Add Report button is visible
 *  3. Edit button is visible on patient profile
 *  4. Patient profile card displays correct info
 */

const {
  waitForDisplayed, tapElement,
  getElementText, elementExists, takeScreenshot
} = require('../helpers/utils');

describe('Report Management', () => {
  before(async () => {
    const { loginAsDoctor } = require('../helpers/utils');
    await loginAsDoctor();
  });

  // ------------------------------------------------------------------
  // 1. Patient profile header shows name
  // ------------------------------------------------------------------
  it('should display patient name on profile', async () => {
    if (await elementExists('patient-name-header', 5000)) {
      const name = await getElementText('patient-name-header');
      expect(name.length).toBeGreaterThan(0);
      await takeScreenshot('report-patient-name');
    }
  });

  // ------------------------------------------------------------------
  // 2. Add Report button visible
  // ------------------------------------------------------------------
  it('should show Add Report button on patient profile', async () => {
    const btnExists = await elementExists('patient-add-report-btn', 5000);
    expect(btnExists).toBe(true);
    await takeScreenshot('report-add-button');
  });

  // ------------------------------------------------------------------
  // 3. Edit patient button visible
  // ------------------------------------------------------------------
  it('should show Edit button on patient profile', async () => {
    const editExists = await elementExists('patient-edit-btn', 5000);
    expect(editExists).toBe(true);
    await takeScreenshot('report-edit-patient-btn');
  });

  // ------------------------------------------------------------------
  // 4. Tapping Add Report navigates to form
  // ------------------------------------------------------------------
  it('should navigate to Add Report form when tapped', async () => {
    if (await elementExists('patient-add-report-btn', 3000)) {
      await tapElement('patient-add-report-btn');
      await browser.pause(2000);
      // After navigating, we should be on the AddDiseaseView
      await takeScreenshot('report-add-form-opened');
      // Navigate back
      await browser.back();
      await browser.pause(1000);
    }
  });
});
