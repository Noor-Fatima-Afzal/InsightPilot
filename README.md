# InsightPilot AI: Multi-Agent Strategy Research & Company Audit Platform

<p align="center">
  <a href="https://www.python.org/"><img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python"></a>
  <a href="https://fastapi.tiangolo.com/"><img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI"></a>
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js"></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"></a>
</p>

<p align="center">
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"></a>
  <a href="https://www.framer.com/motion/"><img src="https://img.shields.io/badge/Framer_Motion-111827?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion"></a>
  <a href="https://groq.com/"><img src="https://img.shields.io/badge/Groq-f55036?style=for-the-badge&logoColor=white" alt="Groq"></a>
  <a href="https://tavily.com/"><img src="https://img.shields.io/badge/Tavily-0f172a?style=for-the-badge&logoColor=white" alt="Tavily"></a>
  <a href="https://www.docker.com/"><img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker"></a>
</p>

**InsightPilot AI** is an open-source, multi-agent research platform for founders, consultants, and analysts who need fast strategic answers without starting from scratch. It ships with two equally prominent workflows: **Strategy Research** for building a market view from a business idea, and **Company Audit** for analyzing a live company or competitor URL to uncover positioning gaps, ICP insights, and go-to-market ideas.

The system uses a FastAPI backend, a Next.js frontend, and an agent pipeline that coordinates research, competitor discovery, strategy synthesis, and executive reporting in real time.

---

## Demo Video

<p align="center">
  <video controls playsinline width="100%" src="demo.mp4"></video>
</p>

<p align="center">
  If the embedded player does not render in your browser, open the file directly: [demo.mp4](demo.mp4).
</p>

---

## Live Workflow

1. Enter a business idea or company URL.
2. Run the workflow with one click.
3. Watch the agents research, compare, and synthesize in real time.
4. Review the final report, share it, or download it for stakeholders.

---

## Features

- Dual-mode analysis: Strategy Research and Company Audit.
- Real-time agent activity streaming through SSE.
- Research agent for live web intelligence.
- Competitor analysis for positioning and market context.
- Strategy synthesis for positioning gaps, ICP, and GTM ideas.
- Executive report generation with shareable session links.
- Modern UI built for demos, launches, and client presentations.
- Dockerized deployment for local and production environments.

---

## Architecture

```mermaid
flowchart LR
  %% Client
  User[Founder, Analyst, Consultant] --> UI[Next.js Frontend]

  %% API surface
  UI -->|POST /api/research/analyze| Analyze[FastAPI Route: Start Analysis]
  UI -->|GET /api/research/stream/:session_id| Stream[FastAPI Route: SSE Stream]
  UI -->|GET /api/research/report/:session_id| Report[FastAPI Route: Final Report]

  subgraph Backend[FastAPI Backend Runtime]
    Analyze --> Orchestrator[AgentOrchestrator]
    Stream --> Orchestrator
    Report --> Orchestrator

    Orchestrator --> SessionStore[(In-memory Session State)]
    Orchestrator --> ModeContext[Mode-aware Context Builder\n(research or company_audit)]

    ModeContext --> ResearchAgent[Research Agent]
    ResearchAgent --> CompetitorAgent[Competitor Agent]
    CompetitorAgent --> StrategyAgent[Strategy Agent]
    StrategyAgent --> ReportAgent[Report Agent]

    ReportAgent --> ExecutiveReport[ExecutiveReport\n(Pydantic schema)]
    Orchestrator --> SSEEvents[SSE Event Envelope\nagent_start, research_complete, competitor_found, insight_generated, workflow_complete]
  end

  %% External intelligence + reasoning services
  ResearchAgent --> Tavily[Tavily Search API]
  CompetitorAgent --> Groq[Groq LLM]
  StrategyAgent --> Groq
  ReportAgent --> Groq

  SSEEvents --> Stream
  ExecutiveReport --> Report
  Stream --> UI
  Report --> UI
```

### End-to-End Flow

1. The user submits either a business idea or a company URL.
2. The FastAPI endpoint validates the request and creates a session.
3. The orchestrator builds a mode-aware context for strategy research or company audit.
4. The research agent gathers live market and product signals from the web.
5. The competitor agent identifies relevant rivals, positioning, and feature comparisons.
6. The strategy agent synthesizes positioning gaps, ideal customer profile details, and go-to-market ideas.
7. The report agent assembles the final executive report and summary sections.
8. The frontend streams progress updates through SSE and renders the final report.

### Analysis Modes

| Mode | Input | Primary Output |
| --- | --- | --- |
| Strategy Research | Business idea, company name, niche | Market opportunity analysis, competitor landscape, strategic recommendations |
| Company Audit | Company or competitor URL | Positioning gaps, ICP signals, GTM ideas, source-backed findings |

