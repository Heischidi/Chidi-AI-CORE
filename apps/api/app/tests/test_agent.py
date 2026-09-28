import uuid
import pytest
from unittest.mock import AsyncMock

from app.models.product import Product, PricingRule
from app.models.capability import Capability
from app.services.tools.base import ToolContext
from app.services.tools.registry import ToolRegistryService
from app.services.tools.price_negotiation import PriceNegotiationTool

@pytest.mark.asyncio
async def test_capability_authorization():
    mock_db = AsyncMock()
    workspace_id = uuid.uuid4()
    
    class MockScalars:
        def __init__(self, items): self.items = items
        def all(self): return self.items
        
    class MockResult:
        def __init__(self, items): self.items = items
        def scalars(self): return MockScalars(self.items)

    # 1. Capability is enabled
    mock_db.execute.return_value = MockResult([
        Capability(workspace_id=workspace_id, capability_key="PRICE_NEGOTIATION", enabled=True)
    ])
    
    registry = ToolRegistryService(mock_db)
    tools = await registry.get_authorized_tools(workspace_id)
    assert len(tools) == 1
    assert tools[0].name == "negotiate_price"

    # 2. Capability is disabled
    # Simulate DB returning empty for enabled==True
    mock_db.execute.return_value = MockResult([])
    
    tools = await registry.get_authorized_tools(workspace_id)
    assert len(tools) == 0

@pytest.mark.asyncio
async def test_tenant_isolation_tools():
    # If a workspace doesn't have the capability, the tool isn't returned
    mock_db = AsyncMock()
    workspace_a = uuid.uuid4()
    
    class MockScalars:
        def __init__(self, items): self.items = items
        def all(self): return self.items
        
    class MockResult:
        def __init__(self, items): self.items = items
        def scalars(self): return MockScalars(self.items)
    
    mock_db.execute.return_value = MockResult([])
    registry = ToolRegistryService(mock_db)
    tools = await registry.get_authorized_tools(workspace_a)
    assert len(tools) == 0

@pytest.mark.asyncio
async def test_price_negotiation_below_minimum():
    workspace_id = uuid.uuid4()
    product_id = uuid.uuid4()
    
    rule = PricingRule(minimum_price=10000, negotiation_enabled=True)
    product = Product(id=product_id, workspace_id=workspace_id, price=15000, pricing_rule=rule)
    
    class MockResult:
        def __init__(self, val): self.val = val
        def scalar_one_or_none(self): return self.val
        
    mock_db = AsyncMock()
    mock_db.execute.return_value = MockResult(product)
    
    context = ToolContext(workspace_id=workspace_id, conversation_id=uuid.uuid4(), db=mock_db)
    tool = PriceNegotiationTool()
    
    # Customer offers 7,000 (below 10,000)
    result = await tool.execute(context, {"product_id": str(product_id), "offered_price": 7000})
    
    assert result.success is True
    assert result.status_code == "REJECTED"
    assert result.data["approved"] is False
    assert result.data["reason"] == "PRICE_BELOW_MINIMUM"

@pytest.mark.asyncio
async def test_price_negotiation_at_minimum():
    workspace_id = uuid.uuid4()
    product_id = uuid.uuid4()
    
    rule = PricingRule(minimum_price=10000, negotiation_enabled=True)
    product = Product(id=product_id, workspace_id=workspace_id, price=15000, pricing_rule=rule)
    
    class MockResult:
        def __init__(self, val): self.val = val
        def scalar_one_or_none(self): return self.val
        
    mock_db = AsyncMock()
    mock_db.execute.return_value = MockResult(product)
    
    context = ToolContext(workspace_id=workspace_id, conversation_id=uuid.uuid4(), db=mock_db)
    tool = PriceNegotiationTool()
    
    # Customer offers exactly 10,000
    result = await tool.execute(context, {"product_id": str(product_id), "offered_price": 10000})
    
    assert result.success is True
    assert result.status_code == "APPROVED"
    assert result.data["approved"] is True

@pytest.mark.asyncio
async def test_price_negotiation_above_minimum():
    workspace_id = uuid.uuid4()
    product_id = uuid.uuid4()
    
    rule = PricingRule(minimum_price=10000, negotiation_enabled=True)
    product = Product(id=product_id, workspace_id=workspace_id, price=15000, pricing_rule=rule)
    
    class MockResult:
        def __init__(self, val): self.val = val
        def scalar_one_or_none(self): return self.val
        
    mock_db = AsyncMock()
    mock_db.execute.return_value = MockResult(product)
    
    context = ToolContext(workspace_id=workspace_id, conversation_id=uuid.uuid4(), db=mock_db)
    tool = PriceNegotiationTool()
    
    # Customer offers 12,000
    result = await tool.execute(context, {"product_id": str(product_id), "offered_price": 12000})
    
    assert result.success is True
    assert result.status_code == "APPROVED"
    assert result.data["approved"] is True
