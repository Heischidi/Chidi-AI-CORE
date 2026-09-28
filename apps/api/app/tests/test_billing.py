import uuid
import pytest
from unittest.mock import AsyncMock, MagicMock

from app.services.usage_meter import UsageMeter
from app.services.quota import QuotaService
from app.services.entitlements import EntitlementService
from app.models.billing import Subscription, Plan, PlanLimit, PlanEntitlement

@pytest.mark.asyncio
async def test_usage_meter_record():
    mock_db = AsyncMock()
    meter = UsageMeter(db=mock_db)
    
    workspace_id = uuid.uuid4()
    await meter.record(workspace_id, metric="AI_MESSAGE", quantity=5, source="API")
    
    # Verify the raw event was added
    assert mock_db.add.called
    added_obj = mock_db.add.call_args[0][0]
    assert added_obj.workspace_id == workspace_id
    assert added_obj.metric == "AI_MESSAGE"
    assert added_obj.quantity == 5
    
    # Verify the upsert query was executed
    assert mock_db.execute.called

@pytest.mark.asyncio
async def test_quota_service_no_subscription():
    mock_db = AsyncMock()
    
    # Return empty result
    mock_result = MagicMock()
    mock_result.first.return_value = None
    mock_db.execute.return_value = mock_result
    
    quota = QuotaService(db=mock_db)
    result = await quota.check(uuid.uuid4(), "AI_MESSAGE")
    
    assert result["allowed"] == False
    assert result["limit"] == 0

@pytest.mark.asyncio
async def test_quota_service_unlimited():
    mock_db = AsyncMock()
    
    sub = Subscription(status="ACTIVE")
    plan = Plan(id=uuid.uuid4())
    
    limit = PlanLimit(limit_value=-1, period="MONTHLY")
    
    # Setup mock to return (sub, plan) on first call, then limit on second call
    mock_result_1 = MagicMock()
    mock_result_1.first.return_value = (sub, plan)
    
    mock_result_2 = MagicMock()
    mock_result_2.scalar_one_or_none.return_value = limit
    
    mock_db.execute.side_effect = [mock_result_1, mock_result_2]
    
    quota = QuotaService(db=mock_db)
    result = await quota.check(uuid.uuid4(), "AI_MESSAGE")
    
    assert result["allowed"] == True
    assert result["limit"] == -1

@pytest.mark.asyncio
async def test_entitlement_denied():
    mock_db = AsyncMock()
    
    sub = Subscription(status="ACTIVE")
    plan = Plan(id=uuid.uuid4())
    
    mock_result_1 = MagicMock()
    mock_result_1.first.return_value = (sub, plan)
    
    mock_result_2 = MagicMock()
    mock_result_2.scalar_one_or_none.return_value = None # No entitlement
    
    mock_db.execute.side_effect = [mock_result_1, mock_result_2]
    
    entitlements = EntitlementService(db=mock_db)
    allowed = await entitlements.check_capability(uuid.uuid4(), "PRICE_NEGOTIATION")
    
    assert allowed == False

@pytest.mark.asyncio
async def test_entitlement_allowed():
    mock_db = AsyncMock()
    
    sub = Subscription(status="ACTIVE")
    plan = Plan(id=uuid.uuid4())
    
    entitlement = PlanEntitlement(capability_key="PRICE_NEGOTIATION")
    
    mock_result_1 = MagicMock()
    mock_result_1.first.return_value = (sub, plan)
    
    mock_result_2 = MagicMock()
    mock_result_2.scalar_one_or_none.return_value = entitlement
    
    mock_db.execute.side_effect = [mock_result_1, mock_result_2]
    
    entitlements = EntitlementService(db=mock_db)
    allowed = await entitlements.check_capability(uuid.uuid4(), "PRICE_NEGOTIATION")
    
    assert allowed == True
