import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Integer, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.base import Base

class Conversation(Base):
    __tablename__ = "conversations"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False, index=True)
    # visitor_id would go here in full implementation
    channel = Column(String(50), default="WEB") # WEB, WIDGET, API
    status = Column(String(50), default="ACTIVE") # ACTIVE, RESOLVED, HANDOFF, CLOSED
    
    started_at = Column(DateTime, default=datetime.utcnow)
    ended_at = Column(DateTime, nullable=True)
    metadata_json = Column(JSON, nullable=True) # renamed from metadata to avoid conflict with sqlalchemy
    
    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan")

class Message(Base):
    __tablename__ = "messages"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    conversation_id = Column(UUID(as_uuid=True), ForeignKey("conversations.id", ondelete="CASCADE"), nullable=False, index=True)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False, index=True) # Redundant for fast isolation
    
    role = Column(String(20), nullable=False) # USER, ASSISTANT, SYSTEM, TOOL
    content = Column(String, nullable=True)
    content_type = Column(String(50), default="TEXT") # TEXT, STRUCTURED, TOOL_CALL, TOOL_RESULT
    
    structured_data = Column(JSON, nullable=True)
    tool_call_id = Column(String(255), nullable=True)
    
    tokens_input = Column(Integer, nullable=True)
    tokens_output = Column(Integer, nullable=True)
    metadata_json = Column(JSON, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    conversation = relationship("Conversation", back_populates="messages")
