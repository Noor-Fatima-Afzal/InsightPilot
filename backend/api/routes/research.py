"""Research API routes"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import StreamingResponse
import logging
import json
import asyncio

from models.schemas import ResearchQuery, StreamingMessage
from agents.orchestrator import orchestrator

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/research/analyze")
async def start_research(query: ResearchQuery):
    """
    Start research analysis for a business idea
    
    Returns a session ID for tracking progress
    """
    try:
        logger.info(f"Starting research for: {query.company_name}")
        session_id = orchestrator.create_session(query)
        return {
            "session_id": session_id,
            "status": "initialized",
            "message": "Research initialized. Starting autonomous agent workflow...",
        }
    except Exception as e:
        logger.error(f"Error starting research: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/research/stream/{session_id}")
async def stream_research(session_id: str):
    """
    Stream research progress for a session
    
    Returns streaming updates as agents work
    """

    async def event_generator():
        try:
            async for event in orchestrator.run_research_workflow(session_id):
                # Format as SSE
                yield f"data: {json.dumps(event)}\n\n"
                await asyncio.sleep(0.1)  # Small delay for UI updates
        except Exception as e:
            logger.error(f"Stream error: {str(e)}")
            yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )


@router.get("/research/status/{session_id}")
async def get_research_status(session_id: str):
    """Get current research status"""
    try:
        response = orchestrator.get_research_response(session_id)
        if not response:
            raise HTTPException(status_code=404, detail="Session not found")
        return response.model_dump()
    except Exception as e:
        logger.error(f"Error getting status: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/research/report/{session_id}")
async def get_research_report(session_id: str):
    """Get completed research report"""
    try:
        response = orchestrator.get_research_response(session_id)
        if not response:
            raise HTTPException(status_code=404, detail="Session not found")
        if response.status != "completed":
            raise HTTPException(
                status_code=400,
                detail=f"Research not completed. Status: {response.status}",
            )
        return response.report
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting report: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/research/activity/{session_id}")
async def get_agents_activity(session_id: str):
    """Get agent activity log for a session"""
    try:
        response = orchestrator.get_research_response(session_id)
        if not response:
            raise HTTPException(status_code=404, detail="Session not found")
        return {"activity": response.agents_activity}
    except Exception as e:
        logger.error(f"Error getting activity: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
