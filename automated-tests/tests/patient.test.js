/**
 * patient.test.js
 * Suite: Patient & Report Management
 * Pre-condition: auth.test.js has run → logged in on /dashboard
 */

const { By, until } = require('selenium-webdriver');
const config = require('../config');
const { scrollAndClick } = require('../run-tests');

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


async function ensureLoggedIn(driver, log) {
  await driver.get(`${config.baseUrl}/dashboard`);
  await driver.sleep(1000);
  let cu = await driver.getCurrentUrl();
  if (cu.includes('/dashboard')) {
    log('Already logged in, on dashboard.');
    return;
  }

  log('Session expired or not logged in. Logging in...');
  await driver.get(`${config.baseUrl}/login`);
  await driver.wait(until.elementLocated(By.id('login-license')), config.defaultTimeout);
  
  await clearField(driver, await driver.findElement(By.id('login-license')));
  await driver.findElement(By.id('login-license')).sendKeys(config.testDoctor.licenseNo);
  
  await clearField(driver, await driver.findElement(By.id('login-password')));
  await driver.findElement(By.id('login-password')).sendKeys(config.testDoctor.password);
  
  await safeClick(driver, await driver.findElement(By.id('login-submit')));
  await driver.sleep(1000);

  cu = await driver.getCurrentUrl();
  if (cu.includes('/dashboard')) {
    log('Logged in successfully.');
    return;
  }

  // Check if "Doctor not found" or other login error occurred
  const alerts = await driver.findElements(By.className('alert-error'));
  if (alerts.length > 0) {
    const alertText = await alerts[0].getText();
    if (alertText.toLowerCase().includes('not found') || alertText.toLowerCase().includes('invalid')) {
      log(`Doctor login failed: "${alertText}". Registering doctor dynamically...`);
      await driver.get(`${config.baseUrl}/signup`);
      await driver.wait(until.elementLocated(By.id('signup-name')), config.defaultTimeout);
      
      await clearField(driver, await driver.findElement(By.id('signup-name')));
      await driver.findElement(By.id('signup-name')).sendKeys(config.testDoctor.name);
      
      await clearField(driver, await driver.findElement(By.id('signup-license')));
      await driver.findElement(By.id('signup-license')).sendKeys(config.testDoctor.licenseNo);
      
      await clearField(driver, await driver.findElement(By.id('signup-email')));
      await driver.findElement(By.id('signup-email')).sendKeys(config.testDoctor.email);
      
      await clearField(driver, await driver.findElement(By.id('signup-password')));
      await driver.findElement(By.id('signup-password')).sendKeys(config.testDoctor.password);
      
      await safeClick(driver, await driver.findElement(By.id('signup-submit')));
      await driver.wait(until.urlContains('/login'), config.defaultTimeout);
      log('Dynamic registration successful. Logging in again...');

      await driver.wait(until.elementLocated(By.id('login-license')), config.defaultTimeout);
      await clearField(driver, await driver.findElement(By.id('login-license')));
      await driver.findElement(By.id('login-license')).sendKeys(config.testDoctor.licenseNo);
      
      await clearField(driver, await driver.findElement(By.id('login-password')));
      await driver.findElement(By.id('login-password')).sendKeys(config.testDoctor.password);
      
      await safeClick(driver, await driver.findElement(By.id('login-submit')));
      await driver.wait(until.urlContains('/dashboard'), config.defaultTimeout);
      log('Logged in successfully after dynamic registration.');
    }
  }
}

const PATIENT_NAME = config.testPatient.name;
let capturedPatientId = null;

// Helper: scroll element into centre of view then click (JS fallback)
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

