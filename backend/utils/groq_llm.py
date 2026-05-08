"""Groq LLM integration for reasoning and analysis"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from groq import Groq
from typing import Generator, Any
from config.settings import settings
import logging
import json
import re

logger = logging.getLogger(__name__)


class GroqAnalyzer:
    """Groq LLM for intelligent reasoning"""

    def __init__(self):
        self.client = Groq(api_key=settings.groq_api_key)
        self.model = "openai/gpt-oss-120b"

    @staticmethod
    def _extract_json_text(response_text: str) -> str:
        """Extract the first JSON object or array from a model response."""
        text = response_text.strip()

        if text.startswith("```"):
            text = re.sub(r"^```(?:json)?\s*", "", text, flags=re.IGNORECASE)
            text = re.sub(r"\s*```$", "", text).strip()

        first_object = text.find("{")
        last_object = text.rfind("}")
        first_array = text.find("[")
        last_array = text.rfind("]")

        if first_object != -1 and last_object != -1 and (first_array == -1 or first_object <= first_array):
            return text[first_object:last_object + 1]

        if first_array != -1 and last_array != -1:
            return text[first_array:last_array + 1]

        return text

    def parse_json_response(self, response_text: str) -> Any:
        """Parse JSON content from a model response with light cleanup."""
        cleaned_text = self._extract_json_text(response_text)
        return json.loads(cleaned_text)

    def analyze_competitors(self, query_context: str, research_data: str) -> str:
        """Analyze competitors using Groq"""
        prompt = f"""
Using the business context and research data below, produce a precise, actionable competitor analysis for a founder-facing report.

Context: {query_context}
Research Data: {research_data}

Return ONLY valid JSON with this structure:
{{
    "competitors": [
        {{
            "name": "company name",
            "strengths": ["strength1", "strength2"],
            "weaknesses": ["weakness1", "weakness2"],
            "market_position": "one-sentence market position",
            "key_features": ["feature1", "feature2"]
        }}
    ]
}}

Requirements:
- Return 3 to 5 competitors.
- Keep each field concise but specific.
- Prefer real company names when possible.
- Do not include markdown, code fences, or commentary.
- Make the output easy to read in a demo presentation.
"""
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                max_tokens=2000,
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"Groq analysis error: {str(e)}")
            raise

    def generate_insights(self, analysis_data: str) -> str:
        """Generate strategic insights"""
        prompt = f"""
Based on the market analysis below, generate strategic insights and recommendations for a founder-friendly executive report.

Data: {analysis_data}

Return ONLY valid JSON with this structure:
{{
    "insights": [
        {{
            "category": "category name",
            "insight": "detailed but concise insight",
            "recommendation": "specific founder action",
            "priority": "HIGH/MEDIUM/LOW"
        }}
    ],
    "top_opportunities": ["opportunity1", "opportunity2"],
    "risks": ["risk1", "risk2"]
}}

Requirements:
- Return 3 to 5 insights.
- Make recommendations operational and easy to explain in a demo.
- Keep language professional, concrete, and non-generic.
- Do not include markdown, code fences, or commentary.
"""
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                max_tokens=2000,
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"Groq insights generation error: {str(e)}")
            raise

    def generate_executive_report(self, full_analysis: str) -> str:
        """Generate executive report"""
        prompt = f"""
Create a polished executive report for startup founders based on the analysis below.

{full_analysis}

Return ONLY valid JSON with this structure:
{{
    "executive_summary": "2-3 sentence high-level summary",
    "market_overview": "clear and detailed market context",
    "key_findings": ["finding1", "finding2"],
    "top_opportunities": ["opportunity1", "opportunity2"],
    "risks": ["risk1", "risk2"],
    "recommendations": [
        {{
            "title": "Recommendation Title",
            "description": "detailed description",
            "timeframe": "implementation timeframe"
        }}
    ],
    "next_steps": ["step1", "step2"],
    "success_metrics": ["metric1", "metric2"]
}}

Requirements:
- Keep it professional, specific, and easy to present in a demo.
- Prefer language that a founder or investor would understand quickly.
- Do not include markdown, code fences, or commentary.
"""
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3,
                max_tokens=3000,
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"Groq report generation error: {str(e)}")
            raise

    def synthesize_executive_summary(self, report_payload: str) -> str:
        """Synthesize a polished executive summary from structured report data."""
        prompt = f"""
You are preparing a board-ready executive summary from structured report data.

Report data:
{report_payload}

Return ONLY valid JSON:
{{
  "executive_summary": "3-5 sentence synthesis covering market context, top opportunity, key risk, and immediate strategic direction"
}}

Requirements:
- Keep tone professional and concise.
- Avoid buzzwords and generic filler.
- Mention one concrete opportunity and one concrete risk.
- Do not include markdown, code fences, or commentary.
"""
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.2,
                max_tokens=450,
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"Groq summary synthesis error: {str(e)}")
            raise

    def stream_analysis(self, prompt: str) -> Generator[str, None, None]:
        """Stream analysis response"""
        try:
            stream = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                max_tokens=2000,
                stream=True,
            )
            for chunk in stream:
                if chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content
        except Exception as e:
            logger.error(f"Groq streaming error: {str(e)}")
            raise


groq_analyzer = GroqAnalyzer()
