"""
run_tests.py - Main runner for HistoQuanta Appium E2E Test Suite
================================================================
Runs all 20 mobile Appium test cases and generates the Excel/HTML reports.
"""

import subprocess
import sys
import os
import time
from datetime import datetime

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def main():
    print("=" * 65)
    print("  HistoQuanta - Appium Mobile Automated Test Suite")
    print("  Cancer Screening iOS Application - Mobile Testing")
    print("=" * 65)
    print(f"  Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"  Target:  iOS Simulator / Device")
    print(f"  Tests:   20 test cases across 5 modules")
    print("=" * 65)
    print()

    # Run pytest
    start = time.time()
    exit_code = subprocess.call([
        sys.executable, "-m", "pytest",
        ".",  # Run all test files in the directory
        "-v",
        "--tb=short",
        "--no-header",
    ], cwd=os.path.dirname(os.path.abspath(__file__)))

    elapsed = time.time() - start

    # Generate report from collected results
    print("\nGenerating Reports...\n")

    import json
    from generate_report import generate_excel_report
    from generate_html_report import generate_html_report

    results = []
    json_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "appium_results.json")
    if os.path.exists(json_path):
        try:
            with open(json_path, "r", encoding="utf-8") as f:
                results = json.load(f)
        except Exception as e:
            print(f"ERROR: Failed to load appium_results.json: {e}")

    if len(results) == 0:
        print("WARNING: No test results were loaded.")
        return exit_code

    # Generate Excel Report
    excel_path = generate_excel_report(results)
    
    # Generate HTML Report
    html_path = generate_html_report(results)

    # Open HTML report in browser (if not running in CI)
    if os.environ.get('CI') != 'true':
        try:
            import webbrowser
            webbrowser.open(f"file://{os.path.abspath(html_path)}")
        except Exception as e:
            print(f"WARNING: Could not auto-open HTML report: {e}")

    print(f"\nTotal execution time: {round(elapsed, 1)}s")
    print(f"Pytest exit code: {exit_code}")

    return exit_code

if __name__ == "__main__":
    sys.exit(main())
