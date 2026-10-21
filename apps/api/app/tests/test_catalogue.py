import uuid
import pytest
from unittest.mock import AsyncMock, MagicMock
from app.models.product import Product, ProductVariant, SizeChart, PricingRule
from app.schemas.catalogue import ProductCreate, ProductVariantCreate, SizeChartCreate

@pytest.mark.asyncio
async def test_product_fashion_model_creation():
    workspace_id = uuid.uuid4()
    product = Product(
        workspace_id=workspace_id,
        name="Luxe Silk Slip Dress",
        description="Bias-cut silk dress with delicate straps.",
        price=45000.0,
        previous_price=55000.0,
        currency="NGN",
        category="Dresses",
        sku="LSD-001",
        brand="Chidi Couture",
        colours=["Emerald", "Champagne", "Onyx"],
        sizes=["XS", "S", "M", "L"],
        materials="100% Mulberry Silk",
        care_instructions="Dry clean only",
        fit_notes="Slim fit through hips, bias cut drapes fluidly",
        occasion_tags=["Cocktail", "Evening", "Wedding Guest"],
        style_tags=["Minimalist", "Luxury", "Contemporary"],
        images=["https://images.example.com/dress1.jpg"],
        stock_quantity=15,
        status="published"
    )

    assert product.name == "Luxe Silk Slip Dress"
    assert product.category == "Dresses"
    assert "Emerald" in product.colours
    assert "M" in product.sizes
    assert product.price == 45000.0
    assert product.previous_price == 55000.0
    assert product.stock_quantity == 15
    assert product.status == "published"


@pytest.mark.asyncio
async def test_product_variant_model():
    product_id = uuid.uuid4()
    variant = ProductVariant(
        product_id=product_id,
        sku="LSD-001-EM-M",
        size="M",
        colour="Emerald",
        price=45000.0,
        stock_quantity=5,
        availability=True
    )

    assert variant.sku == "LSD-001-EM-M"
    assert variant.size == "M"
    assert variant.colour == "Emerald"
    assert variant.stock_quantity == 5
    assert variant.availability is True


@pytest.mark.asyncio
async def test_size_chart_model():
    workspace_id = uuid.uuid4()
    chart = SizeChart(
        workspace_id=workspace_id,
        name="Womens Standard Dress Guide",
        category="Dresses",
        unit="cm",
        chart_data={
            "S": {"bust": "84-88", "waist": "66-70", "hips": "90-94"},
            "M": {"bust": "88-92", "waist": "70-74", "hips": "94-98"},
            "L": {"bust": "92-96", "waist": "74-78", "hips": "98-102"}
        }
    )

    assert chart.name == "Womens Standard Dress Guide"
    assert chart.unit == "cm"
    assert "M" in chart.chart_data
    assert chart.chart_data["M"]["bust"] == "88-92"


@pytest.mark.asyncio
async def test_csv_import_parsing():
    import io
    import csv

    csv_data = """name,price,category,colours,sizes,sku
Emerald Blazer,38000,Outerwear,"Emerald, Black","S, M, L",EB-001
Linen Trousers,22000,Trousers,"Beige, White","M, L, XL",LT-002
"""
    reader = csv.DictReader(io.StringIO(csv_data))
    rows = list(reader)

    assert len(rows) == 2
    assert rows[0]["name"] == "Emerald Blazer"
    assert float(rows[0]["price"]) == 38000.0
    colours = [c.strip() for c in rows[0]["colours"].split(",")]
    assert "Emerald" in colours
    assert "Black" in colours
