"""
run_tests.py - Main runner for HistoQuanta E2E Test Suite
==========================================================
Runs all 130 Selenium test cases and generates the Excel report.

Usage:
    python run_tests.py
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
    print("  HistoQuanta - Selenium E2E Automated Test Suite")
    print("  Cancer Screening Portal - Web Application Testing")
    print("=" * 65)
    print(f"  Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"  Target:  http://localhost:3000")
    print(f"  Tests:   130 test cases across 10 modules")
    print("=" * 65)
    print()

    # Run pytest
    start = time.time()
    exit_code = subprocess.call([
        sys.executable, "-m", "pytest",
        "test_histoquanta.py",
        "-v",
        "--tb=short",
        "--no-header",
        "--continue-on-collection-errors",
    ], cwd=os.path.dirname(os.path.abspath(__file__)))

    elapsed = time.time() - start

    # Generate report from collected results
    print("\n\nGenerating Excel Report...\n")

    import json
    from generate_report import generate_excel_report

    results = []
    json_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "results.json")
    if os.path.exists(json_path):
        try:
            with open(json_path, "r", encoding="utf-8") as f:
                results = json.load(f)
        except Exception as e:
            print(f"ERROR: Failed to load results.json: {e}")

    if len(results) == 0:
        print("WARNING: No test results were loaded from results.json.")
        print("This may happen if tests were not run or all skipped.")
        print("Generating report with 0 results anyway...")

    report_path = generate_excel_report(results)

    # Generate and open HTML report
    try:
        from generate_html_report import generate_html_report
        html_path = generate_html_report(results)
        import webbrowser
        webbrowser.open(f"file://{os.path.abspath(html_path)}")
    except Exception as e:
        print(f"WARNING: Failed to generate/open HTML report: {e}")

    print(f"\nTotal execution time: {round(elapsed, 1)}s")
    print(f"Pytest exit code: {exit_code}")

    return exit_code


if __name__ == "__main__":
    sys.exit(main())
