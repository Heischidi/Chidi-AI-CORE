import uuid
from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.models.workspace import Workspace
from app.dependencies import get_current_workspace
from app.services.tools.registry import ToolRegistryService

router = APIRouter()

@router.get("/")
async def list_tools(
    workspace: Workspace = Depends(get_current_workspace),
    db: AsyncSession = Depends(get_db)
):
    registry = ToolRegistryService(db)
    tools = await registry.get_authorized_tools(workspace.id)
    return [
        {
            "name": t.name,
            "description": t.description,
            "input_schema": t.input_schema
        } for t in tools
    ]
