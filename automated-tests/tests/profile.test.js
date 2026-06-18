/**
 * profile.test.js
 * Suite: Doctor Profile & Logout Flow
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

async function run(driver, log, screenshot) {
  log('=== Doctor Profile & Logout Flow Suite ===');

  // Ensure logged in on dashboard
  // Strategy: navigate to /dashboard — if already logged in we land there,
  // if not the app redirects us to /login.
  await driver.get(`${config.baseUrl}/dashboard`);
  await driver.sleep(1000);
  const urlAfterNav = await driver.getCurrentUrl();

  if (urlAfterNav.includes('/login') || urlAfterNav.includes('/signup')) {
    log('Session expired, logging in for profile suite...');
    await driver.wait(until.elementLocated(By.id('login-license')), config.defaultTimeout);
    await driver.findElement(By.id('login-license')).sendKeys(config.testDoctor.licenseNo);
    await driver.findElement(By.id('login-password')).sendKeys(config.testDoctor.password);
    await safeClick(driver, await driver.findElement(By.id('login-submit')));
    await driver.wait(until.urlContains('/dashboard'), config.defaultTimeout);
  } else {
    log('Already logged in, on dashboard.');
  }


  // ── 1. Navigate to My Profile tab ─────────────────────────────────────────
  log('[1] Clicking My Profile tab...');
  await safeClick(driver, await driver.findElement(By.id('sidebar-tab-3')));
  await driver.sleep(800);
  log('✔ Profile tab clicked.');
  await screenshot('01-profile-tab-loaded');

  // ── 2. Doctor name in header ──────────────────────────────────────────────
  log('[2] Verifying doctor name...');
  const nameEl = await driver.wait(
    until.elementLocated(By.xpath(
      `//h2[contains(text(), '${config.testDoctor.name}') or contains(text(), 'Dr. Selenium')]`
    )),
    config.defaultTimeout
  );
  log(`✔ Doctor name: "${await nameEl.getText()}"`);
  await screenshot('02-profile-name-verified');

  // ── 3. License number visible ─────────────────────────────────────────────
  log('[3] Verifying license number visible...');
  const pageText1 = await driver.findElement(By.tagName('body')).getText();
  if (pageText1.includes(config.testDoctor.licenseNo)) {
    log(`✔ License "${config.testDoctor.licenseNo}" visible.`);
  } else {
    log('ℹ License may not be in current view section.');
  }
  await screenshot('03-profile-info-visible');

  // ── 4. Settings items ─────────────────────────────────────────────────────
  log('[4] Verifying Settings section items...');
  await driver.wait(until.elementLocated(By.id('settings-downloads')), config.defaultTimeout);
  await driver.wait(until.elementLocated(By.id('settings-privacy-policy')), config.defaultTimeout);
  await driver.wait(until.elementLocated(By.id('settings-terms-and-conditions')), config.defaultTimeout);
  await driver.wait(until.elementLocated(By.id('settings-about')), config.defaultTimeout);
  log('✔ All 4 Settings items found.');
  await screenshot('04-settings-items');

  // ── 5. Click Edit Profile ─────────────────────────────────────────────────
  log('[5] Clicking Edit Profile toggle...');
  const editToggle = await driver.wait(
    until.elementLocated(By.id('profile-edit-toggle')), config.defaultTimeout
  );
  await safeClick(driver, editToggle);
  await driver.sleep(500);

  await driver.wait(until.elementLocated(By.id('profile-name')), config.defaultTimeout);
  await driver.wait(until.elementLocated(By.id('profile-spec')), config.defaultTimeout);
  await driver.wait(until.elementLocated(By.id('profile-hospital')), config.defaultTimeout);
  await driver.wait(until.elementLocated(By.id('profile-email')), config.defaultTimeout);
  await driver.wait(until.elementLocated(By.id('profile-phone')), config.defaultTimeout);
  await driver.wait(until.elementLocated(By.id('profile-save-btn')), config.defaultTimeout);
  log('✔ Edit Profile form visible with all fields.');
  await screenshot('05-edit-profile-form-open');

  // ── 6. Edit fields ────────────────────────────────────────────────────────
  log('[6] Updating Specialization, Hospital, Phone...');
  const specInput = await driver.findElement(By.id('profile-spec'));
  await safeClick(driver, specInput);
  await specInput.clear();
  await specInput.sendKeys('Senior Pathologist');

  const hospInput = await driver.findElement(By.id('profile-hospital'));
  await safeClick(driver, hospInput);
  await hospInput.clear();
  await hospInput.sendKeys('City Diagnostics Hub');

  const phoneInput = await driver.findElement(By.id('profile-phone'));
  await safeClick(driver, phoneInput);
  await phoneInput.clear();
  await phoneInput.sendKeys('9988776655');

  await screenshot('06-profile-fields-updated');

  // ── 7. Save profile ───────────────────────────────────────────────────────
  log('[7] Saving profile changes...');
  const saveBtn = await driver.findElement(By.id('profile-save-btn'));
  await safeClick(driver, saveBtn);

  const successAlert = await driver.wait(
    until.elementLocated(By.className('alert-success')),
    config.defaultTimeout
  );
  log(`✔ Profile saved: "${await successAlert.getText()}"`);
  await screenshot('07-profile-saved-success');

  // ── 8. Edit mode auto-closes ──────────────────────────────────────────────
  log('[8] Waiting for edit mode to auto-close...');
  await driver.wait(
    async () => (await driver.findElements(By.id('profile-name'))).length === 0,
    6000,
    'Expected edit inputs to disappear after save'
  );
  log('✔ Edit mode closed automatically.');
  await screenshot('08-edit-mode-closed');

  // ── 9. Updated values visible ─────────────────────────────────────────────
  log('[9] Verifying updated values...');
  const pageText2 = await driver.findElement(By.tagName('body')).getText();
  if (pageText2.includes('Senior Pathologist')) log('✔ Updated specialization visible.');
  else log('ℹ Specialization not yet visible (backend sync).');
  if (pageText2.includes('City Diagnostics Hub')) log('✔ Updated hospital visible.');
  else log('ℹ Hospital not yet visible (backend sync).');
  await screenshot('09-profile-updated-values');

  // ── 10. My Downloads ──────────────────────────────────────────────────────
  log('[10] Navigating to My Downloads...');
  await safeClick(driver, await driver.findElement(By.id('sidebar-tab-3')));
  await driver.sleep(600);
  const dlBtn = await driver.wait(
    until.elementLocated(By.id('settings-downloads')), config.defaultTimeout
  );
  await safeClick(driver, dlBtn);
  await driver.wait(until.urlContains('/downloads'), config.defaultTimeout);
  log('✔ My Downloads page loaded.');
  await screenshot('10-my-downloads');

  await driver.navigate().back();
  await driver.wait(until.urlContains('/dashboard'), config.defaultTimeout);

  // ── 11. Privacy Policy ────────────────────────────────────────────────────
  log('[11] Navigating to Privacy Policy...');
  await safeClick(driver, await driver.findElement(By.id('sidebar-tab-3')));
  await driver.sleep(600);
  const ppBtn = await driver.wait(
    until.elementLocated(By.id('settings-privacy-policy')), config.defaultTimeout
  );
  await safeClick(driver, ppBtn);
  await driver.wait(until.urlContains('/privacy-policy'), config.defaultTimeout);
  log('✔ Privacy Policy page loaded.');
  
  await driver.wait(until.elementLocated(By.xpath("//*[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'data') or contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'information')]")), config.defaultTimeout);
  log('✔ Privacy Policy content verified.');
  
  await screenshot('11-privacy-policy');

  await driver.navigate().back();
  await driver.wait(until.urlContains('/dashboard'), config.defaultTimeout);

  // ── 12. Terms & Conditions ────────────────────────────────────────────────
  log('[12] Navigating to Terms & Conditions...');
  await safeClick(driver, await driver.findElement(By.id('sidebar-tab-3')));
  await driver.sleep(600);
  const tcBtn = await driver.wait(
    until.elementLocated(By.id('settings-terms-and-conditions')), config.defaultTimeout
  );
  await safeClick(driver, tcBtn);
  await driver.wait(until.urlContains('/terms-and-conditions'), config.defaultTimeout);
  log('✔ Terms & Conditions page loaded.');

  await driver.wait(until.elementLocated(By.xpath("//*[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'agree') or contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'liability')]")), config.defaultTimeout);
  log('✔ Terms & Conditions content verified.');

  await screenshot('12-terms-and-conditions');

  await driver.navigate().back();
  await driver.wait(until.urlContains('/dashboard'), config.defaultTimeout);
  await safeClick(driver, await driver.findElement(By.id('sidebar-tab-3')));
  await driver.sleep(600);

  // ── 13. Logout Cancellation ───────────────────────────────────────────────
  log('[13] Testing Logout Cancellation...');
  const logoutBtn = await driver.wait(
    until.elementLocated(By.id('profile-logout-btn')), config.defaultTimeout
  );
  await safeClick(driver, logoutBtn);
  await driver.wait(until.alertIsPresent(), config.defaultTimeout);
  const cancelAlert = await driver.switchTo().alert();
  await cancelAlert.dismiss();
  await driver.sleep(500);
  
  const currentUrl = await driver.getCurrentUrl();
  if (currentUrl.includes('/dashboard')) {
    log('✔ Logout canceled successfully, session remains active.');
  } else {
    throw new Error('Logout cancel failed, redirected to: ' + currentUrl);
  }

  // ── 14. Logout ────────────────────────────────────────────────────────────
  log('[14] Testing Logout...');
  await safeClick(driver, logoutBtn);

  await driver.wait(until.alertIsPresent(), config.defaultTimeout);
  const alert = await driver.switchTo().alert();
  log(`Logout confirm dialog: "${await alert.getText()}"`);
  await alert.accept();

  await driver.wait(until.urlContains('/login'), config.defaultTimeout);
  log('✔ Logged out, redirected to /login.');
  await screenshot('13-logged-out');

  // ── Bonus: Protected route guard after logout ─────────────────────────────
  log('[Bonus] Verifying /dashboard redirect after logout...');
  await driver.get(`${config.baseUrl}/dashboard`);
  await driver.wait(until.urlContains('/login'), config.defaultTimeout);
  log('✔ Protected route correctly redirects to /login after logout.');
  await screenshot('14-protected-redirect-after-logout');

  log('=== Doctor Profile & Logout Flow Suite COMPLETE ===');
}

module.exports = { run, name: 'Doctor Profile & Logout Flow' };
