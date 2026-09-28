from abc import ABC, abstractmethod
from typing import List
from openai import AsyncOpenAI
import os

class EmbeddingProvider(ABC):
    @abstractmethod
    async def embed_documents(self, texts: List[str]) -> List[List[float]]:
        pass

    @abstractmethod
    async def embed_query(self, text: str) -> List[float]:
        pass

class OpenAIEmbeddingProvider(EmbeddingProvider):
    def __init__(self, api_key: str = None, model: str = "text-embedding-3-small"):
        self.client = AsyncOpenAI(
            api_key=api_key or os.getenv("OPENAI_API_KEY", "dummy-key")
        )
        self.model = model

    async def embed_documents(self, texts: List[str]) -> List[List[float]]:
        if not texts:
            return []
        
        # Batch embedding support
        response = await self.client.embeddings.create(
            input=texts,
            model=self.model
        )
        return [data.embedding for data in response.data]

    async def embed_query(self, text: str) -> List[float]:
        result = await self.embed_documents([text])
        if result:
            return result[0]
        return []
