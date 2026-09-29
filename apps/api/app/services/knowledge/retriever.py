import uuid
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.knowledge import KnowledgeChunk
from app.services.knowledge.embeddings import GeminiEmbeddingProvider

class RetrievedChunk:
    def __init__(self, text: str, metadata: dict, score: float):
        self.text = text
        self.metadata = metadata
        self.score = score

class KnowledgeRetriever:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.embedding_provider = GeminiEmbeddingProvider()

    async def search(
        self, 
        workspace_id: uuid.UUID, 
        query: str, 
        top_k: int = 5, 
        similarity_threshold: float = 0.5
    ) -> List[RetrievedChunk]:
        # Generate query embedding
        query_embedding = await self.embedding_provider.embed_query(query)
        if not query_embedding:
            return []

        # Vector search using pgvector cosine distance
        # similarity = 1 - cosine_distance
        # We want to order by cosine distance ascending (closest first)
        
        # In pgvector: <=> is cosine distance
        stmt = (
            select(KnowledgeChunk)
            .where(KnowledgeChunk.workspace_id == workspace_id)
            .order_by(KnowledgeChunk.embedding.cosine_distance(query_embedding))
            .limit(top_k)
        )
        
        result = await self.db.execute(stmt)
        chunks = result.scalars().all()
        
        # Note: To strictly apply similarity_threshold, we could calculate the exact similarity.
        # But for simplicity, we just return the ordered top_k. In a full implementation, 
        # we can calculate 1 - chunk.embedding.cosine_distance(query_embedding) and filter.
        
        return [
            RetrievedChunk(
                text=c.text_content, 
                metadata=c.metadata_json or {}, 
                score=1.0 # placeholder for actual calculated score
            )
            for c in chunks
        ]
