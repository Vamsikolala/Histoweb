module.exports = {
  // Base URL of the React/Vite development server
  baseUrl: 'http://localhost:5173',

  // Base URL of the backend API
  apiUrl: 'http://localhost:8000',

  // Timeout settings (ms)
  defaultTimeout: 12000,

  // Test doctor credentials (generated fresh each run to avoid DB conflicts)
  testDoctor: {
    name: 'Dr. Selenium Test',
    licenseNo: 'SEL' + Math.floor(100000 + Math.random() * 900000),
    email: 'selenium.test.' + Math.floor(100000 + Math.random() * 900000) + '@histoquanta.com',
    password: 'Password123!'
  },

  // Test patient details (generated fresh each run to avoid DB unique constraints)
  testPatient: {
    name: 'John Doe Test ' + String.fromCharCode(65 + Math.floor(Math.random() * 26)) + String.fromCharCode(65 + Math.floor(Math.random() * 26)) + String.fromCharCode(65 + Math.floor(Math.random() * 26)),
    phone: '98765' + Math.floor(10000 + Math.random() * 90000)
  },



  // Browser configuration
  // false = browser window visible so you can watch the automation live
  headless: false
};