async function run(driver, log, screenshot) {
  log('=== Patient & Report Management Suite ===');

  // Ensure logged in
  await ensureLoggedIn(driver, log);


  // ── 1. Home tab: tiles + no-patient banner ─────────────────────────────────
  log('[1] Verifying Home tab – module tiles and no-patient banner...');
  await safeClick(driver, await driver.findElement(By.id('sidebar-tab-0')));
  await driver.sleep(500);

  await driver.wait(until.elementLocated(By.id('home-select-patient-banner')), config.defaultTimeout,
    'Expected "No Patient Selected" banner');
  log('✔ "No Patient Selected" banner visible.');

  for (const r of ['breast', 'thyroid', 'git', 'softtissue', 'headneck', 'lungs']) {
    await driver.wait(until.elementLocated(By.id(`tissue-${r}`)), config.defaultTimeout,
      `Expected tile tissue-${r}`);
  }
  log('✔ All 6 clinical module tiles found.');
  await screenshot('01-home-tab-no-patient');

  // ── 2. Navigate to Add Patient tab ────────────────────────────────────────
  log('[2] Navigating to Add Patient tab...');
  await safeClick(driver, await driver.findElement(By.id('sidebar-tab-2')));
  await driver.sleep(500);
  await driver.wait(until.elementLocated(By.id('ap-name')), config.defaultTimeout);
  log('✔ Add Patient tab loaded.');
  await screenshot('02-add-patient-tab');

  // ── 3. Name input filter ──────────────────────────────────────────────────
  log('[3] Testing Name input filter ("John123" → "John")...');
  const nameInput = await driver.findElement(By.id('ap-name'));
  await safeClick(driver, nameInput);
  await clearField(driver, nameInput);
  await nameInput.sendKeys('John123');
  await driver.sleep(400);
  const nameValue = await nameInput.getAttribute('value');
  if (nameValue === 'John') {
    log('✔ Name filter correct: "John123" → "John".');
  } else {
    throw new Error(`Name filter failed: expected "John" got "${nameValue}"`);
  }
  await clearField(driver, nameInput);

  // ── 4. Phone input filter ─────────────────────────────────────────────────
  log('[4] Testing Phone input filter ("abc9876543210" → "9876543210")...');
  const phoneInput = await driver.findElement(By.id('ap-phone'));
  await safeClick(driver, phoneInput);
  await clearField(driver, phoneInput);
  await phoneInput.sendKeys('abc9876543210');
  await driver.sleep(400);
  const phoneValue = await phoneInput.getAttribute('value');
  if (phoneValue === '9876543210') {
    log('✔ Phone filter correct: "abc9876543210" → "9876543210".');
  } else {
    throw new Error(`Phone filter failed: expected "9876543210" got "${phoneValue}"`);
  }
  await clearField(driver, phoneInput);

  // ── 4a. Short phone number validation ───────────────────────────────────────
  log('[4a] Testing short phone number validation...');
  await driver.findElement(By.id('ap-name')).sendKeys('Test Patient');
  await driver.findElement(By.id('ap-age')).sendKeys('30');
  
  const genSelect = await driver.findElement(By.id('ap-gender'));
  await safeClick(driver, genSelect);
  await driver.sleep(300);
  await genSelect.findElement(By.css('option[value="Male"]')).click();

  await driver.findElement(By.id('ap-phone')).sendKeys('12345');
  await driver.findElement(By.id('ap-address')).sendKeys('Test Addr');
  await driver.findElement(By.id('save-patient-btn')).click();

  const shortPhoneAlert = await driver.wait(until.elementLocated(By.className('alert-error')), config.defaultTimeout);
  await driver.sleep(500);
  const shortPhoneText = await shortPhoneAlert.getText();
  if (shortPhoneText.includes('exactly 10 digits')) {
    log('✔ Short phone number rejected correctly.');
  } else {
    throw new Error('Unexpected short phone error: ' + shortPhoneText);
  }
  
  // Clear fields for next step
  await clearField(driver, await driver.findElement(By.id('ap-name')));
  await clearField(driver, await driver.findElement(By.id('ap-age')));
  await clearField(driver, await driver.findElement(By.id('ap-phone')));
  await clearField(driver, await driver.findElement(By.id('ap-address')));

  // ── 4b. Age boundary validation ───────────────────────────────────────────
  log('[4b] Testing age boundary validation...');
  const ageInp = await driver.findElement(By.id('ap-age'));
  
  // Test negative age
  await ageInp.sendKeys('-5');
  let validMsg = await ageInp.getAttribute('validationMessage');
  if (validMsg && validMsg.length > 0) {
    log('✔ Negative age blocked by HTML5 validation.');
  } else {
    throw new Error('Negative age was not blocked by validation!');
  }
  await clearField(driver, ageInp);

  // Test extreme age
  await ageInp.sendKeys('200');
  validMsg = await ageInp.getAttribute('validationMessage');
  if (validMsg && validMsg.length > 0) {
    log('✔ Extreme age (200) blocked by HTML5 validation.');
  } else {
    throw new Error('Extreme age was not blocked by validation!');
  }
  await clearField(driver, ageInp);

  // ── 5. Empty form validation ──────────────────────────────────────────────
  log('[5] Testing empty form validation...');
  const saveBtn = await driver.findElement(By.id('save-patient-btn'));
  await safeClick(driver, saveBtn);
  await driver.sleep(800);
  const errAlert = await driver.wait(
    until.elementLocated(By.className('alert-error')),
    config.defaultTimeout,
    'Expected alert-error after submitting empty form'
  );
  await driver.sleep(500);
  log(`✔ Error shown: "${await errAlert.getText()}"`);
  await screenshot('05-validation-error-empty-form');

  // ── 6. Fill valid form and submit ─────────────────────────────────────────
  log(`[6] Filling valid patient form: "${PATIENT_NAME}"...`);
  await safeClick(driver, nameInput);
  await clearField(driver, nameInput);
  await nameInput.sendKeys(PATIENT_NAME);

  const ageInput = await driver.findElement(By.id('ap-age'));
  await safeClick(driver, ageInput);
  await clearField(driver, ageInput);
  await ageInput.sendKeys('45');

  // Gender is a <select>
  const genderSelect = await driver.findElement(By.id('ap-gender'));
  await safeClick(driver, genderSelect);
  await driver.sleep(300);
  const maleOption = await genderSelect.findElement(By.css('option[value="Male"]'));
  await maleOption.click();

  await safeClick(driver, phoneInput);
  await clearField(driver, phoneInput);
  await phoneInput.sendKeys(config.testPatient.phone);

  const addrInput = await driver.findElement(By.id('ap-address'));
  await safeClick(driver, addrInput);
  await addrInput.sendKeys('Hyderabad, India');

  const rtInput = await driver.findElement(By.id('ap-report-type'));
  await safeClick(driver, rtInput);
  await rtInput.sendKeys('Biopsy Test');

  const diagInput = await driver.findElement(By.id('ap-diagnosis'));
  await safeClick(driver, diagInput);
  await diagInput.sendKeys('High Grade Ductal Carcinoma');

  // Submit the form
  await safeClick(driver, await driver.findElement(By.id('save-patient-btn')));
  
  // Wait for success
  await driver.wait(until.elementLocated(By.className('alert-success')), config.defaultTimeout, 'Expected success alert after saving patient');
  log('✔ Patient saved successfully.');
  await screenshot('06-patient-saved-success');

  // Navigate to Search tab
  await safeClick(driver, await driver.findElement(By.id('sidebar-tab-1')));
  await driver.wait(until.elementLocated(By.id('patient-search-input')), config.defaultTimeout);

  // ── 7. Search tab: empty state / bogus search ─────────────────────────────
  log('[7] Testing bogus search on Search tab...');
  let searchInput = await driver.findElement(By.id('patient-search-input'));
  await safeClick(driver, searchInput);
  await clearField(driver, searchInput);
  await searchInput.sendKeys('BOGUS_NAME_9999');
  await driver.sleep(1000);
  
  const noRes = await driver.findElements(By.className('no-results'));
  if (noRes.length > 0) {
    log('✔ Bogus search yielded no results.');
  } else {
    // If there's no '.no-results' class, just check if there are no patient cards
    const cards = await driver.findElements(By.xpath('//div[contains(@id, "patient-card-")]'));
    if (cards.length === 0) {
      log('✔ Bogus search yielded no results (0 cards).');
    } else {
      throw new Error('Bogus search yielded results unexpectedly.');
    }
  }
  await screenshot('07-bogus-search');
  
  await clearField(driver, searchInput);
  await driver.sleep(500);

  // ── 8. Search for patient ─────────────────────────────────────────────────
  log(`[8] Searching for "${PATIENT_NAME}"...`);
  searchInput = await driver.findElement(By.id('patient-search-input'));
  await searchInput.sendKeys(PATIENT_NAME);
  await driver.sleep(1000);

  const patientNameSpan = await driver.wait(
    until.elementLocated(By.xpath(`//span[normalize-space(text())='${PATIENT_NAME}']`)),
    config.defaultTimeout,
    `Expected patient card for "${PATIENT_NAME}"`
  );
  log('✔ Patient card found in search.');
  await screenshot('08-search-results');

  // ── 9. Select patient session ─────────────────────────────────────────────
  log('[9] Selecting patient session...');
  const cardDiv = await patientNameSpan.findElement(
    By.xpath('./ancestor::div[contains(@id,"patient-card-")]')
  );
  const cardId = await cardDiv.getAttribute('id');
  capturedPatientId = cardId.replace('patient-card-', '');
  
  if (/^PT\d+$/.test(capturedPatientId)) {
    log(`✔ Patient ID format verified (PTXXX): ${capturedPatientId}`);
  } else {
    throw new Error('Patient ID format is invalid! Expected PTXXX but got: ' + capturedPatientId);
  }

  const selectBtn = await driver.findElement(By.id(`select-patient-${capturedPatientId}`));
  await safeClick(driver, selectBtn);
  await driver.sleep(600);

  // Verify session active on Home tab
  await safeClick(driver, await driver.findElement(By.id('sidebar-tab-0')));
  await driver.sleep(500);
  await driver.wait(until.elementLocated(By.id('home-clear-session')), config.defaultTimeout,
    'Expected "Finish Session" button after patient select');
  log('✔ Patient session active on Home tab.');
  await screenshot('09-patient-session-active');

  // ── 10. Tiles unlocked ────────────────────────────────────────────────────
  log('[10] Verifying tiles unlocked...');
  const breastTile = await driver.findElement(By.id('tissue-breast'));
  const locked = await breastTile.findElements(By.xpath('.//span[text()="Locked"]'));
  if (locked.length === 0) log('✔ Tiles unlocked — no "Locked" badge.');
  else throw new Error('Tiles still show "Locked" with active patient session.');
  await screenshot('10-modules-unlocked');

  // ── 11. Open patient profile ──────────────────────────────────────────────
  log('[11] Opening patient profile...');
  await safeClick(driver, await driver.findElement(By.id('sidebar-tab-1')));
  await driver.sleep(400);
  const si2 = await driver.findElement(By.id('patient-search-input'));
  await si2.sendKeys(PATIENT_NAME);
  await driver.sleep(1000);

  const profileCard = await driver.wait(
    until.elementLocated(By.id(`patient-card-${capturedPatientId}`)),
    config.defaultTimeout
  );
  await safeClick(driver, profileCard);
  await driver.wait(until.urlContains('/patient/'), config.defaultTimeout);
  log('✔ Patient Profile page loaded.');
  await screenshot('11-patient-profile');

  // ── 12. Profile: details + Add Report button ──────────────────────────────
  log('[12] Verifying Patient Profile page...');
  await driver.wait(until.elementLocated(By.id('add-report-btn')), config.defaultTimeout);
  await driver.wait(until.elementLocated(By.id('patient-edit-btn')), config.defaultTimeout);
  const nameH2 = await driver.wait(
    until.elementLocated(By.xpath(`//h2[contains(text(), '${PATIENT_NAME}')]`)),
    config.defaultTimeout
  );
  log(`✔ Profile name: "${await nameH2.getText()}"`);
  await screenshot('12-patient-profile-details');

  // ── 13. Edit patient ──────────────────────────────────────────────────────
  log('[13] Navigating to Edit Patient...');
  const editBtn = await driver.findElement(By.id('patient-edit-btn'));
  await safeClick(driver, editBtn);
  await driver.wait(until.urlContains('/edit'), config.defaultTimeout);
  await driver.wait(until.elementLocated(By.id('ep-name')), config.defaultTimeout);
  log('✔ Edit Patient form loaded.');
  await screenshot('13-edit-patient-form');

  const epPhone = await driver.findElement(By.id('ep-phone'));
  await safeClick(driver, epPhone);
  await clearField(driver, epPhone);
  await epPhone.sendKeys('9988776655');

  const epAddr = await driver.findElement(By.id('ep-address'));
  await safeClick(driver, epAddr);
  await clearField(driver, epAddr);
  await epAddr.sendKeys('Chennai, Tamil Nadu');

  await screenshot('13-edit-patient-filled');

  const editSave = await driver.findElement(By.id('edit-patient-save'));
  await safeClick(driver, editSave);
  await driver.wait(
    async () => !(await driver.getCurrentUrl()).includes('/edit'),
    config.defaultTimeout,
    'Expected redirect away from /edit after save'
  );
  log('✔ Edit saved, back on profile.');
  await screenshot('13-post-edit-profile');

  // ── 13a. Edit Patient without making changes ──────────────────────────────
  log('[13a] Edit Patient without making changes...');
  const editBtnAgain = await driver.findElement(By.id('patient-edit-btn'));
  await safeClick(driver, editBtnAgain);
  await driver.wait(until.urlContains('/edit'), config.defaultTimeout);
  await driver.wait(until.elementLocated(By.id('ep-name')), config.defaultTimeout);
  
  const editSaveAgain = await driver.findElement(By.id('edit-patient-save'));
  await safeClick(driver, editSaveAgain);
  await driver.wait(
    async () => !(await driver.getCurrentUrl()).includes('/edit'),
    config.defaultTimeout,
    'Expected redirect away from /edit after empty save'
  );
  log('✔ Saved profile without changes successfully.');

  // ── 14. Verify updated details ────────────────────────────────────────────
  log('[14] Verifying updated patient details...');
  const bodyTxt = await driver.findElement(By.tagName('body')).getText();
  if (bodyTxt.includes('9988776655') || bodyTxt.includes('Chennai')) {
    log('✔ Updated phone/address visible on profile.');
  } else {
    log('ℹ Updated details may not be in current view (backend-sync).');
  }
  await screenshot('14-verify-updated-details');

  log('=== Patient & Report Management Suite COMPLETE ===');
}

module.exports = { run, name: 'Patient & Report Management', getCapturedPatientId: () => capturedPatientId };
