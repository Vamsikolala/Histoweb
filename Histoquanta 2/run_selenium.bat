@echo off
title HistoQuanta Selenium Test Runner
echo ========================================================
echo   HistoQuanta Portal - Starting Selenium Automated Tests
echo ========================================================
echo.
echo [1/2] Verifying dependencies...
pip install -r e2e_tests/requirements.txt
echo.
echo [2/2] Running automated test suite...
python e2e_tests/run_tests.py
echo.
echo ========================================================
echo   Tests Completed!
echo ========================================================
pause
