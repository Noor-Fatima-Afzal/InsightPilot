from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime


class ResearchQuery(BaseModel):
    """Request model for research analysis"""

    business_idea: str = Field(..., min_length=1, description="Business idea or startup concept")
    company_name: str = Field(..., min_length=1, description="Company or product name")
    niche: str = Field(..., min_length=1, description="Target niche or industry")
    analysis_mode: str = Field("research", description="Analysis mode: research or company_audit")
    additional_context: Optional[str] = Field(None, description="Optional additional context")


class CompetitorAnalysis(BaseModel):
    """Competitor analysis data"""

    name: str
    url: Optional[str]
    strengths: List[str]
    weaknesses: List[str]
    market_position: str
    key_features: List[str]


class MarketTrend(BaseModel):
    """Market trend insight"""

    trend: str
    relevance: str
    opportunity: Optional[str]
    threat: Optional[str]


class StrategicInsight(BaseModel):
    """Strategic insight from analysis"""

    category: str
    insight: str
    recommendation: str
    priority: str  # HIGH, MEDIUM, LOW


class ExecutiveReport(BaseModel):
    """Final executive report"""

    analysis_mode: str = "research"
    executive_summary: str
    market_overview: str
    competitors: List[CompetitorAnalysis]
    market_trends: List[MarketTrend]
    strategic_insights: List[StrategicInsight]
    key_findings: List[str] = []
    top_opportunities: List[str] = []
    positioning_gaps: List[str] = []
    ideal_customer_profile: List[str] = []
    go_to_market: List[str] = []
    source_signals: List[str] = []
    risks: List[str] = []
    success_metrics: List[str] = []
    recommendations: List[str]
    next_steps: List[str]
    generated_at: datetime


class ResearchResponse(BaseModel):
    """Response model for research analysis"""

    session_id: str
    status: str  # pending, in_progress, completed, error
    analysis_mode: str
    business_idea: str
    company_name: str
    niche: str
    report: Optional[ExecutiveReport]
    agents_activity: List[Dict[str, Any]]
    error: Optional[str]
    created_at: datetime
    updated_at: datetime


class StreamingMessage(BaseModel):
    """Message for streaming responses"""

    type: str  # agent_start, agent_step, agent_thinking, research_result, competitor_found, insight_generated, report_section, completed
    agent: Optional[str]
    content: str
    data: Optional[Dict[str, Any]]
    timestamp: datetime
