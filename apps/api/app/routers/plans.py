import uuid
from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.session import get_db
from app.models.workspace import Workspace
from app.models.billing import Plan, Subscription, PlanLimit, PlanEntitlement
from app.dependencies import get_current_workspace
from pydantic import BaseModel

router = APIRouter()

class PlanResponse(BaseModel):
    id: uuid.UUID
    name: str
    description: Optional[str]
    price_metadata: dict
    billing_interval: str
    
    model_config = {"from_attributes": True}

class SubscriptionResponse(BaseModel):
    status: str
    plan: PlanResponse
    current_period_end: Optional[datetime]

@router.get("/", response_model=List[PlanResponse])
async def list_plans(
    db: AsyncSession = Depends(get_db)
):
    """List all active public plans."""
    stmt = select(Plan).where(Plan.active == True)
    result = await db.execute(stmt)
    return result.scalars().all()

@router.get("/subscription", response_model=SubscriptionResponse)
async def get_workspace_subscription(
    workspace: Workspace = Depends(get_current_workspace),
    db: AsyncSession = Depends(get_db)
):
    stmt = select(Subscription, Plan).join(Plan, Subscription.plan_id == Plan.id).where(
        Subscription.workspace_id == workspace.id
    )
    result = await db.execute(stmt)
    row = result.first()
    
    if not row:
        raise HTTPException(status_code=404, detail="No subscription found for workspace.")
        
    sub, plan = row
    return SubscriptionResponse(
        status=sub.status,
        plan=PlanResponse.model_validate(plan),
        current_period_end=sub.current_period_end
    )
