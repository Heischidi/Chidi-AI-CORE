import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.session import get_db
from app.models.workspace import Workspace
from app.models.integration import CustomTool
from app.schemas.integration import CustomToolCreate, CustomToolResponse
from app.dependencies import get_current_workspace
from app.services.secret_store import SecretStore
from app.services.security import is_safe_url

router = APIRouter()

@router.get("/", response_model=List[CustomToolResponse])
async def list_custom_tools(
    workspace: Workspace = Depends(get_current_workspace),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(CustomTool).where(CustomTool.workspace_id == workspace.id))
    return result.scalars().all()

@router.post("/", response_model=CustomToolResponse)
async def create_custom_tool(
    req: CustomToolCreate,
    workspace: Workspace = Depends(get_current_workspace),
    db: AsyncSession = Depends(get_db)
):
    if not is_safe_url(req.endpoint):
        raise HTTPException(status_code=400, detail="Endpoint URL is invalid or points to a restricted internal address.")
        
    credential_id = None
    if req.credential_secret:
        store = SecretStore()
        credential_id = await store.store(req.credential_secret)
        
    ct = CustomTool(
        workspace_id=workspace.id,
        name=req.name,
        description=req.description,
        method=req.method.upper(),
        endpoint=req.endpoint,
        input_schema=req.input_schema,
        output_mapping=req.output_mapping,
        integration_id=req.integration_id,
        enabled=req.enabled,
        credential_id=credential_id
    )
    db.add(ct)
    await db.commit()
    await db.refresh(ct)
    return ct
