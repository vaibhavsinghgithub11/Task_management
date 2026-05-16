#!/bin/bash

# Health Check Script
# Usage: ./scripts/health-check.sh [backend_url] [frontend_url]

set -e

BACKEND_URL=${1:-http://localhost:5001}
FRONTEND_URL=${2:-http://localhost:8080}

echo "🏥 Running Health Checks..."
echo ""

# Backend Health Check
echo "🔍 Checking Backend ($BACKEND_URL)..."
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" $BACKEND_URL/health || echo "000")

if [ "$BACKEND_STATUS" = "200" ]; then
    echo "✅ Backend is healthy!"
    
    # Get backend info
    BACKEND_INFO=$(curl -s $BACKEND_URL/health)
    echo "   Response: $BACKEND_INFO"
else
    echo "❌ Backend is unhealthy! (Status: $BACKEND_STATUS)"
fi

echo ""

# Frontend Health Check
echo "🔍 Checking Frontend ($FRONTEND_URL)..."
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" $FRONTEND_URL || echo "000")

if [ "$FRONTEND_STATUS" = "200" ]; then
    echo "✅ Frontend is healthy!"
else
    echo "❌ Frontend is unhealthy! (Status: $FRONTEND_STATUS)"
fi

echo ""

# Database Connection Check (if backend is healthy)
if [ "$BACKEND_STATUS" = "200" ]; then
    echo "🔍 Checking Database Connection..."
    DB_STATUS=$(curl -s $BACKEND_URL/api/auth/health 2>/dev/null || echo "error")
    
    if [ "$DB_STATUS" != "error" ]; then
        echo "✅ Database connection is healthy!"
    else
        echo "⚠️  Could not verify database connection"
    fi
fi

echo ""

# Summary
echo "📊 Health Check Summary:"
echo "   Backend:  $([ "$BACKEND_STATUS" = "200" ] && echo "✅ Healthy" || echo "❌ Unhealthy")"
echo "   Frontend: $([ "$FRONTEND_STATUS" = "200" ] && echo "✅ Healthy" || echo "❌ Unhealthy")"

if [ "$BACKEND_STATUS" = "200" ] && [ "$FRONTEND_STATUS" = "200" ]; then
    echo ""
    echo "✨ All systems operational!"
    exit 0
else
    echo ""
    echo "⚠️  Some systems are down!"
    exit 1
fi
