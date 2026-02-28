@echo off
echo ========================================
echo GitHub Push - Final Step
echo ========================================
echo.
echo This will attempt to push your project to GitHub.
echo A login window may appear - sign in with your GitHub account.
echo.
pause

PowerShell -ExecutionPolicy Bypass -File "%~dp0auto-push.ps1"
