# 🚀 Quick Start Guide

Get InsightPilot AI running in **5 minutes**.

## Prerequisites

Ensure you have:
- Python 3.11+ installed
- Node.js 20+ installed
- Two free API keys (see below)

## Get Your API Keys (2 minutes)

### 1. Groq API Key
1. Visit [console.groq.com](https://console.groq.com/keys)
2. Sign up/login
3. Create new API key
4. Copy the key

### 2. Tavily API Key
1. Visit [tavily.com](https://tavily.com)
2. Sign up/login
3. Create new API key
4. Copy the key

## Installation (3 minutes)

### Clone the Repository
```bash
cd c:\Users\Tech Mehal\Desktop\Agentic-AI
```

### Setup Backend

**Open Terminal 1:**
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate it
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env

# Edit .env and add your API keys:
# GROQ_API_KEY=your_key_here
# TAVILY_API_KEY=your_key_here
# (Open with Notepad or VS Code)

# Start server
python -m uvicorn app.main:app --reload
```

✅ Backend running on `http://localhost:8000`

### Setup Frontend

**Open Terminal 2:**
```bash
cd frontend

# Install dependencies
npm install

# Create env file
copy .env.local.example .env.local

# Start dev server
npm run dev
```

✅ Frontend running on `http://localhost:3000`

## Use It (30 seconds)

1. **Open browser**: Go to `http://localhost:3000`
2. **Fill the form**:
   - Business Idea: `AI-powered customer support platform`
   - Company Name: `SupportAI`
   - Target Niche: `B2B SaaS`
3. **Click "Launch Analysis"**
4. **Watch it work!** 🎬
5. **Download the report** when ready

## Troubleshooting

### Backend won't start
```bash
# Make sure venv is activated
venv\Scripts\activate

# Reinstall requirements
pip install -r requirements.txt
```

### Frontend won't connect
- Check `.env.local` has: `NEXT_PUBLIC_API_URL=http://localhost:8000`
- Restart frontend: `npm run dev`

### API key errors
- Verify `.env` file exists in backend folder
- Check keys are correct (no extra spaces)
- Restart backend

## Next Steps

### Explore the Code
```
📁 Backend: backend/agents/orchestrator.py
📁 Frontend: frontend/components/AgentWorkflow.tsx
📁 Styling: frontend/styles/globals.css
```

### Customize
- **Change agent behavior**: Edit `backend/agents/*.py`
- **Modify UI**: Edit `frontend/components/*.tsx`
- **Adjust styling**: Edit `frontend/styles/globals.css`

### Deploy
See [SETUP_GUIDE.md](SETUP_GUIDE.md) for Docker and production deployment.

## Documentation

- 📖 [README.md](README.md) - Full overview
- 🛠️ [SETUP_GUIDE.md](SETUP_GUIDE.md) - Detailed setup
- 🏗️ [ARCHITECTURE.md](ARCHITECTURE.md) - Technical architecture
- 📚 [API_REFERENCE.md](API_REFERENCE.md) - API documentation

## File Structure

```
agentic-ai/
├── backend/              ← Python FastAPI
│   ├── agents/          ← Autonomous agents
│   ├── api/             ← REST endpoints
│   └── requirements.txt
├── frontend/             ← Next.js React
│   ├── app/             ← Pages
│   ├── components/      ← UI components
│   └── package.json
└── README.md            ← Start here
```

## Commands Reference

```bash
# Backend
cd backend
source venv/bin/activate        # Windows: venv\Scripts\activate
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload

# Frontend
cd frontend
npm install
npm run dev

# Docker (all-in-one)
docker-compose up --build
```

## What You Get

✨ **Elite UI**
- Glassmorphism design
- Smooth animations
- Real-time updates

🤖 **Autonomous Agents**
- Research agent (Tavily)
- Competitor analysis (Groq)
- Strategy generation (Groq)
- Report generation (Groq)

📊 **Professional Reports**
- Executive summaries
- Competitive analysis
- Market trends
- Actionable recommendations

---

**Happy building! Questions? Check the docs or open an issue.** 🚀
