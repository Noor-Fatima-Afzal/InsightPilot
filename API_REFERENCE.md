# API Reference

Complete API documentation for the InsightPilot AI backend.

## Base URL
```
Development: http://localhost:8000
Production: https://api.your-domain.com
```

## Authentication
Currently no authentication required. Add JWT/OAuth for production.

## Response Format
All responses are JSON.

### Success Response
```json
{
  "data": {...},
  "status": "success"
}
```

### Error Response
```json
{
  "error": "Error message",
  "detail": "Detailed error information"
}
```

---

## Endpoints

### 1. Start Research Analysis

**Endpoint:** `POST /api/research/analyze`

**Description:** Initiate a new research analysis session

**Request Body:**
```json
{
  "business_idea": "An AI-powered customer support platform",
  "company_name": "SupportAI",
  "niche": "B2B SaaS",
  "additional_context": "Optional additional information"
}
```

**Request Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| business_idea | string | Yes | Business concept or idea |
| company_name | string | Yes | Company or product name |
| niche | string | Yes | Target market niche |
| additional_context | string | No | Extra context for analysis |

**Response (201 Created):**
```json
{
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "initialized",
  "message": "Research initialized. Starting autonomous agent workflow..."
}
```

**Error Response (400):**
```json
{
  "detail": "Please fill in all fields"
}
```

**Example with curl:**
```bash
curl -X POST http://localhost:8000/api/research/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "business_idea": "AI-powered customer support platform",
    "company_name": "SupportAI",
    "niche": "B2B SaaS"
  }'
```

**Example with Python:**
```python
import requests

url = "http://localhost:8000/api/research/analyze"
payload = {
    "business_idea": "AI-powered customer support platform",
    "company_name": "SupportAI",
    "niche": "B2B SaaS"
}

response = requests.post(url, json=payload)
session_id = response.json()["session_id"]
```

---

### 2. Stream Research Progress

**Endpoint:** `GET /api/research/stream/{session_id}`

**Description:** Stream real-time research progress using Server-Sent Events (SSE)

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| session_id | string | UUID from /analyze endpoint |

**Response:** Server-Sent Events (SSE) Stream

**Event Types:**

#### Agent Start
```json
{
  "type": "agent_start",
  "agent": "Research Agent",
  "message": "Researching SupportAI in the B2B SaaS space..."
}
```

#### Research Complete
```json
{
  "type": "research_complete",
  "agent": "Research Agent",
  "results_count": 42,
  "message": "Research complete. Found key information and trends."
}
```

#### Competitor Found
```json
{
  "type": "competitor_found",
  "agent": "Competitor Agent",
  "competitor": "ZendeskSupport",
  "strengths": ["24/7 support", "AI automation", "Easy integration"],
  "weaknesses": ["High pricing", "Steep learning curve"]
}
```

#### Insight Generated
```json
{
  "type": "insight_generated",
  "agent": "Strategy Agent",
  "insight": "Market is consolidating around AI-first solutions",
  "recommendation": "Position as AI-native alternative to legacy players"
}
```

#### Workflow Complete
```json
{
  "type": "workflow_complete",
  "agent": "Orchestrator",
  "message": "Research complete! Executive report generated.",
  "report": {...}
}
```

#### Error
```json
{
  "type": "error",
  "agent": "Strategy Agent",
  "message": "Error during strategy formulation"
}
```

**Example with JavaScript:**
```javascript
const sessionId = "550e8400-e29b-41d4-a716-446655440000";

const eventSource = new EventSource(
  `http://localhost:8000/api/research/stream/${sessionId}`
);

eventSource.addEventListener('message', (event) => {
  const data = JSON.parse(event.data);
  console.log(data.type, data);
  
  if (data.type === 'workflow_complete') {
    console.log('Report:', data.report);
    eventSource.close();
  }
});

eventSource.addEventListener('error', (error) => {
  console.error('Stream error:', error);
  eventSource.close();
});
```

**Example with Python:**
```python
import requests
import json

session_id = "550e8400-e29b-41d4-a716-446655440000"
url = f"http://localhost:8000/api/research/stream/{session_id}"

with requests.get(url, stream=True) as response:
    for line in response.iter_lines():
        if line:
            if line.startswith(b'data: '):
                data = json.loads(line[6:])
                print(f"{data['type']}: {data.get('message', '')}")
