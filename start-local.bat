@echo off
echo ========================================================
echo     Nexus Workforce OS - Local Independent Runner
echo ========================================================
echo.
echo Launching Backend server in a new window...
start "HRMS Backend (Port 8000)" cmd /k "%~dp0start-backend.bat"

echo Launching Frontend server in a new window...
start "HRMS Frontend (Port 5173)" cmd /k "%~dp0start-frontend.bat"

echo.
echo Both services launched!
echo - Frontend: http://localhost:5173
echo - Backend:  http://localhost:8000/api/docs
echo ========================================================
