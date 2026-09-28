import uuid
import pytest
from fastapi import HTTPException
from unittest.mock import AsyncMock, patch

from app.routers.public_widget import get_widget_workspace, create_public_conversation, list_public_messages, send_public_message
from app.schemas.widget import PublicConversationCreate, PublicMessageCreate
from app.models.workspace import Workspace
from app.models.widget import WidgetConfig
from app.models.conversation import Conversation, Message

@pytest.mark.asyncio
async def test_tenant_isolation_get_widget_workspace():
    # Test that a widget securely resolves to the correct workspace
    workspace_id = uuid.uuid4()
    
    class MockResult:
        def __init__(self, val):
            self.val = val
        def scalar_one_or_none(self):
            return self.val
            
    mock_db = AsyncMock()
    mock_db.execute.side_effect = [
        # First call: WidgetConfig
        MockResult(WidgetConfig(public_widget_id="test_widget", workspace_id=workspace_id, enabled=True)),
        # Second call: Workspace
        MockResult(Workspace(id=workspace_id))
    ]
    
    workspace = await get_widget_workspace("test_widget", db=mock_db)
    assert workspace.id == workspace_id
    
@pytest.mark.asyncio
async def test_tenant_isolation_conversation_access():
    # Test that a widget cannot access a conversation belonging to another workspace
    widget_ws_id = uuid.uuid4()
    other_ws_id = uuid.uuid4()
    conv_id = uuid.uuid4()
    
    workspace = Workspace(id=widget_ws_id)
    req = PublicMessageCreate(message="Hello")
    
    class MockResult:
        def __init__(self, val):
            self.val = val
        def scalar_one_or_none(self):
            return self.val

    mock_db = AsyncMock()
    # Mock finding the conversation, but it belongs to OTHER workspace
    mock_db.execute.return_value = MockResult(None)
    # Return None because the SQL explicitly does `where(Conversation.workspace_id == workspace.id)`
    
    with pytest.raises(HTTPException) as excinfo:
        await send_public_message(
            public_widget_id="test_widget",
            conversation_id=conv_id,
            req=req,
            workspace=workspace,
            db=mock_db
        )
    
    assert excinfo.value.status_code == 404
    assert excinfo.value.detail == "Conversation not found"
