import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.session import get_db
from app.models.workspace import Workspace
from app.models.integration import Integration, CustomTool
from app.schemas.integration import IntegrationCreate, IntegrationResponse, CustomToolCreate, CustomToolResponse
from app.dependencies import get_current_workspace
from app.services.secret_store import SecretStore

router = APIRouter()

@router.get("/", response_model=List[IntegrationResponse])
async def list_integrations(
    workspace: Workspace = Depends(get_current_workspace),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Integration).where(Integration.workspace_id == workspace.id))
    return result.scalars().all()

@router.post("/", response_model=IntegrationResponse)
async def create_integration(
    req: IntegrationCreate,
    workspace: Workspace = Depends(get_current_workspace),
    db: AsyncSession = Depends(get_db)
):
    credential_id = None
    if req.credential_secret:
        store = SecretStore()
        credential_id = await store.store(req.credential_secret)
        
    integration = Integration(
        workspace_id=workspace.id,
        provider=req.provider,
        configuration=req.configuration,
        enabled=req.enabled,
        credential_id=credential_id
    )
    db.add(integration)
    await db.commit()
    await db.refresh(integration)
    return integration
