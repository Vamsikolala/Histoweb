/**
 * Appium iOS Test Configuration
 * Shared constants for all test suites
 */
module.exports = {
  // Backend API URL (must be reachable from the simulator)
  apiUrl: 'http://localhost:8000',

  // Timeouts (ms)
  defaultTimeout: 15000,
  splashTimeout: 5000,

  // iOS Simulator target
  simulator: {
    deviceName: 'iPhone 15 Pro',
    platformVersion: '17.5'
  },

  // Test doctor credentials (randomized to avoid DB conflicts)
  testDoctor: {
    name: 'Dr. Appium Test',
    licenseNo: 'APM' + Math.floor(100000 + Math.random() * 900000),
    email: 'appium.test.' + Math.floor(100000 + Math.random() * 900000) + '@histoquanta.com',
    password: 'Password123!'
  },

  // Test patient details
  testPatient: {
    name: 'John Appium ' + String.fromCharCode(65 + Math.floor(Math.random() * 26)),
    age: '45',
    gender: 'Male',
    phone: '98765' + Math.floor(10000 + Math.random() * 90000)
  }
};
