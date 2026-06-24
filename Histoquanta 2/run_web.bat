@echo off
title HistoQuanta Web App Runner
echo ========================================================
echo   HistoQuanta Portal - Starting Local Development Servers
echo ========================================================
echo.

:: 1. Start PHP Backend Server in a background process
echo [1/2] Launching PHP Backend Server on http://127.0.0.1:8000...
start "HistoQuanta PHP Backend" /min C:\xampp\php\php.exe -S 127.0.0.1:8000 -t backend
timeout /t 2 /nobreak > nul

:: 2. Start Vite dev frontend server in the current terminal window
echo [2/2] Launching Vite Frontend Server on http://localhost:3000...
echo.
cd web
npm run dev
