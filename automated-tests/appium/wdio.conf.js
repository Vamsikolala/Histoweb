const path = require('path');
const config = require('./config');

exports.config = {
  // ====================
  // Runner Configuration
  // ====================
  runner: 'local',
  port: 4723,
  maxInstances: 1,

  // ==================
  // Specify Test Files
  // ==================
  specs: ['./tests/**/*.test.js'],

  // ============
  // Capabilities
  // ============
  capabilities: [
    {
      'platformName': 'iOS',
      'appium:deviceName': config.simulator.deviceName,
      'appium:platformVersion': config.simulator.platformVersion,
      'appium:automationName': 'XCUITest',
      'appium:app': path.resolve(
        __dirname,
        '../../app/HistoQuanta 4/build/Build/Products/Debug-iphonesimulator/HistoQuanta.app'
      ),
      'appium:noReset': false,
      'appium:fullReset': false,
      'appium:newCommandTimeout': 240,
      'appium:wdaLaunchTimeout': 120000,
      'appium:wdaConnectionTimeout': 120000,
      'appium:showXcodeLog': false
    }
  ],

  // ===================
  // Test Configurations
  // ===================
  logLevel: 'info',
  bail: 0,
  waitforTimeout: config.defaultTimeout,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,

  // Framework
  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 300000 // 5 minutes per test
  },

  // Reporters
  reporters: ['spec'],

  // =====
  // Hooks
  // =====
  afterTest: async function (test, context, { error, result, duration, passed, retries }) {
    if (!passed) {
      const timestamp = Date.now();
      const sanitizedName = test.title.replace(/[^a-zA-Z0-9]/g, '_');
      await browser.saveScreenshot(`./reports/failure-${sanitizedName}-${timestamp}.png`);
    }
  },

  before: async function () {
    const fs = require('fs');
    const reportsDir = path.join(__dirname, 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
  }
};
