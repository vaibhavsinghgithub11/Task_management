#!/bin/bash

# Full Stack Deployment Script
# Usage: ./scripts/deploy-all.sh

set -e

echo "🚀 Starting Full Stack Deployment..."
echo ""

# Check if .env files exist
if [ ! -f "./backend/.env" ]; then
    echo "⚠️  Backend .env file not found!"
    echo "Please create backend/.env from backend/.env.example"
    exit 1
fi

if [ ! -f "./frontend/.env" ]; then
    echo "⚠️  Frontend .env file not found!"
    echo "Please create frontend/.env from frontend/.env.example"
    exit 1
fi

# Deploy Backend
echo "📦 Step 1/3: Deploying Backend..."
./scripts/deploy-backend.sh railway
echo ""

# Wait for backend to be ready
echo "⏳ Waiting for backend to be ready..."
sleep 10
echo ""

# Deploy Frontend
echo "📦 Step 2/3: Deploying Frontend..."
./scripts/deploy-frontend.sh vercel
echo ""

# Verify deployment
echo "✅ Step 3/3: Verifying Deployment..."
echo ""

# Get URLs (you'll need to update these after first deployment)
echo "🔗 Deployment URLs:"
echo "   Backend:  Check Railway dashboard"
echo "   Frontend: Check Vercel dashboard"
echo ""

echo "📋 Post-Deployment Checklist:"
echo "   1. Update FRONTEND_URL in Railway environment variables"
echo "   2. Update VITE_API_URL in Vercel environment variables"
echo "   3. Test authentication flow"
echo "   4. Create admin user"
echo "   5. Run API tests at /api-test"
echo ""

echo "✨ Deployment complete!"
