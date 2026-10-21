from pydantic import BaseModel, Field, HttpUrl, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import datetime
import uuid

# ── Size Chart Schemas ─────────────────────────────────────────────────────────

class SizeChartBase(BaseModel):
    name: str = Field(..., max_length=100)
    category: Optional[str] = Field(None, max_length=100)
    unit: str = Field("cm", max_length=10)
    chart_data: Dict[str, Dict[str, Any]] = Field(default_factory=dict)

class SizeChartCreate(SizeChartBase):
    pass

class SizeChartUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    unit: Optional[str] = None
    chart_data: Optional[Dict[str, Dict[str, Any]]] = None

class SizeChartResponse(SizeChartBase):
    id: uuid.UUID
    workspace_id: uuid.UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ── Variant Schemas ────────────────────────────────────────────────────────────

class ProductVariantBase(BaseModel):
    sku: Optional[str] = Field(None, max_length=100)
    size: Optional[str] = Field(None, max_length=50)
    colour: Optional[str] = Field(None, max_length=50)
    price: Optional[float] = None
    stock_quantity: int = Field(0, ge=0)
    availability: bool = True
    image_url: Optional[str] = Field(None, max_length=500)

class ProductVariantCreate(ProductVariantBase):
    pass

class ProductVariantUpdate(BaseModel):
    sku: Optional[str] = None
    size: Optional[str] = None
    colour: Optional[str] = None
    price: Optional[float] = None
    stock_quantity: Optional[int] = None
    availability: Optional[bool] = None
    image_url: Optional[str] = None

class ProductVariantResponse(ProductVariantBase):
    id: uuid.UUID
    product_id: uuid.UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ── Pricing Rule Schemas ───────────────────────────────────────────────────────

class PricingRuleBase(BaseModel):
    minimum_price: float
    maximum_discount_percent: Optional[float] = None
    negotiation_enabled: bool = True

class PricingRuleCreate(PricingRuleBase):
    pass

class PricingRuleResponse(PricingRuleBase):
    id: uuid.UUID
    product_id: uuid.UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ── Product Schemas ────────────────────────────────────────────────────────────

class ProductBase(BaseModel):
    name: str = Field(..., max_length=200)
    description: Optional[str] = None
    price: float = Field(..., gt=0)
    previous_price: Optional[float] = None
    currency: str = Field("NGN", max_length=10)
    availability: bool = True
    category: Optional[str] = Field(None, max_length=100)
    sku: Optional[str] = Field(None, max_length=100)
    brand: Optional[str] = Field(None, max_length=100)
    colours: List[str] = Field(default_factory=list)
    sizes: List[str] = Field(default_factory=list)
    materials: Optional[str] = Field(None, max_length=255)
    care_instructions: Optional[str] = None
    fit_notes: Optional[str] = None
    occasion_tags: List[str] = Field(default_factory=list)
    style_tags: List[str] = Field(default_factory=list)
    images: List[str] = Field(default_factory=list)
    purchase_url: Optional[str] = Field(None, max_length=500)
    stock_quantity: int = Field(0, ge=0)
    status: str = Field("published", max_length=20)
    size_chart_id: Optional[uuid.UUID] = None

class ProductCreate(ProductBase):
    variants: Optional[List[ProductVariantCreate]] = None
    pricing_rule: Optional[PricingRuleCreate] = None

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    previous_price: Optional[float] = None
    currency: Optional[str] = None
    availability: Optional[bool] = None
    category: Optional[str] = None
    sku: Optional[str] = None
    brand: Optional[str] = None
    colours: Optional[List[str]] = None
    sizes: Optional[List[str]] = None
    materials: Optional[str] = None
    care_instructions: Optional[str] = None
    fit_notes: Optional[str] = None
    occasion_tags: Optional[List[str]] = None
    style_tags: Optional[List[str]] = None
    images: Optional[List[str]] = None
    purchase_url: Optional[str] = None
    stock_quantity: Optional[int] = None
    status: Optional[str] = None
    size_chart_id: Optional[uuid.UUID] = None
    pricing_rule: Optional[PricingRuleCreate] = None

class ProductResponse(ProductBase):
    id: uuid.UUID
    workspace_id: uuid.UUID
    created_at: datetime
    updated_at: Optional[datetime] = None
    variants: List[ProductVariantResponse] = Field(default_factory=list)
    pricing_rule: Optional[PricingRuleResponse] = None
    size_chart: Optional[SizeChartResponse] = None

    model_config = ConfigDict(from_attributes=True)

class ProductListResponse(BaseModel):
    items: List[ProductResponse]
    total: int
    page: int
    limit: int
    pages: int

# ── CSV Import Schemas ─────────────────────────────────────────────────────────

class CSVImportResult(BaseModel):
    total_rows: int
    imported_count: int
    skipped_count: int
    error_count: int
    errors: List[Dict[str, Any]] = Field(default_factory=list)
    preview_items: List[Dict[str, Any]] = Field(default_factory=list)
