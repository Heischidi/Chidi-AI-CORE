import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean, Float, Integer, Text, JSON, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.base import Base

class SizeChart(Base):
    __tablename__ = "size_charts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(100), nullable=False)
    category = Column(String(100), nullable=True)
    unit = Column(String(10), default="cm")  # "cm" or "inches"
    chart_data = Column(JSON, nullable=False, default=dict)  # {"S": {"bust": "86", "waist": "68"}, ...}
    created_at = Column(DateTime, default=datetime.utcnow)

    products = relationship("Product", back_populates="size_chart")

class Product(Base):
    __tablename__ = "products"
    __table_args__ = (
        UniqueConstraint("workspace_id", "sku", name="uq_products_workspace_sku"),
    )
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)

    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    previous_price = Column(Float, nullable=True)
    currency = Column(String(10), default="NGN")
    availability = Column(Boolean, default=True)
    
    # Fashion catalogue extensions
    category = Column(String(100), nullable=True, index=True)
    sku = Column(String(100), nullable=True, index=True)
    brand = Column(String(100), nullable=True)
    colours = Column(JSON, nullable=True, default=list)  # ["Emerald", "Black"]
    sizes = Column(JSON, nullable=True, default=list)    # ["XS", "S", "M", "L", "XL"]
    materials = Column(String(255), nullable=True)
    care_instructions = Column(Text, nullable=True)
    fit_notes = Column(Text, nullable=True)
    occasion_tags = Column(JSON, nullable=True, default=list)  # ["wedding", "cocktail", "formal"]
    style_tags = Column(JSON, nullable=True, default=list)     # ["minimalist", "luxury"]
    images = Column(JSON, nullable=True, default=list)         # ["https://..."]
    purchase_url = Column(String(500), nullable=True)
    stock_quantity = Column(Integer, default=0)
    status = Column(String(20), default="published")           # "draft", "published", "archived"
    
    size_chart_id = Column(UUID(as_uuid=True), ForeignKey("size_charts.id", ondelete="SET NULL"), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    pricing_rule = relationship("PricingRule", back_populates="product", uselist=False, cascade="all, delete-orphan")
    variants = relationship("ProductVariant", back_populates="product", cascade="all, delete-orphan", lazy="selectin")
    size_chart = relationship("SizeChart", back_populates="products", lazy="selectin")

class ProductVariant(Base):
    __tablename__ = "product_variants"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True)
    sku = Column(String(100), nullable=True, index=True)
    size = Column(String(50), nullable=True)
    colour = Column(String(50), nullable=True)
    price = Column(Float, nullable=True)  # Variant-specific override, defaults to product.price if null
    stock_quantity = Column(Integer, default=0)
    availability = Column(Boolean, default=True)
    image_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    product = relationship("Product", back_populates="variants")

class PricingRule(Base):
    __tablename__ = "pricing_rules"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id", ondelete="CASCADE"), nullable=False, unique=True, index=True)
    minimum_price = Column(Float, nullable=False)
    maximum_discount_percent = Column(Float, nullable=True)
    negotiation_enabled = Column(Boolean, default=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    product = relationship("Product", back_populates="pricing_rule")
