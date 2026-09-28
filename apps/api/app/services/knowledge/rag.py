import uuid
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.knowledge.retriever import KnowledgeRetriever

class RAGContext:
    def __init__(self, context_text: str, sources: List[dict]):
        self.context_text = context_text
        self.sources = sources

class RAGContextBuilder:
    def __init__(self, db: AsyncSession):
        self.retriever = KnowledgeRetriever(db)

    async def build(self, workspace_id: uuid.UUID, query: str) -> RAGContext:
        chunks = await self.retriever.search(workspace_id=workspace_id, query=query)
        
        if not chunks:
            return RAGContext(context_text="", sources=[])
            
        context_parts = []
        sources = []
        
        for i, chunk in enumerate(chunks):
            # Format nicely for the LLM
            source_info = chunk.metadata.get("url") or chunk.metadata.get("filename") or "Unknown Source"
            context_parts.append(f"[Source {i+1}: {source_info}]\n{chunk.text}")
            sources.append(chunk.metadata)
            
        formatted_context = "\n\n".join(context_parts)
        
        return RAGContext(context_text=formatted_context, sources=sources)
