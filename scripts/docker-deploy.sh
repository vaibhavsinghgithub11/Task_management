#!/bin/bash

# Docker Compose Deployment Script
# Usage: ./scripts/docker-deploy.sh [command]
# Commands: up, down, restart, logs, build

set -e

COMMAND=${1:-up}

echo "🐳 Docker Deployment Manager"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install Docker first."
    exit 1
fi

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose not found. Please install Docker Compose first."
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found!"
    echo "Creating from .env.docker template..."
    cp .env.docker .env
    echo "✅ .env file created. Please update it with your values."
    echo ""
fi

case $COMMAND in
  up)
    echo "🚀 Starting all services..."
    docker-compose up -d
    echo ""
    echo "✅ Services started!"
    echo ""
    echo "🔗 Access your application:"
    echo "   Frontend:  http://localhost:8080"
    echo "   Backend:   http://localhost:5001"
    echo "   MongoDB:   mongodb://localhost:27017"
    echo ""
    echo "📊 View logs with: ./scripts/docker-deploy.sh logs"
    ;;
    
  down)
    echo "🛑 Stopping all services..."
    docker-compose down
    echo "✅ Services stopped!"
    ;;
    
  restart)
    echo "🔄 Restarting all services..."
    docker-compose restart
    echo "✅ Services restarted!"
    ;;
    
  logs)
    echo "📋 Showing logs (Ctrl+C to exit)..."
    docker-compose logs -f
    ;;
    
  build)
    echo "🔨 Building images..."
    docker-compose build --no-cache
    echo "✅ Images built!"
    ;;
    
  clean)
    echo "🧹 Cleaning up..."
    docker-compose down -v
    docker system prune -f
    echo "✅ Cleanup complete!"
    ;;
    
  status)
    echo "📊 Service Status:"
    docker-compose ps
    ;;
    
  *)
    echo "❌ Unknown command: $COMMAND"
    echo ""
    echo "Available commands:"
    echo "  up       - Start all services"
    echo "  down     - Stop all services"
    echo "  restart  - Restart all services"
    echo "  logs     - View logs"
    echo "  build    - Rebuild images"
    echo "  clean    - Remove containers and volumes"
    echo "  status   - Show service status"
    exit 1
    ;;
esac
