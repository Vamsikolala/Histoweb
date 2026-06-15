const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const config = require('./config');

const REPORTS_DIR = path.join(__dirname, 'reports');
const SCREENSHOTS_DIR = path.join(REPORTS_DIR, 'screenshots');

// Ensure directories exist
if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });
if (!fs.existsSync(SCREENSHOTS_DIR)) fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

const testSuites = [
  require('./tests/auth.test'),
  require('./tests/patient.test'),
  require('./tests/report.test'),
  require('./tests/clinical.test'),
  require('./tests/profile.test')
];

// ---------------------------------------------------------------------------
// Shared helper: scroll an element into view (centre) then click it.
// Falls back to a JS click if the native click is intercepted.
// ---------------------------------------------------------------------------
async function scrollAndClick(driver, element) {
  await driver.executeScript(
    "arguments[0].scrollIntoView({ behavior: 'smooth', block: 'center' });",
    element
  );
  await driver.sleep(400);
  try {
    await element.click();
  } catch (_) {
    await driver.executeScript("arguments[0].click();", element);
  }
}

// Export helper so test files can import from the runner path
// (tests use require('../run-tests').scrollAndClick)
module.exports = { scrollAndClick };

async function main() {
  console.log('==================================================');
  console.log('      HISTOQUANTA SELENIUM AUTOMATION RUNNER      ');
  console.log('==================================================');
  console.log(`Target Environment : ${config.baseUrl}`);
  console.log(`Browser            : Chrome (${config.headless ? 'Headless' : 'VISIBLE – watch the screen!'})`);
  console.log(`Test Suites        : ${testSuites.length}`);
  console.log(`Started            : ${new Date().toLocaleString()}\n`);

  const chromeOptions = new chrome.Options();
  if (config.headless) {
    chromeOptions.addArguments('--headless=new');
  }
  // Large window so the mobile bottom tab bar never overlaps desktop buttons
  chromeOptions.addArguments('--no-sandbox');
  chromeOptions.addArguments('--disable-dev-shm-usage');
  chromeOptions.addArguments('--window-size=1440,900');
  chromeOptions.addArguments('--start-maximized');

  const driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(chromeOptions)
    .build();

  // Maximise the window (for non-headless runs this makes it fill the screen)
  await driver.manage().window().setRect({ x: 0, y: 0, width: 1440, height: 900 });

  const reportData = {
    startTime: new Date(),
    endTime: null,
    total: testSuites.length,
    passed: 0,
    failed: 0,
    suites: []
  };

  try {
    for (const suite of testSuites) {
      console.log(`\n▶  Running Suite: ${suite.name}`);
      console.log(`   ${'─'.repeat(50)}`);

      const suiteResult = {
        name: suite.name,
        status: 'PASSED',
        logs: [],
        steps: [],   // { step, status, message, timestamp }
        screenshots: [],
        error: null,
        durationMs: 0
      };

      const suiteStart = Date.now();
      let stepCounter = 0;

      const logger = (msg) => {
        const timestamp = new Date().toLocaleTimeString();
        const formatted = `[${timestamp}] ${msg}`;
        suiteResult.logs.push(formatted);

        // Capture step-level status for the Excel sheet
        stepCounter++;
        const isPassed = msg.includes('✔') || msg.includes('COMPLETE');
        const isFailed = msg.includes('❌');
        suiteResult.steps.push({
          step: stepCounter,
          timestamp,
          status: isFailed ? 'FAIL' : isPassed ? 'PASS' : 'INFO',
          message: msg
        });

        console.log(`   ${formatted}`);
      };

      const screenshotCapturer = async (name) => {
        try {
          const sanitized = `${suite.name.replace(/[\s&]+/g, '-').toLowerCase()}-${name}-${Date.now()}.png`;
          const base64 = await driver.takeScreenshot();
          const filePath = path.join(SCREENSHOTS_DIR, sanitized);
          fs.writeFileSync(filePath, base64, 'base64');
          suiteResult.screenshots.push({
            name,
            fileName: sanitized,
            relativePath: `./screenshots/${sanitized}`
          });
          logger(`Screenshot saved: ${sanitized}`);
        } catch (err) {
          console.error(`   Failed to capture screenshot: ${err.message}`);
        }
      };

      try {
        await suite.run(driver, logger, screenshotCapturer);
        reportData.passed++;
      } catch (err) {
        suiteResult.status = 'FAILED';
        suiteResult.error = err.stack || err.toString();
        reportData.failed++;
        logger(`❌ Suite error: ${err.message}`);
        try { await screenshotCapturer('failure-error'); } catch (_) {}
      } finally {
        suiteResult.durationMs = Date.now() - suiteStart;
        reportData.suites.push(suiteResult);
        const icon = suiteResult.status === 'PASSED' ? '✅' : '❌';
        console.log(`\n${icon}  Suite "${suite.name}" [${suiteResult.status}] — ${(suiteResult.durationMs / 1000).toFixed(2)}s`);
      }
    }
  } catch (globalErr) {
    console.error(`\nFatal runner error: ${globalErr.message}`);
  } finally {
    reportData.endTime = new Date();
    await driver.quit();
    generateHTMLReport(reportData);
    generateExcelReport(reportData);
  }
}

