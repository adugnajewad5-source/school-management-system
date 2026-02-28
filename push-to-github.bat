@echo off
REM Push School Management System to GitHub
REM Repository: https://github.com/adugnajewad5-source/school-management-system

echo ========================================
echo Pushing to GitHub...
echo ========================================
echo.

REM Initialize git
echo Step 1: Initializing git repository...
git init
if errorlevel 1 goto error

REM Add all files
echo.
echo Step 2: Adding all files...
git add .
if errorlevel 1 goto error

REM Create commit
echo.
echo Step 3: Creating commit...
git commit -m "Initial commit - School Management System

- Complete school management system
- Student, Teacher, Admin, and Parent portals
- Real-time notifications
- Responsive design (phone and PC)
- Cloudinary integration for file uploads
- MySQL database
- Secure authentication
- Production-ready"
if errorlevel 1 goto error

REM Add remote
echo.
echo Step 4: Adding remote repository...
git remote add origin https://github.com/adugnajewad5-source/school-management-system.git
if errorlevel 1 goto error

REM Rename branch
echo.
echo Step 5: Renaming branch to main...
git branch -M main
if errorlevel 1 goto error

REM Push to GitHub
echo.
echo Step 6: Pushing to GitHub...
git push -u origin main
if errorlevel 1 goto error

echo.
echo ========================================
echo SUCCESS! Project pushed to GitHub!
echo ========================================
echo.
echo Repository: https://github.com/adugnajewad5-source/school-management-system
echo.
pause
exit /b 0

:error
echo.
echo ========================================
echo ERROR! Something went wrong.
echo ========================================
echo.
echo Make sure:
echo 1. Git is installed (https://git-scm.com/download/win)
echo 2. You are in the project root directory
echo 3. GitHub credentials are configured
echo.
pause
exit /b 1
