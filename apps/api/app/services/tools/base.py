import uuid
from typing import Any, Dict, Optional
from abc import ABC, abstractmethod
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

class ToolContext(BaseModel):
    workspace_id: uuid.UUID
    conversation_id: uuid.UUID
    
    # Internal DB session injected by the registry/agent loop, not exposed to LLM
    class Config:
        arbitrary_types_allowed = True
    
    db: Optional[Any] = None

class ToolResult(BaseModel):
    success: bool
    data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    status_code: str = "SUCCESS"

class BaseTool(ABC):
    """
    Abstract base class for all deterministic business tools.
    The LLM does NOT execute code; it just returns a JSON mapping to one of these.
    """
    name: str
    description: str
    input_schema: Dict[str, Any]
    
    @abstractmethod
    async def execute(self, context: ToolContext, arguments: Dict[str, Any]) -> ToolResult:
        """Execute the deterministic business action and return a structured result."""
        pass
