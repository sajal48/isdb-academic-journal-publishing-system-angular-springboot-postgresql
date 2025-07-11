#!/bin/bash

# Build and start all services
echo "Building and starting AJPS application..."

# Stop any running containers
docker-compose down

# Build and start services
docker-compose up --build -d

# Wait for services to be healthy
echo "Waiting for services to be ready..."
sleep 30

# Check if services are running
echo "Checking service status..."
docker-compose ps

echo "Application should be available at:"
echo "Frontend: http://localhost:4500"
echo "Backend API: http://localhost:8090/api"
echo "Database: localhost:5432"

echo "To view logs: docker-compose logs -f [service-name]"
echo "To stop: docker-compose down"
