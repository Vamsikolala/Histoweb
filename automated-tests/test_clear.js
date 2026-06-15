const { Builder, By, until, Key } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function main() {
  const chromeOptions = new chrome.Options();
  // NO HEADLESS
  chromeOptions.addArguments('--window-size=1440,900');
  chromeOptions.addArguments('--start-maximized');
  const driver = await new Builder().forBrowser('chrome').setChromeOptions(chromeOptions).build();
  try {
    await driver.get('http://localhost:5173/signup');
    await driver.wait(until.elementLocated(By.id('signup-name')), 5000);

    // Fill invalid email format
    await driver.findElement(By.id('signup-name')).sendKeys('Test Name');
    await driver.findElement(By.id('signup-license')).sendKeys('TEST1234');
    await driver.findElement(By.id('signup-email')).sendKeys('invalidemailformat');
    await driver.findElement(By.id('signup-password')).sendKeys('ValidPass1!');
    
    // Click submit
    const submitBtn = await driver.findElement(By.id('signup-submit'));
    await driver.executeScript("arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });", submitBtn);
    await driver.sleep(500);
    await submitBtn.click();

    // Wait for error
    const errAlert = await driver.wait(until.elementLocated(By.className('alert-error')), 5000);
    console.log('Error alert shown:', await errAlert.getText());

    // Try clearing
    const fields = ['signup-name', 'signup-license', 'signup-email', 'signup-password'];
    for (const id of fields) {
      const el = await driver.findElement(By.id(id));
      console.log(`Before clear ${id}:`, await el.getAttribute('value'));
      try {
        await driver.executeScript(
          "arguments[0].value = '';" +
          "arguments[0].dispatchEvent(new Event('input', { bubbles: true }));" +
          "arguments[0].dispatchEvent(new Event('change', { bubbles: true }));",
          el
        );
      } catch (e) {
        console.error('JS clear failed:', e);
      }
      console.log(`After clear ${id}:`, await el.getAttribute('value'));
    }

    await driver.sleep(2000); // stay open for a bit so we see it

  } catch (err) {
    console.error('Error encountered:', err);
  } finally {
    await driver.quit();
  }
}
main();
