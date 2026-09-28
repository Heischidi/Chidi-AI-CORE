import uuid
from typing import Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException

from app.services.voice.stt_provider import SpeechToTextProvider
from app.services.voice.tts_provider import TextToSpeechProvider
from app.services.voice.audio_storage import AudioStorage
from app.services.conversation_service import ConversationService
from app.services.usage_meter import UsageMeter
from app.services.quota import QuotaService

class VoiceService:
    def __init__(
        self, 
        db: AsyncSession, 
        stt_provider: SpeechToTextProvider, 
        tts_provider: TextToSpeechProvider, 
        audio_storage: AudioStorage
    ):
        self.db = db
        self.stt = stt_provider
        self.tts = tts_provider
        self.storage = audio_storage
        
    async def process_voice_message(
        self, 
        workspace_id: uuid.UUID, 
        conversation_id: uuid.UUID, 
        audio_data: bytes, 
        mime_type: str
    ) -> Dict[str, Any]:
        """
        Orchestrates Voice -> STT -> Agent Pipeline -> TTS -> Audio Storage
        """
        # Validate audio limits (e.g. 10MB)
        if len(audio_data) > 10 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="Audio file too large. Limit is 10MB.")
            
        # 1. Transcribe audio
        try:
            stt_result = await self.stt.transcribe(audio_data, mime_type)
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Speech to text failed: {str(e)}")
            
        transcript_text = stt_result.get("text")
        stt_duration = stt_result.get("duration_seconds", 0)
        
        if not transcript_text:
            raise HTTPException(status_code=400, detail="Could not transcribe audio.")
            
        # 2. Process through existing Chidi Agent (same as text input)
        conv_service = ConversationService(self.db)
        
        # Inject voice metadata into the message processing if needed
        # We can pass metadata down or rely on standard text processing
        # For this modular monolith, we'll let conv_service process text, then we augment the final message
        agent_response = await conv_service.process_message(
            workspace_id=workspace_id,
            conversation_id=conversation_id,
            message_content=transcript_text
        )
        
        # 3. Synthesize Chidi's text response to audio
        # If the agent used a tool, agent_response["content"] might be empty or a summary.
        # Ensure we have text to speak.
        response_text = agent_response.get("content", "I have processed your request.")
        if not response_text:
            response_text = "I've handled that for you."
            
        try:
            tts_result = await self.tts.synthesize(response_text)
            tts_audio = tts_result["audio_data"]
            tts_mime = tts_result["mime_type"]
            tts_duration = tts_result.get("duration_seconds", 0)
        except Exception as e:
            # Fallback: if TTS fails, we return the text response without audio.
            tts_audio = None
            tts_duration = 0
            
        # 4. Store audio if synthesized
        audio_url = None
        if tts_audio:
            audio_url = await self.storage.store(tts_audio, tts_mime)
            
        # 5. Meter usage
        meter = UsageMeter(self.db)
        await meter.record(workspace_id, "VOICE_REQUEST", 1)
        if stt_duration > 0:
            await meter.record(workspace_id, "STT_SECONDS", int(stt_duration))
        if tts_duration > 0:
            await meter.record(workspace_id, "TTS_SECONDS", int(tts_duration))
            
        await self.db.commit()
            
        # 6. Return standard structured response
        return {
            "transcript": {
                "text": transcript_text
            },
            "assistant": agent_response,
            "audio": {
                "url": audio_url,
                "duration_seconds": tts_duration
            } if audio_url else None
        }
