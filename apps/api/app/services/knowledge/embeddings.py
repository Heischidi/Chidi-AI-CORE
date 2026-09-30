from abc import ABC, abstractmethod
from typing import List
from google import genai
import os

class EmbeddingProvider(ABC):
    @abstractmethod
    async def embed_documents(self, texts: List[str]) -> List[List[float]]:
        pass

    @abstractmethod
    async def embed_query(self, text: str) -> List[float]:
        pass

from google.genai import types

class GeminiEmbeddingProvider(EmbeddingProvider):
    def __init__(self, api_key: str = None, model: str = "gemini-embedding-2"):
        self.client = genai.Client(api_key=api_key or os.getenv("GEMINI_API_KEY"))
        self.model = model

    async def embed_documents(self, texts: List[str]) -> List[List[float]]:
        if not texts:
            return []
        
        # Batch embedding support using google-genai
        response = self.client.models.embed_content(
            model=self.model,
            contents=texts,
            config=types.EmbedContentConfig(output_dimensionality=768)
        )
        return [emb.values for emb in response.embeddings]

    async def embed_query(self, text: str) -> List[float]:
        result = await self.embed_documents([text])
        if result:
            return result[0]
        return []
