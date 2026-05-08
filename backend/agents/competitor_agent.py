"""Competitor Analysis Agent - Analyzes competitors and market position"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.groq_llm import groq_analyzer
from models.schemas import CompetitorAnalysis
from typing import Dict, Any, List
import logging
import json

logger = logging.getLogger(__name__)


class CompetitorAgent:
    """Autonomous competitor analysis agent"""

    def __init__(self):
        self.name = "Competitor Agent"
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

    async def analyze(self, research_data: str, niche: str) -> List[CompetitorAnalysis]:
        """
        Analyze competitors quickly (optimized for speed)
        """
        logger.info(f"{self.name}: Analyzing {niche}")
        self.activity_log.clear()

        try:
            self.log_activity("analysis_started", {"niche": niche})

            # Truncate research data for speed
            research_data_short = research_data[:500] if research_data else ""

            logger.info(f"{self.name}: Analyzing competitors")
            response = groq_analyzer.analyze_competitors(niche, research_data_short)

            # Parse response
            try:
                parsed_response = groq_analyzer.parse_json_response(response)
                competitors = [
                    CompetitorAnalysis(
                        name=comp.get("name", "Unknown"),
                        url=comp.get("url"),
                        strengths=comp.get("strengths", [])[:3],
                        weaknesses=comp.get("weaknesses", [])[:3],
                        market_position=comp.get("market_position", "Competitor"),
                        key_features=comp.get("key_features", [])[:3],
                    )
                    for comp in parsed_response.get("competitors", [])[:5]  # Limit to 5
                ]
                self.log_activity("analysis_complete", {"competitors": len(competitors)})
                logger.info(f"{self.name}: Found {len(competitors)} competitors")
                return competitors
            except json.JSONDecodeError:
                logger.warning(f"{self.name}: Parse error, returning defaults")
                self.log_activity("parse_error", {})
                return [
                    CompetitorAnalysis(
                        name="Market Leader",
                        url=None,
                        strengths=["Brand recognition", "Market share"],
                        weaknesses=["High costs"],
                        market_position="Leader",
                        key_features=["Established brand", "Large distribution"],
                    ),
                    CompetitorAnalysis(
                        name="Rising Competitor",
                        url=None,
                        strengths=["Innovation", "Speed"],
                        weaknesses=["Limited resources"],
                        market_position="Challenger",
                        key_features=["Fast iteration", "Niche focus"],
                    )
                ]

        except Exception as e:
            logger.error(f"{self.name} error: {str(e)}")
            self.log_activity("error", {"error": str(e)[:50]})
            return []


competitor_agent = CompetitorAgent()
