# HistoQuanta — Appium iOS Test Suite

Automated mobile testing for the HistoQuanta iOS app using **WebdriverIO** + **Appium XCUITest Driver**.

## Test Coverage (20 Tests)

| Test File           | Tests | Description                                      |
|---------------------|-------|--------------------------------------------------|
| `splash.test.js`    | 3     | Splash screen title, subtitle, auto-transition   |
| `auth.test.js`      | 11    | Login, Signup, Forgot Password, validations      |
| `patient.test.js`   | 6     | Add/Search patient, name/phone validation        |
| `report.test.js`    | 4     | Patient profile, Add/Edit report buttons         |
| `clinical.test.js`  | 4     | Dashboard tiles, module navigation               |
| `profile.test.js`   | 7     | Doctor profile, settings, logout flow            |

## Prerequisites

| Tool               | Version | Install                                       |
|---------------------|---------|-----------------------------------------------|
| Node.js            | ≥ 18    | `brew install node`                            |
| Xcode              | ≥ 15    | Mac App Store                                  |
| Appium             | ≥ 2.5   | `npm install -g appium`                        |
| XCUITest Driver    | ≥ 7.0   | `appium driver install xcuitest`               |
| iOS Simulator      | —       | Included with Xcode                            |

## Setup

### 1. Build the iOS App for Simulator

```bash
# From the project root
cd "app/HistoQuanta 4"
xcodebuild -project "HistoQuanta 4.xcodeproj" \
  -scheme "HistoQuanta" \
  -sdk iphonesimulator \
  -configuration Debug \
  -derivedDataPath build \
  clean build
```

The `.app` bundle will be at:
```
app/HistoQuanta 4/build/Build/Products/Debug-iphonesimulator/HistoQuanta.app
```

### 2. Install Test Dependencies

```bash
cd automated-tests/appium
npm install
```

### 3. Start Appium Server

```bash
appium
```

### 4. Start the Backend (required for login tests)

```bash
cd backend
php -S localhost:8000
```

## Running Tests

```bash
cd automated-tests/appium
npm test
```

## Reports

- **Failure screenshots** are saved to `./reports/`
- **Spec reporter** outputs results to the terminal

## Configuration

Edit `config.js` to change:
- **Simulator device/OS**: `simulator.deviceName` and `simulator.platformVersion`
- **Test credentials**: `testDoctor` and `testPatient` objects
- **Timeouts**: `defaultTimeout` and `splashTimeout`

## How Appium Finds Elements

The iOS app uses SwiftUI `.accessibilityIdentifier()` modifiers on all interactive elements. Appium's XCUITest driver locates these via the `~` (accessibility ID) selector:

```javascript
const element = await $('~login-license-field');
await element.setValue('MY_LICENSE');
```

### Accessibility ID Map

| View                | Identifier                    | Type     |
|---------------------|-------------------------------|----------|
| **Splash**          | `splash-title`                | Text     |
|                     | `splash-subtitle`             | Text     |
| **Login**           | `login-license-field`         | TextField|
|                     | `login-password-field`        | Secure   |
|                     | `login-submit-btn`            | Button   |
|                     | `login-signup-link`           | Button   |
|                     | `login-forgot-password-link`  | Button   |
|                     | `login-error-text`            | Text     |
| **Signup**          | `signup-name-field`           | TextField|
|                     | `signup-license-field`        | TextField|
|                     | `signup-email-field`          | TextField|
|                     | `signup-password-field`       | Secure   |
|                     | `signup-submit-btn`           | Button   |
|                     | `signup-error-text`           | Text     |
|                     | `signup-login-link`           | Button   |
| **Forgot Password** | `forgot-email-field`          | TextField|
|                     | `forgot-otp-field`            | TextField|
|                     | `forgot-new-password-field`   | Secure   |
|                     | `forgot-confirm-password-field`| Secure  |
|                     | `forgot-submit-btn`           | Button   |
|                     | `forgot-back-btn`             | Button   |
| **Add Patient**     | `ap-name-field`               | TextField|
|                     | `ap-age-field`                | TextField|
|                     | `ap-gender-picker`            | Picker   |
|                     | `ap-phone-field`              | TextField|
|                     | `ap-address-field`            | TextField|
|                     | `ap-submit-btn`               | Button   |
| **Search**          | `search-input`                | TextField|
| **Patient Profile** | `patient-name-header`         | Text     |
|                     | `patient-edit-btn`            | Button   |
|                     | `patient-add-report-btn`      | Button   |
| **Doctor Profile**  | `profile-doctor-name`         | Text     |
|                     | `profile-edit-btn`            | Button   |
|                     | `profile-privacy-btn`         | Button   |
|                     | `profile-terms-btn`           | Button   |
|                     | `profile-about-btn`           | Button   |
|                     | `profile-logout-btn`          | Button   |
