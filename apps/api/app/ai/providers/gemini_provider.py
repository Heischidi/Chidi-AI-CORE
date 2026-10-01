from typing import List, Dict, Any, AsyncIterator, Optional
from google import genai
from google.genai import types
import os

from app.ai.providers.base import AIProvider, ChatMessage, AIResponse, AIResponseChunk

class GeminiProvider(AIProvider):
    """
    Provider for Google Gemini models.
    """
    
    def __init__(self, api_key: str = None, model: str = "gemini-2.0-flash"):
        key = api_key or os.getenv("GEMINI_API_KEY")
        self.client = genai.Client(api_key=key)
        self.model = model

    def _prepare_messages(self, messages: List[ChatMessage]) -> List[types.Content]:
        contents = []
        for msg in messages:
            role = "user" if msg.role == "user" else "model"
            
            # Simple conversion, ignoring tool calls for now to get a baseline
            parts = []
            if msg.content:
                parts.append(types.Part.from_text(text=msg.content))
                
            if parts:
                contents.append(types.Content(role=role, parts=parts))
                
        return contents

    async def generate(
        self,
        messages: List[ChatMessage],
        system_prompt: str,
        tools: Optional[List[Dict[str, Any]]] = None,
        temperature: float = 0.7,
        max_tokens: int = 2048,
    ) -> AIResponse:
        
        config = types.GenerateContentConfig(
            system_instruction=system_prompt,
            temperature=temperature,
            max_output_tokens=max_tokens
        )
        
        # In a complete implementation, you'd parse OpenAI-style tools to Gemini Tools here
        # For simplicity, we just run the chat.
        response = self.client.models.generate_content(
            model=self.model,
            contents=self._prepare_messages(messages),
            config=config
        )
        
        return AIResponse(
            content=response.text or "",
            tool_calls=None
        )

    async def stream(
        self,
        messages: List[ChatMessage],
        system_prompt: str,
        tools: Optional[List[Dict[str, Any]]] = None,
        temperature: float = 0.7,
        max_tokens: int = 2048,
    ) -> AsyncIterator[AIResponseChunk]:
        
        config = types.GenerateContentConfig(
            system_instruction=system_prompt,
            temperature=temperature,
            max_output_tokens=max_tokens
        )
        
        response = self.client.models.generate_content_stream(
            model=self.model,
            contents=self._prepare_messages(messages),
            config=config
        )
        
        for chunk in response:
            if chunk.text:
                yield AIResponseChunk(content=chunk.text)
