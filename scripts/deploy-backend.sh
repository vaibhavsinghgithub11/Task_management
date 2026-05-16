#!/bin/bash

# Backend Deployment Script
# Usage: ./scripts/deploy-backend.sh [platform]
# Platforms: railway, heroku, docker

set -e

PLATFORM=${1:-railway}
BACKEND_DIR="./backend"

echo "🚀 Deploying Backend to $PLATFORM..."

cd $BACKEND_DIR

case $PLATFORM in
  railway)
    echo "📦 Deploying to Railway..."
    
    # Check if Railway CLI is installed
    if ! command -v railway &> /dev/null; then
        echo "❌ Railway CLI not found. Installing..."
        npm install -g @railway/cli
    fi
    
    # Deploy
    railway up
    
    echo "✅ Backend deployed to Railway!"
    echo "🔗 Get your URL with: railway domain"
    ;;
    
  heroku)
    echo "📦 Deploying to Heroku..."
    
    # Check if Heroku CLI is installed
    if ! command -v heroku &> /dev/null; then
        echo "❌ Heroku CLI not found. Please install it first."
        exit 1
    fi
    
    # Deploy
    git push heroku main
    
    echo "✅ Backend deployed to Heroku!"
    ;;
    
  docker)
    echo "🐳 Building Docker image..."
    
    # Build image
    docker build -t team-task-backend:latest .
    
    echo "✅ Docker image built successfully!"
    echo "💡 Run with: docker run -p 5001:5001 --env-file .env team-task-backend:latest"
    ;;
    
  *)
    echo "❌ Unknown platform: $PLATFORM"
    echo "Available platforms: railway, heroku, docker"
    exit 1
    ;;
esac

cd ..
echo "✨ Deployment complete!"
