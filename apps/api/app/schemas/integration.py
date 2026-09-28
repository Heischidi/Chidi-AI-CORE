import uuid
from typing import List
from pydantic import BaseModel
from datetime import datetime
from uuid import UUID

class IntegrationBase(BaseModel):
    provider: str
    configuration: dict = {}
    enabled: bool = True
    credential_secret: str = None # Write-only

class IntegrationCreate(IntegrationBase):
    pass

class IntegrationResponse(BaseModel):
    id: UUID
    workspace_id: UUID
    provider: str
    configuration: dict
    enabled: bool
    created_at: datetime
    
    model_config = {"from_attributes": True}

class CustomToolBase(BaseModel):
    name: str
    description: str
    method: str = "GET"
    endpoint: str
    input_schema: dict
    output_mapping: dict = None
    integration_id: UUID = None
    enabled: bool = True
    credential_secret: str = None # Write-only

class CustomToolCreate(CustomToolBase):
    pass

class CustomToolResponse(BaseModel):
    id: UUID
    workspace_id: UUID
    name: str
    description: str
    method: str
    endpoint: str
    input_schema: dict
    output_mapping: dict = None
    integration_id: UUID = None
    enabled: bool
    created_at: datetime
    
    model_config = {"from_attributes": True}
