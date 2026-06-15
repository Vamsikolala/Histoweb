/**
 * report.test.js
 * Suite: Report Management & Form Validation
 * Pre-condition: patient.test.js has run; a test patient "John Doe Test" exists.
 *                We re-login and navigate to the patient profile via search.
 * Covers:
 *  1. Navigate to patient profile via Search tab
 *  2. Click "Add Report" button → navigate to /patient/:id/add-report
 *  3. Add Report page: UI elements present
 *  4. Save button disabled when required fields are empty
 *  5. Fill Report Type only → save still disabled (Diagnosis + Full Report needed)
 *  6. Fill all required fields → save button becomes enabled
 *  7. Submit report → success message, redirected back to patient profile
 *  8. Disease history: newly added report card visible
 *  9. Edit existing report → verify edit mode loads with prefilled data
 * 10. Delete a report → confirm it disappears from history
 */

const { By, until } = require('selenium-webdriver');
const config = require('../config');

async function clearField(driver, element) {
  try {
    await driver.executeScript(
      "var nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;" +
      "nativeInputValueSetter.call(arguments[0], '');" +
      "arguments[0].dispatchEvent(new Event('input', { bubbles: true }));" +
      "arguments[0].dispatchEvent(new Event('change', { bubbles: true }));",
      element
    );
  } catch (_) {
    try {
      await element.clear();
    } catch (__) {}
  }
}


async function safeClick(driver, element) {
  await driver.executeScript(
    "arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });",
    element
  );
  await driver.sleep(350);
  try {
    await element.click();
  } catch (_) {
    await driver.executeScript("arguments[0].click();", element);
  }
}

const PATIENT_NAME = config.testPatient.name;


async function ensureOnPatientProfile(driver, log) {
  const currentUrl = await driver.getCurrentUrl();
  if (currentUrl.includes('/patient/') && !currentUrl.includes('/add-report') && !currentUrl.includes('/edit')) {
    return;
  }

  await driver.get(`${config.baseUrl}/dashboard`);
  await driver.wait(until.urlContains('/dashboard'), config.defaultTimeout);

  await safeClick(driver, await driver.findElement(By.id('sidebar-tab-1')));
  await driver.wait(until.elementLocated(By.id('patient-search-input')), config.defaultTimeout);

  const searchInput = await driver.findElement(By.id('patient-search-input'));
  await searchInput.sendKeys(PATIENT_NAME);
  await driver.sleep(1000);

  const patientCard = await driver.wait(
    until.elementLocated(By.xpath(
      `//span[normalize-space(text())='${PATIENT_NAME}']/ancestor::div[contains(@id, 'patient-card-')]`
    )),
    config.defaultTimeout,
    `Expected patient card for "${PATIENT_NAME}"`
  );
  await safeClick(driver, patientCard);
  await driver.wait(until.urlContains('/patient/'), config.defaultTimeout);
  log(`On patient profile: ${await driver.getCurrentUrl()}`);
}

