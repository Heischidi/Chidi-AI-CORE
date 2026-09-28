from pydantic import BaseModel
from typing import Optional
from uuid import UUID
from datetime import datetime

class WorkspaceCreate(BaseModel):
    name: str
    slug: str

class WorkspaceResponse(BaseModel):
    id: UUID
    name: str
    slug: str
    plan: str
    public_id: UUID
    is_active: bool
    created_at: datetime
    
    model_config = {"from_attributes": True}

class WorkspaceMemberResponse(BaseModel):
    id: UUID
    workspace_id: UUID
    user_id: UUID
    role: str
    created_at: datetime
    
    model_config = {"from_attributes": True}
