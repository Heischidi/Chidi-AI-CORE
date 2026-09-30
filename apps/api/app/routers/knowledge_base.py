from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, text
from typing import List, Dict, Any

from app.db.session import get_db
from app.models.workspace import Workspace
from app.models.knowledge import WebsitePage, Document
from app.dependencies import get_current_workspace

router = APIRouter()

@router.get("/summary")
async def get_knowledge_summary(
    db: AsyncSession = Depends(get_db)
):
    # Bypass auth for now - get default workspace
    result = await db.execute(select(Workspace).limit(1))
    workspace = result.scalar_one_or_none()
    if not workspace:
        return {"pages": [], "documents": []}
        
    pages_res = await db.execute(
        select(WebsitePage)
        .where(WebsitePage.workspace_id == workspace.id)
        .order_by(WebsitePage.url)
    )
    pages = pages_res.scalars().all()
    
    docs_res = await db.execute(
        select(Document)
        .where(Document.workspace_id == workspace.id)
    )
    docs = docs_res.scalars().all()
    
    # Let's count chunks for each
    chunks_count = {}
    chunks_res = await db.execute(text(f"SELECT source_id, COUNT(*) FROM knowledge_chunks WHERE workspace_id = '{workspace.id}' GROUP BY source_id"))
    for row in chunks_res.fetchall():
        chunks_count[str(row[0])] = row[1]
    
    formatted_pages = [
        {
            "id": str(p.id),
            "name": p.url,
            "type": "WEBSITE_PAGE",
            "status": p.status,
            "chunks": chunks_count.get(str(p.id), 0)
        } for p in pages
    ]
    
    formatted_docs = [
        {
            "id": str(d.id),
            "name": d.filename,
            "type": d.file_type.upper(),
            "status": d.status,
            "chunks": chunks_count.get(str(d.id), 0)
        } for d in docs
    ]
    
    return formatted_pages + formatted_docs
