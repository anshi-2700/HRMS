@echo off
echo ========================================================
echo          Nexus Workforce OS - Server Stopper
echo ========================================================
echo.
echo Stopping all running containers...
docker compose down
echo.
echo All containers have been stopped successfully.
echo ========================================================
pause
