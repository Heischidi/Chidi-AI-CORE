import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.base import Base

class WidgetConfig(Base):
    __tablename__ = "widget_configs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False, unique=True, index=True)
    
    # Public identifier used in the browser script
    public_widget_id = Column(String(100), unique=True, nullable=False, index=True)
    
    # Customizations
    primary_color = Column(String(20), default="#000000")
    position = Column(String(20), default="bottom-right")
    welcome_message = Column(String, default="Hi! I'm Chidi. How can I help you?")
    suggested_questions = Column(JSON, default=list)
    avatar_url = Column(String, nullable=True)
    auto_open = Column(Boolean, default=False)
    enabled = Column(Boolean, default=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    workspace = relationship("Workspace")
