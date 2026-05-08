"""Report Generation Agent - Generates polished executive reports"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.groq_llm import groq_analyzer
from models.schemas import CompetitorAnalysis, ExecutiveReport
from typing import Dict, Any
import logging
import json
from datetime import datetime

logger = logging.getLogger(__name__)


class ReportAgent:
    """Autonomous report generation agent"""

    def __init__(self):
        self.name = "Report Agent"
        self.activity_log = []

    def log_activity(self, step: str, details: Dict[str, Any]):
        """Log agent activity"""
        self.activity_log.append(
            {
                "agent": self.name,
                "step": step,
                "details": details,
            }
        )

    def _normalize_competitors(self, competitors: Any) -> list[CompetitorAnalysis]:
        """Convert arbitrary competitor inputs into schema-complete models."""
        normalized: list[CompetitorAnalysis] = []

        for competitor in competitors:
            if isinstance(competitor, CompetitorAnalysis):
                normalized.append(competitor)
            elif isinstance(competitor, dict):
                normalized.append(
                    CompetitorAnalysis(
                        name=competitor.get("name", "Competitor"),
                        url=competitor.get("url"),
                        strengths=competitor.get("strengths", [])[:3],
                        weaknesses=competitor.get("weaknesses", [])[:3],
                        market_position=competitor.get("market_position", "Competitor"),
                        key_features=competitor.get("key_features", [])[:3],
                    )
                )
            else:
                normalized.append(
                    CompetitorAnalysis(
                        name=str(competitor),
                        url=None,
                        strengths=[],
                        weaknesses=[],
                        market_position="Competitor",
                        key_features=[],
                    )
                )

        return normalized

    def _apply_summary_synthesis(self, report: ExecutiveReport, company_name: str) -> ExecutiveReport:
        """Run a second-pass synthesis to improve executive-summary quality."""
        try:
            synthesis_payload = {
                "company_name": company_name,
                "market_overview": report.market_overview,
                "key_findings": report.key_findings,
                "top_opportunities": report.top_opportunities,
                "risks": report.risks,
                "recommendations": report.recommendations,
                "next_steps": report.next_steps,
            }
            synthesis_response = groq_analyzer.synthesize_executive_summary(
                json.dumps(synthesis_payload, indent=2)
            )
            parsed_synthesis = groq_analyzer.parse_json_response(synthesis_response)
            synthesized_summary = parsed_synthesis.get("executive_summary", "").strip()
            if synthesized_summary:
                report.executive_summary = synthesized_summary
        except Exception as synthesis_error:
            logger.warning(f"{self.name}: Summary synthesis skipped: {str(synthesis_error)[:80]}")

        return report

    async def generate_report(
        self,
        company_name: str,
        business_idea: str,
        all_findings: Dict[str, Any],
        analysis_context: str = "",
    ) -> ExecutiveReport:
        """
        Generate executive report quickly (optimized for speed)
        """
        logger.info(f"{self.name}: Generating report for {company_name}")
        self.activity_log.clear()

        try:
            self.log_activity("report_generation_started", {"company": company_name})

            # Compress findings for speed
            competitors = self._normalize_competitors(all_findings.get("competitors", []))
            strategy = all_findings.get("strategy", {})
            research = all_findings.get("research", {})

            competitor_summary = []
            for competitor in competitors:
                competitor_summary.append(
                    {
                        "name": competitor.name,
                        "position": competitor.market_position,
                        "strengths": competitor.strengths[:3],
                        "weaknesses": competitor.weaknesses[:3],
                        "key_features": competitor.key_features[:3],
                    }
                )

            strategy_summary = {
                "positioning": strategy.get("positioning", "Not specified") if isinstance(strategy, dict) else "Not specified",
                "positioning_gaps": strategy.get("positioning_gaps", []) if isinstance(strategy, dict) else [],
                "ideal_customer_profile": strategy.get("ideal_customer_profile", []) if isinstance(strategy, dict) else [],
                "go_to_market": strategy.get("go_to_market", []) if isinstance(strategy, dict) else [],
                "next_90_days": strategy.get("next_90_days", []) if isinstance(strategy, dict) else [],
                "strategic_insights": strategy.get("strategic_insights", []) if isinstance(strategy, dict) else [],
                "top_opportunities": strategy.get("top_opportunities", []) if isinstance(strategy, dict) else [],
                "risks": strategy.get("risks", []) if isinstance(strategy, dict) else [],
            }

            research_summary = {
                "company_info": research.get("company_info", {}),
                "market_info": research.get("market_info", {}),
            }

            # Ultra-concise prompt
            prompt = f"""Generate a polished executive report for a startup founder.
