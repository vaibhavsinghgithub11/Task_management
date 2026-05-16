#!/bin/bash

echo "🚀 Deploying with ngrok + Vercel"
echo ""

# Check if ngrok is running
if ! pgrep -x "ngrok" > /dev/null; then
    echo "❌ ngrok is not running!"
    echo ""
    echo "Please start ngrok in another terminal:"
    echo "  ngrok http 5001"
    echo ""
    echo "Then run this script again."
    exit 1
fi

# Get ngrok URL
echo "🔍 Getting ngrok URL..."
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o '"public_url":"https://[^"]*' | grep -o 'https://[^"]*' | head -1)

if [ -z "$NGROK_URL" ]; then
    echo "❌ Could not get ngrok URL"
    echo "Make sure ngrok is running on port 5001"
    exit 1
fi

echo "✅ ngrok URL: $NGROK_URL"
echo ""

# Update frontend .env
echo "📝 Updating frontend environment..."
cd frontend || exit 1
echo "VITE_API_URL=$NGROK_URL/api" > .env
echo "✅ Frontend .env updated"
echo ""

# Update Vercel environment variable
echo "📝 Updating Vercel environment..."
vercel env rm VITE_API_URL production -y 2>/dev/null || true
echo "$NGROK_URL/api" | vercel env add VITE_API_URL production
echo "✅ Vercel environment updated"
echo ""

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod
echo ""

echo "✨ Deployment complete!"
echo ""
echo "📋 Important:"
echo "  • ngrok URL: $NGROK_URL"
echo "  • Keep ngrok terminal running!"
echo "  • Update backend CORS if needed"
echo ""
echo "📝 Next steps:"
echo "  1. Visit your Vercel domain"
echo "  2. Test authentication"
echo "  3. Verify all features work"
echo ""
echo "💡 Tip: If ngrok URL changes, run this script again"
