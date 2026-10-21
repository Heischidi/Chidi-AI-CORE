import hmac
import hashlib
import json
import pytest
from unittest.mock import AsyncMock, patch, MagicMock
from app.config import settings

@pytest.mark.asyncio
async def test_whatsapp_webhook_verification(async_client):
    # Valid verification
    response = await async_client.get(
        "/api/v1/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=chidi_webhook_verify_token&hub.challenge=CHALLENGE_CODE_1234"
    )
    assert response.status_code == 200
    assert response.text == "CHALLENGE_CODE_1234"

    # Invalid token
    response_invalid = await async_client.get(
        "/api/v1/webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=wrong_token&hub.challenge=CHALLENGE_CODE_1234"
    )
    assert response_invalid.status_code == 403


@pytest.mark.asyncio
async def test_whatsapp_webhook_hmac_signature(async_client):
    webhook_payload = {
        "object": "whatsapp_business_account",
        "entry": []
    }
    raw_bytes = json.dumps(webhook_payload).encode("utf-8")
    
    with patch.object(settings, "WHATSAPP_APP_SECRET", "super_secret_whatsapp_key"):
        # Test missing signature header
        resp_missing = await async_client.post(
            "/api/v1/webhooks/whatsapp",
            content=raw_bytes,
            headers={"Content-Type": "application/json"}
        )
        assert resp_missing.status_code == 403
        assert "Missing or malformed WhatsApp signature" in resp_missing.json()["detail"]

        # Test invalid signature
        resp_invalid = await async_client.post(
            "/api/v1/webhooks/whatsapp",
            content=raw_bytes,
            headers={
                "Content-Type": "application/json",
                "X-Hub-Signature-256": "sha256=invalid_hex_digest"
            }
        )
        assert resp_invalid.status_code == 403
        assert "Invalid WhatsApp signature" in resp_invalid.json()["detail"]

        # Test valid signature
        valid_digest = "sha256=" + hmac.new(
            b"super_secret_whatsapp_key",
            raw_bytes,
            hashlib.sha256
        ).hexdigest()

        resp_valid = await async_client.post(
            "/api/v1/webhooks/whatsapp",
            content=raw_bytes,
            headers={
                "Content-Type": "application/json",
                "X-Hub-Signature-256": valid_digest
            }
        )
        assert resp_valid.status_code == 200
        assert resp_valid.json() == {"status": "ignored", "reason": "empty entry"}


@pytest.mark.asyncio
async def test_whatsapp_webhook_idempotency_deduplication(async_client):
    import uuid
    unique_msg_id = f"wamid.{uuid.uuid4()}"
    webhook_payload = {
        "object": "whatsapp_business_account",
        "entry": [
            {
                "id": "10023456789",
                "changes": [
                    {
                        "value": {
                            "messaging_product": "whatsapp",
                            "metadata": {
                                "display_phone_number": "15550234567",
                                "phone_number_id": "1234567890"
                            },
                            "messages": [
                                {
                                    "from": "2348012345678",
                                    "id": unique_msg_id,
                                    "timestamp": "1730000000",
                                    "text": {
                                        "body": "Hello, do you have the emerald silk dress?"
                                    },
                                    "type": "text"
                                }
                            ]
                        },
                        "field": "messages"
                    }
                ]
            }
        ]
    }

    with patch("app.routers.webhooks.ConversationService") as mock_service_cls:
        mock_instance = MagicMock()
        mock_instance.process_message = AsyncMock(return_value=None)
        mock_service_cls.return_value = mock_instance
        
        # First delivery: processed
        resp1 = await async_client.post("/api/v1/webhooks/whatsapp", json=webhook_payload)
        assert resp1.status_code == 200

        # Second delivery (duplicate retry by Meta): deduplicated
        resp2 = await async_client.post("/api/v1/webhooks/whatsapp", json=webhook_payload)
        assert resp2.status_code == 200
        assert resp2.json()["status"] == "deduplicated"
        assert resp2.json()["message_id"] == unique_msg_id

