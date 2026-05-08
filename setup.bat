@echo off
REM setup.bat - One-command setup script for Windows

echo 🚀 AI Research ^& Strategy Agent - Setup
echo ======================================

REM Check Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python not found. Please install Python 3.11+
    pause
    exit /b 1
)
echo ✅ Python found

REM Check Node
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found. Please install Node.js 20+
    pause
    exit /b 1
)
echo ✅ Node.js found

REM Setup Backend
echo.
echo Setting up backend...
cd backend

if not exist "venv" (
    python -m venv venv
    echo ✅ Virtual environment created
)

call venv\Scripts\activate.bat
pip install -r requirements.txt >nul 2>&1
echo ✅ Backend dependencies installed

if not exist ".env" (
    copy .env.example .env
    echo ⚠️  Created .env file - please add your API keys
    echo    GROQ_API_KEY: https://console.groq.com/keys
    echo    TAVILY_API_KEY: https://tavily.com
)

cd ..

REM Setup Frontend
echo.
echo Setting up frontend...
cd frontend

call npm install >nul 2>&1
echo ✅ Frontend dependencies installed

if not exist ".env.local" (
    copy .env.local.example .env.local
    echo ✅ Created .env.local
)

cd ..

echo.
echo ======================================
echo ✅ Setup complete!
echo.
echo Next steps:
echo 1. Add API keys to backend\.env
echo 2. Terminal 1: cd backend ^& venv\Scripts\activate ^& python -m uvicorn app.main:app --reload
echo 3. Terminal 2: cd frontend ^& npm run dev
echo 4. Open http://localhost:3000
echo.
echo 📖 See QUICK_START.md for details
echo ======================================
pause
