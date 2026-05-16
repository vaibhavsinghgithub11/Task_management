#!/bin/bash

# Frontend Deployment Script
# Usage: ./scripts/deploy-frontend.sh [platform]
# Platforms: vercel, netlify, docker

set -e

PLATFORM=${1:-vercel}
FRONTEND_DIR="./frontend"

echo "🚀 Deploying Frontend to $PLATFORM..."

cd $FRONTEND_DIR

case $PLATFORM in
  vercel)
    echo "📦 Deploying to Vercel..."
    
    # Check if Vercel CLI is installed
    if ! command -v vercel &> /dev/null; then
        echo "❌ Vercel CLI not found. Installing..."
        npm install -g vercel
    fi
    
    # Deploy to production
    vercel --prod
    
    echo "✅ Frontend deployed to Vercel!"
    ;;
    
  netlify)
    echo "📦 Deploying to Netlify..."
    
    # Check if Netlify CLI is installed
    if ! command -v netlify &> /dev/null; then
        echo "❌ Netlify CLI not found. Installing..."
        npm install -g netlify-cli
    fi
    
    # Build
    npm run build
    
    # Deploy
    netlify deploy --prod --dir=dist
    
    echo "✅ Frontend deployed to Netlify!"
    ;;
    
  docker)
    echo "🐳 Building Docker image..."
    
    # Build image
    docker build -t team-task-frontend:latest \
      --build-arg VITE_API_URL=${VITE_API_URL:-http://localhost:5001/api} .
    
    echo "✅ Docker image built successfully!"
    echo "💡 Run with: docker run -p 8080:8080 team-task-frontend:latest"
    ;;
    
  *)
    echo "❌ Unknown platform: $PLATFORM"
    echo "Available platforms: vercel, netlify, docker"
    exit 1
    ;;
esac

cd ..
echo "✨ Deployment complete!"
