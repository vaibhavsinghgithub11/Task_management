#!/bin/bash

# Environment Setup Script
# Usage: ./scripts/setup-env.sh

set -e

echo "🔧 Environment Setup Wizard"
echo ""

# Function to generate secure JWT secret
generate_jwt_secret() {
    node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
}

# Backend Environment Setup
echo "📦 Setting up Backend Environment..."
if [ ! -f "./backend/.env" ]; then
    cp ./backend/.env.example ./backend/.env
    
    # Generate JWT secret
    JWT_SECRET=$(generate_jwt_secret)
    
    # Update .env file with generated secret
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/your_jwt_secret_here/$JWT_SECRET/" ./backend/.env
    else
        sed -i "s/your_jwt_secret_here/$JWT_SECRET/" ./backend/.env
    fi
    
    echo "✅ Backend .env created with secure JWT secret"
    echo ""
    echo "⚠️  Please update the following in backend/.env:"
    echo "   - MONGO_URI (your MongoDB connection string)"
    echo "   - FRONTEND_URL (after deploying frontend)"
else
    echo "✅ Backend .env already exists"
fi

echo ""

# Frontend Environment Setup
echo "🎨 Setting up Frontend Environment..."
if [ ! -f "./frontend/.env" ]; then
    cp ./frontend/.env.example ./frontend/.env
    echo "✅ Frontend .env created"
    echo ""
    echo "⚠️  Please update the following in frontend/.env:"
    echo "   - VITE_API_URL (after deploying backend)"
else
    echo "✅ Frontend .env already exists"
fi

echo ""

# Docker Environment Setup
echo "🐳 Setting up Docker Environment..."
if [ ! -f "./.env" ]; then
    cp ./.env.docker ./.env
    
    # Generate JWT secret for Docker
    JWT_SECRET=$(generate_jwt_secret)
    
    # Update .env file
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/change_this_to_a_secure_random_string_min_32_characters/$JWT_SECRET/" ./.env
    else
        sed -i "s/change_this_to_a_secure_random_string_min_32_characters/$JWT_SECRET/" ./.env
    fi
    
    echo "✅ Docker .env created with secure JWT secret"
    echo ""
    echo "⚠️  Please update the following in .env:"
    echo "   - MONGO_ROOT_PASSWORD (secure password for MongoDB)"
else
    echo "✅ Docker .env already exists"
fi

echo ""
echo "✨ Environment setup complete!"
echo ""
echo "📋 Next Steps:"
echo "   1. Update environment variables in .env files"
echo "   2. Install dependencies: npm install (in both backend and frontend)"
echo "   3. Start development: npm run dev"
echo "   4. Or deploy: ./scripts/deploy-all.sh"
