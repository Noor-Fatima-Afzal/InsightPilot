"""Tavily API integration for web research"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from tavily import TavilyClient
from typing import List, Dict, Any
from config.settings import settings
import logging

logger = logging.getLogger(__name__)


class TavilyResearcher:
    """Tavily web research integration"""

    def __init__(self):
        self.client = TavilyClient(api_key=settings.tavily_api_key)

    def search(self, query: str, topic: str = "general") -> Dict[str, Any]:
        """
        Perform web search using Tavily
        
        Args:
            query: Search query
            topic: Research topic type (general, news, science, etc.)
            
        Returns:
            Search results with sources and data
        """
        try:
            response = self.client.search(
                query=query,
                search_depth="advanced",
                max_results=10,
                include_answer=True,
                topic=topic,
            )
            return response
        except Exception as e:
            logger.error(f"Tavily search error: {str(e)}")
            raise

    def get_competitor_info(self, company_name: str) -> Dict[str, Any]:
        """Get competitor information"""
        query = f"{company_name} company overview products features"
        return self.search(query, topic="general")

    def get_market_trends(self, niche: str) -> Dict[str, Any]:
        """Get market trends for a niche"""
        query = f"{niche} market trends 2025 2026 opportunities"
        return self.search(query, topic="news")

    def get_industry_analysis(self, industry: str) -> Dict[str, Any]:
        """Get industry analysis"""
        query = f"{industry} industry analysis market size growth"
        return self.search(query, topic="general")


tavily_researcher = TavilyResearcher()
