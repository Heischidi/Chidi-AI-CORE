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

    # 1. Match WidgetConfig by public_widget_id
    result = await db.execute(
        select(WidgetConfig).where(WidgetConfig.public_widget_id == public_widget_id)
    )
    widget = result.scalar_one_or_none()
    
    if widget:
        if not widget.enabled:
            raise HTTPException(status_code=403, detail="Widget is disabled")
        ws_result = await db.execute(select(Workspace).where(Workspace.id == widget.workspace_id))
        workspace = ws_result.scalar_one_or_none()
        if workspace:
            return workspace

    # 2. Match Workspace by slug
    ws_slug_res = await db.execute(select(Workspace).where(Workspace.slug == public_widget_id))
    workspace = ws_slug_res.scalar_one_or_none()
    if workspace:
        return workspace

    # 3. Fallback to default workspace
    ws_fallback = await db.execute(select(Workspace).limit(1))
    workspace = ws_fallback.scalar_one_or_none()
    if workspace:
        return workspace
        
    raise HTTPException(status_code=404, detail="Workspace not found")

@router.get("/config/{public_widget_id}", response_model=WidgetConfigResponse)
async def get_widget_config(public_widget_id: str, db: AsyncSession = Depends(get_db)):
    widget = None
    
    # 1. Look up widget by public_widget_id
    if public_widget_id != "default":
        result = await db.execute(
            select(WidgetConfig).where(WidgetConfig.public_widget_id == public_widget_id)
        )
        widget = result.scalar_one_or_none()

    # 2. Look up widget by workspace slug
    if not widget and public_widget_id != "default":
        ws_res = await db.execute(select(Workspace).where(Workspace.slug == public_widget_id))
        ws = ws_res.scalar_one_or_none()
        if ws:
            w_res = await db.execute(select(WidgetConfig).where(WidgetConfig.workspace_id == ws.id))
            widget = w_res.scalar_one_or_none()

    # 3. Fallback to primary workspace widget config
    if not widget:
        ws_res = await db.execute(select(Workspace).limit(1))
        ws = ws_res.scalar_one_or_none()
        if ws:
            w_res = await db.execute(select(WidgetConfig).where(WidgetConfig.workspace_id == ws.id))
            widget = w_res.scalar_one_or_none()

    if widget and widget.enabled:
        return WidgetConfigResponse(
            widget_id=widget.public_widget_id,
            name="Chidi",
            primary_color=widget.primary_color or "#00A86B",
            position=widget.position or "bottom-right",
            welcome_message=widget.welcome_message or "Hello! I'm Chidi, your personal AI fashion stylist. Tell me about your occasion, size, or style preference and I'll find the perfect look from our catalogue.",
            suggested_questions=widget.suggested_questions or [
                "Style an outfit for a wedding guest",
                "Show me black trousers in size M",
                "How does the silk slip dress fit?",
                "What are your newest arrivals?"
            ],
            avatar_url=widget.avatar_url,
            auto_open=widget.auto_open or False,
            enabled=True
        )

    return WidgetConfigResponse(
        widget_id=public_widget_id,
        name="Chidi",
        primary_color="#00A86B",
        position="bottom-right",
        welcome_message="Hello! I'm Chidi, your personal AI fashion stylist. Tell me about your occasion, size, or style preference and I'll find the perfect look from our catalogue.",
        suggested_questions=[
            "Style an outfit for a wedding guest",
            "Show me black trousers in size M",
            "How does the silk slip dress fit?",
            "What are your newest arrivals?"
        ],
        avatar_url=None,
        auto_open=False,
        enabled=True
    )

@router.post("/{public_widget_id}/conversations", response_model=ConversationResponse, dependencies=[Depends(check_rate_limit)])
async def create_public_conversation(
    public_widget_id: str,
    req: PublicConversationCreate,
    workspace: Workspace = Depends(get_widget_workspace),
    db: AsyncSession = Depends(get_db)
):
    try:
        service = ConversationService(db)
        conv = await service.create_conversation(workspace_id=workspace.id, channel="WIDGET")
        
        if req.visitor_id:
            conv.metadata_json = {"visitor_id": req.visitor_id}
            await db.commit()
            await db.refresh(conv)
            
        return conv
    except Exception as e:
        import logging
        logging.getLogger("chidi.widget").error("Failed to create public conversation: %s", str(e), exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to initialize conversation")

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
    except Exception as e:
        import logging
        logging.getLogger("chidi.widget").error("Error in send_public_message: %s", str(e), exc_info=True)
        if settings.ENVIRONMENT == "development":
            raise HTTPException(status_code=500, detail={"error": str(e)})
        raise HTTPException(status_code=500, detail="An error occurred while generating a response. Please try again.")

