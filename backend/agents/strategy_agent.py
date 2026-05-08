"""Strategy Agent - Creates strategic insights and recommendations"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.groq_llm import groq_analyzer
from models.schemas import StrategicInsight, MarketTrend
from typing import Dict, Any, List
import logging
import json

logger = logging.getLogger(__name__)


class StrategyAgent:
    """Autonomous strategy formulation agent"""

    def __init__(self):
        self.name = "Strategy Agent"
        self.activity_log: List[Dict[str, Any]] = []

    def log_activity(self, step: str, details: Dict[str, Any]):
        """Log agent activity"""
        self.activity_log.append(
            {
                "agent": self.name,
                "step": step,
                "details": details,
            }
        )

    async def formulate_strategy(
        self,
        business_idea: str,
        company_name: str,
        niche: str,
        research_summary: str,
        competitor_analysis: str,
        analysis_context: str = "",
    ) -> Dict[str, Any]:
        """
        Formulate strategy quickly (optimized for speed)
        """
        logger.info(f"{self.name}: Formulating strategy for {company_name}")
        self.activity_log.clear()

        try:
            self.log_activity(
                "strategy_formulation_started",
                {"company": company_name, "niche": niche},
            )

            # Truncate data for faster processing
            research_summary = research_summary[:1000] if research_summary else ""
            competitor_analysis = competitor_analysis[:1000] if competitor_analysis else ""

            prompt = f"""Business: {business_idea}
Company: {company_name}
Niche: {niche}

Analysis context:
{analysis_context}

Research summary:
{research_summary}

Competitor analysis:
{competitor_analysis}

Fast strategy: provide only the most important, founder-ready insights.

Return ONLY valid JSON with this structure:
{{
    "strategic_insights": [
        {{
            "category": "Positioning",
            "insight": "key insight",
            "recommendation": "specific action",
            "priority": "HIGH/MEDIUM/LOW"
        }}
    ],
    "positioning": "market position",
    "positioning_gaps": ["gap1", "gap2"],
    "ideal_customer_profile": ["profile1", "profile2"],
    "go_to_market": ["key tactic 1", "key tactic 2"],
    "next_90_days": ["action1", "action2"],
    "top_opportunities": ["opportunity1", "opportunity2"],
    "risks": ["risk1", "risk2"]
}}

Requirements:
- Tie recommendations to the supplied research and competitors.
- Keep output concise but specific.
- Make it easy to present to founders in a demo.
- Do not include markdown, code fences, or commentary."""

            logger.info(f"{self.name}: Generating strategy")
            response = groq_analyzer.generate_insights(prompt)

            try:
                parsed_response = groq_analyzer.parse_json_response(response)
                self.log_activity(
                    "strategy_generated",
                    {"insights_count": len(parsed_response.get("strategic_insights", []))},
                )
                logger.info(f"{self.name}: Strategy complete")
                return parsed_response
            except (json.JSONDecodeError, ValueError):
                logger.warning(f"{self.name}: Parse error, returning defaults")
                self.log_activity("parse_error", {"response": response[:100]})
                return {
                    "strategic_insights": [
                        {
                            "category": "Positioning",
                            "insight": "Position as a focused, outcome-driven solution rather than a generic AI tool.",
                            "recommendation": "Lead with one high-value use case and show measurable outcomes in the first 90 days.",
                            "priority": "HIGH",
                        }
                    ],
                    "positioning": "Focused premium solution for the target niche",
                    "positioning_gaps": ["Generic positioning", "Unclear differentiation"],
                    "ideal_customer_profile": ["Teams with an urgent workflow problem", "Buyers who value speed and clarity"],
                    "go_to_market": ["Start with a single use case", "Use founder-led customer interviews", "Pilot with early adopters"],
                    "next_90_days": ["Launch MVP", "Validate pricing", "Collect customer feedback"],
                    "top_opportunities": ["Niche differentiation", "Early adopter partnerships"],
                    "risks": ["Generic positioning", "Slow user activation"],
                }

        except Exception as e:
            logger.error(f"{self.name} error: {str(e)}")
            self.log_activity("error", {"error": str(e)})
            return {
                "strategic_insights": [
                    {
                        "category": "Readiness",
                        "insight": "The market appears ready, but execution must stay narrowly focused to avoid a generic message.",
                        "recommendation": "Launch with one clear promise and measure conversion, activation, and retention from day one.",
                        "priority": "MEDIUM",
                    }
                ],
                "positioning_gaps": ["Broad message", "Weak proof points"],
                "ideal_customer_profile": ["Early adopters", "Decision makers who need fast validation"],
            }


strategy_agent = StrategyAgent()
