@echo off
echo Starting Nexus Workforce API (Django Ninja)...
cd /d %~dp0backend
call ..\venv\Scripts\activate.bat
python manage.py runserver 0.0.0.0:8000
