# Academic Journal Publishing System - Docker Setup

This document provides instructions for running the AJPS application using Docker.

## Prerequisites

- Docker Desktop or Docker Engine installed
- Docker Compose installed
- At least 4GB RAM available for containers

## Quick Start

### Using Scripts (Recommended)

**Windows:**
```cmd
start.bat
```

**Linux/macOS:**
```bash
chmod +x start.sh
./start.sh
```

### Manual Start

1. **Build and start all services:**
   ```bash
   docker-compose up --build -d
   ```

2. **Check service status:**
   ```bash
   docker-compose ps
   ```

3. **View logs:**
   ```bash
   # All services
   docker-compose logs -f
   
   # Specific service
   docker-compose logs -f ajps-backend
   ```

## Access URLs

- **Frontend:** http://localhost:4500
- **Backend API:** http://localhost:8090/api
- **Database:** localhost:5432
- **Health Check:** http://localhost:8090/actuator/health

## Services

### 1. PostgreSQL Database (ajps-database)
- **Port:** 5432
- **Database:** academic_journal_publication_system
- **Username:** postgres
- **Password:** isdb62

### 2. Spring Boot Backend (ajps-backend)
- **Port:** 8090
- **Profile:** docker
- **Health Check:** /actuator/health

### 3. Angular Frontend (ajps-frontend)
- **Port:** 80 (mapped to 4500)
- **Nginx reverse proxy configured**

## Environment Configuration

### Backend Configuration
The backend uses the `docker` profile with these settings:
- Database connection to `ajps-database` container
- File uploads stored in Docker volume
- CORS configured for Docker network

### Frontend Configuration
- Nginx configured with reverse proxy to backend
- API calls routed through `/api/*` to backend
- Static file caching enabled

## File Uploads

Uploaded files are stored in a Docker volume `backend_uploads` and are persistent across container restarts.

## Useful Commands

### Container Management
```bash
# Stop all services
docker-compose down

# Restart a specific service
docker-compose restart ajps-backend

# Rebuild a specific service
docker-compose up --build ajps-backend

# Remove volumes (will delete uploaded files)
docker-compose down -v
```

### Debugging
```bash
# Access backend container shell
docker-compose exec ajps-backend sh

# Access database
docker-compose exec ajps-database psql -U postgres -d academic_journal_publication_system

# View frontend nginx logs
docker-compose logs ajps-frontend
```

## Production Deployment

For production deployment:

1. Update environment variables in `docker-compose.yml`
2. Use external database instead of containerized PostgreSQL
3. Configure proper domain names and SSL certificates
4. Set up proper backup strategies for volumes
5. Configure monitoring and logging

## Troubleshooting

### Common Issues

1. **Port conflicts:**
   - Ensure ports 80, 4500, 5432, and 8090 are not in use
   - Modify port mappings in docker-compose.yml if needed

2. **Database connection issues:**
   - Check if database container is healthy: `docker-compose ps`
   - Verify database logs: `docker-compose logs ajps-database`

3. **Frontend not loading:**
   - Check nginx configuration
   - Verify backend is accessible: `curl http://localhost:8090/actuator/health`

4. **File upload issues:**
   - Ensure backend_uploads volume has proper permissions
   - Check backend logs for file system errors

### Health Checks

All services include health checks. Check status with:
```bash
docker-compose ps
```

Healthy services will show "Up (healthy)" status.

## Development vs Docker

### Local Development
- Backend: `http://localhost:8090`
- Frontend: `http://localhost:4500`
- Uses `application-isdb.properties`

### Docker Environment
- All services containerized
- Internal Docker networking
- Uses `application-docker.properties`
- Nginx reverse proxy for frontend

## Security Notes

- Default passwords are used for development
- Change passwords for production deployment
- CORS is configured permissively for development
- Update security headers for production
