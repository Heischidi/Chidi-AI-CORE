from pydantic import BaseModel, HttpUrl
from typing import Optional, List
from uuid import UUID
from datetime import datetime

class WebsiteCreate(BaseModel):
    base_url: str
    max_pages: int = 50
    crawl_depth: int = 2

class WebsiteResponse(BaseModel):
    id: UUID
    workspace_id: UUID
    base_url: str
    status: str
    max_pages: int
    crawl_depth: int
    created_at: datetime
    
    model_config = {"from_attributes": True}

class WebsitePageResponse(BaseModel):
    id: UUID
    website_id: UUID
    url: str
    title: Optional[str]
    status: str
    
    model_config = {"from_attributes": True}

class DocumentResponse(BaseModel):
    id: UUID
    workspace_id: UUID
    filename: str
    file_type: str
    status: str
    error_message: Optional[str]
    created_at: datetime
    
    model_config = {"from_attributes": True}

class KnowledgeSearchRequest(BaseModel):
    query: str
    top_k: int = 5
    similarity_threshold: float = 0.5
