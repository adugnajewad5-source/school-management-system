@echo off
echo Starting School Management System...
echo.
echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && node index.js"
timeout /t 3 /nobreak >nul
echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && node node_modules/vite/bin/vite.js --host"
echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173 or http://localhost:5174
echo.
pause
