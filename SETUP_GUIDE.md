# Setup Guide - InsightPilot AI

Complete step-by-step guide to get the application running.

## Prerequisites

### System Requirements
- **OS**: macOS, Linux, or Windows
- **RAM**: 4GB minimum (8GB recommended)
- **Disk Space**: 2GB available

### Required Software
- **Python**: 3.11 or higher ([download](https://www.python.org))
- **Node.js**: 20 or higher ([download](https://nodejs.org))
- **Git**: For cloning the repository
- **Docker** (optional): For containerized deployment

### API Keys (Required)
1. **Groq API Key** - Get at [console.groq.com](https://console.groq.com/keys)
2. **Tavily API Key** - Get at [tavily.com](https://tavily.com)

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/agentic-ai.git
cd agentic-ai
```

### 2. Backend Setup

#### Install Python Dependencies
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate

# Install packages
pip install -r requirements.txt
```

#### Configure Environment
```bash
# Copy example environment file
cp .env.example .env

# Edit .env and add your API keys
# Use your favorite text editor (VS Code, nano, etc.)
```

**Required .env values:**
```
GROQ_API_KEY=your_groq_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here
BACKEND_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
```

#### Start Backend Server
```bash
# From backend directory (with venv activated)
python -m uvicorn app.main:app --reload

# Output: Uvicorn running on http://127.0.0.1:8000
```

### 3. Frontend Setup

#### In a new terminal, navigate to frontend
```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local
```

**Verify .env.local:**
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

#### Start Frontend Dev Server
```bash
npm run dev

# Output: ▲ Next.js 15.0 running on http://localhost:3000
```

### 4. Verify Installation

1. **Open Frontend**: Visit `http://localhost:3000`
2. **Check Backend**: Visit `http://localhost:8000/health` in your browser
3. **Fill in the form** and submit to test the full workflow

## Docker Setup

### Using Docker Compose (Easiest)

```bash
# From root directory
# Copy environment file for backend
cp backend/.env.example backend/.env

# Edit backend/.env with your API keys

# Build and start services
docker-compose up --build

# Access:
# - Frontend: http://localhost:3000
# - Backend: http://localhost:8000
# - API Docs: http://localhost:8000/docs
```

### Individual Docker Builds

#### Build Backend
```bash
docker build -t agentic-ai-backend -f Dockerfile.backend .
docker run -p 8000:8000 \
  -e GROQ_API_KEY=your_key \
  -e TAVILY_API_KEY=your_key \
  agentic-ai-backend
```

#### Build Frontend
```bash
docker build -t agentic-ai-frontend -f Dockerfile.frontend .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://localhost:8000 \
  agentic-ai-frontend
```

## Common Issues & Solutions

### Issue: "ModuleNotFoundError: No module named 'fastapi'"
**Solution:**
```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```

### Issue: "Cannot find module '@/components/Logo'"
**Solution:**
```bash
cd frontend
rm -rf node_modules .next
npm install
```

### Issue: API connection failed
**Solution:**
1. Ensure backend is running: `python -m uvicorn app.main:app --reload`
2. Check `NEXT_PUBLIC_API_URL` in frontend `.env.local`
3. Verify both services are on `localhost`

### Issue: "GROQ_API_KEY not set"
**Solution:**
1. Check backend `.env` file exists
2. Verify key is correctly set: `echo $GROQ_API_KEY`
3. Restart backend server

### Issue: "Cannot connect to Docker daemon"
**Solution:**
- Start Docker Desktop application
- Ensure Docker is running: `docker ps`

## Development Workflow

### File Structure for Development
```
agentic-ai/
├── backend/
│   ├── venv/                 (virtual environment)
│   ├── app/main.py          (modify backend logic here)
│   ├── agents/              (add new agents here)
│   └── .env                 (your API keys - don't commit!)
│
├── frontend/
│   ├── app/                 (modify pages here)
│   ├── components/          (modify/add components here)
│   └── .env.local          (frontend config - don't commit!)
```

### Hot Reload
Both services support hot reload during development:
- **Backend**: Changes to `.py` files auto-reload
- **Frontend**: Changes to `.tsx` files auto-reload

### Testing the API

#### Using curl
```bash
# Start a research analysis
curl -X POST http://localhost:8000/api/research/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "business_idea": "AI customer support",
    "company_name": "SupportAI",
    "niche": "B2B SaaS"
  }'
```

#### Using FastAPI Swagger UI
Visit: `http://localhost:8000/docs`

## Production Deployment

### Deploy Backend (AWS EC2 / DigitalOcean)

```bash
# SSH into your server
ssh user@your_server_ip

# Clone repository
git clone your_repo_url
cd agentic-ai/backend

# Setup environment
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Create .env with production values
nano .env

# Run with Gunicorn
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 app.main:app
```

### Deploy Frontend (Vercel)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel deploy

# Set environment variables in Vercel dashboard:
# NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

### Deploy with Docker (AWS ECS / Railway)

```bash
# Build and push images
docker build -t your-registry/backend -f Dockerfile.backend .
docker push your-registry/backend

docker build -t your-registry/frontend -f Dockerfile.frontend .
docker push your-registry/frontend

# Use docker-compose.yml for orchestration
docker-compose -f docker-compose.prod.yml up
```

## Next Steps

1. **Customize Agents**: Modify agents in `backend/agents/`
2. **Add Features**: Extend API in `backend/api/routes/`
3. **Update UI**: Modify components in `frontend/components/`
4. **Deploy**: Follow production deployment steps above

## Support

For issues or questions:
1. Check the [README.md](README.md)
2. Review [ARCHITECTURE.md](ARCHITECTURE.md)
3. Check [API_REFERENCE.md](API_REFERENCE.md)
4. Open a GitHub issue

---

**Happy Building! 🚀**
