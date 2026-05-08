"""Research Agent - Gathers web intelligence using Tavily"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.tavily_search import tavily_researcher
from models.schemas import ResearchQuery
from typing import Dict, Any, List
import logging
import json
import asyncio

logger = logging.getLogger(__name__)


class ResearchAgent:
    """Autonomous research agent"""

    def __init__(self):
        self.name = "Research Agent"
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

    async def research(self, query: ResearchQuery, analysis_context: str = "") -> Dict[str, Any]:
        """
        Ultra-fast research - single search only
        """
        logger.info(f"{self.name}: Starting fast research")
        self.activity_log.clear()

        research_findings = {
            "company_info": {"results": []},
            "market_info": {"results": []},
        }

        try:
            # Single combined search for speed
            search_query_parts = [query.company_name, query.business_idea, query.niche]
            if analysis_context:
                search_query_parts.append(analysis_context)

            search_query = " ".join(part for part in search_query_parts if part).strip()
            
            try:
                result = await asyncio.wait_for(
                    asyncio.to_thread(
                        tavily_researcher.search,
                        search_query,
                        "general"
                    ),
                    timeout=12.0
                )
                research_findings["company_info"] = result
            except asyncio.TimeoutError:
                logger.warning(f"{self.name}: Search timeout")
                research_findings["company_info"] = {"results": []}
            
            self.log_activity("search_complete", {"status": "fast"})
            logger.info(f"{self.name}: Research complete")

        except Exception as e:
            logger.error(f"{self.name} error: {str(e)}")
            self.log_activity("error", {"error": str(e)})

        return research_findings


research_agent = ResearchAgent()
