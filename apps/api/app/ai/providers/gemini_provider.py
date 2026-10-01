from typing import List, Dict, Any, AsyncIterator, Optional
from google import genai
from google.genai import types
import os
import asyncio
import logging
from functools import partial

from app.ai.providers.base import AIProvider, ChatMessage, AIResponse, AIResponseChunk

logger = logging.getLogger(__name__)

class GeminiProvider(AIProvider):
    """
    Provider for Google Gemini models.
    """
    
    # Model priority list: try each in order on failure
    MODEL_FALLBACKS = [
        "gemini-3.8-flash",
        "gemini-2.5-flash",
        "gemini-1.5-flash-latest",
    ]
    
    def __init__(self, api_key: str = None, model: str = "gemini-3.8-flash"):
        key = api_key or os.getenv("GEMINI_API_KEY")
        self.client = genai.Client(api_key=key)
        self.model = model

    def _prepare_messages(self, messages: List[ChatMessage]) -> List[types.Content]:
        contents = []
        for msg in messages:
            role = "user" if msg.role == "user" else "model"
            
            parts = []
            if msg.content:
                parts.append(types.Part.from_text(text=msg.content))
                
            if parts:
                contents.append(types.Content(role=role, parts=parts))
                
        return contents

    def _try_generate(self, model: str, contents, config) -> AIResponse:
        """Attempt generation with a specific model (runs in thread pool)."""
        response = self.client.models.generate_content(
            model=model,
            contents=contents,
            config=config
        )
        return AIResponse(content=response.text or "", tool_calls=None)

    async def _try_generate_async(self, model: str, contents, config) -> AIResponse:
        """Run the blocking SDK call in a thread pool so we don't block the event loop."""
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(None, partial(self._try_generate, model, contents, config))

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
        
        contents = self._prepare_messages(messages)
        
        # Try primary model with retries, then fallback to other models
        models_to_try = [self.model] + [m for m in self.MODEL_FALLBACKS if m != self.model]
        last_error = None
        
        for model in models_to_try:
            for attempt in range(3):  # 3 retries per model
                try:
                    logger.info(f"Trying model {model}, attempt {attempt + 1}")
                    return await self._try_generate_async(model, contents, config)
                except Exception as e:
                    error_str = str(e)
                    # 503 = overloaded, retry with backoff
                    if "503" in error_str or "UNAVAILABLE" in error_str:
                        wait = 2 ** attempt  # 1s, 2s, 4s
                        logger.warning(f"Model {model} overloaded (503), waiting {wait}s...")
                        await asyncio.sleep(wait)
                        last_error = e
                        continue
                    # 404 = model not available, try next model
                    elif "404" in error_str or "NOT_FOUND" in error_str:
                        logger.warning(f"Model {model} not found (404), trying next model...")
                        last_error = e
                        break  # break inner retry loop, try next model
                    else:
                        raise  # re-raise unexpected errors immediately
        
        raise last_error or Exception("All models failed")

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
