#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Nimble - Quick Tools Application${NC}"
echo "=================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Error: Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi

# Function to show usage
show_usage() {
    echo "Usage: $0 [option]"
    echo ""
    echo "Options:"
    echo "  dev     - Start in development mode (hot reload)"
    echo "  prod    - Start in production mode"
    echo "  stop    - Stop all containers"
    echo "  clean   - Stop and remove all containers and images"
    echo "  logs    - Show logs from running containers"
    echo "  help    - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 dev     # Start development server on http://localhost:31415"
    echo "  $0 prod    # Start production server on http://localhost:31415"
    echo "  $0 stop    # Stop all running containers"
}

# Function to start development mode
start_dev() {
    echo -e "${YELLOW}Starting Nimble in development mode...${NC}"
    echo "The app will be available at: http://localhost:31415"
    echo "Press Ctrl+C to stop"
    echo ""
    docker-compose -f docker-compose.dev.yml up --build
}

# Function to start production mode
start_prod() {
    echo -e "${YELLOW}Starting Nimble in production mode...${NC}"
    echo "The app will be available at: http://localhost:31415"
    echo "Press Ctrl+C to stop"
    echo ""
    docker-compose up --build
}

# Function to stop containers
stop_containers() {
    echo -e "${YELLOW}Stopping all containers...${NC}"
    docker-compose down
    docker-compose -f docker-compose.dev.yml down
    echo -e "${GREEN}All containers stopped.${NC}"
}

# Function to clean everything
clean_all() {
    echo -e "${YELLOW}Cleaning all containers and images...${NC}"
    docker-compose down --rmi all --volumes --remove-orphans
    docker-compose -f docker-compose.dev.yml down --rmi all --volumes --remove-orphans
    echo -e "${GREEN}Cleanup completed.${NC}"
}

# Function to show logs
show_logs() {
    echo -e "${YELLOW}Showing logs from running containers...${NC}"
    docker-compose logs -f
}

# Main script logic
case "${1:-help}" in
    "dev")
        start_dev
        ;;
    "prod")
        start_prod
        ;;
    "stop")
        stop_containers
        ;;
    "clean")
        clean_all
        ;;
    "logs")
        show_logs
        ;;
    "help"|*)
        show_usage
        ;;
esac 