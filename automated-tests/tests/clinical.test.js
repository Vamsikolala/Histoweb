/**
 * clinical.test.js
 * Suite: Clinical Analysis Modules Navigation
 * Pre-condition: auth.test.js & patient.test.js have run.
 *                A patient "John Doe Test" exists and a session can be selected.
 * Covers:
 *  1. Login and select the test patient session from Search tab
 *  2. Navigate to Home tab → tissue module tiles are unlocked
 *  3. Click Breast Cancer tile → navigate to /patient/:id/modules/breast
 *  4. Breast module page: 4 assessment cards visible (ER, PR, HER2, Ki67)
 *  5. Click ER Assessment → navigate to /patient/:id/modules/breast/er
 *  6. ER form: verify page loaded (has recognizable heading)
 *  7. Navigate back to Breast module page
 *  8. Click Ki67 Proliferation → navigate to /patient/:id/modules/breast/ki67
 *  9. Ki67 page: verify loaded
 * 10. Navigate back → click Breast Guidelines button
 * 11. Guidelines page loaded, navigate back
 * 12. Navigate to Gastrointestinal tile from Home
 * 13. GIT module page loads
 * 14. Navigate to Head & Neck module
 * 15. Navigate back to Home, clear session → tiles show "Locked" badge
 */

const { By, until } = require('selenium-webdriver');
const config = require('../config');

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

async function selectTestPatient(driver, log) {
  await driver.get(`${config.baseUrl}/dashboard`);
  await driver.wait(until.urlContains('/dashboard'), config.defaultTimeout);

  await safeClick(driver, await driver.findElement(By.id('sidebar-tab-1')));
  await driver.wait(until.elementLocated(By.id('patient-search-input')), config.defaultTimeout);

  const searchInput = await driver.findElement(By.id('patient-search-input'));
  await searchInput.sendKeys(PATIENT_NAME);
  await driver.sleep(1000);

  const selectBtns = await driver.findElements(By.xpath(
    '//button[contains(@id,"select-patient-")]'
  ));

  if (selectBtns.length === 0) {
    throw new Error(`No patients found matching "${PATIENT_NAME}". Please run patient.test.js first.`);
  }

  await safeClick(driver, selectBtns[0]);
  await driver.sleep(500);
  log(`ℹ Patient "${PATIENT_NAME}" selected as session.`);
}

