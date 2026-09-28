import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean, JSON, Integer, Date
from sqlalchemy.dialects.postgresql import UUID
from app.db.base import Base

class Plan(Base):
    __tablename__ = "plans"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String(100), nullable=False)
    slug = Column(String(50), nullable=False, unique=True, index=True)
    description = Column(String, nullable=True)
    active = Column(Boolean, default=True)
    price_metadata = Column(JSON, default=dict)
    billing_interval = Column(String(50), default="MONTHLY") # MONTHLY, YEARLY
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class PlanLimit(Base):
    __tablename__ = "plan_limits"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    plan_id = Column(UUID(as_uuid=True), ForeignKey("plans.id", ondelete="CASCADE"), nullable=False, index=True)
    metric = Column(String(100), nullable=False) # AI_MESSAGE, KNOWLEDGE_DOCUMENT
    limit_value = Column(Integer, nullable=False) # -1 for unlimited
    period = Column(String(50), nullable=False, default="MONTHLY") # MONTHLY, DAILY, TOTAL
    
    created_at = Column(DateTime, default=datetime.utcnow)

class PlanEntitlement(Base):
    __tablename__ = "plan_entitlements"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    plan_id = Column(UUID(as_uuid=True), ForeignKey("plans.id", ondelete="CASCADE"), nullable=False, index=True)
    capability_key = Column(String(100), nullable=False) # PRICE_NEGOTIATION, HUMAN_HANDOFF
    
    created_at = Column(DateTime, default=datetime.utcnow)

class Subscription(Base):
    __tablename__ = "subscriptions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    workspace_id = Column(UUID(as_uuid=True), ForeignKey("workspaces.id", ondelete="CASCADE"), nullable=False, unique=True)
    plan_id = Column(UUID(as_uuid=True), ForeignKey("plans.id", ondelete="RESTRICT"), nullable=False)
    
    status = Column(String(50), default="ACTIVE") # TRIALING, ACTIVE, PAST_DUE, CANCELED
    billing_interval = Column(String(50), default="MONTHLY")
    
    current_period_start = Column(DateTime, nullable=True)
    current_period_end = Column(DateTime, nullable=True)
    cancel_at_period_end = Column(Boolean, default=False)
    canceled_at = Column(DateTime, nullable=True)
    
    external_customer_id = Column(String(255), nullable=True)
    external_subscription_id = Column(String(255), nullable=True)
    metadata_json = Column(JSON, default=dict)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class BillingEvent(Base):
    __tablename__ = "billing_events"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    provider = Column(String(50), nullable=False)
    external_event_id = Column(String(255), nullable=False, unique=True, index=True)
    event_type = Column(String(100), nullable=False)
    payload = Column(JSON, nullable=False)
    
    processed = Column(Boolean, default=False)
    processed_at = Column(DateTime, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
