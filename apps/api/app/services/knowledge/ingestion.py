import uuid
import logging
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from io import BytesIO

from app.models.knowledge import Website, WebsitePage, Document, KnowledgeChunk
from app.services.knowledge.crawler import WebsiteCrawler
from app.services.knowledge.extractor import ExtractorFactory
from app.services.knowledge.chunker import TextChunker
from app.services.knowledge.embeddings import GeminiEmbeddingProvider

logger = logging.getLogger(__name__)

class KnowledgeIngestionService:
    def __init__(self, db: AsyncSession = None):
        self.db = db
        self.chunker = TextChunker()
        self.embedding_provider = GeminiEmbeddingProvider()
        self.extractor_factory = ExtractorFactory()

    async def ingest_website(self, website_id: uuid.UUID):
        from app.db.session import async_session_maker
        
        async with async_session_maker() as session:
            self.db = session
            # Fetch website
            result = await self.db.execute(select(Website).where(Website.id == website_id))
            website = result.scalar_one_or_none()
        if not website:
            logger.error(f"Website {website_id} not found")
            return

        website.status = "CRAWLING"
        await self.db.commit()

        try:
            crawler = WebsiteCrawler(website.base_url, max_pages=website.max_pages, crawl_depth=website.crawl_depth)
            crawled_pages = await crawler.crawl()

            # Process pages
            for page_data in crawled_pages:
                # Check if page exists
                page_res = await self.db.execute(
                    select(WebsitePage).where(WebsitePage.url == page_data.url, WebsitePage.website_id == website.id)
                )
                page = page_res.scalar_one_or_none()

                if not page:
                    page = WebsitePage(
                        workspace_id=website.workspace_id,
                        website_id=website.id,
                        url=page_data.url,
                        title=page_data.title,
                        content_hash=page_data.content_hash,
                        status="INDEXED"
                    )
                    self.db.add(page)
                    await self.db.commit()
                    await self.db.refresh(page)
                    
                    await self._index_text(
                        text=page_data.content,
                        source_type="WEBSITE_PAGE",
                        source_id=page.id,
                        workspace_id=website.workspace_id,
                        metadata={"url": page.url, "title": page.title}
                    )
                else:
                    # If content hash changed, reindex
                    if page.content_hash != page_data.content_hash:
                        # Delete old chunks
                        await self.db.execute(
                            delete(KnowledgeChunk).where(KnowledgeChunk.source_id == page.id)
                        )
                        page.content_hash = page_data.content_hash
                        page.title = page_data.title
                        await self.db.commit()
                        
                        await self._index_text(
                            text=page_data.content,
                            source_type="WEBSITE_PAGE",
                            source_id=page.id,
                            workspace_id=website.workspace_id,
                            metadata={"url": page.url, "title": page.title}
                        )

            website.status = "COMPLETED"
        except Exception as e:
            logger.error(f"Failed to ingest website {website_id}: {str(e)}")
            website.status = "FAILED"
            
        await self.db.commit()

    async def ingest_document(self, document_id: uuid.UUID, file_content: bytes):
        from app.db.session import async_session_maker
        
        async with async_session_maker() as session:
            self.db = session
            result = await self.db.execute(select(Document).where(Document.id == document_id))
            document = result.scalar_one_or_none()
        if not document:
            return

        document.status = "PROCESSING"
        await self.db.commit()

        try:
            extractor = self.extractor_factory.get_extractor(document.file_type)
            extracted = extractor.extract(BytesIO(file_content))
            
            # Delete old chunks if any (for re-processing)
            await self.db.execute(delete(KnowledgeChunk).where(KnowledgeChunk.source_id == document.id))
            
            await self._index_text(
                text=extracted.content,
                source_type="DOCUMENT",
                source_id=document.id,
                workspace_id=document.workspace_id,
                metadata={"filename": document.filename}
            )
            
            document.status = "COMPLETED"
        except Exception as e:
            logger.error(f"Failed to ingest document {document_id}: {str(e)}")
            document.status = "FAILED"
            document.error_message = str(e)
            
        await self.db.commit()

    async def _index_text(self, text: str, source_type: str, source_id: uuid.UUID, workspace_id: uuid.UUID, metadata: dict):
        chunks = self.chunker.chunk_text(text, base_metadata=metadata)
        if not chunks:
            return
            
        # Extract just the texts to embed in batch
        texts_to_embed = [c.text for c in chunks]
        embeddings = await self.embedding_provider.embed_documents(texts_to_embed)
        
        # Save to DB
        db_chunks = []
        for i, chunk in enumerate(chunks):
            db_chunks.append(
                KnowledgeChunk(
                    workspace_id=workspace_id,
                    source_type=source_type,
                    source_id=source_id,
                    text_content=chunk.text,
                    chunk_index=chunk.index,
                    embedding=embeddings[i] if i < len(embeddings) else None,
                    metadata_json=chunk.metadata
                )
            )
            
        self.db.add_all(db_chunks)
        await self.db.commit()
