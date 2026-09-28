from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from uuid import UUID
from datetime import datetime

class CapabilityBase(BaseModel):
    capability_key: str
    enabled: bool = True
    configuration: Dict[str, Any] = {}

class CapabilityCreate(CapabilityBase):
    pass

class CapabilityUpdate(BaseModel):
    enabled: Optional[bool] = None
    configuration: Optional[Dict[str, Any]] = None

class CapabilityResponse(CapabilityBase):
    id: UUID
    workspace_id: UUID
    created_at: datetime
    updated_at: datetime
    
    model_config = {"from_attributes": True}

class ToolExecutionResponse(BaseModel):
    id: UUID
    workspace_id: UUID
    conversation_id: UUID
    tool_name: str
    input_payload: Optional[Dict[str, Any]]
    output_payload: Optional[Dict[str, Any]]
    status: str
    error_message: Optional[str]
    duration_ms: Optional[int]
    created_at: datetime
    
    model_config = {"from_attributes": True}