### Backend Responsibilities

- Request validation with Pydantic schemas.
- Session lifecycle management in the orchestrator.
- URL parsing and context construction for mode-aware analysis.
- Parallel agent execution after initial research context is prepared.
- SSE event streaming for live progress updates.
- Final report assembly with analysis mode metadata and source signals.

### Frontend Responsibilities

- High-conversion landing page with two equally visible services.
- Service-aware forms with validation and contextual helper text.
- Real-time activity feed and workflow visualization.
- Results page with executive summary, audit details, share links, and download actions.
- Responsive layout for demos, recording, and stakeholder presentations.

### Data and Output Model

- Input: business idea, company name, niche, or URL depending on mode.
- Intermediate artifacts: research notes, competitor snapshots, strategy insights, source signals.
- Output: executive report with summary, market context, positioning gaps, ICP, GTM ideas, and references.

---

## Tech Stack

| Layer | Stack | Purpose |
| --- | --- | --- |
| Frontend framework | Next.js 15, React 18, TypeScript | Server-rendered UI, type safety, and a modern app router structure |
| Frontend styling | Tailwind CSS, custom CSS modules, Framer Motion | Responsive design, motion, and polished interaction states |
| Frontend state | Local component state, custom hooks, lightweight store patterns | Form control, streamed updates, and UI orchestration |
| Backend framework | FastAPI, Python 3.11+, Pydantic, pydantic-settings | API layer, validation, configuration, and typed data models |
| Async execution | asyncio, SSE streaming | Parallel agent work, incremental UI updates, and non-blocking request handling |
| Research layer | Tavily web search | Live market, product, and competitor signal collection |
| LLM layer | Groq-hosted chat models | Strategy synthesis, report drafting, and natural-language reasoning |
| Agent orchestration | Multi-agent workflow in `backend/agents/` | Research, competitor analysis, strategy synthesis, and report generation |
| API contract | Pydantic schemas in `backend/models/schemas.py` | Request/response consistency across backend and frontend |
| Frontend API client | Typed API helpers in `frontend/lib/api.ts` | Session creation, progress streaming, and report retrieval |
| Deployment | Docker, Docker Compose, backend and frontend Dockerfiles | Local reproducibility and production-ready containerization |
| Configuration | `.env`, `backend/config/settings.py`, `frontend/.env.local` | Environment-based secrets and runtime settings |
| Documentation | README, API reference, setup and architecture guides | Onboarding, contribution, and deployment clarity |

### Stack Notes

- The backend is designed around a modular agent pipeline rather than a monolithic prompt call.
- The frontend is optimized for demonstration quality, with visible progress and shareable results.
- The system is built to support both founder-led workflows and client-facing competitive audits.

---

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- Groq API key
- Tavily API key

### Environment Variables

Create a root-level `.env` file:

```env
GROQ_API_KEY=your_groq_api_key_here
TAVILY_API_KEY=your_tavily_api_key_here
BACKEND_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
DEBUG=False
LOG_LEVEL=INFO
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Run Locally

### Option 1: Start Both Apps From the Root

```bash
npm install
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:8000

### Option 2: Run Services Separately

Backend:

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

### Option 3: Docker

```bash
docker-compose up --build
```

---

## API Overview

### Start an Analysis

```http
POST /api/research/analyze
```

Example payload:

```json
{
  "business_idea": "AI-powered customer support for remote teams",
  "company_name": "SupportFlow",
  "niche": "B2B SaaS",
  "analysis_mode": "strategy_research"
}
```

### Stream Progress

```http
GET /api/research/stream/{session_id}
```

### Fetch Report

```http
GET /api/research/report/{session_id}
```

---

## Project Structure

```text
Agentic-AI/
├── backend/
│   ├── agents/
│   ├── api/
│   ├── app/
│   ├── config/
│   ├── models/
│   └── utils/
├── frontend/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── styles/
│   └── types/
├── docker-compose.yml
├── Dockerfile
├── Dockerfile.backend
├── Dockerfile.frontend
└── README.md
```

---

## Additional Documentation

- [API Reference](API_REFERENCE.md)
- [Architecture Notes](ARCHITECTURE.md)
- [Setup Guide](SETUP_GUIDE.md)
- [Quick Start](QUICK_START.md)

---

## Deployment

The project is container-ready and can be deployed with Docker Compose or split into separate frontend and backend services. Use the included Dockerfiles to build production images for each service.

---

## License

MIT License. Feel free to use, modify, and distribute.

---

## Contributing

Contributions are welcome. If you add features, please keep the README and docs aligned with the actual application behavior.
