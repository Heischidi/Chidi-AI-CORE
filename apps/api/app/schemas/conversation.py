from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from uuid import UUID
from datetime import datetime

class MessageCreate(BaseModel):
    content: str

class MessageResponse(BaseModel):
    id: UUID
    role: str
    content: Optional[str]
    content_type: str
    metadata_json: Optional[Dict[str, Any]] = None
    created_at: datetime
    
    model_config = {"from_attributes": True}

class ConversationCreate(BaseModel):
    channel: str = "WEB"

class ConversationResponse(BaseModel):
    id: UUID
    workspace_id: UUID
    channel: str
    status: str
    started_at: datetime
    
    model_config = {"from_attributes": True}

class ChatRequest(BaseModel):
    message: str
    stream: bool = False
