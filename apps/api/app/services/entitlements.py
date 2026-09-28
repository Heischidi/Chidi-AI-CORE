import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.billing import Subscription, Plan, PlanEntitlement

class EntitlementService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def check_capability(self, workspace_id: uuid.UUID, capability_key: str) -> bool:
        """
        Check if a workspace's current plan allows access to a specific capability.
        This represents: Platform -> Plan -> Workspace Authorization.
        """
        stmt = select(Subscription, Plan).join(Plan, Subscription.plan_id == Plan.id).where(
            Subscription.workspace_id == workspace_id,
            Subscription.status.in_(["ACTIVE", "TRIALING"])
        )
        result = await self.db.execute(stmt)
        row = result.first()
        
        if not row:
            return False
            
        subscription, plan = row
        
        entitlement_stmt = select(PlanEntitlement).where(
            PlanEntitlement.plan_id == plan.id,
            PlanEntitlement.capability_key == capability_key
        )
        entitlement_res = await self.db.execute(entitlement_stmt)
        entitlement = entitlement_res.scalar_one_or_none()
        
        return entitlement is not None
