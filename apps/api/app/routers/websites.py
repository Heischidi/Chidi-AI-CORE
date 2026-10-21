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
from app.services.security import is_safe_url

router = APIRouter()

@router.post("/", response_model=WebsiteResponse)
async def add_website(
    website_in: WebsiteCreate,
    background_tasks: BackgroundTasks,
    workspace: Workspace = Depends(get_current_workspace),
    db: AsyncSession = Depends(get_db)
):
    if not is_safe_url(website_in.base_url):
        raise HTTPException(
            status_code=400,
            detail="The provided URL is invalid or points to a restricted internal/loopback address."
        )

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
    result = await db.execute(
        select(Website).where(Website.workspace_id == workspace.id)
    )
    return result.scalars().all()

@router.delete("/{website_id}")
async def delete_website(
    website_id: uuid.UUID,
    workspace: Workspace = Depends(get_current_workspace),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Website).where(
            Website.id == website_id,
            Website.workspace_id == workspace.id
        )
    )
    website = result.scalar_one_or_none()
    if not website:
        raise HTTPException(status_code=404, detail="Website not found")
        
    await db.delete(website)
    await db.commit()
    return {"status": "success"}

@router.post("/{website_id}/recrawl", response_model=WebsiteResponse)
async def recrawl_website(
    website_id: uuid.UUID,
    background_tasks: BackgroundTasks,
    workspace: Workspace = Depends(get_current_workspace),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Website).where(
            Website.id == website_id,
            Website.workspace_id == workspace.id
        )
    )
    website = result.scalar_one_or_none()
    if not website:
        raise HTTPException(status_code=404, detail="Website not found")

    if not is_safe_url(website.base_url):
        raise HTTPException(status_code=400, detail="Website base URL is no longer valid or safe.")
    
    # Reset status so frontend shows it's working
    website.status = "PENDING"
    await db.commit()
    await db.refresh(website)
    
    # Queue fresh ingestion
    ingestion_service = KnowledgeIngestionService(db)
    background_tasks.add_task(ingestion_service.ingest_website, website.id)
    
    return website
