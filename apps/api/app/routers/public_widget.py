import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sse_starlette.sse import EventSourceResponse

from app.db.session import get_db
from app.models.widget import WidgetConfig
from app.models.workspace import Workspace
from app.models.conversation import Conversation, Message
from app.schemas.widget import WidgetConfigResponse, PublicConversationCreate, PublicMessageCreate
from app.schemas.conversation import ConversationResponse, MessageResponse
from app.services.conversation_service import ConversationService

router = APIRouter()

# Basic Rate Limiting Foundation
async def check_rate_limit(request: Request):
    # In a production system, this would use Redis to track requests by IP and Widget ID.
    # We establish the foundation here to prevent abuse.
    client_ip = request.client.host if request.client else "unknown"
    # Logic: if redis.get(client_ip) > MAX_REQUESTS: raise 429 Too Many Requests
    pass

# Dependency to resolve workspace from public_widget_id
async def get_widget_workspace(
    public_widget_id: str, 
    db: AsyncSession = Depends(get_db)
) -> Workspace:
    if public_widget_id == "default":
        ws_result = await db.execute(select(Workspace).limit(1))
        workspace = ws_result.scalar_one_or_none()
        if not workspace:
            raise HTTPException(status_code=404, detail="Workspace not found")
        return workspace

    result = await db.execute(
        select(WidgetConfig).where(WidgetConfig.public_widget_id == public_widget_id)
    )
    widget = result.scalar_one_or_none()
    
    if not widget:
        raise HTTPException(status_code=404, detail="Widget not found")
    if not widget.enabled:
        raise HTTPException(status_code=403, detail="Widget is disabled")
        
    ws_result = await db.execute(select(Workspace).where(Workspace.id == widget.workspace_id))
    workspace = ws_result.scalar_one_or_none()
    
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
        
    return workspace

@router.get("/config/{public_widget_id}", response_model=WidgetConfigResponse)
async def get_widget_config(public_widget_id: str, db: AsyncSession = Depends(get_db)):
    if public_widget_id == "default":
        return WidgetConfigResponse(
            widget_id="default",
            name="Chidi",
            primary_color="#10b981",
            position="bottom-right",
            welcome_message="Hi! I'm Chidi. I'm ready to answer questions based on the knowledge you just added!",
            suggested_questions=[],
            avatar_url=None,
            auto_open=False,
            enabled=True
        )

    result = await db.execute(
        select(WidgetConfig).where(WidgetConfig.public_widget_id == public_widget_id)
    )
    widget = result.scalar_one_or_none()
    if not widget or not widget.enabled:
        raise HTTPException(status_code=404, detail="Widget not found or disabled")
        
    # Map to public response (which strictly drops private ids and hardcodes 'name': 'Chidi')
    return WidgetConfigResponse(
        widget_id=widget.public_widget_id,
        name="Chidi",
        primary_color=widget.primary_color,
        position=widget.position,
        welcome_message=widget.welcome_message,
        suggested_questions=widget.suggested_questions,
        avatar_url=widget.avatar_url,
        auto_open=widget.auto_open,
        enabled=widget.enabled
    )

@router.post("/{public_widget_id}/conversations", response_model=ConversationResponse, dependencies=[Depends(check_rate_limit)])
async def create_public_conversation(
    public_widget_id: str,
    req: PublicConversationCreate,
    workspace: Workspace = Depends(get_widget_workspace),
    db: AsyncSession = Depends(get_db)
):
    # This automatically associates the conversation ONLY with the resolved workspace.
    # We also track it as a WIDGET channel.
    service = ConversationService(db)
    conv = await service.create_conversation(workspace_id=workspace.id, channel="WIDGET")
    
    # In a real implementation, we'd store the anonymous visitor_id in metadata_json
    if req.visitor_id:
        conv.metadata_json = {"visitor_id": req.visitor_id}
        await db.commit()
        await db.refresh(conv)
        
    return conv

@router.get("/{public_widget_id}/conversations/{conversation_id}/messages", response_model=List[MessageResponse], dependencies=[Depends(check_rate_limit)])
async def list_public_messages(
    public_widget_id: str,
    conversation_id: uuid.UUID,
    workspace: Workspace = Depends(get_widget_workspace),
    db: AsyncSession = Depends(get_db)
):
    # CRITICAL: We enforce workspace.id here to ensure Tenant A widget cannot read Tenant B conversation
    result = await db.execute(
        select(Message).where(
            Message.conversation_id == conversation_id,
            Message.workspace_id == workspace.id
        ).order_by(Message.created_at.asc())
    )
    return result.scalars().all()

@router.post("/{public_widget_id}/conversations/{conversation_id}/messages", dependencies=[Depends(check_rate_limit)])
async def send_public_message(
    public_widget_id: str,
    conversation_id: uuid.UUID,
    req: PublicMessageCreate,
    workspace: Workspace = Depends(get_widget_workspace),
    db: AsyncSession = Depends(get_db)
):
    # CRITICAL: We first verify the conversation actually belongs to this workspace
    # to prevent Tenant A widget from sending a message to Tenant B conversation.
    conv_result = await db.execute(
        select(Conversation).where(
            Conversation.id == conversation_id,
            Conversation.workspace_id == workspace.id
        )
    )
    conv = conv_result.scalar_one_or_none()
    if not conv:
        raise HTTPException(status_code=404, detail="Conversation not found")

    service = ConversationService(db)
    
    try:
        if req.stream:
            async def event_generator():
                async for chunk in await service.process_message(
                    workspace, conversation_id, req.message, stream=True
                ):
                    yield {"data": chunk}
            return EventSourceResponse(event_generator())
        else:
            assistant_msg = await service.process_message(
                workspace, conversation_id, req.message, stream=False
            )
            return MessageResponse.model_validate(assistant_msg)
            
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
