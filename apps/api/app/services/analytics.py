import uuid
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.analytics import AnalyticsEvent

class AnalyticsService:
    def __init__(self, db: AsyncSession):
        self.db = db
        
    async def record_event(self, workspace_id: uuid.UUID, event_type: str, source: str = None, 
                           conversation_id: uuid.UUID = None, visitor_id: str = None, metadata: dict = None):
        """
        Record a workspace analytics event.
        """
        event = AnalyticsEvent(
            workspace_id=workspace_id,
            event_type=event_type,
            source=source,
            conversation_id=conversation_id,
            visitor_id=visitor_id,
            metadata_json=metadata or {},
            occurred_at=datetime.utcnow()
        )
        self.db.add(event)
        # Note: caller is responsible for awaiting db.commit()
