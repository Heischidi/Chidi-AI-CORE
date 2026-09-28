import uuid
from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.db.session import get_db
from app.models.workspace import Workspace
from app.models.usage import UsageRecord, UsageDailyAggregate
from app.dependencies import get_current_workspace
from app.services.quota import QuotaService
from pydantic import BaseModel

router = APIRouter()

class UsageAggregateResponse(BaseModel):
    metric: str
    total_quantity: int

class QuotaResponse(BaseModel):
    metric: str
    allowed: bool
    limit: int
    current_usage: int
    remaining: int
    period: str

@router.get("/summary", response_model=List[UsageAggregateResponse])
async def get_usage_summary(
    workspace: Workspace = Depends(get_current_workspace),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(
        UsageDailyAggregate.metric, 
        func.sum(UsageDailyAggregate.quantity).label("total")
    ).where(
        UsageDailyAggregate.workspace_id == workspace.id
    ).group_by(UsageDailyAggregate.metric)
    
    result = await db.execute(stmt)
    rows = result.all()
    
    return [UsageAggregateResponse(metric=row[0], total_quantity=row[1]) for row in rows]

@router.get("/quota/{metric}", response_model=QuotaResponse)
async def get_metric_quota(
    metric: str,
    workspace: Workspace = Depends(get_current_workspace),
    db: AsyncSession = Depends(get_db)
):
    quota_service = QuotaService(db)
    result = await quota_service.check(workspace.id, metric, quantity=0)
    
    return QuotaResponse(
        metric=metric,
        allowed=result["allowed"],
        limit=result["limit"],
        current_usage=result["current_usage"],
        remaining=result["remaining"],
        period=result["period"]
    )
