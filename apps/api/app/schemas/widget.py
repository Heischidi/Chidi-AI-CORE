from pydantic import BaseModel, Field
from typing import Optional, List
from uuid import UUID
from datetime import datetime

class WidgetConfigResponse(BaseModel):
    # Notice we DO NOT expose workspace_id here.
    widget_id: str
    name: str = "Chidi" # Immutable identity
    primary_color: str
    position: str
    welcome_message: str
    suggested_questions: List[str]
    avatar_url: Optional[str]
    auto_open: bool
    enabled: bool

    model_config = {"from_attributes": True}

class PublicConversationCreate(BaseModel):
    # Anonymous visitor session id or anonymous footprint
    visitor_id: Optional[str] = None
    
class PublicMessageCreate(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    stream: bool = False
