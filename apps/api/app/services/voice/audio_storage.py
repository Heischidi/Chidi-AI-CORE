from abc import ABC, abstractmethod
import uuid
import tempfile
import os

class AudioStorage(ABC):
    @abstractmethod
    async def store(self, audio_data: bytes, mime_type: str) -> str:
        """Stores audio and returns a secure, temporary or persistent URL/reference."""
        pass

class MockLocalAudioStorage(AudioStorage):
    """
    Mock storage for development. 
    Writes to a temporary local file and returns a dummy URL.
    """
    async def store(self, audio_data: bytes, mime_type: str) -> str:
        if not audio_data:
            return ""
            
        ext = ".mp3"
        if "wav" in mime_type:
            ext = ".wav"
        elif "ogg" in mime_type:
            ext = ".ogg"
            
        filename = f"{uuid.uuid4()}{ext}"
        filepath = os.path.join(tempfile.gettempdir(), filename)
        
        with open(filepath, "wb") as f:
            f.write(audio_data)
            
        return f"https://mock-storage.local/{filename}"
