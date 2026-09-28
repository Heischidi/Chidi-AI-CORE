import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Integer, JSON, Boolean, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from pgvector.sqlalchemy import Vector
from app.db.base import Base

class Website(Base):
    __tablename__ = "websites"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False, index=True)
    
    base_url = Column(String, nullable=False)
    status = Column(String(50), default="PENDING") # PENDING, CRAWLING, COMPLETED, FAILED
    max_pages = Column(Integer, default=50)
    crawl_depth = Column(Integer, default=2)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    pages = relationship("WebsitePage", back_populates="website", cascade="all, delete-orphan")

class WebsitePage(Base):
    __tablename__ = "website_pages"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False, index=True)
    website_id = Column(UUID(as_uuid=True), ForeignKey("websites.id", ondelete="CASCADE"), nullable=False, index=True)
    
    url = Column(String, nullable=False, index=True)
    title = Column(String, nullable=True)
    content_hash = Column(String, nullable=True)
    
    status = Column(String(50), default="PENDING") # PENDING, EXTRACTED, INDEXED, FAILED
    last_crawled_at = Column(DateTime, nullable=True)
    
    website = relationship("Website", back_populates="pages")

class Document(Base):
    __tablename__ = "documents"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False, index=True)
    
    filename = Column(String, nullable=False)
    file_type = Column(String(20), nullable=False) # PDF, DOCX, TXT, CSV
    status = Column(String(50), default="PENDING") # PENDING, PROCESSING, COMPLETED, FAILED
    error_message = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class KnowledgeChunk(Base):
    __tablename__ = "knowledge_chunks"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Source relationship (could be website page or document)
    source_type = Column(String(20), nullable=False) # WEBSITE_PAGE, DOCUMENT
    source_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    
    text_content = Column(Text, nullable=False)
    chunk_index = Column(Integer, nullable=False)
    
    # OpenAI text-embedding-3-small uses 1536 dimensions
    embedding = Column(Vector(1536), nullable=True)
    
    metadata_json = Column(JSON, nullable=True) # E.g., {"url": "...", "page_num": 1}
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
