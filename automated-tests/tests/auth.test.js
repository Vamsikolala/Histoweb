/**
 * auth.test.js
 * Suite: Authentication Flow
 * Covers:
 *  1. Unauthenticated redirect from / and /dashboard → /login
 *  2. Login page UI elements are present
 *  3. Login with wrong credentials shows error
 *  4. Navigate to Signup page
 *  5. Signup form input validation (UI elements present)
 *  6. Full Signup → redirect to login
 *  7. Login with new credentials → dashboard
 *  8. Dashboard sidebar tabs are present and visible
 */

const { By, until, Key } = require('selenium-webdriver');
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

async function run(driver, log, screenshot) {
  log('=== Authentication Flow Suite ===');

  // ------------------------------------------------------------------
  // 1. Unauthenticated redirect: visiting / should end up at /login
  // ------------------------------------------------------------------
  log('[1] Checking unauthenticated redirect from "/" to "/login"...');
  await driver.get(config.baseUrl + '/');
  await driver.wait(until.urlContains('/login'), config.defaultTimeout,
    'Expected redirect to /login from /');
  log('✔ Redirect to /login verified.');
  await screenshot('01-redirect-to-login');

  // ------------------------------------------------------------------
  // 2. Login page UI elements
  // ------------------------------------------------------------------
  log('[2] Verifying Login page UI elements...');
  await driver.wait(until.elementLocated(By.id('login-license')), config.defaultTimeout);
  await driver.wait(until.elementLocated(By.id('login-password')), config.defaultTimeout);
  await driver.wait(until.elementLocated(By.id('login-submit')), config.defaultTimeout);
  await driver.wait(until.elementLocated(By.id('login-goto-signup')), config.defaultTimeout);
  await driver.wait(until.elementLocated(By.id('login-forgot-password')), config.defaultTimeout);
  log('✔ Login page elements (license, password, submit, signup link, forgot-password) found.');
  await screenshot('02-login-page-ui');

  // ------------------------------------------------------------------
  // 2a. Empty credentials validation
  // ------------------------------------------------------------------
  log('[2a] Testing login with empty credentials...');
  await driver.findElement(By.id('login-submit')).click();
  const emptyErrAlert = await driver.wait(
    until.elementLocated(By.className('alert-error')),
    config.defaultTimeout
  );
  await driver.sleep(500);
  const emptyErrText = await emptyErrAlert.getText();
  if (emptyErrText.includes('license number and password')) {
    log('✔ Empty credentials error shown correctly.');
  } else {
    throw new Error('Unexpected empty credentials error: ' + emptyErrText);
  }
  await screenshot('02a-login-empty-credentials');

  // ------------------------------------------------------------------
  // 2b. SQL Injection handling
  // ------------------------------------------------------------------
  log('[2b] Testing SQL Injection handling in login...');
  await driver.findElement(By.id('login-license')).sendKeys("' OR 1=1 --");
  await driver.findElement(By.id('login-password')).sendKeys("' OR 1=1 --");
  await driver.findElement(By.id('login-submit')).click();
  await driver.wait(until.elementLocated(By.className('alert-error')), config.defaultTimeout);
  log('✔ SQL Injection attempt rejected safely.');
  await clearField(driver, await driver.findElement(By.id('login-license')));
  await clearField(driver, await driver.findElement(By.id('login-password')));

  // ------------------------------------------------------------------
  // 3. Wrong credentials → error message shown
  // ------------------------------------------------------------------
  log('[3] Testing login with wrong credentials...');
  await driver.findElement(By.id('login-license')).sendKeys('INVALID123');
  await driver.findElement(By.id('login-password')).sendKeys('wrongpass');
  await driver.findElement(By.id('login-submit')).click();

  // Wait for either error alert or URL stays at login
  const invalidAlert = await driver.wait(until.elementLocated(By.className('alert-error')), config.defaultTimeout);
  await driver.sleep(500);
  const invalidText = await invalidAlert.getText();
  if (invalidText.includes('Invalid credentials') || invalidText.toLowerCase().includes('not found')) {
    log('✔ Invalid credentials error text verified.');
  } else {
    throw new Error('Unexpected error text for invalid credentials: ' + invalidText);
  }

  const currentUrl = await driver.getCurrentUrl();
  if (currentUrl.includes('/login')) {
    log('✔ Stayed on /login after bad credentials.');
  } else {
    throw new Error('Expected to stay on /login after wrong credentials, got: ' + currentUrl);
  }
  // Clear fields for next step
  const licenseField = await driver.findElement(By.id('login-license'));
  await clearField(driver, licenseField);
  const passwordField = await driver.findElement(By.id('login-password'));
  await clearField(driver, passwordField);
  await screenshot('03-login-wrong-credentials');

  // ------------------------------------------------------------------
  // 3a. Forgot Password navigation
  // ------------------------------------------------------------------
  log('[3a] Navigating to Forgot Password page...');
  await driver.findElement(By.id('login-forgot-password')).click();
  await driver.wait(until.urlContains('/forgot-password'), config.defaultTimeout);
  log('✔ Forgot Password page loaded.');
  await screenshot('03a-forgot-password');

  // Go back to login
  const backToLoginBtn = await driver.wait(
    until.elementLocated(By.id('forgot-password-back')),
    config.defaultTimeout
  );
  await backToLoginBtn.click();
  await driver.wait(until.urlContains('/login'), config.defaultTimeout);
  log('✔ Navigated back to Login page.');

  // ------------------------------------------------------------------
  // 4. Navigate to Signup page
  // ------------------------------------------------------------------
  log('[4] Navigating to Signup page...');
  const gotoSignupBtn = await driver.wait(
    until.elementLocated(By.id('login-goto-signup')),
    config.defaultTimeout
  );
  await gotoSignupBtn.click();
  await driver.wait(until.urlContains('/signup'), config.defaultTimeout,
    'Expected URL to contain /signup after clicking Create account');
  log('✔ Signup page loaded.');
  await screenshot('04-signup-page');

  // ------------------------------------------------------------------
  // 5. Signup form UI elements present
  // ------------------------------------------------------------------
  log('[5] Verifying Signup form UI elements...');
  await driver.wait(until.elementLocated(By.id('signup-name')), config.defaultTimeout);
  await driver.wait(until.elementLocated(By.id('signup-license')), config.defaultTimeout);
  await driver.wait(until.elementLocated(By.id('signup-email')), config.defaultTimeout);
  await driver.wait(until.elementLocated(By.id('signup-password')), config.defaultTimeout);
  await driver.wait(until.elementLocated(By.id('signup-submit')), config.defaultTimeout);
  log('✔ Signup form elements (name, license, email, password, submit) all present.');

  // ------------------------------------------------------------------
  // 5a. Signup empty fields validation
  // ------------------------------------------------------------------
  log('[5a] Testing signup with empty fields...');
  await driver.findElement(By.id('signup-submit')).click();
  let signupErrAlert = await driver.wait(until.elementLocated(By.className('alert-error')), config.defaultTimeout);
  await driver.sleep(500);
  let signupErrText = await signupErrAlert.getText();
  if (signupErrText.includes('fill in all fields')) {
    log('✔ Signup empty fields validation correct.');
  } else {
    throw new Error('Unexpected empty signup error: ' + signupErrText);
  }

  // ------------------------------------------------------------------
  // 5b. Signup invalid email format validation
  // ------------------------------------------------------------------
  log('[5b] Testing signup with invalid email format...');
  await driver.findElement(By.id('signup-name')).sendKeys('Test Name');
  await driver.findElement(By.id('signup-license')).sendKeys('TEST1234');
  await driver.findElement(By.id('signup-email')).sendKeys('invalidemailformat');
  await driver.findElement(By.id('signup-password')).sendKeys('ValidPass1!');
  await driver.findElement(By.id('signup-submit')).click();
  
  signupErrAlert = await driver.wait(until.elementLocated(By.className('alert-error')), config.defaultTimeout);
  await driver.sleep(500);
  signupErrText = await signupErrAlert.getText();
  if (signupErrText.includes('valid email address')) {
    log('✔ Invalid email format rejected correctly.');
  } else {
    throw new Error('Unexpected email signup error: ' + signupErrText);
  }
  
  // clear fields
  const nameEl = await driver.findElement(By.id('signup-name'));
  const licenseEl = await driver.findElement(By.id('signup-license'));
  const emailEl = await driver.findElement(By.id('signup-email'));
  const passEl = await driver.findElement(By.id('signup-password'));

  log('Before clear - name: ' + (await nameEl.getAttribute('value')) +
      ', license: ' + (await licenseEl.getAttribute('value')) +
      ', email: ' + (await emailEl.getAttribute('value')) +
      ', password: ' + (await passEl.getAttribute('value')));

  await clearField(driver, nameEl);
  await clearField(driver, licenseEl);
  await clearField(driver, emailEl);
  await clearField(driver, passEl);
  await driver.sleep(300);

  log('After clear - name: ' + (await nameEl.getAttribute('value')) +
      ', license: ' + (await licenseEl.getAttribute('value')) +
      ', email: ' + (await emailEl.getAttribute('value')) +
      ', password: ' + (await passEl.getAttribute('value')));

  // ------------------------------------------------------------------
  // 6. Fill and submit Signup form
  // ------------------------------------------------------------------
  log(`[6] Signing up new doctor: ${config.testDoctor.name}`);
  log(`    License: ${config.testDoctor.licenseNo}`);
  log(`    Email: ${config.testDoctor.email}`);

  await driver.findElement(By.id('signup-name')).sendKeys(config.testDoctor.name);
  await driver.findElement(By.id('signup-license')).sendKeys(config.testDoctor.licenseNo);
  await driver.findElement(By.id('signup-email')).sendKeys(config.testDoctor.email);
  await driver.findElement(By.id('signup-password')).sendKeys(config.testDoctor.password);
  await screenshot('06-signup-form-filled');

  await driver.findElement(By.id('signup-submit')).click();
  log('Signup form submitted. Waiting for redirect to /login...');

  // After signup success, app redirects back to /login
  await driver.wait(until.urlContains('/login'), 10000,
    'Expected redirect to /login after successful signup');
  log('✔ Signup successful, redirected to /login.');
  await screenshot('06-post-signup-login');

  // ------------------------------------------------------------------
  // 6a. Attempt signup with existing email
  // ------------------------------------------------------------------
  log('[6a] Testing duplicate signup rejection...');
  const gotoSignupDup = await driver.wait(
    until.elementLocated(By.id('login-goto-signup')),
    config.defaultTimeout
  );
  await safeClick(driver, gotoSignupDup);
  await driver.wait(until.urlContains('/signup'), config.defaultTimeout);
  
  const signupNameDup = await driver.wait(
    until.elementLocated(By.id('signup-name')),
    config.defaultTimeout
  );
  await signupNameDup.sendKeys(config.testDoctor.name);
  await driver.findElement(By.id('signup-license')).sendKeys(config.testDoctor.licenseNo + '99'); // different license
  await driver.findElement(By.id('signup-email')).sendKeys(config.testDoctor.email); // SAME email
  await driver.findElement(By.id('signup-password')).sendKeys(config.testDoctor.password);
  await driver.findElement(By.id('signup-submit')).click();

  const dupAlert = await driver.wait(until.elementLocated(By.className('alert-error')), config.defaultTimeout);
  await driver.sleep(500);
  const dupText = await dupAlert.getText();
  if (dupText.toLowerCase().includes('exist') || dupText.toLowerCase().includes('already')) {
    log('✔ Duplicate email signup rejected correctly.');
  } else {
    throw new Error('Unexpected duplicate email error: ' + dupText);
  }
  
  // Go back to login
  await driver.get(config.baseUrl + '/login');
  await driver.wait(until.urlContains('/login'), config.defaultTimeout);

  // ------------------------------------------------------------------
  // 7. Login with newly created doctor credentials
  // ------------------------------------------------------------------
  log('[7] Logging in with new doctor credentials...');
  const loginLicense = await driver.wait(
    until.elementLocated(By.id('login-license')), config.defaultTimeout
  );
  await loginLicense.sendKeys(config.testDoctor.licenseNo);
  await driver.findElement(By.id('login-password')).sendKeys(config.testDoctor.password);
  await screenshot('07-login-form-filled');

  await driver.findElement(By.id('login-submit')).click();
  log('Login submitted. Waiting for /dashboard...');

  await driver.wait(until.urlContains('/dashboard'), config.defaultTimeout,
    'Expected redirect to /dashboard after login');
  log('✔ Logged in successfully, dashboard loaded.');
  await screenshot('07-dashboard-loaded');

  // ------------------------------------------------------------------
  // 8. Dashboard: sidebar tabs visible
  // ------------------------------------------------------------------
  log('[8] Verifying sidebar tabs on dashboard...');
  await driver.wait(until.elementLocated(By.id('sidebar-tab-0')), config.defaultTimeout);
  await driver.wait(until.elementLocated(By.id('sidebar-tab-1')), config.defaultTimeout);
  await driver.wait(until.elementLocated(By.id('sidebar-tab-2')), config.defaultTimeout);
  await driver.wait(until.elementLocated(By.id('sidebar-tab-3')), config.defaultTimeout);
  log('✔ Sidebar tabs 0 (Home), 1 (Search), 2 (Add), 3 (Profile) all found.');
  await screenshot('08-sidebar-tabs-visible');

  log('=== Authentication Flow Suite COMPLETE ===');
}

module.exports = { run, name: 'Authentication Flow' };
