import uuid
from typing import Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from datetime import datetime

from app.models.billing import Subscription, Plan, PlanLimit
from app.models.usage import UsageDailyAggregate

class QuotaService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def check(self, workspace_id: uuid.UUID, metric: str, quantity: int = 1) -> Dict[str, Any]:
        """
        Check if a workspace has enough quota to perform an action.
        Returns:
            {"allowed": bool, "limit": int, "current_usage": int, "remaining": int, "period": str}
        """
        # 1. Get Workspace Subscription and Plan
        stmt = select(Subscription, Plan).join(Plan, Subscription.plan_id == Plan.id).where(
            Subscription.workspace_id == workspace_id,
            Subscription.status.in_(["ACTIVE", "TRIALING"])
        )
        result = await self.db.execute(stmt)
        row = result.first()
        
        if not row:
            # No active subscription = NO usage allowed.
            return {"allowed": False, "limit": 0, "current_usage": 0, "remaining": 0, "period": "NONE"}
            
        subscription, plan = row
        
        # 2. Get the specific limit for this metric on this plan
        limit_stmt = select(PlanLimit).where(
            PlanLimit.plan_id == plan.id,
            PlanLimit.metric == metric
        )
        limit_res = await self.db.execute(limit_stmt)
        plan_limit = limit_res.scalar_one_or_none()
        
        if not plan_limit:
            # If no limit is explicitly defined for this metric on the plan, assume it's NOT allowed.
            # (Or unlimited, depending on business rules. Let's assume NOT allowed for safety).
            return {"allowed": False, "limit": 0, "current_usage": 0, "remaining": 0, "period": "NONE"}
            
        if plan_limit.limit_value == -1:
            return {"allowed": True, "limit": -1, "current_usage": 0, "remaining": -1, "period": plan_limit.period}
            
        # 3. Calculate current usage based on the period
        current_usage = 0
        now = datetime.utcnow()
        
        if plan_limit.period == "MONTHLY":
            # For simplicity in this phase, just sum usage for the current calendar month
            # In production, this might map to subscription.current_period_start
            start_date = now.replace(day=1).date()
            usage_stmt = select(func.sum(UsageDailyAggregate.quantity)).where(
                UsageDailyAggregate.workspace_id == workspace_id,
                UsageDailyAggregate.metric == metric,
                UsageDailyAggregate.date >= start_date
            )
            usage_res = await self.db.execute(usage_stmt)
            current_usage = usage_res.scalar() or 0
            
        elif plan_limit.period == "DAILY":
            usage_stmt = select(UsageDailyAggregate.quantity).where(
                UsageDailyAggregate.workspace_id == workspace_id,
                UsageDailyAggregate.metric == metric,
                UsageDailyAggregate.date == now.date()
            )
            usage_res = await self.db.execute(usage_stmt)
            current_usage = usage_res.scalar() or 0
            
        elif plan_limit.period == "TOTAL":
            usage_stmt = select(func.sum(UsageDailyAggregate.quantity)).where(
                UsageDailyAggregate.workspace_id == workspace_id,
                UsageDailyAggregate.metric == metric
            )
            usage_res = await self.db.execute(usage_stmt)
            current_usage = usage_res.scalar() or 0
            
        remaining = plan_limit.limit_value - current_usage
        allowed = (current_usage + quantity) <= plan_limit.limit_value
        
        return {
            "allowed": allowed,
            "limit": plan_limit.limit_value,
            "current_usage": current_usage,
            "remaining": remaining,
            "period": plan_limit.period
        }