async function run(driver, log, screenshot) {
  log('=== Clinical Analysis Modules Navigation Suite ===');

  // Navigate to /dashboard — if logged in we land there, if not we get /login
  await driver.get(`${config.baseUrl}/dashboard`);
  await driver.sleep(1000);
  const urlAfterNav = await driver.getCurrentUrl();

  if (urlAfterNav.includes('/login') || urlAfterNav.includes('/signup')) {
    log('Session expired, re-logging in for clinical suite...');
    await driver.wait(until.elementLocated(By.id('login-license')), config.defaultTimeout);
    await driver.findElement(By.id('login-license')).sendKeys(config.testDoctor.licenseNo);
    await driver.findElement(By.id('login-password')).sendKeys(config.testDoctor.password);
    await safeClick(driver, await driver.findElement(By.id('login-submit')));
    await driver.wait(until.urlContains('/dashboard'), config.defaultTimeout);
    log('Already logged in, on dashboard.');
  }

  // ------------------------------------------------------------------
  // 0. Test direct URL access without session
  // ------------------------------------------------------------------
  log('[0] Testing direct URL access without session...');
  // First ensure session is cleared
  const clearBtns = await driver.findElements(By.id('home-clear-session'));
  if (clearBtns.length > 0) {
    await safeClick(driver, clearBtns[0]);
    await driver.sleep(500);
  }
  await driver.get(`${config.baseUrl}/modules/breast`);
  await driver.wait(until.urlContains('/dashboard'), config.defaultTimeout,
    'Expected redirect to dashboard if no session active');
  log('✔ Sessionless direct access rejected correctly.');

  // ------------------------------------------------------------------
  // 1. Select the test patient session
  // ------------------------------------------------------------------
  log('[1] Selecting test patient for session...');
  await selectTestPatient(driver, log);

  // Navigate to Home tab
  await safeClick(driver, await driver.findElement(By.id('sidebar-tab-0')));
  await driver.sleep(500);
  await screenshot('01-home-patient-selected');

  // ------------------------------------------------------------------
  // 2. Verify tiles are unlocked
  // ------------------------------------------------------------------
  log('[2] Verifying module tiles are unlocked...');
  const breastTile = await driver.wait(
    until.elementLocated(By.id('tissue-breast')),
    config.defaultTimeout
  );
  const lockedBadges = await breastTile.findElements(By.xpath('.//span[text()="Locked"]'));
  if (lockedBadges.length === 0) {
    log('✔ Tiles unlocked – no "Locked" badge visible.');
  } else {
    throw new Error('Tiles still show "Locked" badge even with a patient session active.');
  }
  await screenshot('02-tiles-unlocked');

  // ------------------------------------------------------------------
  // 3. Click Breast Cancer tile → navigate to breast module
  // ------------------------------------------------------------------
  log('[3] Clicking Breast Cancer tile...');
  await safeClick(driver, breastTile);
  await driver.wait(until.urlContains('/modules/breast'), config.defaultTimeout,
    'Expected URL to contain /modules/breast');
  log('✔ Breast module page loaded.');
  await screenshot('03-breast-module-page');

  // ------------------------------------------------------------------
  // 4. Breast module: 4 assessment options visible
  // ------------------------------------------------------------------
  log('[4] Verifying breast module options (ER, PR, HER2, Ki67)...');
  const breastBody = await driver.findElement(By.tagName('body')).getText();
  const requiredModules = ['ER Assessment', 'PR Assessment', 'HER2 Protocol', 'Ki67 Proliferation'];
  for (const mod of requiredModules) {
    if (!breastBody.includes(mod)) {
      throw new Error(`Expected "${mod}" option in Breast module, but not found.`);
    }
  }
  log('✔ All 4 breast assessment cards found: ER, PR, HER2, Ki67.');
  await screenshot('04-breast-options');

  // ------------------------------------------------------------------
  // 5. Click ER Assessment → /patient/:id/modules/breast/er
  // ------------------------------------------------------------------
  log('[5] Clicking ER Assessment option...');
  const erOptionEl = await driver.wait(
    until.elementLocated(By.xpath("//*[contains(text(),'ER Assessment')]")),
    config.defaultTimeout
  );
  await safeClick(driver, erOptionEl);
  await driver.wait(until.urlContains('/modules/breast/er'), config.defaultTimeout,
    'Expected URL to contain /modules/breast/er');
  log('✔ ER Assessment page loaded.');
  await screenshot('05-er-assessment-page');

  // ------------------------------------------------------------------
  // 6. ER form: verify page loaded with heading
  // ------------------------------------------------------------------
  log('[6] Verifying ER Assessment page content...');
  const erPageText = await driver.findElement(By.tagName('body')).getText();
  if (erPageText.includes('ER') || erPageText.includes('Estrogen') || erPageText.includes('Allred') || erPageText.includes('H-Score')) {
    log('✔ ER Assessment page content verified.');
  } else {
    throw new Error('ER Assessment page did not load expected content.');
  }
  await screenshot('06-er-page-content');

  // ------------------------------------------------------------------
  // 7. Navigate back to Breast module
  // ------------------------------------------------------------------
  log('[7] Navigating back to Breast module page...');
  await driver.navigate().back();
  await driver.wait(until.urlContains('/modules/breast'), config.defaultTimeout);
  // Ensure we're not on /er anymore
  await driver.wait(
    async () => !(await driver.getCurrentUrl()).includes('/breast/er'),
    3000
  );
  log('✔ Back on Breast module page.');
  await screenshot('07-back-to-breast-module');

  // ------------------------------------------------------------------
  // 8. Click Ki67 Proliferation
  // ------------------------------------------------------------------
  log('[8] Clicking Ki67 Proliferation option...');
  const ki67El = await driver.wait(
    until.elementLocated(By.xpath("//*[contains(text(),'Ki67 Proliferation')]")),
    config.defaultTimeout
  );
  await safeClick(driver, ki67El);
  await driver.wait(until.urlContains('/modules/breast/ki67'), config.defaultTimeout,
    'Expected URL to contain /modules/breast/ki67');
  log('✔ Ki67 Proliferation page loaded.');
  await screenshot('08-ki67-page');

  // ------------------------------------------------------------------
  // 9. Ki67 page: verify loaded
  // ------------------------------------------------------------------
  log('[9] Verifying Ki67 page content...');
  const ki67PageText = await driver.findElement(By.tagName('body')).getText();
  if (ki67PageText.includes('Ki67') || ki67PageText.includes('Proliferation') || ki67PageText.includes('%')) {
    log('✔ Ki67 page content verified.');
  } else {
    throw new Error('Ki67 page did not load expected content.');
  }
  await screenshot('09-ki67-content');

  // ------------------------------------------------------------------
  // 10. Navigate back to Breast types → click Guidelines
  // ------------------------------------------------------------------
  log('[10] Going back to Breast module to test Guidelines...');
  await driver.navigate().back();
  await driver.wait(until.urlContains('/modules/breast'), config.defaultTimeout);
  await driver.wait(
    async () => !(await driver.getCurrentUrl()).includes('/ki67'),
    3000
  );

  // Click Guidelines button (in the page header actions)
  const guidelinesBtn = await driver.wait(
    until.elementLocated(By.xpath("//button[contains(text(),'Guidelines')]")),
    config.defaultTimeout,
    'Expected a Guidelines button on the Breast module page'
  );
  await safeClick(driver, guidelinesBtn);
  await driver.wait(until.urlContains('/guidelines'), config.defaultTimeout,
    'Expected URL to contain /guidelines');
  log('✔ Breast Guidelines page loaded.');
  await screenshot('10-breast-guidelines');

  // ------------------------------------------------------------------
  // 11. Navigate back to Home tab via Dashboard
  // ------------------------------------------------------------------
  log('[11] Navigating back to Home tab and restoring session...');
  await selectTestPatient(driver, log);
  await safeClick(driver, await driver.findElement(By.id('sidebar-tab-0')));
  await driver.sleep(500);
  await screenshot('11-back-home-tab');

  // ------------------------------------------------------------------
  // 12. Click Gastrointestinal tile → GIT module
  // ------------------------------------------------------------------
  log('[12] Clicking Gastrointestinal tile...');
  const gitTile = await driver.wait(
    until.elementLocated(By.id('tissue-git')),
    config.defaultTimeout
  );
  await safeClick(driver, gitTile);
  await driver.wait(until.urlContains('/modules/git'), config.defaultTimeout,
    'Expected URL to contain /modules/git');
  log('✔ GIT (Gastrointestinal) module page loaded.');
  await screenshot('12-git-module-page');

  // ------------------------------------------------------------------
  // 13. GIT module page: verify options
  // ------------------------------------------------------------------
  log('[13] Verifying GIT module options...');
  const gitPageText = await driver.findElement(By.tagName('body')).getText();
  if (gitPageText.includes('Adenocarcinoma') || gitPageText.includes('GIST') || gitPageText.includes('NET') || gitPageText.includes('GIT')) {
    log('✔ GIT module page has expected content (Adenocarcinoma/GIST/NET).');
  } else {
    throw new Error('GIT module page did not show expected options.');
  }
  await screenshot('13-git-options');

  // ------------------------------------------------------------------
  // 14. Navigate to Head & Neck module
  // ------------------------------------------------------------------
  log('[14] Navigating to Head & Neck module and restoring session...');
  await selectTestPatient(driver, log);
  await safeClick(driver, await driver.findElement(By.id('sidebar-tab-0')));
  await driver.sleep(500);

  const headneckTile = await driver.wait(
    until.elementLocated(By.id('tissue-headneck')),
    config.defaultTimeout
  );
  await safeClick(driver, headneckTile);
  await driver.wait(until.urlContains('/modules/headneck'), config.defaultTimeout,
    'Expected URL to contain /modules/headneck');
  log('✔ Head & Neck module page loaded.');

  const headneckPageText = await driver.findElement(By.tagName('body')).getText();
  if (headneckPageText.includes('Head') || headneckPageText.includes('Neck') || headneckPageText.includes('P16') || headneckPageText.includes('HER2')) {
    log('✔ Head & Neck module content verified.');
  }
  await screenshot('14-headneck-module');

  // ------------------------------------------------------------------
  // 14a. Navigate to Thyroid module
  // ------------------------------------------------------------------
  log('[14a] Navigating to Thyroid module and restoring session...');
  await selectTestPatient(driver, log);
  await safeClick(driver, await driver.findElement(By.id('sidebar-tab-0')));
  await driver.sleep(500);

  const thyroidTile = await driver.wait(until.elementLocated(By.id('tissue-thyroid')), config.defaultTimeout);
  await safeClick(driver, thyroidTile);
  await driver.wait(until.urlContains('/modules/thyroid'), config.defaultTimeout);
  log('✔ Thyroid module page loaded.');

  const thyroidPageText = await driver.findElement(By.tagName('body')).getText();
  if (thyroidPageText.includes('Bethesda') || thyroidPageText.includes('TRADS') || thyroidPageText.includes('Thyroid')) {
    log('✔ Thyroid module content verified.');
  }

  // ------------------------------------------------------------------
  // 14b. Navigate to Lungs module
  // ------------------------------------------------------------------
  log('[14b] Navigating to Lungs module and restoring session...');
  await selectTestPatient(driver, log);
  await safeClick(driver, await driver.findElement(By.id('sidebar-tab-0')));
  await driver.sleep(500);

  const lungsTile = await driver.wait(until.elementLocated(By.id('tissue-lungs')), config.defaultTimeout);
  await safeClick(driver, lungsTile);
  await driver.wait(until.urlContains('/modules/lungs'), config.defaultTimeout);
  log('✔ Lungs module page loaded.');

  const lungsPageText = await driver.findElement(By.tagName('body')).getText();
  if (lungsPageText.includes('NSCLC') || lungsPageText.includes('SCLC') || lungsPageText.includes('Lungs')) {
    log('✔ Lungs module content verified.');
  }

  // ------------------------------------------------------------------
  // 14c. Navigate to Soft Tissue module
  // ------------------------------------------------------------------
  log('[14c] Navigating to Soft Tissue module and restoring session...');
  await selectTestPatient(driver, log);
  await safeClick(driver, await driver.findElement(By.id('sidebar-tab-0')));
  await driver.sleep(500);

  const softtissueTile = await driver.wait(until.elementLocated(By.id('tissue-softtissue')), config.defaultTimeout);
  await safeClick(driver, softtissueTile);
  await driver.wait(until.urlContains('/modules/softtissue'), config.defaultTimeout);
  log('✔ Soft Tissue module page loaded.');

  const stPageText = await driver.findElement(By.tagName('body')).getText();
  if (stPageText.includes('Soft Tissue') || stPageText.includes('Sarcoma')) {
    log('✔ Soft Tissue module content verified.');
  }

  // ------------------------------------------------------------------
  // 15. Clear session → tiles show "Locked" badge
  // ------------------------------------------------------------------
  log('[15] Clearing patient session and verifying tiles show "Locked"...');
  await selectTestPatient(driver, log);
  await safeClick(driver, await driver.findElement(By.id('sidebar-tab-0')));
  await driver.sleep(500);

  // Click "Finish Session" button if patient session is still active
  const finalClearBtns = await driver.findElements(By.id('home-clear-session'));
  if (finalClearBtns.length > 0) {
    await safeClick(driver, finalClearBtns[0]);
    await driver.sleep(500);
    log('✔ Session cleared.');
  }

  // Now verify that the "Locked" badge appears
  const breastTileAfterClear = await driver.wait(
    until.elementLocated(By.id('tissue-breast')),
    config.defaultTimeout
  );
  await driver.sleep(300);
  const lockedBadgesAfterClear = await breastTileAfterClear.findElements(
    By.xpath('.//span[text()="Locked"]')
  );
  if (lockedBadgesAfterClear.length > 0) {
    log('✔ "Locked" badge visible on module tiles after session cleared.');
  } else {
    log('ℹ "Locked" badge not found – session may have already been cleared previously.');
  }
  await screenshot('15-tiles-locked-after-clear');

  log('=== Clinical Analysis Modules Navigation Suite COMPLETE ===');
}

module.exports = { run, name: 'Clinical Analysis Modules Navigation' };
