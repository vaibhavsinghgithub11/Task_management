#!/bin/bash

# Railway Environment Variables Setup Script
# Run this if you have Railway CLI installed: railway login && railway link

echo "Setting up Railway environment variables..."

railway variables set MONGO_URI="mongodb+srv://simp23le_db_user:yrAI62RRqGWZ0pKm@cluster0.deez2qh.mongodb.net/team-task-manager?retryWrites=true&w=majority"

railway variables set JWT_SECRET="745ff757f8342a32b23477a7b994dd272996c90692dafd805a2075f7f95d549b8096fb06d0529b78213f9621a6aa18dc2d0a420091025cb063504ad1ee92a889"

railway variables set JWT_EXPIRE="7d"

railway variables set NODE_ENV="production"

railway variables set PORT="5001"

echo "✅ Environment variables set successfully!"
echo "⚠️  Don't forget to set FRONTEND_URL manually with your frontend deployment URL"
