from abc import ABC, abstractmethod
from typing import Dict, Any, Tuple

class SpeechToTextProvider(ABC):
    @abstractmethod
    async def transcribe(self, audio_data: bytes, mime_type: str) -> Dict[str, Any]:
        """
        Transcribe audio to text.
        Returns:
            {"text": str, "language": str, "duration_seconds": float}
        """
        pass

class MockSTTProvider(SpeechToTextProvider):
    async def transcribe(self, audio_data: bytes, mime_type: str) -> Dict[str, Any]:
        # Minimal mock implementation
        if not audio_data:
            raise ValueError("Empty audio data")
            
        return {
            "text": "This is a simulated transcription from the voice interface.",
            "language": "en",
            "duration_seconds": 3.5
        }
