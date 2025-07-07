#!/bin/bash

echo "🔄 Quick rebuild for production..."
echo "Stopping current container..."
docker-compose down

echo "Building and starting with latest code..."
docker-compose up --build -d

echo "✅ Rebuild complete! Visit http://localhost:31415"
echo "To view logs: docker-compose logs -f" 