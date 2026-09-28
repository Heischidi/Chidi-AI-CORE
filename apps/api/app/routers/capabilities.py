import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.session import get_db
from app.models.workspace import Workspace
from app.models.capability import Capability, ToolExecution
from app.schemas.capability import CapabilityCreate, CapabilityUpdate, CapabilityResponse, ToolExecutionResponse
from app.dependencies import get_current_workspace

router = APIRouter()

@router.get("/", response_model=List[CapabilityResponse])
async def list_capabilities(
    workspace: Workspace = Depends(get_current_workspace),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Capability).where(Capability.workspace_id == workspace.id))
    return result.scalars().all()

@router.post("/", response_model=CapabilityResponse)
async def create_capability(
    req: CapabilityCreate,
    workspace: Workspace = Depends(get_current_workspace),
    db: AsyncSession = Depends(get_db)
):
    cap = Capability(
        workspace_id=workspace.id,
        capability_key=req.capability_key,
        enabled=req.enabled,
        configuration=req.configuration
    )
    db.add(cap)
    await db.commit()
    await db.refresh(cap)
    return cap

@router.patch("/{capability_id}", response_model=CapabilityResponse)
async def update_capability(
    capability_id: uuid.UUID,
    req: CapabilityUpdate,
    workspace: Workspace = Depends(get_current_workspace),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Capability).where(
            Capability.id == capability_id,
            Capability.workspace_id == workspace.id
        )
    )
    cap = result.scalar_one_or_none()
    if not cap:
        raise HTTPException(status_code=404, detail="Capability not found")
        
    if req.enabled is not None:
        cap.enabled = req.enabled
    if req.configuration is not None:
        cap.configuration = req.configuration
        
    await db.commit()
    await db.refresh(cap)
    return cap

@router.get("/executions", response_model=List[ToolExecutionResponse])
async def list_tool_executions(
    workspace: Workspace = Depends(get_current_workspace),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(ToolExecution)
        .where(ToolExecution.workspace_id == workspace.id)
        .order_by(ToolExecution.created_at.desc())
        .limit(100)
    )
    return result.scalars().all()
