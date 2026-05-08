"""Agent Orchestrator - Coordinates all agents using LangGraph-inspired architecture"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agents.research_agent import research_agent
from agents.competitor_agent import competitor_agent
from agents.strategy_agent import strategy_agent
from agents.report_agent import report_agent
from models.schemas import (
    ResearchQuery,
    ResearchResponse,
    ExecutiveReport,
)
from typing import Dict, Any, List, AsyncGenerator
import logging
import json
import uuid
import asyncio
from datetime import datetime
from urllib.parse import urlparse

logger = logging.getLogger(__name__)


class AgentOrchestrator:
    """Orchestrates autonomous agents"""

    def __init__(self):
        self.sessions = {}
        self.active_agents = [
            research_agent,
            competitor_agent,
            strategy_agent,
            report_agent,
        ]

    def create_session(self, query: ResearchQuery) -> str:
        """Create new research session"""
        session_id = str(uuid.uuid4())
        self.sessions[session_id] = {
            "query": query,
            "analysis_mode": query.analysis_mode,
            "status": "initialized",
            "research_data": None,
            "competitors": None,
            "strategy": None,
            "report": None,
            "agents_activity": [],
            "created_at": datetime.now(),
        }
        logger.info(f"Created session {session_id}")
        return session_id

    def _build_analysis_context(self, query: ResearchQuery) -> str:
        """Build compact context used to steer the agents."""
        context_parts = [f"mode={query.analysis_mode}"]
        if query.additional_context:
            context_parts.append(query.additional_context.strip())

        if query.analysis_mode == "company_audit":
            raw_subject = query.company_name.strip()
            if raw_subject.startswith(("http://", "https://")):
                parsed_url = urlparse(raw_subject)
                host = parsed_url.netloc or raw_subject
                raw_subject = host.removeprefix("www.")
            context_parts.append(
                "Audit brief focus: source-backed company audit, competitor map, positioning gaps, ideal customer profile, go-to-market ideas, and client-ready summary."
            )
            context_parts.append(f"source={raw_subject}")

        return " | ".join(part for part in context_parts if part)

    def get_session(self, session_id: str) -> Dict[str, Any]:
        """Get session data"""
        return self.sessions.get(session_id)

    async def run_research_workflow(
        self, session_id: str
    ) -> AsyncGenerator[Dict[str, Any], None]:
        """
        Run complete research workflow with parallel agent execution
        
        Yields research progress events for real-time UI updates
        Agents 2-4 run in parallel after research completes for speed
        """
        session = self.get_session(session_id)
        if not session:
            logger.error(f"Session not found: {session_id}")
            return

        query = session["query"]
        analysis_context = self._build_analysis_context(query)
        logger.info(f"Starting research workflow for session {session_id}")

        try:
            # Step 1: Research Agent (must complete first)
            logger.info(f"Step 1: Research Agent starting")
            yield {
                "type": "agent_start",
                "agent": "Research Agent",
                "message": f"Researching {query.company_name} in the {query.niche} space...",
            }

            research_findings = await research_agent.research(query, analysis_context)
            session["research_data"] = research_findings
            session["agents_activity"].extend(research_agent.activity_log)

            yield {
                "type": "research_complete",
                "agent": "Research Agent",
                "results_count": len(
                    research_findings.get("company_info", {}).get("results", [])
                ),
                "message": "Research complete. Analyzing in parallel...",
            }

            research_summary = json.dumps(research_findings, indent=2)

            # Steps 2-4: Run competitor, strategy, and report agents in PARALLEL
            logger.info(f"Steps 2-4: Starting parallel agent analysis")

            # Yield that agents are starting
            yield {"type": "agent_start", "agent": "Competitor Agent", "message": "Analyzing competitors..."}
            yield {"type": "agent_start", "agent": "Strategy Agent", "message": "Formulating strategy..."}
            yield {"type": "agent_start", "agent": "Report Agent", "message": "Generating report..."}

            # Create parallel tasks with timeouts
            try:
                competitor_task = asyncio.create_task(
                    asyncio.wait_for(
                        competitor_agent.analyze(research_summary, query.niche),
                        timeout=12.0
                    )
                )

                # Wait for competitors to complete first
                competitors = await competitor_task
                session["competitors"] = [comp.model_dump() for comp in competitors]
                session["agents_activity"].extend(competitor_agent.activity_log)

                # Emit competitor findings
                for comp in competitors:
                    yield {
                        "type": "competitor_found",
                        "agent": "Competitor Agent",
                        "competitor": comp.name,
                        "strengths": comp.strengths[:3],
                        "weaknesses": comp.weaknesses[:3],
                    }

                # Now run strategy with competitor data
                competitors_summary = json.dumps([c.model_dump() for c in competitors], indent=2)
                strategy_task = asyncio.create_task(
                    asyncio.wait_for(
                        strategy_agent.formulate_strategy(
                            query.business_idea,
                            query.company_name,
                            query.niche,
                            research_summary,
                            competitors_summary,
                            analysis_context
                        ),
                        timeout=12.0
                    )
                )

                # Wait for strategy
                strategy = await strategy_task
                session["strategy"] = strategy
                session["agents_activity"].extend(strategy_agent.activity_log)

                # Emit insights
                if strategy.get("strategic_insights"):
                    for insight in strategy["strategic_insights"][:3]:
                        yield {
                            "type": "insight_generated",
                            "agent": "Strategy Agent",
                            "insight": insight.get("insight", "")[:100],
                            "recommendation": insight.get("recommendation", "")[:100],
                        }

                # Step 4: Report Generation
                logger.info(f"Step 4: Report Agent starting")
                all_findings = {
                    "query": {
                        "business_idea": query.business_idea,
                        "company_name": query.company_name,
                        "niche": query.niche,
                    },
                    "research": research_findings,
                    "competitors": session["competitors"],
                    "strategy": strategy,
                }

                report = await asyncio.wait_for(
                    report_agent.generate_report(
                        query.company_name, query.business_idea, all_findings, analysis_context
                    ),
                    timeout=12.0
                )
                session["report"] = report.model_dump(mode="json")
                session["agents_activity"].extend(report_agent.activity_log)

            except asyncio.TimeoutError as e:
                logger.error(f"Agent timeout: {str(e)}")
                # Generate partial report with available data
                timeout_strategy = session.get("strategy", {}) if isinstance(session.get("strategy"), dict) else {}
                session["report"] = ExecutiveReport(
                    analysis_mode=query.analysis_mode,
                    executive_summary=f"Analysis for {query.company_name} was completed with partial data due to a timeout.",
                    market_overview="The market looks promising, but the workflow timed out before all agents could finish.",
                    competitors=session.get("competitors", []),
                    market_trends=timeout_strategy.get("market_trends", []),
                    strategic_insights=timeout_strategy.get("strategic_insights", []),
                    key_findings=["Partial analysis completed before timeout."],
                    top_opportunities=["Rerun analysis for the full report"],
                    positioning_gaps=timeout_strategy.get("positioning_gaps", []),
                    ideal_customer_profile=timeout_strategy.get("ideal_customer_profile", []),
                    go_to_market=timeout_strategy.get("go_to_market", []),
                    source_signals=["Partial report generated after timeout"],
                    risks=["Timeout interrupted the final synthesis step"],
                    success_metrics=["Complete the full workflow without timeout"],
                    recommendations=["Re-run the analysis when the system is under less load"],
                    next_steps=["Retry report generation", "Review the competitor and strategy outputs"],
                    generated_at=datetime.now(),
                ).model_dump(mode="json")

            # Final completion
            session["status"] = "completed"
            logger.info(f"Research workflow completed for session {session_id}")

            yield {
                "type": "workflow_complete",
                "agent": "Orchestrator",
                "message": "Analysis complete!",
                "report": session["report"],
            }

        except Exception as e:
            session["status"] = "error"
            logger.error(f"Workflow error: {str(e)}")
            yield {
                "type": "error",
                "agent": "Orchestrator",
                "message": f"Error: {str(e)}",
            }

    def get_research_response(self, session_id: str) -> ResearchResponse:
        """Get current research response for session"""
        session = self.get_session(session_id)
        if not session:
            return None

        query = session["query"]
        return ResearchResponse(
            session_id=session_id,
            status=session["status"],
            analysis_mode=query.analysis_mode,
            business_idea=query.business_idea,
            company_name=query.company_name,
            niche=query.niche,
            report=session.get("report"),
            agents_activity=session.get("agents_activity", []),
            error=None if session["status"] != "error" else "Workflow failed",
            created_at=session["created_at"],
            updated_at=datetime.now(),
        )


orchestrator = AgentOrchestrator()
