"""Fashion catalogue extensions: variants, size charts, occasion tags, fashion attributes

Revision ID: 2a_fashion_catalogue
Revises: 1c10e6d76ed4
Create Date: 2026-10-21 19:30:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '2a_fashion_catalogue'
down_revision: Union[str, Sequence[str], None] = '1c10e6d76ed4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Create size_charts table
    op.create_table(
        'size_charts',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('workspace_id', sa.UUID(), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('category', sa.String(length=100), nullable=True),
        sa.Column('unit', sa.String(length=10), nullable=True, server_default='cm'),
        sa.Column('chart_data', sa.JSON(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['workspace_id'], ['workspaces.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_size_charts_id'), 'size_charts', ['id'], unique=False)
    op.create_index(op.f('ix_size_charts_workspace_id'), 'size_charts', ['workspace_id'], unique=False)

    # 2. Add columns to products table
    op.add_column('products', sa.Column('previous_price', sa.Float(), nullable=True))
    op.add_column('products', sa.Column('category', sa.String(length=100), nullable=True))
    op.add_column('products', sa.Column('sku', sa.String(length=100), nullable=True))
    op.add_column('products', sa.Column('brand', sa.String(length=100), nullable=True))
    op.add_column('products', sa.Column('colours', sa.JSON(), nullable=True))
    op.add_column('products', sa.Column('sizes', sa.JSON(), nullable=True))
    op.add_column('products', sa.Column('materials', sa.String(length=255), nullable=True))
    op.add_column('products', sa.Column('care_instructions', sa.Text(), nullable=True))
    op.add_column('products', sa.Column('fit_notes', sa.Text(), nullable=True))
    op.add_column('products', sa.Column('occasion_tags', sa.JSON(), nullable=True))
    op.add_column('products', sa.Column('style_tags', sa.JSON(), nullable=True))
    op.add_column('products', sa.Column('images', sa.JSON(), nullable=True))
    op.add_column('products', sa.Column('purchase_url', sa.String(length=500), nullable=True))
    op.add_column('products', sa.Column('stock_quantity', sa.Integer(), nullable=True, server_default='0'))
    op.add_column('products', sa.Column('status', sa.String(length=20), nullable=True, server_default='published'))
    op.add_column('products', sa.Column('size_chart_id', sa.UUID(), nullable=True))
    op.add_column('products', sa.Column('updated_at', sa.DateTime(), nullable=True))

    op.create_index(op.f('ix_products_category'), 'products', ['category'], unique=False)
    op.create_index(op.f('ix_products_sku'), 'products', ['sku'], unique=False)
    op.create_foreign_key('fk_products_size_chart_id', 'products', 'size_charts', ['size_chart_id'], ['id'], ondelete='SET NULL')

    # 3. Create product_variants table
    op.create_table(
        'product_variants',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('product_id', sa.UUID(), nullable=False),
        sa.Column('sku', sa.String(length=100), nullable=True),
        sa.Column('size', sa.String(length=50), nullable=True),
        sa.Column('colour', sa.String(length=50), nullable=True),
        sa.Column('price', sa.Float(), nullable=True),
        sa.Column('stock_quantity', sa.Integer(), nullable=True, server_default='0'),
        sa.Column('availability', sa.Boolean(), nullable=True, server_default='true'),
        sa.Column('image_url', sa.String(length=500), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['product_id'], ['products.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_product_variants_id'), 'product_variants', ['id'], unique=False)
    op.create_index(op.f('ix_product_variants_product_id'), 'product_variants', ['product_id'], unique=False)
    op.create_index(op.f('ix_product_variants_sku'), 'product_variants', ['sku'], unique=False)


def downgrade() -> None:
    # 1. Drop product_variants
    op.drop_index(op.f('ix_product_variants_sku'), table_name='product_variants')
    op.drop_index(op.f('ix_product_variants_product_id'), table_name='product_variants')
    op.drop_index(op.f('ix_product_variants_id'), table_name='product_variants')
    op.drop_table('product_variants')

    # 2. Drop product columns & indexes
    op.drop_constraint('fk_products_size_chart_id', 'products', type_='foreignkey')
    op.drop_index(op.f('ix_products_sku'), table_name='products')
    op.drop_index(op.f('ix_products_category'), table_name='products')
    op.drop_column('products', 'updated_at')
    op.drop_column('products', 'size_chart_id')
    op.drop_column('products', 'status')
    op.drop_column('products', 'stock_quantity')
    op.drop_column('products', 'purchase_url')
    op.drop_column('products', 'images')
    op.drop_column('products', 'style_tags')
    op.drop_column('products', 'occasion_tags')
    op.drop_column('products', 'fit_notes')
    op.drop_column('products', 'care_instructions')
    op.drop_column('products', 'materials')
    op.drop_column('products', 'sizes')
    op.drop_column('products', 'colours')
    op.drop_column('products', 'brand')
    op.drop_column('products', 'sku')
    op.drop_column('products', 'category')
    op.drop_column('products', 'previous_price')

    # 3. Drop size_charts
    op.drop_index(op.f('ix_size_charts_workspace_id'), table_name='size_charts')
    op.drop_index(op.f('ix_size_charts_id'), table_name='size_charts')
    op.drop_table('size_charts')
