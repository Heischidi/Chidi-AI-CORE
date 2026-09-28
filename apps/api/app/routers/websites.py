from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
import uuid

from app.db.session import get_db
from app.models.workspace import Workspace
from app.models.knowledge import Website
from app.schemas.knowledge import WebsiteCreate, WebsiteResponse
from app.dependencies import get_current_workspace
from app.services.knowledge.ingestion import KnowledgeIngestionService

router = APIRouter()

@router.post("/", response_model=WebsiteResponse)
async def add_website(
    website_in: WebsiteCreate,
    background_tasks: BackgroundTasks,
    workspace: Workspace = Depends(get_current_workspace),
    db: AsyncSession = Depends(get_db)
):
    website = Website(
        workspace_id=workspace.id,
        base_url=website_in.base_url,
        max_pages=website_in.max_pages,
        crawl_depth=website_in.crawl_depth
    )
    db.add(website)
    await db.commit()
    await db.refresh(website)
    
    # Run ingestion in background
    ingestion_service = KnowledgeIngestionService(db)
    background_tasks.add_task(ingestion_service.ingest_website, website.id)
    
    return website

@router.get("/", response_model=List[WebsiteResponse])
async def list_websites(
    workspace: Workspace = Depends(get_current_workspace),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Website).where(Website.workspace_id == workspace.id))
    return result.scalars().all()
