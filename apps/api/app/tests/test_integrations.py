import uuid
import pytest
from unittest.mock import AsyncMock, patch

from app.services.security import is_safe_url
from app.services.tools.base import ToolContext
from app.services.tools.order_tracking import OrderTrackingTool
from app.services.tools.custom_http import CustomHTTPTool
from app.models.integration import Integration

def test_security_ssrf():
    assert is_safe_url("http://localhost/api") == False
    assert is_safe_url("http://127.0.0.1/api") == False
    assert is_safe_url("http://169.254.169.254/metadata") == False
    assert is_safe_url("http://0.0.0.0/test") == False
    assert is_safe_url("http://metadata.google.internal") == False
    assert is_safe_url("https://api.stripe.com/v1/charges") == True
    assert is_safe_url("https://my-business.com/api/orders") == True

@pytest.mark.asyncio
async def test_custom_tool_ssrf_protection():
    context = ToolContext(workspace_id=uuid.uuid4(), conversation_id=uuid.uuid4(), db=AsyncMock())
    
    tool = CustomHTTPTool(
        name="test_tool",
        description="test",
        input_schema={},
        method="GET",
        endpoint="http://localhost:8080/admin"
    )
    
    result = await tool.execute(context, {})
    assert result.success == False
    assert result.status_code == "SECURITY_ERROR"
    assert "unsafe" in result.error

@pytest.mark.asyncio
async def test_order_tracking_missing_args():
    context = ToolContext(workspace_id=uuid.uuid4(), conversation_id=uuid.uuid4(), db=AsyncMock())
    tool = OrderTrackingTool()
    
    result = await tool.execute(context, {"order_id": "123"}) # Missing email
    assert result.success == False
    assert result.status_code == "INVALID_ARGUMENTS"

@pytest.mark.asyncio
@patch("app.services.tools.order_tracking.httpx.AsyncClient.get")
async def test_order_tracking_success(mock_get):
    workspace_id = uuid.uuid4()
    mock_db = AsyncMock()
    
    class MockScalars:
        def __init__(self, items): self.items = items
        def all(self): return self.items
        
    class MockResult:
        def __init__(self, items): self.items = items
        def scalars(self): return MockScalars(self.items)

    integration = Integration(
        workspace_id=workspace_id,
        provider="HTTP_API",
        configuration={"purpose": "ORDER_TRACKING", "endpoint": "https://api.business.com/orders"},
        enabled=True
    )
    mock_db.execute.return_value = MockResult([integration])
    
    context = ToolContext(workspace_id=workspace_id, conversation_id=uuid.uuid4(), db=mock_db)
    tool = OrderTrackingTool()
    
    mock_response = AsyncMock()
    mock_response.status_code = 200
    mock_response.raise_for_status = lambda: None
    mock_response.json = lambda: {"status": "shipped", "estimated_delivery": "2026-10-02", "tracking_number": "123456789"}
    mock_get.return_value = mock_response
    
    result = await tool.execute(context, {"order_id": "ORD-123", "email": "test@example.com"})
    
    assert result.success == True
    assert result.data["status"] == "shipped"
    assert result.data["tracking_number"] == "123456789"
