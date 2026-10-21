"""Security hardening: workspace SKU uniqueness and durable webhook event deduplication

Revision ID: 2b_security_hardening
Revises: 2a_fashion_catalogue
Create Date: 2026-10-21 20:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '2b_security_hardening'
down_revision: Union[str, Sequence[str], None] = '2a_fashion_catalogue'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Enforce unique constraint for SKU per workspace on products
    op.create_unique_constraint(
        'uq_products_workspace_sku',
        'products',
        ['workspace_id', 'sku']
    )

    # 2. Create processed_webhook_events table for durable idempotency
    op.create_table(
        'processed_webhook_events',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('event_id', sa.String(length=255), nullable=False),
        sa.Column('provider', sa.String(length=50), nullable=False, server_default='WHATSAPP'),
        sa.Column('workspace_id', sa.UUID(), nullable=True),
        sa.Column('status', sa.String(length=50), nullable=True, server_default='PROCESSED'),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['workspace_id'], ['workspaces.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_processed_webhook_events_id'), 'processed_webhook_events', ['id'], unique=False)
    op.create_index(op.f('ix_processed_webhook_events_event_id'), 'processed_webhook_events', ['event_id'], unique=True)
    op.create_index(op.f('ix_processed_webhook_events_workspace_id'), 'processed_webhook_events', ['workspace_id'], unique=False)
    op.create_index(op.f('ix_processed_webhook_events_created_at'), 'processed_webhook_events', ['created_at'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_processed_webhook_events_created_at'), table_name='processed_webhook_events')
    op.drop_index(op.f('ix_processed_webhook_events_workspace_id'), table_name='processed_webhook_events')
    op.drop_index(op.f('ix_processed_webhook_events_event_id'), table_name='processed_webhook_events')
    op.drop_index(op.f('ix_processed_webhook_events_id'), table_name='processed_webhook_events')
    op.drop_table('processed_webhook_events')

    op.drop_constraint('uq_products_workspace_sku', 'products', type_='unique')
