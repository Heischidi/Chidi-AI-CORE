import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sse_starlette.sse import EventSourceResponse

from app.db.session import get_db
from app.models.workspace import Workspace
from app.models.conversation import Conversation, Message
from app.schemas.conversation import ConversationCreate, ConversationResponse, ChatRequest, MessageResponse
from app.dependencies import get_current_workspace
from app.services.conversation_service import ConversationService

router = APIRouter()

@router.post("/", response_model=ConversationResponse)
async def create_conversation(
    conv_in: ConversationCreate,
    workspace: Workspace = Depends(get_current_workspace),
    db: AsyncSession = Depends(get_db)
):
    service = ConversationService(db)
    return await service.create_conversation(workspace_id=workspace.id, channel=conv_in.channel)

@router.get("/", response_model=List[ConversationResponse])
async def list_conversations(
    workspace: Workspace = Depends(get_current_workspace),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Conversation)
        .where(Conversation.workspace_id == workspace.id)
        .order_by(Conversation.started_at.desc())
    )
    return result.scalars().all()

@router.post("/{conversation_id}/messages")
async def send_message(
    conversation_id: uuid.UUID,
    chat_request: ChatRequest,
    workspace: Workspace = Depends(get_current_workspace),
    db: AsyncSession = Depends(get_db)
):
    service = ConversationService(db)
    
    try:
        if chat_request.stream:
            async def event_generator():
                async for chunk in await service.process_message(
                    workspace, conversation_id, chat_request.message, stream=True
                ):
                    yield {"data": chunk}
            return EventSourceResponse(event_generator())
        else:
            assistant_msg = await service.process_message(
                workspace, conversation_id, chat_request.message, stream=False
            )
            return MessageResponse.model_validate(assistant_msg)
            
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/{conversation_id}/messages", response_model=List[MessageResponse])
async def list_messages(
    conversation_id: uuid.UUID,
    workspace: Workspace = Depends(get_current_workspace),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Message)
        .where(
            Message.conversation_id == conversation_id,
            Message.workspace_id == workspace.id
        )
        .order_by(Message.created_at.asc())
    )
    return result.scalars().all()
