#!/bin/bash

# Start database services
echo "Starting database services..."
docker-compose up -d postgres mongodb redis

# Wait for services to be ready
echo "Waiting for services to be ready..."
sleep 10

# Check if services are healthy
echo "Checking service health..."
docker-compose ps

echo "Development environment is ready!"
echo "PostgreSQL: localhost:5432"
echo "MongoDB: localhost:27017"  
echo "Redis: localhost:6379"
echo ""
echo "To start the backend: cd backend && python run.py"
echo "To start the frontend: cd frontend && npm run dev"
