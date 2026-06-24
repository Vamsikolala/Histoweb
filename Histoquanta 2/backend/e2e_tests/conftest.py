"""
conftest.py - Pytest fixtures and configuration for HistoQuanta E2E Tests
"""
import pytest
import time
import json
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

BASE_URL = "http://localhost:3000"

# ─── Test credentials (create via signup or use existing) ───
TEST_LICENSE = "TESTLIC001"
TEST_PASSWORD = "Test@1234"
TEST_NAME = "Dr. SeleniumBot"
TEST_EMAIL = "seleniumbot_histoquanta@test.com"


@pytest.fixture(scope="session")
def driver():
    """Create a single browser instance for the entire test session."""
    chrome_options = Options()
    chrome_options.add_argument("--start-maximized")
    chrome_options.add_argument("--disable-extensions")
    chrome_options.add_argument("--disable-popup-blocking")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    import os
    if os.environ.get('CI') == 'true':
        chrome_options.add_argument("--headless=new")

    service = Service(ChromeDriverManager().install())
    drv = webdriver.Chrome(service=service, options=chrome_options)
    drv.implicitly_wait(5)
    yield drv
    drv.quit()


@pytest.fixture(scope="session")
def wait(driver):
    """Return an explicit wait with 10-second timeout."""
    return WebDriverWait(driver, 10)


def login_as_test_doctor(driver, wait):
    """Helper: ensure logged in as the test doctor."""
    driver.get(f"{BASE_URL}/login")
    time.sleep(1)
    # Check if already on dashboard (already logged in)
    if "/dashboard" in driver.current_url:
        return

    try:
        license_input = wait.until(EC.presence_of_element_located((By.ID, "login-license")))
        license_input.clear()
        license_input.send_keys(TEST_LICENSE)

        password_input = driver.find_element(By.ID, "login-password")
        password_input.clear()
        password_input.send_keys(TEST_PASSWORD)

        driver.find_element(By.ID, "login-submit").click()
        time.sleep(2)
    except Exception:
        pass


# ─── Test Result Collector ───
class TestResultCollector:
    """Collects test results for Excel report generation."""
    def __init__(self):
        self.results = []
        self.start_time = datetime.now()

    def add_result(self, test_id, module, test_case, description, steps,
                   expected, actual, status, execution_time=0.0, screenshot=""):
        self.results.append({
            "test_id": test_id,
            "module": module,
            "test_case": test_case,
            "description": description,
            "steps": steps,
            "expected_result": expected,
            "actual_result": actual,
            "status": status,
            "execution_time": round(execution_time, 2),
            "screenshot": screenshot,
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        })


# Global collector instance
collector = TestResultCollector()
import pytest
pytest.collector = collector


def pytest_sessionfinish(session, exitstatus):
    """Auto-generate Excel report and dump to JSON when pytest session finishes."""
    if len(collector.results) > 0:
        # Save results to a json file for the parent runner script to read
        try:
            with open("results.json", "w", encoding="utf-8") as f:
                json.dump(collector.results, f, indent=2)
        except Exception as e:
            print(f"\n[WARN] Could not write results.json: {e}")

        # Still attempt to generate Excel directly in case pytest is run alone
        try:
            from generate_report import generate_excel_report
            generate_excel_report(collector.results)
        except Exception as e:
            print(f"\n[WARN] Could not generate Excel report: {e}")


def pytest_configure(config):
    """Register custom markers."""
    config.addinivalue_line("markers", "login: Login page tests")
    config.addinivalue_line("markers", "signup: Signup page tests")
    config.addinivalue_line("markers", "dashboard: Dashboard tests")
    config.addinivalue_line("markers", "clinical: Clinical module tests")
