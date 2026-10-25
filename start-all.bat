@echo off
echo ========================================================
echo          Nexus Workforce OS - Docker Launcher
echo ========================================================
echo.
echo Starting all containers (Frontend, Backend, PostgreSQL, Redis)...
docker compose up -d
echo.
echo Containers are up and running!
echo.
echo - Frontend Application:    http://localhost:5173
echo - Backend API & Swagger:   http://localhost:8000/api/docs
echo - Django Admin Portal:     http://localhost:8000/admin/
echo.
echo Run "docker compose logs -f" to view live logs.
echo Run "docker compose down" to stop all containers.
echo ========================================================
pause
