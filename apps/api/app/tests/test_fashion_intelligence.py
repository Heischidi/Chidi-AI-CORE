import uuid
import pytest
from unittest.mock import AsyncMock, MagicMock

from app.models.product import Product, SizeChart
from app.models.capability import Capability
from app.services.tools.base import ToolContext
from app.services.tools.fashion_stylist import FashionStylistTool
from app.services.tools.size_fit_assistant import SizeFitAssistantTool
from app.services.tools.registry import ToolRegistryService
from app.ai.chidi_core import ChidiCore

@pytest.mark.asyncio
async def test_fashion_stylist_tool_execution():
    workspace_id = uuid.uuid4()
    mock_db = AsyncMock()
    context = ToolContext(workspace_id=workspace_id, conversation_id=uuid.uuid4(), db=mock_db)

    # Mock products in database
    p1 = Product(
        id=uuid.uuid4(),
        workspace_id=workspace_id,
        name="Emerald Silk Bias Slip Dress",
        price=45000.0,
        currency="NGN",
        availability=True,
        category="Dresses",
        colours=["Emerald Green", "Black"],
        sizes=["S", "M", "L"],
        occasion_tags=["Cocktail", "Wedding Guest", "Dinner Date"],
        style_tags=["Minimalist", "Luxury"],
        status="published",
        variants=[]
    )
    p2 = Product(
        id=uuid.uuid4(),
        workspace_id=workspace_id,
        name="Linen Wide-Leg Trouser",
        price=32000.0,
        currency="NGN",
        availability=True,
        category="Trousers",
        colours=["Sage Mist", "Sandstone"],
        sizes=["M", "L"],
        occasion_tags=["Brunch", "Casual"],
        style_tags=["Relaxed"],
        status="published",
        variants=[]
    )

    class MockScalars:
        def __init__(self, items): self.items = items
        def all(self): return self.items
        def scalar_one_or_none(self): return self.items[0] if self.items else None

    class MockResult:
        def __init__(self, items): self.items = items
        def scalars(self): return MockScalars(self.items)

    mock_db.execute.return_value = MockResult([p1, p2])

    tool = FashionStylistTool()
    res = await tool.execute(context, {
        "occasion": "Cocktail",
        "max_budget": 50000,
        "preferred_colour": "Emerald",
        "size": "M"
    })

    assert res.success is True
    assert res.status_code == "SUCCESS"
    assert len(res.data["outfit_recommendations"]) > 0
    # The emerald slip dress should rank first
    first_item = res.data["outfit_recommendations"][0]
    assert first_item["name"] == "Emerald Silk Bias Slip Dress"
    assert first_item["price"] <= 50000


@pytest.mark.asyncio
async def test_size_fit_assistant_with_measurements():
    workspace_id = uuid.uuid4()
    mock_db = AsyncMock()
    context = ToolContext(workspace_id=workspace_id, conversation_id=uuid.uuid4(), db=mock_db)

    chart = SizeChart(
        id=uuid.uuid4(),
        workspace_id=workspace_id,
        name="Dresses Size Guide",
        category="Dresses",
        unit="cm",
        chart_data={
            "S": {"bust": "84-88", "waist": "64-68", "hips": "90-94"},
            "M": {"bust": "88-92", "waist": "69-74", "hips": "94-98"},
            "L": {"bust": "92-96", "waist": "75-80", "hips": "98-104"}
        }
    )

    product = Product(
        id=uuid.uuid4(),
        workspace_id=workspace_id,
        name="Emerald Silk Bias Slip Dress",
        price=45000.0,
        category="Dresses",
        sizes=["S", "M", "L"],
        fit_notes="Bias-cut silhouette with slight ease over waist.",
        size_chart=chart,
        variants=[]
    )

    mock_res = MagicMock()
    mock_res.scalar_one_or_none.return_value = product
    mock_db.execute.return_value = mock_res

    tool = SizeFitAssistantTool()
    res = await tool.execute(context, {
        "product_name": "Silk Slip Dress",
        "user_waist": 70,  # Falls cleanly in size M (69-74)
        "preferred_fit": "fitted"
    })

    assert res.success is True
    assert res.data["found"] is True
    assert res.data["recommended_size"] == "M"
    assert "size M is recommended" in res.data["guidance"]


@pytest.mark.asyncio
async def test_chidi_core_fashion_prompt():
    prompt = ChidiCore.build_system_prompt(
        business_name="Maison Aurelia",
        business_type="Fashion & Luxury Apparel",
        business_context="High-end conscious fashion brand.",
        enabled_capabilities=["FASHION_STYLING", "PRODUCT_SEARCH"]
    )

    assert "CHIDI AI" in prompt
    assert "Maison Aurelia" in prompt
    assert "FASHION COMMERCE & STYLING RULES" in prompt
    assert "ONLY recommend products that exist in the business's verified catalogue" in prompt
    assert "Respect the customer's stated budget strictly" in prompt