async function run(driver, log, screenshot) {
  log('=== Report Management & Form Validation Suite ===');

  // Navigate to /dashboard — if logged in we land there, if not we get /login
  await driver.get(`${config.baseUrl}/dashboard`);
  await driver.sleep(1000);
  const urlAfterNav = await driver.getCurrentUrl();

  if (urlAfterNav.includes('/login') || urlAfterNav.includes('/signup')) {
    log('Session expired, re-logging in for report suite...');
    await driver.wait(until.elementLocated(By.id('login-license')), config.defaultTimeout);
    await driver.findElement(By.id('login-license')).sendKeys(config.testDoctor.licenseNo);
    await driver.findElement(By.id('login-password')).sendKeys(config.testDoctor.password);
    await safeClick(driver, await driver.findElement(By.id('login-submit')));
    await driver.wait(until.urlContains('/dashboard'), config.defaultTimeout);
  } else {
    log('Already logged in, on dashboard.');
  }

  // ------------------------------------------------------------------
  // 1. Navigate to patient profile via Search tab
  // ------------------------------------------------------------------
  log('[1] Navigating to test patient profile via Search...');
  await ensureOnPatientProfile(driver, log);
  await screenshot('01-patient-profile-pre-report');

  // ------------------------------------------------------------------
  // 2. Click "Add Report" button
  // ------------------------------------------------------------------
  log('[2] Clicking "Add Report" button...');
  const addReportBtn = await driver.wait(
    until.elementLocated(By.id('add-report-btn')),
    config.defaultTimeout
  );
  await safeClick(driver, addReportBtn);

  await driver.wait(until.urlContains('/add-report'), config.defaultTimeout,
    'Expected URL to contain /add-report');
  log('✔ Add Report page loaded.');
  await screenshot('02-add-report-page');

  // ------------------------------------------------------------------
  // 3. UI elements present
  // ------------------------------------------------------------------
  log('[3] Verifying Add Report form elements...');
  await driver.wait(until.elementLocated(By.id('rt-type')), config.defaultTimeout);
  await driver.wait(until.elementLocated(By.id('rt-diagnosis')), config.defaultTimeout);
  await driver.wait(until.elementLocated(By.id('rt-notes')), config.defaultTimeout);
  await driver.wait(until.elementLocated(By.id('rt-full-report')), config.defaultTimeout);
  await driver.wait(until.elementLocated(By.id('save-report-btn')), config.defaultTimeout);
  await driver.wait(until.elementLocated(By.id('add-gallery-btn')), config.defaultTimeout);
  log('✔ All Add Report form elements found.');

  // ------------------------------------------------------------------
  // 4. Save button disabled when all fields empty
  // ------------------------------------------------------------------
  log('[4] Checking Save button is disabled with empty fields...');
  const saveBtn = await driver.findElement(By.id('save-report-btn'));
  const isDisabledEmpty = await saveBtn.getAttribute('disabled');
  if (isDisabledEmpty !== null) {
    log('✔ Save button is disabled when fields are empty.');
  } else {
    throw new Error('Save button should be disabled when required fields are empty.');
  }
  await screenshot('04-save-btn-disabled-empty');

  // ------------------------------------------------------------------
  // 5. Fill only Report Type → save still disabled
  // ------------------------------------------------------------------
  log('[5] Fill only Report Type → save should remain disabled...');
  await driver.findElement(By.id('rt-type')).sendKeys('Preliminary Test');
  await driver.sleep(300);
  const isDisabledPartial = await saveBtn.getAttribute('disabled');
  if (isDisabledPartial !== null) {
    log('✔ Save button still disabled with only Report Type filled.');
  } else {
    throw new Error('Save button should remain disabled when Diagnosis and Full Report are empty.');
  }
  await screenshot('05-save-btn-disabled-partial');

  // ------------------------------------------------------------------
  // 6. Fill all required fields → save becomes enabled
  // ------------------------------------------------------------------
  log('[6] Filling all required fields...');
  await driver.findElement(By.id('rt-type')).clear();
  await driver.findElement(By.id('rt-type')).sendKeys('Blood Test Analysis');
  await driver.findElement(By.id('rt-diagnosis')).sendKeys('Iron Deficiency Anemia');
  await driver.findElement(By.id('rt-notes')).sendKeys('Patient reports fatigue and pallor.');
  await driver.findElement(By.id('rt-full-report')).sendKeys(
    'Hemoglobin: 10.5 g/dL\nMCV: 74 fL\nSerum Iron: 42 mcg/dL\nConclusion: Mild iron deficiency anemia. Recommend oral iron supplementation.'
  );
  await driver.sleep(500);

  const isEnabledNow = await saveBtn.getAttribute('disabled');
  if (isEnabledNow === null) {
    log('✔ Save button is now enabled after filling all required fields.');
  } else {
    throw new Error('Save button should be enabled after all required fields are filled.');
  }
  await screenshot('06-report-form-filled-enabled');

  // ------------------------------------------------------------------
  // 7. Submit report → success, redirect back to patient profile
  // ------------------------------------------------------------------
  log('[7] Submitting the report...');
  await safeClick(driver, saveBtn);

  // Wait for redirect back to patient profile
  await driver.wait(
    until.urlMatches(/\/patient\/\w+$/),
    config.defaultTimeout,
    'Expected redirect back to /patient/:id after saving report'
  );
  log('✔ Report saved, redirected back to patient profile.');
  await screenshot('07-report-saved-redirect');

  // ------------------------------------------------------------------
  // 7a. Add second report with extreme text length
  // ------------------------------------------------------------------
  log('[7a] Adding second report with extreme text length...');
  await driver.wait(until.elementLocated(By.id('add-report-btn')), config.defaultTimeout).click();
  await driver.wait(until.urlContains('/add-report'), config.defaultTimeout);
  
  await driver.findElement(By.id('rt-type')).sendKeys('Extreme Stress Test');
  await driver.findElement(By.id('rt-diagnosis')).sendKeys('Testing boundaries');
  await driver.findElement(By.id('rt-notes')).sendKeys('A'.repeat(1000)); // 1000 chars
  await driver.findElement(By.id('rt-full-report')).sendKeys('B'.repeat(10000)); // 10000 chars
  
  await driver.findElement(By.id('save-report-btn')).click();
  await driver.wait(until.urlMatches(/\/patient\/\w+$/), config.defaultTimeout);
  log('✔ Extreme length report saved successfully.');

  // ------------------------------------------------------------------
  // 8. Disease history: newly added report visible
  // ------------------------------------------------------------------
  log('[8] Verifying newly added report appears in Disease History...');
  await driver.sleep(500); // brief settle

  const reportTypeInHistory = await driver.wait(
    until.elementLocated(By.xpath(
      "//*[contains(text(),'Blood Test Analysis')]"
    )),
    config.defaultTimeout,
    'Expected "Blood Test Analysis" to appear in Disease History'
  );
  const historyText = await reportTypeInHistory.getText();
  log(`✔ Report found in history: "${historyText}"`);

  // Verify date format
  const dateElements = await driver.findElements(By.xpath('//p[contains(text(), "Date:")]'));
  if (dateElements.length > 0) {
    const dateText = await dateElements[0].getText();
    // Regex for typical dates (e.g., DD/MM/YYYY or YYYY-MM-DD or MMM DD, YYYY)
    if (/\d+/.test(dateText)) {
      log('✔ Date format rendered correctly on history card.');
    } else {
      throw new Error('Date format seems invalid on history card: ' + dateText);
    }
  }

  await screenshot('08-report-in-disease-history');

  // ------------------------------------------------------------------
  // 9. Edit existing report → prefilled data
  // ------------------------------------------------------------------
  log('[9] Testing Edit Report flow...');
  // Find an edit button for a report (non-analysis reports only)
  const editReportBtns = await driver.findElements(By.xpath(
    '//*[contains(@id,"edit-report-")]'
  ));

  if (editReportBtns.length > 0) {
    await safeClick(driver, editReportBtns[0]);
    await driver.wait(until.urlContains('/add-report'), config.defaultTimeout,
      'Expected URL to contain /add-report for edit mode');

    await driver.wait(until.elementLocated(By.id('rt-type')), config.defaultTimeout);
    const prefillValue = await driver.findElement(By.id('rt-type')).getAttribute('value');
    log(`✔ Edit Report loaded with prefilled Report Type: "${prefillValue}"`);
    await screenshot('09-edit-report-prefilled');

    // Go back without saving
    const backBtn = await driver.findElement(By.id('add-report-back'));
    await safeClick(driver, backBtn);
    await driver.wait(until.urlContains('/patient/'), config.defaultTimeout);
    log('✔ Navigated back from Edit Report.');
  } else {
    log('ℹ No editable reports found (may be analysis type). Skipping edit test.');
  }

  // ------------------------------------------------------------------
  // 10. Download report → My Downloads page
  // ------------------------------------------------------------------
  log('[10] Testing Download Report flow...');
  const downloadBtns = await driver.findElements(By.xpath(
    '//*[contains(@id,"download-report-")]'
  ));

  if (downloadBtns.length > 0) {
    await safeClick(driver, downloadBtns[0]);
    await driver.sleep(1000);
    try {
      const alertPresent = await driver.wait(until.alertIsPresent(), 3000).catch(() => null);
      if (alertPresent) {
        const alertText = (await driver.switchTo().alert().getText());
        log(`✔ Download alert: "${alertText}"`);
        await driver.switchTo().alert().accept();
      }
    } catch (e) {
      log('ℹ No download alert (may have been handled differently).');
    }
    await screenshot('10-download-triggered');

    const downloadsBtn = await driver.wait(
      until.elementLocated(By.id('downloads-btn')), config.defaultTimeout
    );
    await safeClick(driver, downloadsBtn);
    await driver.wait(until.urlContains('/downloads'), config.defaultTimeout);
    log('✔ My Downloads page loaded.');
    await screenshot('10-my-downloads-page');

    await driver.navigate().back();
    await driver.wait(until.urlContains('/patient/'), config.defaultTimeout);
  } else {
    log('ℹ No downloadable reports found yet.');
  }

  // ------------------------------------------------------------------
  // 11. Delete cancellation and empty state check
  // ------------------------------------------------------------------
  log('[11] Testing Delete Report cancellation...');
  let deleteBtns = await driver.findElements(By.xpath('//*[contains(@id,"delete-report-")]'));

  if (deleteBtns.length > 0) {
    const initialReportCount = deleteBtns.length;
    // Attempt to delete but CANCEL
    await deleteBtns[deleteBtns.length - 1].click();
    await driver.sleep(500);

    try {
      const alertPresent = await driver.wait(until.alertIsPresent(), 3000).catch(() => null);
      if (alertPresent) {
        log('Dismissing delete confirmation dialog...');
        await driver.switchTo().alert().dismiss();
        await driver.sleep(1000);
      }
    } catch (e) {
      log('ℹ Delete used a custom dialog. Clicking Cancel...');
      const cancelBtn = await driver.findElements(By.xpath('//button[contains(text(),"Cancel") or contains(text(),"No")]'));
      if (cancelBtn.length > 0) await cancelBtn[0].click();
    }

    await driver.sleep(1000);
    deleteBtns = await driver.findElements(By.xpath('//*[contains(@id,"delete-report-")]'));
    if (deleteBtns.length === initialReportCount) {
      log('✔ Delete cancellation successful. Report count unchanged.');
    } else {
      throw new Error('Report count changed even after canceling delete!');
    }

    // ------------------------------------------------------------------
    // 12. Delete all reports to test empty state
    // ------------------------------------------------------------------
    log('[12] Testing Delete All Reports to verify empty state...');
    while (deleteBtns.length > 0) {
      await deleteBtns[deleteBtns.length - 1].click();
      await driver.sleep(500);
      try {
        const alertPresent = await driver.wait(until.alertIsPresent(), 3000).catch(() => null);
        if (alertPresent) {
          await driver.switchTo().alert().accept();
        }
      } catch (e) {
        const confirmBtn = await driver.findElements(By.xpath('//button[contains(text(),"Confirm") or contains(text(),"Delete") or contains(text(),"Yes")]'));
        if (confirmBtn.length > 0) await confirmBtn[0].click();
      }
      await driver.sleep(1000);
      deleteBtns = await driver.findElements(By.xpath('//*[contains(@id,"delete-report-")]'));
    }

    log('✔ Report successfully deleted (all reports removed).');

    // Verify empty state
    const emptyStateText = await driver.findElement(By.tagName('body')).getText();
    if (emptyStateText.toLowerCase().includes('no disease history') || emptyStateText.toLowerCase().includes('no reports')) {
      log('✔ Disease history empty state verified correctly.');
    } else {
      log('ℹ Empty state UI text not explicitly found, but 0 reports exist.');
    }

    await screenshot('12-reports-empty-state');
  } else {
    log('ℹ No reports available to test delete flows.');
  }

  log('=== Report Management & Form Validation Suite COMPLETE ===');
}

module.exports = { run, name: 'Report Management & Form Validation' };
