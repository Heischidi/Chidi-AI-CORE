from abc import ABC, abstractmethod
from typing import List, Dict, Any, AsyncIterator, Optional
from pydantic import BaseModel

class ChatMessage(BaseModel):
    role: str
    content: Optional[str] = None
    name: Optional[str] = None
    tool_calls: Optional[List[Dict[str, Any]]] = None
    tool_call_id: Optional[str] = None

class AIResponseChunk(BaseModel):
    content: str

class AIResponse(BaseModel):
    content: str
    tool_calls: Optional[List[Dict[str, Any]]] = None

class AIProvider(ABC):
    """
    Abstract base class for AI Providers (OpenAI, Ollama, etc.)
    Ensures CHIDI AI is not tightly coupled to a single vendor.
    """
    
    @abstractmethod
    async def generate(
        self,
        messages: List[ChatMessage],
        system_prompt: str,
        tools: Optional[List[Dict[str, Any]]] = None,
        temperature: float = 0.7,
        max_tokens: int = 2048,
    ) -> AIResponse:
        pass

    @abstractmethod
    async def stream(
        self,
        messages: List[ChatMessage],
        system_prompt: str,
        tools: Optional[List[Dict[str, Any]]] = None,
        temperature: float = 0.7,
        max_tokens: int = 2048,
    ) -> AsyncIterator[AIResponseChunk]:
        pass
