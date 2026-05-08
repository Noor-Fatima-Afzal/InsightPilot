# Architecture Overview

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                        │
│  - Home page with input form                                │
│  - Real-time research progress visualization                │
│  - Executive report display                                 │
│  - Animated components with Framer Motion                   │
└─────────────────────────────────────────────────────────────┘
                            ↕
                       HTTP / SSE
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                   Backend (FastAPI)                          │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           Agent Orchestrator (LangGraph)           │   │
│  │                                                     │   │
│  │  ┌──────────────────────────────────────────────┐  │   │
│  │  │ 1. Research Agent                            │  │   │
│  │  │    └─→ Tavily Web Search API                 │  │   │
│  │  └──────────────────────────────────────────────┘  │   │
│  │           ↓                                         │   │
│  │  ┌──────────────────────────────────────────────┐  │   │
│  │  │ 2. Competitor Analysis Agent                │  │   │
│  │  │    └─→ Groq LLM Analysis                    │  │   │
│  │  └──────────────────────────────────────────────┘  │   │
│  │           ↓                                         │   │
│  │  ┌──────────────────────────────────────────────┐  │   │
│  │  │ 3. Strategy Agent                            │  │   │
│  │  │    └─→ Groq Strategic Reasoning              │  │   │
│  │  └──────────────────────────────────────────────┘  │   │
│  │           ↓                                         │   │
│  │  ┌──────────────────────────────────────────────┐  │   │
│  │  │ 4. Report Generation Agent                   │  │   │
│  │  │    └─→ Professional Report Creation          │  │   │
│  │  └──────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           API Routes (FastAPI)                      │   │
│  │  - POST /api/research/analyze                       │   │
│  │  - GET /api/research/stream/{session_id}  (SSE)    │   │
│  │  - GET /api/research/status/{session_id}           │   │
│  │  - GET /api/research/report/{session_id}           │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           Data Models (Pydantic)                    │   │
│  │  - ResearchQuery                                    │   │
│  │  - ExecutiveReport                                  │   │
│  │  - CompetitorAnalysis                              │   │
│  │  - StrategicInsight                                │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Frontend Components

#### Page Components
- **`app/page.tsx`**: Landing page with research input form
- **`app/research/[session_id]/page.tsx`**: Research analysis and report display

#### UI Components
- **`Logo.tsx`**: Branded logo with gradient
- **`AnimatedLoader.tsx`**: Loading animation with agent names
- **`AgentWorkflow.tsx`**: Workflow visualization component
- **`CompetitorCard.tsx`**: Competitor analysis display
- **`InsightCard.tsx`**: Strategic insight cards
- **`UI.tsx`**: Reusable UI primitives (GradientText, Card, Glass)

#### Hooks
- **`useStreamedResponse.ts`**: SSE stream handling
- **`useAsyncOperation.ts`**: Async operation wrapper

#### Libraries
- **`api.ts`**: API client functions
- **`store.ts`**: Zustand state management
- **`utils.ts`**: Utility functions

### Backend Architecture

#### Agent Orchestrator (`agents/orchestrator.py`)
```python
class AgentOrchestrator:
    - create_session()           # Initialize research session
    - get_session()              # Retrieve session data
    - run_research_workflow()    # Main async workflow
    - get_research_response()    # Get session response
```

**Workflow Flow:**
1. Research Agent gathers web intelligence
2. Competitor Agent analyzes competitors
3. Strategy Agent formulates recommendations
4. Report Agent generates executive report
5. Results streamed to frontend in real-time

#### Individual Agents

**Research Agent** (`agents/research_agent.py`)
```python
ResearchAgent:
    - research()  # Query web via Tavily
    - log_activity()
    # Returns: company_info, industry_info, market_info
```

**Competitor Agent** (`agents/competitor_agent.py`)
```python
CompetitorAgent:
    - analyze()  # Analyze using Groq LLM
    # Returns: List[CompetitorAnalysis]
```

**Strategy Agent** (`agents/strategy_agent.py`)
```python
StrategyAgent:
    - formulate_strategy()  # Generate strategic insights
    # Returns: market_trends, insights, positioning, GTM
```

**Report Agent** (`agents/report_agent.py`)
```python
ReportAgent:
    - generate_report()  # Create executive report
    # Returns: ExecutiveReport
```

#### API Routes (`api/routes/research.py`)
- `POST /api/research/analyze` - Start research
- `GET /api/research/stream/{session_id}` - SSE stream
- `GET /api/research/status/{session_id}` - Check status
- `GET /api/research/report/{session_id}` - Get report
- `GET /api/research/activity/{session_id}` - Agent activity log

#### Utilities

**Tavily Search** (`utils/tavily_search.py`)
```python
TavilyResearcher:
    - search()                # Web search
    - get_competitor_info()   # Competitor research
    - get_market_trends()     # Trend analysis
    - get_industry_analysis() # Industry research
```

**Groq LLM** (`utils/groq_llm.py`)
```python
GroqAnalyzer:
    - analyze_competitors()       # Competitor analysis
    - generate_insights()         # Strategic insights
    - generate_executive_report() # Report generation
    - stream_analysis()          # Streaming responses
```

## Data Flow

