@echo off
title HistoQuanta Appium Test Runner
echo ========================================================
echo   HistoQuanta Portal - Starting Appium Automated Tests
echo ========================================================
echo.
echo [1/2] Verifying dependencies...
pip install -r appium_tests/requirements.txt
echo.
echo [2/2] Running automated test suite...
python appium_tests/run_tests.py
echo.
echo ========================================================
echo   Tests Completed!
echo ========================================================
pause