Company: {company_name}
Idea: {business_idea}
Competitor count: {len(competitors)}

Analysis context:
{analysis_context}

Research summary:
{json.dumps(research_summary, indent=2)}

Competitors:
{json.dumps(competitor_summary, indent=2)}

Strategy summary:
{json.dumps(strategy_summary, indent=2)}

Return ONLY JSON:
{{
    "executive_summary": "2-3 sentence summary",
    "market_overview": "detailed but easy-to-understand market context",
    "key_findings": ["finding1", "finding2"],
    "top_opportunities": ["opportunity1", "opportunity2"],
    "positioning_gaps": ["gap1", "gap2"],
    "ideal_customer_profile": ["profile1", "profile2"],
    "go_to_market": ["channel1", "channel2"],
    "source_signals": ["source note 1", "source note 2"],
    "risks": ["risk1", "risk2"],
    "recommendations": ["rec1", "rec2"],
    "next_steps": ["step1", "step2"],
    "success_metrics": ["metric1", "metric2"]
}}"""

            logger.info(f"{self.name}: Generating report")
            response = groq_analyzer.generate_executive_report(prompt)

            try:
                parsed_response = groq_analyzer.parse_json_response(response)
                strategic_insights = []
                if isinstance(strategy, dict):
                    for item in strategy.get("strategic_insights", []):
                        if isinstance(item, dict):
                            strategic_insights.append(
                                {
                                    "category": item.get("category", "Strategy"),
                                    "insight": item.get("insight", ""),
                                    "recommendation": item.get("recommendation", ""),
                                    "priority": item.get("priority", "MEDIUM"),
                                }
                            )
                else:
                    strategic_insights = []

                report = ExecutiveReport(
                    analysis_mode="company_audit" if "company_audit" in analysis_context else "research",
                    executive_summary=parsed_response.get("executive_summary", f"Market opportunity for {company_name}"),
                    market_overview=parsed_response.get("market_overview", "Growing market with strong demand"),
                    competitors=competitors,
                    market_trends=strategy.get("market_trends", []) if isinstance(strategy, dict) else [],
                    strategic_insights=strategic_insights,
                    key_findings=parsed_response.get("key_findings", []),
                    top_opportunities=parsed_response.get("top_opportunities", []),
                    positioning_gaps=parsed_response.get("positioning_gaps", strategy_summary.get("positioning_gaps", [])),
                    ideal_customer_profile=parsed_response.get("ideal_customer_profile", strategy_summary.get("ideal_customer_profile", [])),
                    go_to_market=parsed_response.get("go_to_market", strategy_summary.get("go_to_market", [])),
                    source_signals=parsed_response.get("source_signals", []),
                    risks=parsed_response.get("risks", []),
                    success_metrics=parsed_response.get("success_metrics", []),
                    recommendations=parsed_response.get("recommendations", ["Focus on differentiation", "Build MVP"]),
                    next_steps=parsed_response.get("next_steps", ["Launch MVP", "Get customer feedback"]),
                    generated_at=datetime.now(),
                )
                report = self._apply_summary_synthesis(report, company_name)
                self.log_activity("report_generated", {"status": "success"})
                logger.info(f"{self.name}: Report complete")
                return report
            except (json.JSONDecodeError, ValueError) as e:
                logger.warning(f"{self.name}: Using default report")
                self.log_activity("parse_error", {"error": str(e)[:50]})
                fallback_report = ExecutiveReport(
                    analysis_mode="company_audit" if "company_audit" in analysis_context else "research",
                    executive_summary=f"{company_name} has a viable market opportunity if it stays focused on one strong use case.",
                    market_overview=f"{business_idea} sits in a market with clear demand, but the strongest results will come from sharp positioning and fast validation.",
                    competitors=competitors,
                    market_trends=[],
                    strategic_insights=[
                        {
                            "category": "Go-to-market",
                            "insight": "The market appears ready, but the product story must be narrowly framed.",
                            "recommendation": "Launch with a single lead use case and test it against early customers.",
                            "priority": "MEDIUM",
                        }
                    ],
                    key_findings=[
                        "The opportunity is real, but the category is crowded enough that positioning matters.",
                        "The fastest path to traction is a focused MVP and quick customer feedback loops.",
                    ],
                    top_opportunities=[
                        "Own one niche use case before expanding to adjacent segments.",
                        "Use customer proof to strengthen trust and conversion.",
                    ],
                    positioning_gaps=["Broad messaging", "Insufficient proof of differentiation"],
                    ideal_customer_profile=["Early adopters with a painful workflow", "Buyers who need fast ROI"],
                    go_to_market=["Lead with one narrow use case", "Use direct outreach to early adopters"],
                    source_signals=["Fallback summary generated from available research inputs"],
                    risks=[
                        "Broad messaging could make the product feel generic.",
                        "Slow validation may delay learning and reduce momentum.",
                    ],
                    success_metrics=[
                        "Activation rate from first-time users",
                        "Weekly active users in the pilot group",
                        "Retention after the first 30 days",
                    ],
                    recommendations=[
                        "Focus on one narrow use case and make the value proposition unmistakable.",
                        "Build a simple MVP and validate it with a small group of early adopters.",
                        "Measure activation, retention, and customer feedback from the first launch.",
                    ],
                    next_steps=[
                        "Launch a focused MVP",
                        "Interview 5 to 10 early users",
                        "Refine pricing and messaging based on feedback",
                    ],
                    generated_at=datetime.now(),
                )
                return self._apply_summary_synthesis(fallback_report, company_name)

        except Exception as e:
            logger.error(f"{self.name} error: {str(e)}")
            self.log_activity("error", {"error": str(e)[:50]})
            terminal_fallback = ExecutiveReport(
                analysis_mode="company_audit" if "company_audit" in analysis_context else "research",
                executive_summary=f"Analysis complete for {company_name}; the market looks promising, but the clearest win is still tight positioning.",
                market_overview="Market validation suggests a real opportunity, with the strongest outcomes likely to come from a focused launch strategy.",
                competitors=[],
                market_trends=[],
                strategic_insights=[],
                key_findings=["The market signal is positive.", "Execution quality will determine differentiation."],
                top_opportunities=["Focused go-to-market", "Early adopter validation"],
                positioning_gaps=["Positioning not yet differentiated"],
                ideal_customer_profile=["Decision makers with an urgent problem"],
                go_to_market=["Validate with a small pilot group"],
                source_signals=["Generated during exception fallback"],
                risks=["Weak positioning", "Overly broad feature scope"],
                success_metrics=["Pilot conversion rate", "Customer interviews completed", "Early retention"],
                recommendations=["Launch a focused MVP", "Validate with early customers"],
                next_steps=["Execute strategy", "Collect feedback", "Iterate quickly"],
                generated_at=datetime.now(),
            )
            return self._apply_summary_synthesis(terminal_fallback, company_name)


report_agent = ReportAgent()
