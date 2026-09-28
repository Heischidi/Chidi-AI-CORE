import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, JSON, Integer, Date
from sqlalchemy.dialects.postgresql import UUID
from app.db.base import Base

class UsageRecord(Base):
    __tablename__ = "usage_records"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False, index=True)
    
    metric = Column(String(100), nullable=False, index=True) # AI_MESSAGE, TOTAL_TOKENS, DOCUMENT
    quantity = Column(Integer, nullable=False, default=1)
    
    source = Column(String(100), nullable=True) # WIDGET, API, DASHBOARD
    reference_id = Column(String(255), nullable=True) # E.g., message_id, tool_execution_id
    metadata_json = Column(JSON, default=dict)
    
    occurred_at = Column(DateTime, default=datetime.utcnow, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class UsageDailyAggregate(Base):
    __tablename__ = "usage_daily_aggregates"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False, index=True)
    
    date = Column(Date, nullable=False, index=True)
    metric = Column(String(100), nullable=False, index=True)
    quantity = Column(Integer, nullable=False, default=0)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