```

---

### 3. Get Research Status

**Endpoint:** `GET /api/research/status/{session_id}`

**Description:** Get current status of a research session

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| session_id | string | UUID from /analyze endpoint |

**Response (200 OK):**
```json
{
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "in_progress",
  "business_idea": "AI-powered customer support platform",
  "company_name": "SupportAI",
  "niche": "B2B SaaS",
  "report": null,
  "agents_activity": [
    {
      "agent": "Research Agent",
      "step": "company_research",
      "details": {"query": "SupportAI", "results_found": 42}
    }
  ],
  "error": null,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:32:15Z"
}
```

**Possible Status Values:**
- `initialized` - Session created, waiting to start
- `in_progress` - Agents actively processing
- `completed` - Research finished, report ready
- `error` - An error occurred

**Error Response (404):**
```json
{
  "detail": "Session not found"
}
```

---

### 4. Get Research Report

**Endpoint:** `GET /api/research/report/{session_id}`

**Description:** Retrieve the completed executive report

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| session_id | string | UUID from /analyze endpoint |

**Response (200 OK):**
```json
{
  "executive_summary": "SupportAI presents a compelling opportunity in the B2B SaaS customer support market...",
  "market_overview": "The global customer support software market is valued at $7.2B and growing at 12% CAGR...",
  "competitors": [
    {
      "name": "Zendesk",
      "url": "https://zendesk.com",
      "strengths": ["Strong market position", "Extensive integrations"],
      "weaknesses": ["High pricing", "Complex setup"],
      "market_position": "Market leader",
      "key_features": ["AI automation", "Omnichannel", "Analytics"]
    }
  ],
  "market_trends": [
    {
      "trend": "AI-First Customer Support",
      "relevance": "84% of enterprises now use AI in support",
      "opportunity": "First-mover advantage in AI-native platforms",
      "threat": "Rapid commoditization of AI features"
    }
  ],
  "strategic_insights": [
    {
      "category": "Positioning",
      "insight": "Market demands integrated AI-native solutions",
      "recommendation": "Position as 'AI platform with human touch'",
      "priority": "HIGH"
    }
  ],
  "recommendations": [
    "Focus on AI accuracy and personalization",
    "Build strong integration ecosystem",
    "Target enterprise customers first"
  ],
  "next_steps": [
    "Conduct detailed competitive feature analysis",
    "Schedule customer discovery interviews",
    "Develop prototype for pilot customers"
  ],
  "generated_at": "2024-01-15T10:35:00Z"
}
```

**Error Responses:**
- `404 Not Found` - Session not found
- `400 Bad Request` - Research not completed yet

**Status code 400 Response:**
```json
{
  "detail": "Research not completed. Status: in_progress"
}
```

---

### 5. Get Agents Activity Log

**Endpoint:** `GET /api/research/activity/{session_id}`

**Description:** Get detailed activity log from all agents

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| session_id | string | UUID from /analyze endpoint |

**Response (200 OK):**
```json
{
  "activity": [
    {
      "agent": "Research Agent",
      "step": "company_research",
      "details": {"query": "SupportAI", "results_found": 42}
    },
    {
      "agent": "Research Agent",
      "step": "industry_research",
      "details": {"query": "B2B SaaS", "results_found": 156}
    },
    {
      "agent": "Competitor Agent",
      "step": "analysis_started",
      "details": {"niche": "B2B SaaS"}
    },
    {
      "agent": "Competitor Agent",
      "step": "analysis_complete",
      "details": {"competitors_found": 5}
    }
  ]
}
```

---

## Common Response Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Successful request |
| 201 | Created | Resource created successfully |
| 400 | Bad Request | Invalid input or malformed request |
| 404 | Not Found | Resource not found |
| 500 | Server Error | Internal server error |

---

## Rate Limiting

Currently no rate limiting. Recommended for production:
- 10 requests per minute per IP
- 3 concurrent analysis per session
- 10 minute timeout for agent workflows

---

## Error Handling

### Common Errors

#### Invalid Input
```json
{
  "detail": "Please fill in all fields"
}
```

#### Session Not Found
```json
{
  "detail": "Session not found"
}
```

#### Research Not Complete
```json
{
  "detail": "Research not completed. Status: in_progress"
}
```

#### API Key Missing
```json
{
  "error": "Internal server error",
  "detail": "GROQ_API_KEY environment variable not set"
}
```

---

## Examples

### Complete Workflow

```bash
# 1. Start research
RESPONSE=$(curl -s -X POST http://localhost:8000/api/research/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "business_idea": "AI customer support",
    "company_name": "SupportAI",
    "niche": "B2B SaaS"
  }')

SESSION_ID=$(echo $RESPONSE | jq -r '.session_id')
echo "Session: $SESSION_ID"

# 2. Stream progress (in another terminal)
curl -N http://localhost:8000/api/research/stream/$SESSION_ID

# 3. Check status
curl http://localhost:8000/api/research/status/$SESSION_ID

# 4. Get report (when complete)
curl http://localhost:8000/api/research/report/$SESSION_ID | jq '.'

# 5. Download report
curl http://localhost:8000/api/research/report/$SESSION_ID > report.json
```

### Python Client

```python
import requests
import json
import time

class ResearchClient:
    def __init__(self, base_url="http://localhost:8000"):
        self.base_url = base_url
        self.session_id = None
    
    def start_research(self, business_idea, company_name, niche):
        response = requests.post(
            f"{self.base_url}/api/research/analyze",
            json={
                "business_idea": business_idea,
                "company_name": company_name,
                "niche": niche
            }
        )
        self.session_id = response.json()["session_id"]
        return self.session_id
    
    def stream_progress(self):
        response = requests.get(
            f"{self.base_url}/api/research/stream/{self.session_id}",
            stream=True
        )
        for line in response.iter_lines():
            if line.startswith(b'data: '):
                yield json.loads(line[6:])
    
    def get_report(self):
        response = requests.get(
            f"{self.base_url}/api/research/report/{self.session_id}"
        )
        return response.json()

# Usage
client = ResearchClient()
session = client.start_research(
    "AI customer support",
    "SupportAI",
    "B2B SaaS"
)

for event in client.stream_progress():
    print(f"{event['type']}: {event.get('message', '')}")

report = client.get_report()
print(json.dumps(report, indent=2))
```

---

## Webhooks (Future)

Planned webhook support for production deployments:

```
POST https://your-webhook-url.com/research-complete
X-Webhook-Signature: sha256=...

{
  "event": "research.completed",
  "session_id": "...",
  "report": {...}
}
```

---

**For implementation details, see [ARCHITECTURE.md](ARCHITECTURE.md)**
