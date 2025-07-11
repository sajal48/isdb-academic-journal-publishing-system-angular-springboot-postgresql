@echo off

REM Build and start all services
echo Building and starting AJPS application...

REM Stop any running containers
docker-compose down

REM Build and start services
docker-compose up --build -d

REM Wait for services to be ready
echo Waiting for services to be ready...
timeout /t 30 /nobreak > nul

REM Check if services are running
echo Checking service status...
docker-compose ps

echo.
echo Application should be available at:
echo Frontend: http://localhost:4500
echo Backend API: http://localhost:8090/api
echo Database: localhost:5432

echo.
echo To view logs: docker-compose logs -f [service-name]
echo To stop: docker-compose down
