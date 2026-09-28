import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean, JSON, Integer
from sqlalchemy.dialects.postgresql import UUID
from app.db.base import Base

class Integration(Base):
    __tablename__ = "integrations"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False, index=True)
    provider = Column(String(100), nullable=False) # HTTP_API, SHOPIFY, CUSTOM
    configuration = Column(JSON, default=dict)
    credential_id = Column(String(255), nullable=True) # Identifier in secret store
    enabled = Column(Boolean, default=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class CustomTool(Base):
    __tablename__ = "custom_tools"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(100), nullable=False)
    description = Column(String, nullable=False)
    
    method = Column(String(10), nullable=False, default="GET")
    endpoint = Column(String(2000), nullable=False)
    input_schema = Column(JSON, nullable=False)
    output_mapping = Column(JSON, nullable=True)
    
    integration_id = Column(UUID(as_uuid=True), ForeignKey("integrations.id", ondelete="SET NULL"), nullable=True)
    timeout_ms = Column(Integer, default=5000)
    enabled = Column(Boolean, default=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class HumanHandoff(Base):
    __tablename__ = "human_handoffs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False, index=True)
    conversation_id = Column(UUID(as_uuid=True), ForeignKey("conversations.id", ondelete="CASCADE"), nullable=False, index=True)
    reason = Column(String, nullable=True)
    status = Column(String(50), default="REQUESTED") # REQUESTED, QUEUED, ASSIGNED, RESOLVED, CANCELLED
    assigned_to = Column(String(100), nullable=True) # Could be user ID
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class ActionState(Base):
    """Tracks multi-turn actions (like booking requiring confirmation)."""
    __tablename__ = "action_states"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False, index=True)
    conversation_id = Column(UUID(as_uuid=True), ForeignKey("conversations.id", ondelete="CASCADE"), nullable=False, index=True)
    tool_name = Column(String(100), nullable=False)
    
    state = Column(String(50), default="STARTED") # STARTED, AWAITING_INFORMATION, READY_FOR_CONFIRMATION, CONFIRMED, COMPLETED, FAILED
    context_data = Column(JSON, default=dict)
    idempotency_key = Column(String(255), nullable=True, index=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
