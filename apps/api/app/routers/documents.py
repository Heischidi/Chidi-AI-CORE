from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
import uuid

from app.db.session import get_db
from app.models.workspace import Workspace
from app.models.knowledge import Document
from app.schemas.knowledge import DocumentResponse
from app.dependencies import get_current_workspace
from app.services.knowledge.ingestion import KnowledgeIngestionService

router = APIRouter()

@router.post("/", response_model=DocumentResponse)
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    workspace: Workspace = Depends(get_current_workspace),
    db: AsyncSession = Depends(get_db)
):
    # Determine file type
    filename = file.filename
    ext = filename.split('.')[-1].lower() if '.' in filename else ""
    
    document = Document(
        workspace_id=workspace.id,
        filename=filename,
        file_type=ext
    )
    db.add(document)
    await db.commit()
    await db.refresh(document)
    
    # Read file content synchronously for the background task
    content = await file.read()
    
    # Run ingestion in background
    ingestion_service = KnowledgeIngestionService(db)
    background_tasks.add_task(ingestion_service.ingest_document, document.id, content)
    
    return document

@router.get("/", response_model=List[DocumentResponse])
async def list_documents(
    workspace: Workspace = Depends(get_current_workspace),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Document).where(Document.workspace_id == workspace.id))
    return result.scalars().all()
