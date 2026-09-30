from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
import uuid

from app.db.session import get_db
from app.models.user import User
from app.models.workspace import Workspace, WorkspaceMember
from app.schemas.workspace import WorkspaceCreate, WorkspaceResponse
from app.dependencies import get_current_active_user, get_current_workspace

router = APIRouter()

@router.get("/current", response_model=WorkspaceResponse)
async def get_current_active_workspace(
    db: AsyncSession = Depends(get_db)
):
    # Bypass auth for MVP - get or create default workspace
    result = await db.execute(select(Workspace).limit(1))
    workspace = result.scalar_one_or_none()
    if not workspace:
        workspace = Workspace(name="Grand Lynks Homes", slug="grand-lynks-homes")
        db.add(workspace)
        await db.commit()
        await db.refresh(workspace)
    return workspace

@router.post("/", response_model=WorkspaceResponse)
async def create_workspace(
    workspace_in: WorkspaceCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Check if slug exists
    result = await db.execute(select(Workspace).where(Workspace.slug == workspace_in.slug))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Workspace slug already taken")
        
    workspace = Workspace(name=workspace_in.name, slug=workspace_in.slug)
    db.add(workspace)
    await db.commit()
    await db.refresh(workspace)
    
    # Add user as OWNER
    member = WorkspaceMember(workspace_id=workspace.id, user_id=current_user.id, role="OWNER")
    db.add(member)
    await db.commit()
    
    return workspace

@router.get("/", response_model=List[WorkspaceResponse])
async def read_workspaces(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    # Get all workspaces the user is a member of
    stmt = select(Workspace).join(WorkspaceMember).where(WorkspaceMember.user_id == current_user.id)
    result = await db.execute(stmt)
    return result.scalars().all()

@router.get("/{id}", response_model=WorkspaceResponse)
async def read_workspace(
    id: uuid.UUID,
    workspace: Workspace = Depends(get_current_workspace)
):
    # The get_current_workspace dependency already enforces tenant isolation 
    # and validates the user has access to this workspace via the header.
    # We verify the header matches the URL param.
    if workspace.id != id:
         raise HTTPException(status_code=400, detail="Workspace ID mismatch")
    return workspace
