/**
 * splash.test.js
 * Suite: Splash Screen
 * Covers:
 *  1. Splash screen displays app title
 *  2. Splash screen displays subtitle
 *  3. Auto-transitions to Login view after animation
 */

const { waitForDisplayed, takeScreenshot, elementExists } = require('../helpers/utils');

describe('Splash Screen', () => {
  it('should display the HistoQuanta title on splash', async () => {
    const title = await waitForDisplayed('splash-title', 5000);
    const text = await title.getText();
    expect(text).toContain('HistoQuanta');
    await takeScreenshot('splash-title-visible');
  });

  it('should display the subtitle on splash', async () => {
    const subtitle = await waitForDisplayed('splash-subtitle', 5000);
    const text = await subtitle.getText();
    expect(text).toContain('Standardized Microscopy Analysis');
  });

  it('should auto-transition to login screen after splash', async () => {
    // Wait for splash animation to complete (~2.5 seconds)
    await browser.pause(4000);
    const loginExists = await elementExists('login-license-field', 10000);
    expect(loginExists).toBe(true);
    await takeScreenshot('splash-to-login-transition');
  });
});
