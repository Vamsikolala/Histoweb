# HistoQuanta Automated Testing Suite

This directory contains a Node.js-based Selenium automated testing suite that verifies the **complete** HistoQuanta web application — from authentication and patient management to clinical AI analysis modules, report lifecycle, profile management, and logout.

---

## Test Suites (5 Total)

| # | Suite File | Name | Tests |
|---|---|---|---|
| 1 | `auth.test.js` | Authentication Flow | Redirect guard, login UI, wrong-credential rejection, signup, login with new credentials, sidebar verification |
| 2 | `patient.test.js` | Patient & Report Management | Home tab tiles, Add Patient form, input filters (name/phone), validation errors, form submission, search, patient session, profile navigation, edit patient |
| 3 | `report.test.js` | Report Management & Form Validation | Add Report page, disabled save validation, partial fill check, fill all fields, save & redirect, disease history, edit report, download report, delete report |
| 4 | `clinical.test.js` | Clinical Analysis Modules Navigation | Patient session activation, module tiles lock/unlock, Breast module (ER/PR/HER2/Ki67), GIT module, Head & Neck module, Guidelines page, session clear → tiles lock |
| 5 | `profile.test.js` | Doctor Profile & Logout Flow | Profile tab, doctor name verification, settings items, edit profile (specialization/hospital/phone), save profile, auto-close edit mode, My Downloads, Privacy Policy, Terms, logout, post-logout redirect guard |

---

## Prerequisites

1. **Node.js** v18 or higher.
2. **Google Chrome** browser installed.
3. **Backend (PHP + DB)** running via MAMP/XAMPP at `http://localhost:8000`.
4. **Web frontend (Vite/React)** running at `http://localhost:5173` — use `npm run dev` inside `../web`.

---

## Getting Started

### 1. Install Dependencies

```bash
cd automated-tests
rm -rf node_modules package-lock.json
npm install
```

### 2. Configure `config.js`

| Setting | Default | Description |
|---|---|---|
| `baseUrl` | `http://localhost:5173` | Vite dev server URL |
| `apiUrl` | `http://localhost:8000` | PHP backend URL |
| `headless` | `true` | `false` to watch in browser window |
| `defaultTimeout` | `10000` | Element wait timeout (ms) |
| `testDoctor` | auto-generated | Random license + email on each run to avoid DB conflicts |

### 3. Run All Tests

```bash
npm run test
```

---

## Viewing Reports

After execution completes:

- **Terminal**: Pass/Fail summary for each suite.
- **HTML Dashboard**: `reports/dashboard.html` — interactive suite breakdown with logs, error stack traces, pass rate, and duration.
- **Screenshots**: `reports/screenshots/` — step-by-step PNG captures for every action (timestamped).

Open `reports/dashboard.html` in any browser to view the full interactive report.

---

## Test Design Notes

- **Sequential suites**: Each suite builds on the previous. `auth` creates the test doctor; `patient` uses that login to add the patient; `report` and `clinical` use that patient; `profile` ends with logout.
- **Idempotent credentials**: `config.js` generates a fresh random license number and email on every run, so re-running does not cause "already registered" errors.
- **Graceful failures**: Each step uses descriptive error messages so failures are easy to diagnose in the HTML report.
- **Screenshots on every step**: Every meaningful action captures a screenshot, so the HTML report is a full visual walkthrough.
