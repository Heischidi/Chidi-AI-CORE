from typing import List, Dict, Any, AsyncIterator, Optional
from openai import AsyncOpenAI
import os

from app.ai.providers.base import AIProvider, ChatMessage, AIResponse, AIResponseChunk

class OpenAICompatibleProvider(AIProvider):
    """
    Provider for OpenAI-compatible APIs (OpenAI, Groq, Together, Ollama with OpenAI interface).
    """
    
    def __init__(self, api_key: str = None, base_url: str = None, model: str = "gpt-4o-mini"):
        # Uses environment variables OPENAI_API_KEY if api_key is None
        self.client = AsyncOpenAI(
            api_key=api_key or os.getenv("OPENAI_API_KEY", "dummy-key"),
            base_url=base_url
        )
        self.model = model

    def _prepare_messages(self, system_prompt: str, messages: List[ChatMessage]) -> List[Dict[str, Any]]:
        formatted_messages = [{"role": "system", "content": system_prompt}]
        for msg in messages:
            msg_dict = {"role": msg.role.lower()}
            if msg.content is not None:
                msg_dict["content"] = msg.content
            if msg.name:
                msg_dict["name"] = msg.name
            if msg.tool_calls:
                msg_dict["tool_calls"] = msg.tool_calls
            if msg.tool_call_id:
                msg_dict["tool_call_id"] = msg.tool_call_id
            formatted_messages.append(msg_dict)
        return formatted_messages

    async def generate(
        self,
        messages: List[ChatMessage],
        system_prompt: str,
        tools: Optional[List[Dict[str, Any]]] = None,
        temperature: float = 0.7,
        max_tokens: int = 2048,
    ) -> AIResponse:
        
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=self._prepare_messages(system_prompt, messages),
            temperature=temperature,
            max_tokens=max_tokens,
            tools=tools
        )
        
        message = response.choices[0].message
        tool_calls = []
        if message.tool_calls:
            for t in message.tool_calls:
                tool_calls.append({
                    "id": t.id,
                    "type": "function",
                    "function": {
                        "name": t.function.name,
                        "arguments": t.function.arguments
                    }
                })
                
        return AIResponse(
            content=message.content or "",
            tool_calls=tool_calls if tool_calls else None
        )

    async def stream(
        self,
        messages: List[ChatMessage],
        system_prompt: str,
        tools: Optional[List[Dict[str, Any]]] = None,
        temperature: float = 0.7,
        max_tokens: int = 2048,
    ) -> AsyncIterator[AIResponseChunk]:
        
        stream_response = await self.client.chat.completions.create(
            model=self.model,
            messages=self._prepare_messages(system_prompt, messages),
            temperature=temperature,
            max_tokens=max_tokens,
            stream=True
        )
        
        async for chunk in stream_response:
            if chunk.choices and chunk.choices[0].delta.content:
                yield AIResponseChunk(content=chunk.choices[0].delta.content)
