import os
from typing import Optional
from cryptography.fernet import Fernet

class SecretStore:
    """
    Abstraction for encrypted credential storage.
    In a real production system, this could interface with AWS Secrets Manager,
    HashiCorp Vault, or Google Secret Manager.
    For this phase, we use symmetric encryption via Fernet.
    """
    def __init__(self):
        # We need a stable key. In tests/dev, use a dummy key if not set.
        key = os.getenv("CHIDI_SECRET_KEY")
        if not key:
            # Generate a 32-byte URL-safe base64-encoded key for fallback
            key = b'K3vT9N9pGq4gL9T_W0tFvQ_Yw1qWq3cMvL6zO2lC1P0='
        self.cipher = Fernet(key)

    async def store(self, secret_value: str) -> str:
        """Encrypt and store a secret. Returns a credential ID."""
        encrypted = self.cipher.encrypt(secret_value.encode())
        # In this simplistic version, the "credential_id" is literally the encrypted payload.
        # In production, we'd store it in a DB or Vault and return a UUID pointer.
        return encrypted.decode()

    async def retrieve(self, credential_id: str) -> Optional[str]:
        """Retrieve a decrypted secret by its credential ID."""
        if not credential_id:
            return None
        try:
            decrypted = self.cipher.decrypt(credential_id.encode())
            return decrypted.decode()
        except Exception:
            return None
