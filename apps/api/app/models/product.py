import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean, Float
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.base import Base

class Product(Base):
    __tablename__ = "products"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(200), nullable=False)
    description = Column(String, nullable=True)
    price = Column(Float, nullable=False)
    currency = Column(String(10), default="NGN")
    availability = Column(Boolean, default=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    pricing_rule = relationship("PricingRule", back_populates="product", uselist=False)

class PricingRule(Base):
    __tablename__ = "pricing_rules"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id", ondelete="CASCADE"), nullable=False, unique=True, index=True)
    minimum_price = Column(Float, nullable=False)
    maximum_discount_percent = Column(Float, nullable=True)
    negotiation_enabled = Column(Boolean, default=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    
    product = relationship("Product", back_populates="pricing_rule")
