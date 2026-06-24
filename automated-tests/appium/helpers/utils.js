/**
 * Appium Test Helpers
 * Shared utility functions for interacting with iOS elements via accessibilityIdentifier
 */
const config = require('../config');

/**
 * Wait for an element by its accessibility identifier and return it
 */
async function waitForElement(id, timeout = config.defaultTimeout) {
  const element = await $(`~${id}`);
  await element.waitForExist({ timeout });
  return element;
}

/**
 * Wait for an element to be displayed
 */
async function waitForDisplayed(id, timeout = config.defaultTimeout) {
  const element = await $(`~${id}`);
  await element.waitForDisplayed({ timeout });
  return element;
}

/**
 * Tap on an element by accessibility identifier
 */
async function tapElement(id, timeout = config.defaultTimeout) {
  const element = await waitForDisplayed(id, timeout);
  await element.click();
  return element;
}

/**
 * Type text into a field by accessibility identifier
 */
async function typeIntoField(id, text, timeout = config.defaultTimeout) {
  const element = await waitForDisplayed(id, timeout);
  await element.clearValue();
  await element.setValue(text);
  return element;
}

/**
 * Get text from an element by accessibility identifier
 */
async function getElementText(id, timeout = config.defaultTimeout) {
  const element = await waitForDisplayed(id, timeout);
  return element.getText();
}

/**
 * Check if an element exists (does not throw if missing)
 */
async function elementExists(id, timeout = 3000) {
  try {
    const element = await $(`~${id}`);
    return await element.waitForExist({ timeout });
  } catch (_) {
    return false;
  }
}

/**
 * Save a screenshot with a descriptive name
 */
async function takeScreenshot(name) {
  const timestamp = Date.now();
  const sanitized = name.replace(/[^a-zA-Z0-9_-]/g, '_');
  const filePath = `./reports/${sanitized}-${timestamp}.png`;
  await browser.saveScreenshot(filePath);
  console.log(`    📸 Screenshot: ${filePath}`);
}

/**
 * Wait for the splash screen to finish and login view to appear
 */
async function waitForSplashToFinish() {
  // The splash screen auto-transitions after 2.5 seconds
  await browser.pause(4000);
  // Wait for login form to appear
  await waitForDisplayed('login-license-field', 10000);
}

/**
 * Scroll down within the current view
 */
async function scrollDown() {
  const { height, width } = await browser.getWindowSize();
  await browser.touchAction([
    { action: 'press', x: width / 2, y: height * 0.7 },
    { action: 'wait', ms: 300 },
    { action: 'moveTo', x: width / 2, y: height * 0.3 },
    { action: 'release' }
  ]);
}

/**
 * Wait for an alert and handle it
 */
async function handleAlert(action = 'accept') {
  try {
    await browser.pause(500);
    if (action === 'accept') {
      await browser.acceptAlert();
    } else {
      await browser.dismissAlert();
    }
  } catch (_) {
    // No alert present, that's fine
  }
}

module.exports = {
  waitForElement,
  waitForDisplayed,
  tapElement,
  typeIntoField,
  getElementText,
  elementExists,
  takeScreenshot,
  waitForSplashToFinish,
  scrollDown,
  handleAlert
};
