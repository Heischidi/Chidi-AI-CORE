import uuid
import hmac
import hashlib
import json
import logging
from typing import Dict, Any, Optional
from fastapi import APIRouter, Depends, Query, Request, Response, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db.session import get_db
from app.models.workspace import Workspace
from app.models.conversation import Conversation, Message
from app.models.integration import Integration, ProcessedWebhookEvent
from app.services.conversation_service import ConversationService
from app.config import settings

logger = logging.getLogger("chidi.webhooks")
router = APIRouter()

@router.get("/whatsapp")
async def verify_whatsapp_webhook(
    hub_mode: Optional[str] = Query(None, alias="hub.mode"),
    hub_verify_token: Optional[str] = Query(None, alias="hub.verify_token"),
    hub_challenge: Optional[str] = Query(None, alias="hub.challenge"),
):
    """
    Official WhatsApp Business Cloud API Webhook verification handshake.
    Meta sends a GET request to verify endpoint ownership.
    """
    verify_token = settings.WHATSAPP_VERIFY_TOKEN
    if hub_mode == "subscribe" and hub_verify_token and hmac.compare_digest(hub_verify_token, verify_token):
        return Response(content=hub_challenge or "", media_type="text/plain")
    raise HTTPException(status_code=403, detail="Verification token mismatch")


@router.post("/whatsapp")
async def handle_whatsapp_inbound(
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """
    Inbound webhook handler for WhatsApp Business Cloud API.
    Enforces HMAC-SHA256 signature verification, durable DB idempotency,
    and tenant/customer-isolated routing.
    """
    raw_body = await request.body()

    # 1. Signature Verification
    if settings.WHATSAPP_APP_SECRET:
        signature_header = request.headers.get("X-Hub-Signature-256", "")
        if not signature_header or not signature_header.startswith("sha256="):
            raise HTTPException(status_code=403, detail="Missing or malformed WhatsApp signature header")
        
        expected_sig = "sha256=" + hmac.new(
            settings.WHATSAPP_APP_SECRET.encode("utf-8"),
            raw_body,
            hashlib.sha256
        ).hexdigest()

        if not hmac.compare_digest(expected_sig, signature_header):
            raise HTTPException(status_code=403, detail="Invalid WhatsApp signature")
    elif settings.ENVIRONMENT == "production":
        raise HTTPException(status_code=500, detail="WhatsApp app secret is not configured in production")

    # 2. Parse payload
    try:
        payload = json.loads(raw_body.decode("utf-8")) if raw_body else {}
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON body")

    entry_list = payload.get("entry", [])
    if not entry_list:
        return {"status": "ignored", "reason": "empty entry"}

    for entry in entry_list:
        changes = entry.get("changes", [])
        for change in changes:
            value = change.get("value", {})
            messages = value.get("messages", [])
            metadata = value.get("metadata", {})
            phone_number_id = str(metadata.get("phone_number_id") or "")

            for msg in messages:
                msg_id = msg.get("id")
                from_number = msg.get("from")
                msg_type = msg.get("type")

                if not msg_id:
                    continue

                # 3. Durable DB Idempotency & Deduplication
                dedup_stmt = select(ProcessedWebhookEvent).where(
                    ProcessedWebhookEvent.event_id == str(msg_id)
                )
                existing_event = (await db.execute(dedup_stmt)).scalar_one_or_none()

                if existing_event:
                    if existing_event.status in ("PROCESSED", "PROCESSING"):
                        return {"status": "deduplicated", "message_id": msg_id}
                else:
                    # Persist event atomically to claim it
                    webhook_record = ProcessedWebhookEvent(
                        event_id=str(msg_id),
                        provider="WHATSAPP",
                        status="PROCESSING"
                    )
                    db.add(webhook_record)
                    await db.commit()

                # 4. Resolve workspace by WhatsApp phone_number_id
                workspace = None
                if phone_number_id:
                    integ_stmt = select(Integration).where(
                        Integration.provider == "WHATSAPP",
                        Integration.enabled == True
                    )
                    res = await db.execute(integ_stmt)
                    all_integrations = res.scalars().all()
                    for integ in all_integrations:
                        if integ.configuration and str(integ.configuration.get("phone_number_id")) == phone_number_id:
                            ws_res = await db.execute(select(Workspace).where(Workspace.id == integ.workspace_id))
                            workspace = ws_res.scalar_one_or_none()
                            if workspace:
                                break

                if not workspace:
                    if settings.ENVIRONMENT == "development":
                        ws_fallback = await db.execute(select(Workspace).limit(1))
                        workspace = ws_fallback.scalar_one_or_none()
                    else:
                        logger.warning("No workspace configured for WhatsApp phone_number_id")
                        return {"status": "ignored", "reason": "unmapped phone_number_id"}

                if not workspace:
                    return {"status": "ignored", "reason": "workspace not found"}

                # Update workspace_id on event record
                update_event_stmt = select(ProcessedWebhookEvent).where(
                    ProcessedWebhookEvent.event_id == str(msg_id)
                )
                evt = (await db.execute(update_event_stmt)).scalar_one_or_none()
                if evt:
                    evt.workspace_id = workspace.id
                    await db.commit()

                # 5. Process text messages with customer-isolated conversation thread
                if msg_type == "text" and from_number:
                    body_text = msg.get("text", {}).get("body", "").strip()
                    if body_text:
                        # Find active conversation belonging to THIS specific customer phone
                        conv_stmt = (
                            select(Conversation)
                            .where(
                                Conversation.workspace_id == workspace.id,
                                Conversation.channel == "WHATSAPP",
                                Conversation.status == "ACTIVE"
                            )
                            .order_by(Conversation.started_at.desc())
                        )
                        conv_res = await db.execute(conv_stmt)
                        active_convs = conv_res.scalars().all()
                        conversation = None
                        for c in active_convs:
                            if c.metadata_json and c.metadata_json.get("customer_phone") == from_number:
                                conversation = c
                                break

                        if not conversation:
                            conversation = Conversation(
                                workspace_id=workspace.id,
                                channel="WHATSAPP",
                                status="ACTIVE",
                                metadata_json={"customer_phone": from_number, "phone_number_id": phone_number_id}
                            )
                            db.add(conversation)
                            await db.commit()
                            await db.refresh(conversation)

                        # Process message through styling agent loop
                        service = ConversationService(db)
                        try:
                            await service.process_message(workspace, conversation.id, body_text, stream=False)
                            if evt:
                                evt.status = "PROCESSED"
                                await db.commit()
                        except Exception as e:
                            logger.error(f"Error processing WhatsApp message: {type(e).__name__}")
                            if evt:
                                evt.status = "FAILED"
                                await db.commit()

    return {"status": "received"}
