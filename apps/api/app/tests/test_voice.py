import uuid
import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from fastapi import HTTPException

from app.services.voice.voice_service import VoiceService
from app.services.voice.stt_provider import MockSTTProvider
from app.services.voice.tts_provider import MockTTSProvider
from app.services.voice.audio_storage import MockLocalAudioStorage
from app.routers.voice import process_voice_message_dashboard
from app.models.workspace import Workspace

@pytest.mark.asyncio
async def test_voice_service_success():
    mock_db = AsyncMock()
    stt = MockSTTProvider()
    tts = MockTTSProvider()
    storage = MockLocalAudioStorage()
    
    workspace_id = uuid.uuid4()
    conversation_id = uuid.uuid4()
    
    # Mock ConversationService.process_message
    with patch("app.services.voice.voice_service.ConversationService.process_message", new_callable=AsyncMock) as mock_process:
        mock_process.return_value = {"content": "Yes, we have medium.", "role": "assistant"}
        
        service = VoiceService(mock_db, stt, tts, storage)
        
        result = await service.process_voice_message(
            workspace_id=workspace_id,
            conversation_id=conversation_id,
            audio_data=b"dummy_audio_bytes",
            mime_type="audio/webm"
        )
        
        assert result["transcript"]["text"] == "This is a simulated transcription from the voice interface."
        assert result["assistant"]["content"] == "Yes, we have medium."
        assert "url" in result["audio"]
        assert result["audio"]["duration_seconds"] == 2.0

@pytest.mark.asyncio
async def test_voice_service_audio_too_large():
    mock_db = AsyncMock()
    service = VoiceService(mock_db, MockSTTProvider(), MockTTSProvider(), MockLocalAudioStorage())
    
    large_audio = b"0" * (11 * 1024 * 1024) # 11MB
    
    with pytest.raises(HTTPException) as exc:
        await service.process_voice_message(uuid.uuid4(), uuid.uuid4(), large_audio, "audio/webm")
        
    assert exc.value.status_code == 400
    assert "too large" in exc.value.detail

@pytest.mark.asyncio
async def test_voice_service_tts_failure_fallback():
    mock_db = AsyncMock()
    stt = MockSTTProvider()
    
    class FailingTTSProvider:
        async def synthesize(self, text):
            raise ValueError("TTS Engine Error")
            
    storage = MockLocalAudioStorage()
    
    with patch("app.services.voice.voice_service.ConversationService.process_message", new_callable=AsyncMock) as mock_process:
        mock_process.return_value = {"content": "Fallback text.", "role": "assistant"}
        
        service = VoiceService(mock_db, stt, FailingTTSProvider(), storage)
        
        result = await service.process_voice_message(
            workspace_id=uuid.uuid4(),
            conversation_id=uuid.uuid4(),
            audio_data=b"dummy",
            mime_type="audio/webm"
        )
        
        assert result["assistant"]["content"] == "Fallback text."
        assert result["audio"] is None # Fallback triggers None audio

@pytest.mark.asyncio
@patch("app.routers.voice.EntitlementService.check_capability")
async def test_voice_router_no_entitlement(mock_check_capability):
    mock_check_capability.return_value = False
    
    mock_db = AsyncMock()
    # Ensure conversation lookup succeeds
    mock_result = MagicMock()
    mock_result.scalar_one_or_none.return_value = True
    mock_db.execute.return_value = mock_result
    
    workspace = Workspace(id=uuid.uuid4())
    mock_file = AsyncMock()
    
    with pytest.raises(HTTPException) as exc:
        await process_voice_message_dashboard(
            conversation_id=uuid.uuid4(),
            audio_file=mock_file,
            workspace=workspace,
            db=mock_db
        )
        
    assert exc.value.status_code == 403
    assert "not enabled" in exc.value.detail

@pytest.mark.asyncio
@patch("app.routers.voice.EntitlementService.check_capability")
@patch("app.routers.voice.QuotaService.check")
async def test_voice_router_quota_exceeded(mock_quota_check, mock_entitlement_check):
    mock_entitlement_check.return_value = True
    mock_quota_check.return_value = {"allowed": False}
    
    mock_db = AsyncMock()
    mock_result = MagicMock()
    mock_result.scalar_one_or_none.return_value = True
    mock_db.execute.return_value = mock_result
    
    workspace = Workspace(id=uuid.uuid4())
    mock_file = AsyncMock()
    
    with pytest.raises(HTTPException) as exc:
        await process_voice_message_dashboard(
            conversation_id=uuid.uuid4(),
            audio_file=mock_file,
            workspace=workspace,
            db=mock_db
        )
        
    assert exc.value.status_code == 429
    assert "quota exceeded" in exc.value.detail