// ---------------------------------------------------------------------------
// Excel Report Generator
// ---------------------------------------------------------------------------
function generateExcelReport(data) {
  const wb = XLSX.utils.book_new();
  const duration = ((data.endTime - data.startTime) / 1000).toFixed(2);
  const passRate = data.total > 0 ? ((data.passed / data.total) * 100).toFixed(1) : '0.0';

  // ── Sheet 1: Summary ──────────────────────────────────────────────────────
  const summaryRows = [
    ['HistoQuanta Automated Test Report'],
    [''],
    ['Run Date', data.startTime.toLocaleString()],
    ['End Time', data.endTime.toLocaleString()],
    ['Total Duration (s)', duration],
    ['Total Suites', data.total],
    ['Passed', data.passed],
    ['Failed', data.failed],
    ['Pass Rate (%)', passRate],
    ['Target URL', config.baseUrl],
    ['Browser Mode', config.headless ? 'Headless' : 'Visible'],
  ];
  const wsSummary = XLSX.utils.aoa_to_sheet(summaryRows);
  wsSummary['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }];
  wsSummary['!cols'] = [{ wch: 24 }, { wch: 40 }];
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');

  // ── Sheet 2: Suite Results ─────────────────────────────────────────────────
  const suiteHeader = ['#', 'Suite Name', 'Status', 'Duration (s)', 'Screenshots', 'Error'];
  const suiteRows = data.suites.map((s, i) => [
    i + 1,
    s.name,
    s.status,
    (s.durationMs / 1000).toFixed(2),
    s.screenshots.length,
    s.error ? s.error.split('\n')[0] : ''
  ]);
  const wsSuites = XLSX.utils.aoa_to_sheet([suiteHeader, ...suiteRows]);
  wsSuites['!cols'] = [
    { wch: 4 }, { wch: 38 }, { wch: 10 }, { wch: 14 }, { wch: 14 }, { wch: 60 }
  ];
  XLSX.utils.book_append_sheet(wb, wsSuites, 'Suite Results');

  // ── Sheet 3: Step-by-Step Log ─────────────────────────────────────────────
  const logHeader = ['Suite', 'Step #', 'Timestamp', 'Status', 'Message'];
  const logRows = [];
  for (const suite of data.suites) {
    for (const step of (suite.steps || [])) {
      logRows.push([suite.name, step.step, step.timestamp, step.status, step.message]);
    }
  }
  const wsLog = XLSX.utils.aoa_to_sheet([logHeader, ...logRows]);
  wsLog['!cols'] = [{ wch: 36 }, { wch: 8 }, { wch: 14 }, { wch: 8 }, { wch: 90 }];
  XLSX.utils.book_append_sheet(wb, wsLog, 'Step Logs');

  // ── Sheet 4: Screenshots ───────────────────────────────────────────────────
  const ssHeader = ['Suite', 'Step Name', 'File Name'];
  const ssRows = [];
  for (const suite of data.suites) {
    for (const ss of suite.screenshots) {
      ssRows.push([suite.name, ss.name, ss.fileName]);
    }
  }
  const wsScreenshots = XLSX.utils.aoa_to_sheet([ssHeader, ...ssRows]);
  wsScreenshots['!cols'] = [{ wch: 36 }, { wch: 30 }, { wch: 70 }];
  XLSX.utils.book_append_sheet(wb, wsScreenshots, 'Screenshots');

  // ── Sheet 5: Test Cases (manual-style matrix) ──────────────────────────────
  const tcHeader = [
    'TC #', 'Suite', 'Test Case', 'Expected Result', 'Actual Result', 'Status'
  ];
  const tcRows = [];
  let tcNum = 1;
  const testCaseMap = {
    'Authentication Flow': [
      ['Unauthenticated redirect / → /login', 'URL redirects to /login'],
      ['Login page UI elements present', 'license, password, submit, signup, forgot-password found'],
      ['Empty credentials validation', 'Error message for empty fields appears'],
      ['SQL Injection handling', 'SQL characters rejected securely'],
      ['Wrong credentials error text', 'Shows "Invalid credentials" error'],
      ['Wrong credentials rejected', 'Stays on /login'],
      ['Forgot Password navigation', 'Forgot Password page loads'],
      ['Back to Login navigation', 'Navigates back to Login'],
      ['Navigate to Signup', 'URL contains /signup'],
      ['Signup form UI elements present', 'name, license, email, password, submit found'],
      ['Signup empty fields validation', 'Error message for empty fields appears'],
      ['Signup invalid email format', 'Error message for invalid email appears'],
      ['Complete Signup → redirect to /login', 'Redirect to /login on success'],
      ['Duplicate email signup rejected', 'Backend rejects duplicate email'],
      ['Login with new credentials → /dashboard', 'URL contains /dashboard'],
      ['Dashboard sidebar tabs visible', 'Tabs 0,1,2,3 all found'],
    ],
    'Patient & Report Management': [
      ['"No Patient Selected" banner on Home tab', 'Banner element visible'],
      ['All 6 clinical module tiles present', 'breast, thyroid, git, softtissue, headneck, lungs found'],
      ['Add Patient tab loads form fields', 'ap-name, ap-age, ap-gender etc. visible'],
      ['Name input strips numeric characters', '"John123" → "John"'],
      ['Phone input strips alpha/symbol chars', '"abc9876543210" → "9876543210"'],
      ['Short phone number validation', 'Rejects phone < 10 digits'],
      ['Negative age validation', 'HTML5 min=0 blocks input'],
      ['Extreme age validation', 'HTML5 max=150 blocks input'],
      ['Empty form submit shows error alert', 'alert-error element appears'],
      ['Valid patient form submits successfully', 'alert-success element appears'],
      ['Search tab loads correctly', 'Search input element visible'],
      ['Empty search shows recent patients', 'Cards rendered on empty search'],
      ['Bogus search returns no results', 'No patient cards found'],
      ['Search tab finds saved patient', 'Patient card appears in results'],
      ['Patient ID format validation', 'Patient ID matches PTXXX format'],
      ['Patient session activated', '"Finish Session" button visible on Home tab'],
      ['Module tiles unlocked with active session', 'No "Locked" badge on tiles'],
      ['Patient card click opens profile page', 'URL contains /patient/'],
      ['Patient profile shows correct name', '<h2> with patient name found'],
      ['Edit patient form loads with data', 'ep-name, ep-phone, ep-address fields visible'],
      ['Edit patient save redirects to profile', 'URL back to /patient/:id'],
      ['Edit patient save without changes', 'URL redirects back successfully'],
      ['Updated profile details visible', 'New phone/address text found in profile'],
    ],
    'Report Management & Form Validation': [
      ['Patient profile opened via Search', 'URL contains /patient/'],
      ['Add Report button navigates to form', 'URL contains /add-report'],
      ['Add Report form UI elements present', 'rt-type, rt-diagnosis, rt-notes, rt-full-report, save-report-btn found'],
      ['Save button disabled when fields empty', 'save-report-btn has disabled attribute'],
      ['Save button disabled with partial fill', 'Still disabled with only Report Type filled'],
      ['Save button enabled after all required fields filled', 'Disabled attribute removed'],
      ['Report submit → redirected to patient profile', 'URL back to /patient/:id'],
      ['Extreme length report validation', 'Successfully saves 10000+ chars'],
      ['New report visible in Disease History', '"Blood Test Analysis" text found in history'],
      ['Date format on history cards', 'Date string matches expected format'],
      ['Edit report loads prefilled data', 'rt-type shows existing value'],
      ['Navigated back from Edit Report', 'URL back to /patient/:id'],
      ['Download report triggers alert', 'Download alert message appears'],
      ['Download report opens downloads page', 'URL contains /downloads'],
      ['Delete report cancellation', 'Canceling keeps report count intact'],
      ['Delete all reports', 'All reports removed successfully'],
      ['Disease history empty state UI', 'Correct empty state text shown'],
    ],
    'Clinical Analysis Modules Navigation': [
      ['Sessionless direct access rejected', 'Redirected to dashboard without session'],
      ['Module tiles unlocked with session', 'No "Locked" badge on tiles'],
      ['Breast Cancer tile → /modules/breast', 'URL contains /modules/breast'],
      ['Breast module shows 4 assessment options', 'ER, PR, HER2, Ki67 options all found'],
      ['ER Assessment → /modules/breast/er', 'URL contains /modules/breast/er'],
      ['ER Assessment page content correct', 'ER/Estrogen/Allred/H-Score text found'],
      ['Navigate back to Breast module', 'URL back to /modules/breast'],
      ['Ki67 Proliferation → /modules/breast/ki67', 'URL contains /modules/breast/ki67'],
      ['Ki67 page content correct', 'Ki67/Proliferation/% text found'],
      ['Breast Guidelines page loads', 'URL contains /guidelines'],
      ['GIT tile → /modules/git', 'URL contains /modules/git'],
      ['GIT module content correct', 'Adenocarcinoma/GIST/NET text found'],
      ['Head & Neck tile → /modules/headneck', 'URL contains /modules/headneck'],
      ['Head & Neck module content correct', 'Head & Neck content verified'],
      ['Thyroid tile → /modules/thyroid', 'URL contains /modules/thyroid'],
      ['Thyroid module content correct', 'Bethesda/TRADS/Thyroid text found'],
      ['Lungs tile → /modules/lungs', 'URL contains /modules/lungs'],
      ['Lungs module content correct', 'NSCLC/SCLC text found'],
      ['Soft Tissue tile → /modules/softtissue', 'URL contains /modules/softtissue'],
      ['Soft Tissue module content correct', 'Soft Tissue/Sarcoma text found'],
      ['Session cleared from Home tab', '"Finish Session" clicked'],
      ['Session clear → tiles show "Locked"', '"Locked" badge reappears'],
    ],
    'Doctor Profile & Logout Flow': [
      ['My Profile tab loads', 'Profile tab content visible'],
      ['Doctor name visible in profile header', '<h2> with doctor name found'],
      ['License number visible on profile', 'License number text in page'],
      ['All 4 Settings items present', 'Downloads, Privacy, Terms, About buttons found'],
      ['Edit Profile form opens with all fields', 'profile-name, profile-spec, profile-hospital, profile-email, profile-phone visible'],
      ['Profile save shows success alert', 'alert-success with "Profile updated successfully!"'],
      ['Edit mode auto-closes after save', 'profile-name input disappears from DOM'],
      ['Updated specialization visible in profile', '"Senior Pathologist" text in page'],
      ['Updated hospital visible in profile', '"City Diagnostics Hub" text in page'],
      ['My Downloads page navigates correctly', 'URL contains /downloads'],
      ['Privacy Policy page navigates correctly', 'URL contains /privacy-policy'],
      ['Privacy Policy content verified', 'Expected policy content found'],
      ['Terms & Conditions navigates correctly', 'URL contains /terms-and-conditions'],
      ['Terms & Conditions content verified', 'Expected terms content found'],
      ['Logout cancellation', 'Session remains active when canceled'],
      ['Confirm logout → redirect to /login', 'URL contains /login'],
      ['Post-logout /dashboard redirect to /login', 'Protected route blocks access'],
    ],
  };

  for (const suite of data.suites) {
    const cases = testCaseMap[suite.name] || [];
    const suiteSteps = (suite.steps || []).filter(s => s.status !== 'INFO');
    cases.forEach((tc, idx) => {
      const matchingStep = suiteSteps[idx];
      const status = matchingStep
        ? (matchingStep.status === 'FAIL' ? 'FAIL' : 'PASS')
        : (suite.status === 'PASSED' ? 'PASS' : 'FAIL');
      const actual = matchingStep ? matchingStep.message.replace(/^.*?(✔|❌)\s*/, '') : (suite.error ? suite.error.split('\n')[0] : 'Not executed');
      tcRows.push([tcNum++, suite.name, tc[0], tc[1], actual, status]);
    });
  }

  const wsTC = XLSX.utils.aoa_to_sheet([tcHeader, ...tcRows]);
  wsTC['!cols'] = [
    { wch: 6 }, { wch: 36 }, { wch: 50 }, { wch: 50 }, { wch: 60 }, { wch: 8 }
  ];
  XLSX.utils.book_append_sheet(wb, wsTC, 'Test Cases');

  const excelPath = path.join(REPORTS_DIR, 'test-report.xlsx');
  XLSX.writeFile(wb, excelPath);
  console.log(`\nExcel Report Generated: ${excelPath}`);
}

// ---------------------------------------------------------------------------
// HTML Report Generator
// ---------------------------------------------------------------------------
function generateHTMLReport(data) {
  const duration = ((data.endTime - data.startTime) / 1000).toFixed(2);
  const passRate = data.total > 0 ? ((data.passed / data.total) * 100).toFixed(0) : 0;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HistoQuanta Automated Test Dashboard</title>
  <style>
    :root {
      --primary: #0f4c81;
      --primary-light: #eef5fc;
      --success: #10b981;
      --success-light: #ecfdf5;
      --danger: #ef4444;
      --danger-light: #fef2f2;
      --bg: #f4f7f9;
      --surface: #ffffff;
      --text: #1e293b;
      --text-muted: #64748b;
      --border: #e2e8f0;
      --radius: 12px;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    body { background: var(--bg); color: var(--text); padding: 2.5rem; }
    .container { max-width: 1100px; margin: 0 auto; }
    header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
    h1 { font-size: 1.75rem; font-weight: 800; color: var(--primary); }
    .timestamp { font-size: 0.875rem; color: var(--text-muted); }
    .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; margin-bottom: 2rem; }
    .card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.5rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    .card-label { font-size: 0.875rem; font-weight: 600; color: var(--text-muted); margin-bottom: 0.5rem; }
    .card-value { font-size: 2rem; font-weight: 800; color: var(--text); }
    .card.pass { border-left: 4px solid var(--success); }
    .card.fail { border-left: 4px solid var(--danger); }
    .card.total { border-left: 4px solid var(--primary); }
    .suite-section { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); margin-bottom: 1.5rem; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    .suite-header { padding: 1.25rem 1.5rem; background: #fafbfc; border-bottom: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
    .suite-title { font-weight: 700; font-size: 1.125rem; display: flex; align-items: center; gap: 0.75rem; }
    .badge { font-size: 0.75rem; font-weight: 700; padding: 0.25rem 0.625rem; border-radius: 50px; text-transform: uppercase; }
    .badge-passed { background: var(--success-light); color: var(--success); border: 1px solid rgba(16,185,129,0.2); }
    .badge-failed { background: var(--danger-light); color: var(--danger); border: 1px solid rgba(239,68,68,0.2); }
    .suite-body { padding: 1.5rem; }
    .log-title { font-size: 0.875rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; }
    .log-container { background: #0f172a; color: #cbd5e1; padding: 1rem 1.25rem; border-radius: 8px; font-family: Menlo, Monaco, Consolas, "Courier New", monospace; font-size: 0.85rem; line-height: 1.6; margin-bottom: 1.5rem; max-height: 280px; overflow-y: auto; }
    .log-pass { color: #86efac; }
    .log-fail { color: #fca5a5; }
    .log-info { color: #94a3b8; }
    .error-container { background: #fef2f2; border: 1px solid #fee2e2; color: #991b1b; padding: 1rem 1.25rem; border-radius: 8px; font-family: Menlo, Monaco, Consolas, "Courier New", monospace; font-size: 0.85rem; margin-bottom: 1.5rem; white-space: pre-wrap; }
    .screenshot-gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 1rem; }
    .screenshot-card { border: 1px solid var(--border); border-radius: 8px; overflow: hidden; cursor: pointer; background: var(--bg); transition: transform 0.2s, box-shadow 0.2s; }
    .screenshot-card:hover { transform: translateY(-2px); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
    .screenshot-card img { width: 100%; height: 110px; object-fit: cover; display: block; border-bottom: 1px solid var(--border); }
    .screenshot-label { padding: 0.5rem; font-size: 0.75rem; font-weight: 600; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: var(--text); }
    .modal { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(15,23,42,0.8); z-index: 1000; justify-content: center; align-items: center; padding: 2rem; }
    .modal-content { position: relative; max-width: 90%; max-height: 90%; background: var(--surface); padding: 0.5rem; border-radius: 8px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.2); }
    .modal-content img { max-width: 100%; max-height: 80vh; display: block; }
    .modal-close { position: absolute; top: -35px; right: 0; color: #fff; font-size: 1.5rem; font-weight: bold; cursor: pointer; background: none; border: none; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div>
        <h1>HistoQuanta Automation Report</h1>
        <div class="timestamp">Executed on ${data.startTime.toLocaleString()}</div>
      </div>
      <div class="badge ${passRate === '100' ? 'badge-passed' : 'badge-failed'}" style="font-size: 1rem; padding: 0.5rem 1rem;">
        Pass Rate: ${passRate}%
      </div>
    </header>

    <div class="summary-grid">
      <div class="card total"><div class="card-label">Total Suites</div><div class="card-value">${data.total}</div></div>
      <div class="card pass"><div class="card-label">Passed</div><div class="card-value" style="color:var(--success)">${data.passed}</div></div>
      <div class="card fail"><div class="card-label">Failed</div><div class="card-value" style="color:var(--danger)">${data.failed}</div></div>
      <div class="card"><div class="card-label">Duration</div><div class="card-value">${duration}s</div></div>
    </div>

    <h2 style="font-size:1.25rem;font-weight:700;margin-bottom:1rem;color:var(--text-muted);text-transform:uppercase;">Detailed Test Results</h2>

    ${data.suites.map((suite, idx) => `
      <div class="suite-section">
        <div class="suite-header" onclick="toggleSuite(${idx})">
          <div class="suite-title">
            <span class="badge ${suite.status === 'PASSED' ? 'badge-passed' : 'badge-failed'}">${suite.status}</span>
            <span>${suite.name}</span>
          </div>
          <div style="font-size:0.875rem;color:var(--text-muted)">${(suite.durationMs / 1000).toFixed(2)}s &nbsp;▾</div>
        </div>
        <div class="suite-body" id="suite-body-${idx}" style="display:none">
          ${suite.error ? `
            <div class="log-title" style="color:var(--danger)">Failure Details</div>
            <div class="error-container">${suite.error}</div>
          ` : ''}

          <div class="log-title">Execution Log</div>
          <div class="log-container">
            ${suite.logs.map(line => {
              const cls = line.includes('✔') ? 'log-pass' : line.includes('❌') ? 'log-fail' : 'log-info';
              return `<div class="${cls}">${line.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</div>`;
            }).join('')}
          </div>

          ${suite.screenshots.length > 0 ? `
            <div class="log-title">Captured Screenshots (${suite.screenshots.length})</div>
            <div class="screenshot-gallery">
              ${suite.screenshots.map(s => `
                <div class="screenshot-card" onclick="openModal('${s.relativePath}')">
                  <img src="${s.relativePath}" alt="${s.name}" onerror="this.style.display='none'">
                  <div class="screenshot-label">${s.name}</div>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      </div>
    `).join('')}
  </div>

  <div id="modal" class="modal" onclick="closeModal()">
    <div class="modal-content" onclick="event.stopPropagation()">
      <button class="modal-close" onclick="closeModal()">&times;</button>
      <img id="modal-img" src="" alt="Screenshot">
    </div>
  </div>

  <script>
    // Auto-expand failed suites
    document.querySelectorAll('.suite-body').forEach((body, idx) => {
      const header = document.querySelector(\`.suite-header:nth-of-type(\${idx + 1})\`);
      if (body.id && document.querySelector(\`#suite-body-\${idx}\`)) {
        const badge = document.querySelector(\`#suite-body-\${idx}\`)?.previousElementSibling?.querySelector('.badge');
        if (badge && badge.textContent === 'FAILED') {
          document.getElementById(\`suite-body-\${idx}\`).style.display = 'block';
        }
      }
    });
    // Actually expand failed suites properly
    ${data.suites.map((s, i) => s.status === 'FAILED' ? `document.getElementById('suite-body-${i}').style.display = 'block';` : '').join('\n    ')}

    function toggleSuite(idx) {
      const body = document.getElementById('suite-body-' + idx);
      body.style.display = body.style.display === 'none' ? 'block' : 'none';
    }
    function openModal(src) {
      document.getElementById('modal-img').src = src;
      document.getElementById('modal').style.display = 'flex';
    }
    function closeModal() {
      document.getElementById('modal').style.display = 'none';
    }
  </script>
</body>
</html>`;

  const htmlPath = path.join(REPORTS_DIR, 'dashboard.html');
  fs.writeFileSync(htmlPath, html);

  const excelFile = path.join(REPORTS_DIR, 'test-report.xlsx');

  console.log(`\n${'='.repeat(50)}`);
  console.log(`Test Execution Completed!`);
  console.log(`Pass Rate     : ${passRate}%  (${data.passed}/${data.total} suites)`);
  console.log(`Duration      : ${duration}s`);
  console.log(`HTML Report   : ${htmlPath}`);
  console.log(`Excel Report  : ${excelFile}`);
  console.log(`Screenshots   : ${SCREENSHOTS_DIR}`);
  console.log(`${'='.repeat(50)}\n`);
}

main().catch(err => {
  console.error(`\nFatal script error: ${err.message}`);
  process.exit(1);
});
