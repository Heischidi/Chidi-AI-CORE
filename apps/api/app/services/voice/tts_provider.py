from abc import ABC, abstractmethod
from typing import Dict, Any

class TextToSpeechProvider(ABC):
    @abstractmethod
    async def synthesize(self, text: str) -> Dict[str, Any]:
        """
        Synthesize text to speech audio.
        Returns:
            {"audio_data": bytes, "mime_type": str, "duration_seconds": float}
        """
        pass

class MockTTSProvider(TextToSpeechProvider):
    async def synthesize(self, text: str) -> Dict[str, Any]:
        if not text:
            raise ValueError("Empty text")
            
        return {
            "audio_data": b"mock_audio_content_for: " + text.encode(),
            "mime_type": "audio/mpeg",
            "duration_seconds": 2.0
        }
