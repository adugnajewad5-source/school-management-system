# Push School Management System to GitHub
# Repository: https://github.com/adugnajewad5-source/school-management-system

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

try {
    # Step 1: Initialize git
    Write-Host "Step 1: Initializing git repository..." -ForegroundColor Yellow
    git init
    if ($LASTEXITCODE -ne 0) { throw "Git init failed" }

    # Step 2: Add all files
    Write-Host ""
    Write-Host "Step 2: Adding all files..." -ForegroundColor Yellow
    git add .
    if ($LASTEXITCODE -ne 0) { throw "Git add failed" }

    # Step 3: Create commit
    Write-Host ""
    Write-Host "Step 3: Creating commit..." -ForegroundColor Yellow
    git commit -m "Initial commit - School Management System

- Complete school management system
- Student, Teacher, Admin, and Parent portals
- Real-time notifications
- Responsive design (phone and PC)
- Cloudinary integration for file uploads
- MySQL database
- Secure authentication
- Production-ready"
    if ($LASTEXITCODE -ne 0) { throw "Git commit failed" }

    # Step 4: Add remote
    Write-Host ""
    Write-Host "Step 4: Adding remote repository..." -ForegroundColor Yellow
    git remote add origin https://github.com/adugnajewad5-source/school-management-system.git
    if ($LASTEXITCODE -ne 0) { throw "Git remote add failed" }

    # Step 5: Rename branch
    Write-Host ""
    Write-Host "Step 5: Renaming branch to main..." -ForegroundColor Yellow
    git branch -M main
    if ($LASTEXITCODE -ne 0) { throw "Git branch rename failed" }

    # Step 6: Push to GitHub
    Write-Host ""
    Write-Host "Step 6: Pushing to GitHub..." -ForegroundColor Yellow
    git push -u origin main
    if ($LASTEXITCODE -ne 0) { throw "Git push failed" }

    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "SUCCESS! Project pushed to GitHub!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Repository: https://github.com/adugnajewad5-source/school-management-system" -ForegroundColor Green
    Write-Host ""
}
catch {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "ERROR! Something went wrong." -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Make sure:" -ForegroundColor Yellow
    Write-Host "1. Git is installed (https://git-scm.com/download/win)" -ForegroundColor Yellow
    Write-Host "2. You are in the project root directory" -ForegroundColor Yellow
    Write-Host "3. GitHub credentials are configured" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}
