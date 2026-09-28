import uuid
from typing import Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.session import get_db
from app.models.workspace import Workspace
from app.models.conversation import Conversation
from app.dependencies import get_current_workspace
from app.services.voice.stt_provider import MockSTTProvider
from app.services.voice.tts_provider import MockTTSProvider
from app.services.voice.audio_storage import MockLocalAudioStorage
from app.services.voice.voice_service import VoiceService
from app.services.quota import QuotaService
from app.services.entitlements import EntitlementService
from app.models.widget import WidgetConfig

router = APIRouter()

async def _handle_voice(db: AsyncSession, workspace: Workspace, conversation_id: uuid.UUID, audio_file: UploadFile):
    # 1. Verify Conversation belongs to Workspace
    stmt = select(Conversation).where(
        Conversation.id == conversation_id,
        Conversation.workspace_id == workspace.id
    )
    result = await db.execute(stmt)
    conversation = result.scalar_one_or_none()
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found.")
        
    # 2. Check Entitlements (Does the plan allow VOICE?)
    entitlements = EntitlementService(db)
    has_voice = await entitlements.check_capability(workspace.id, "VOICE")
    if not has_voice:
        raise HTTPException(status_code=403, detail="Voice features are not enabled on your current plan.")
        
    # 3. Check Quota
    quota = QuotaService(db)
    quota_res = await quota.check(workspace.id, "VOICE_REQUEST", 1)
    if not quota_res["allowed"]:
        raise HTTPException(status_code=429, detail="Voice quota exceeded.")
        
    # 4. Read audio data
    audio_data = await audio_file.read()
    mime_type = audio_file.content_type
    
    stt = MockSTTProvider()
    tts = MockTTSProvider()
    storage = MockLocalAudioStorage()
    
    voice_service = VoiceService(db, stt, tts, storage)
    
    return await voice_service.process_voice_message(
        workspace_id=workspace.id,
        conversation_id=conversation_id,
        audio_data=audio_data,
        mime_type=mime_type
    )

@router.post("/conversations/{conversation_id}/message")
async def process_voice_message_dashboard(
    conversation_id: uuid.UUID,
    audio_file: UploadFile = File(...),
    workspace: Workspace = Depends(get_current_workspace),
    db: AsyncSession = Depends(get_db)
):
    return await _handle_voice(db, workspace, conversation_id, audio_file)

@router.post("/widget/{public_widget_id}/conversations/{conversation_id}/message")
async def process_voice_message_widget(
    public_widget_id: str,
    conversation_id: uuid.UUID,
    audio_file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
):
    # Resolve workspace from widget ID
    result = await db.execute(
        select(WidgetConfig).where(WidgetConfig.public_widget_id == public_widget_id)
    )
    widget = result.scalar_one_or_none()
    
    if not widget or not widget.enabled:
        raise HTTPException(status_code=404, detail="Widget not found or disabled")
        
    ws_result = await db.execute(select(Workspace).where(Workspace.id == widget.workspace_id))
    workspace = ws_result.scalar_one_or_none()
    
    if not workspace:
        raise HTTPException(status_code=404, detail="Workspace not found")
        
    return await _handle_voice(db, workspace, conversation_id, audio_file)
