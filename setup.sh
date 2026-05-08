#!/bin/bash
# setup.sh - One-command setup script

set -e

echo "🚀 InsightPilot AI - Setup"
echo "======================================"

# Check prerequisites
echo "Checking prerequisites..."

if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 not found. Please install Python 3.11+"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 20+"
    exit 1
fi

echo "✅ Python and Node.js found"

# Setup Backend
echo ""
echo "Setting up backend..."
cd backend

if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo "✅ Virtual environment created"
fi

source venv/bin/activate
pip install -r requirements.txt > /dev/null 2>&1
echo "✅ Backend dependencies installed"

if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "⚠️  Created .env file - please add your API keys"
    echo "   GROQ_API_KEY: https://console.groq.com/keys"
    echo "   TAVILY_API_KEY: https://tavily.com"
fi

cd ..

# Setup Frontend
echo ""
echo "Setting up frontend..."
cd frontend

npm install > /dev/null 2>&1
echo "✅ Frontend dependencies installed"

if [ ! -f ".env.local" ]; then
    cp .env.local.example .env.local
    echo "✅ Created .env.local"
fi

cd ..

echo ""
echo "======================================"
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Add API keys to backend/.env"
echo "2. Terminal 1: cd backend && source venv/bin/activate && python -m uvicorn app.main:app --reload"
echo "3. Terminal 2: cd frontend && npm run dev"
echo "4. Open http://localhost:3000"
echo ""
echo "📖 See QUICK_START.md for details"
echo "======================================"