### Request Flow
```
User Input Form
    ↓
POST /api/research/analyze
    ↓
Create Research Session
    ↓
Validate Input (ResearchQuery)
    ↓
Return Session ID
    ↓
Frontend subscribes to SSE stream
    ↓
GET /api/research/stream/{session_id}
```

### Processing Flow
```
Agent Orchestrator.run_research_workflow()
    ↓
[STAGE 1] Research Agent
    └─→ Tavily Search (Web Intelligence)
    └─→ Stream: agent_start, research_complete
    ↓
[STAGE 2] Competitor Agent
    └─→ Groq Analysis (Competitive Landscape)
    └─→ Stream: competitor_found × N
    ↓
[STAGE 3] Strategy Agent
    └─→ Groq Strategic Reasoning
    └─→ Stream: insight_generated × N
    ↓
[STAGE 4] Report Agent
    └─→ Groq Report Generation
    └─→ Stream: workflow_complete
    ↓
Complete & Return Report
```

### Response Types (SSE Events)
```json
{
  "type": "agent_start",
  "agent": "Research Agent",
  "message": "Researching..."
}

{
  "type": "research_complete",
  "agent": "Research Agent",
  "results_count": 42
}

{
  "type": "competitor_found",
  "competitor": "Company A",
  "strengths": [...],
  "weaknesses": [...]
}

{
  "type": "insight_generated",
  "insight": "...",
  "recommendation": "..."
}

{
  "type": "workflow_complete",
  "report": {...}
}

{
  "type": "error",
  "message": "..."
}
```

## State Management

### Frontend State (Zustand)
```typescript
useResearchStore {
  sessionId: string | null
  status: string
  businessIdea: string
  companyName: string
  niche: string
  report: any
  agentsActivity: any[]
  currentAgent: string
  isLoading: boolean
  error: string | null
  
  // Actions
  setSessionId()
  setStatus()
  setReport()
  addAgentActivity()
  setCurrentAgent()
  setIsLoading()
  setError()
  reset()
}
```

### Backend Session State
```python
{
  "session_id": "uuid",
  "query": ResearchQuery,
  "status": "initialized|in_progress|completed|error",
  "research_data": {...},
  "competitors": [...],
  "strategy": {...},
  "report": ExecutiveReport,
  "agents_activity": [...],
  "created_at": datetime,
}
```

## Data Models

### Input Models
```python
ResearchQuery:
  - business_idea: str
  - company_name: str
  - niche: str
  - additional_context: str | None
```

### Output Models
```python
ExecutiveReport:
  - executive_summary: str
  - market_overview: str
  - competitors: List[CompetitorAnalysis]
  - market_trends: List[MarketTrend]
  - strategic_insights: List[StrategicInsight]
  - recommendations: List[str]
  - next_steps: List[str]
  - generated_at: datetime

CompetitorAnalysis:
  - name: str
  - url: str | None
  - strengths: List[str]
  - weaknesses: List[str]
  - market_position: str
  - key_features: List[str]

StrategicInsight:
  - category: str
  - insight: str
  - recommendation: str
  - priority: HIGH|MEDIUM|LOW
```

## Performance Considerations

### Frontend
- **Streaming**: Real-time updates without full-page reload
- **Component Memoization**: React memo for expensive components
- **Image Optimization**: Next.js image optimization
- **CSS-in-JS**: TailwindCSS for minimal CSS bundle

### Backend
- **Async Processing**: FastAPI async/await throughout
- **Streaming Responses**: SSE for real-time updates
- **API Rate Limiting**: Consider adding for production
- **Caching**: Could cache competitor/trend data
- **Timeout Handling**: 30-60s timeout for agent workflows

## Scalability

### Horizontal Scaling
```
Load Balancer (nginx)
    ├── Backend Instance 1 (FastAPI)
    ├── Backend Instance 2 (FastAPI)
    └── Backend Instance 3 (FastAPI)

Load Balancer (Vercel/CDN)
    └── Frontend (Next.js)
```

### Improvements for Scale
1. **Session Storage**: Redis instead of in-memory dict
2. **Task Queue**: Celery for long-running agent workflows
3. **Message Queue**: RabbitMQ for agent communication
4. **Database**: PostgreSQL for persistent storage
5. **Cache**: Redis for API response caching
6. **Monitoring**: Prometheus + Grafana

## Security Considerations

### Current Setup
- ✅ CORS enabled (should restrict in production)
- ✅ Environment variables for API keys
- ✅ HTTPS ready (enable in production)
- ✅ Input validation (Pydantic)

### Production Recommendations
1. **Rate Limiting**: Implement to prevent abuse
2. **Authentication**: Add user auth (JWT, OAuth)
3. **HTTPS**: Force HTTPS in production
4. **API Key Rotation**: Regular key rotation
5. **Input Sanitization**: Additional validation
6. **Error Handling**: Don't expose stack traces

## Deployment Architecture

```
Developer Local
    ↓
GitHub Repo
    ├── CI/CD Pipeline (GitHub Actions)
    │   ├── Lint & Test
    │   ├── Build Docker Images
    │   └── Push to Registry
    ↓
Production Deployment
    ├── Vercel (Frontend)
    ├── AWS ECS (Backend)
    └── Database: PostgreSQL
```

---

**For questions about architecture, see [SETUP_GUIDE.md](SETUP_GUIDE.md) or [README.md](README.md)**
