#!/bin/bash

# Rollback Script
# Usage: ./scripts/rollback.sh [platform]
# Platforms: railway, vercel, docker

set -e

PLATFORM=${1:-railway}

echo "🔄 Rolling back deployment on $PLATFORM..."
echo ""

case $PLATFORM in
  railway)
    echo "📦 Rolling back Railway deployment..."
    
    if ! command -v railway &> /dev/null; then
        echo "❌ Railway CLI not found. Please install it first."
        exit 1
    fi
    
    cd backend
    railway rollback
    cd ..
    
    echo "✅ Railway deployment rolled back!"
    ;;
    
  vercel)
    echo "📦 Rolling back Vercel deployment..."
    
    if ! command -v vercel &> /dev/null; then
        echo "❌ Vercel CLI not found. Please install it first."
        exit 1
    fi
    
    cd frontend
    vercel rollback
    cd ..
    
    echo "✅ Vercel deployment rolled back!"
    ;;
    
  docker)
    echo "🐳 Rolling back Docker deployment..."
    
    # Stop current containers
    docker-compose down
    
    # Pull previous images (if tagged)
    echo "⚠️  Manual rollback required for Docker:"
    echo "   1. Tag your current images before deploying"
    echo "   2. Use: docker tag team-task-backend:latest team-task-backend:backup"
    echo "   3. To rollback: docker tag team-task-backend:backup team-task-backend:latest"
    echo "   4. Then: docker-compose up -d"
    ;;
    
  all)
    echo "🔄 Rolling back all platforms..."
    ./scripts/rollback.sh railway
    ./scripts/rollback.sh vercel
    echo "✅ All platforms rolled back!"
    ;;
    
  *)
    echo "❌ Unknown platform: $PLATFORM"
    echo "Available platforms: railway, vercel, docker, all"
    exit 1
    ;;
esac

echo ""
echo "✨ Rollback complete!"
