import uuid
from typing import List, Dict, Any
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc

from app.db.session import get_db
from app.models.workspace import Workspace
from app.models.analytics import AnalyticsEvent
from app.dependencies import get_current_workspace
from pydantic import BaseModel

router = APIRouter()

class AnalyticsSummaryResponse(BaseModel):
    event_type: str
    count: int

@router.get("/summary", response_model=List[AnalyticsSummaryResponse])
async def get_analytics_summary(
    days: int = 30,
    workspace: Workspace = Depends(get_current_workspace),
    db: AsyncSession = Depends(get_db)
):
    since_date = datetime.utcnow() - timedelta(days=days)
    
    stmt = select(
        AnalyticsEvent.event_type,
        func.count(AnalyticsEvent.id).label("count")
    ).where(
        AnalyticsEvent.workspace_id == workspace.id,
        AnalyticsEvent.occurred_at >= since_date
    ).group_by(AnalyticsEvent.event_type)
    
    result = await db.execute(stmt)
    rows = result.all()
    
    return [AnalyticsSummaryResponse(event_type=row[0], count=row[1]) for row in rows]
