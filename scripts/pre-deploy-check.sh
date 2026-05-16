#!/bin/bash

# Pre-Deployment Checklist Script
# Usage: ./scripts/pre-deploy-check.sh

set -e

echo "✅ Pre-Deployment Checklist"
echo ""

ERRORS=0
WARNINGS=0

# Check if .env files exist
echo "🔍 Checking environment files..."
if [ -f "./backend/.env" ]; then
    echo "   ✅ Backend .env exists"
else
    echo "   ❌ Backend .env missing"
    ERRORS=$((ERRORS + 1))
fi

if [ -f "./frontend/.env" ]; then
    echo "   ✅ Frontend .env exists"
else
    echo "   ❌ Frontend .env missing"
    ERRORS=$((ERRORS + 1))
fi

echo ""

# Check if dependencies are installed
echo "🔍 Checking dependencies..."
if [ -d "./backend/node_modules" ]; then
    echo "   ✅ Backend dependencies installed"
else
    echo "   ⚠️  Backend dependencies not installed"
    WARNINGS=$((WARNINGS + 1))
fi

if [ -d "./frontend/node_modules" ]; then
    echo "   ✅ Frontend dependencies installed"
else
    echo "   ⚠️  Frontend dependencies not installed"
    WARNINGS=$((WARNINGS + 1))
fi

echo ""

# Check if builds work
echo "🔍 Testing builds..."

# Backend build
cd backend
if npm run build > /dev/null 2>&1; then
    echo "   ✅ Backend builds successfully"
else
    echo "   ❌ Backend build failed"
    ERRORS=$((ERRORS + 1))
fi
cd ..

# Frontend build
cd frontend
if npm run build > /dev/null 2>&1; then
    echo "   ✅ Frontend builds successfully"
else
    echo "   ❌ Frontend build failed"
    ERRORS=$((ERRORS + 1))
fi
cd ..

echo ""

# Check environment variables
echo "🔍 Checking critical environment variables..."

# Backend
if grep -q "your_jwt_secret_here" ./backend/.env 2>/dev/null; then
    echo "   ⚠️  Backend JWT_SECRET not updated"
    WARNINGS=$((WARNINGS + 1))
else
    echo "   ✅ Backend JWT_SECRET configured"
fi

if grep -q "mongodb://localhost" ./backend/.env 2>/dev/null; then
    echo "   ⚠️  Backend using local MongoDB (update for production)"
    WARNINGS=$((WARNINGS + 1))
else
    echo "   ✅ Backend MongoDB URI configured"
fi

# Frontend
if grep -q "localhost" ./frontend/.env 2>/dev/null; then
    echo "   ⚠️  Frontend using localhost API (update for production)"
    WARNINGS=$((WARNINGS + 1))
else
    echo "   ✅ Frontend API URL configured"
fi

echo ""

# Summary
echo "📊 Pre-Deployment Summary:"
echo "   Errors:   $ERRORS"
echo "   Warnings: $WARNINGS"
echo ""

if [ $ERRORS -gt 0 ]; then
    echo "❌ Deployment blocked! Please fix errors above."
    exit 1
elif [ $WARNINGS -gt 0 ]; then
    echo "⚠️  Deployment possible but warnings detected."
    echo "   Review warnings and proceed with caution."
    exit 0
else
    echo "✅ All checks passed! Ready to deploy."
    exit 0
fi
