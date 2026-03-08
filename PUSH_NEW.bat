@echo off
set GIT_PATH="C:\Program Files\Git\bin\git.exe"

echo.
echo ========================================
echo PUSHING NEW GUIDES TO GITHUB
echo ========================================
echo.

echo Step 1: Adding files...
%GIT_PATH% add .

echo Step 2: Committing...
%GIT_PATH% commit -m "Add imm