@echo off
title HistoQuanta Selenium Test Runner
echo ========================================================
echo   HistoQuanta Portal - Starting E2E Automated Tests
echo ========================================================
echo.

:: Check PHP Backend Server (Port 8000)
netstat -ano | findstr LISTENING | findstr :8000 >nul
if %errorlevel% neq 0 (
    echo [1/3] Launching PHP Backend Server...
    start /min "HistoQuanta PHP Backend" C:\xampp\php\php.exe -S 127.0.0.1:8000 -t backend
    set BACKEND_STARTED=1
    timeout /t 2 /nobreak > nul
) else (
    echo [1/3] PHP Backend Server already running on port 8000.
)

:: Check Vite Frontend Server (Port 3000)
netstat -ano | findstr LISTENING | findstr :3000 >nul
if %errorlevel% neq 0 (
    echo [2/3] Launching Vite Frontend Server...
    cd web
    start /min "HistoQuanta Vite Frontend" cmd /c npm run dev
    cd ..
    set FRONTEND_STARTED=1
    timeout /t 5 /nobreak > nul
) else (
    echo [2/3] Vite Frontend Server already running on port 3000.
)

echo.
echo [3/3] Running automated test suite...
python e2e_tests/run_tests.py
echo.

:: Clean up servers if they were started by this script
if "%BACKEND_STARTED%"=="1" (
    echo Stopping PHP Backend Server...
    taskkill /f /fi "windowtitle eq HistoQuanta PHP Backend*" >nul 2>&1
)
if "%FRONTEND_STARTED%"=="1" (
    echo Stopping Vite Frontend Server...
    taskkill /f /fi "windowtitle eq HistoQuanta Vite Frontend*" >nul 2>&1
)

echo ========================================================
echo   Tests Completed!
echo ========================================================
pause
