import uuid
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from sqlalchemy.dialects.postgresql import insert

from app.models.usage import UsageRecord, UsageDailyAggregate

class UsageMeter:
    """
    Centralized service to record usage metrics across the platform.
    """
    def __init__(self, db: AsyncSession):
        self.db = db

    async def record(self, workspace_id: uuid.UUID, metric: str, quantity: int = 1, 
                    source: str = None, reference_id: str = None, metadata: dict = None):
        """
        Record a raw usage event and upsert the daily aggregate in a single transaction.
        """
        if quantity == 0:
            return

        now = datetime.utcnow()
        today = now.date()

        # 1. Record raw event
        record = UsageRecord(
            workspace_id=workspace_id,
            metric=metric,
            quantity=quantity,
            source=source,
            reference_id=reference_id,
            metadata_json=metadata or {},
            occurred_at=now
        )
        self.db.add(record)

        # 2. Upsert daily aggregate
        # Using PostgreSQL specific insert...on_conflict_do_update for atomicity
        # In a real heavy-load system, this might be handled via a background queue or Kafka,
        # but for this modular monolith Phase, UPSERT guarantees no race conditions.
        stmt = insert(UsageDailyAggregate).values(
            workspace_id=workspace_id,
            date=today,
            metric=metric,
            quantity=quantity,
            created_at=now,
            updated_at=now
        )
        
        upsert_stmt = stmt.on_conflict_do_update(
            index_elements=['workspace_id', 'date', 'metric'],
            set_={
                'quantity': UsageDailyAggregate.quantity + quantity,
                'updated_at': now
            }
        )
        
        await self.db.execute(upsert_stmt)
        # Note: caller is responsible for awaiting db.commit() if part of a larger transaction.
        # If UsageMeter is used standalone, it should commit. For safety in API routes:
        # await self.db.commit() is generally expected to be done by the caller dependency.
