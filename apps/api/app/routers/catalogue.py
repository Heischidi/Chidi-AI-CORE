import csv
import io
import uuid
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, status, Header
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_, delete
from sqlalchemy.orm import selectinload

from app.db.session import get_db
from app.models.workspace import Workspace
from app.models.product import Product, ProductVariant, SizeChart, PricingRule
from app.dependencies import get_current_workspace
from app.schemas.catalogue import (
    ProductCreate, ProductUpdate, ProductResponse, ProductListResponse,
    ProductVariantCreate, ProductVariantResponse,
    SizeChartCreate, SizeChartUpdate, SizeChartResponse,
    CSVImportResult
)

router = APIRouter()

def sanitize_csv_cell(val: Optional[str]) -> Optional[str]:
    """
    Sanitize text against spreadsheet formula injection (CSV injection).
    Disarms cells starting with =, +, -, @, \t, or \r.
    """
    if val is None:
        return val
    s = str(val)
    if s and s[0] in ('=', '+', '-', '@', '\t', '\r'):
        return "'" + s
    stripped = s.strip()
    if stripped and stripped[0] in ('=', '+', '-', '@'):
        return "'" + stripped
    return s



# ── Metadata & Filters ─────────────────────────────────────────────────────────

@router.get("/meta")
async def get_catalogue_meta(
    workspace: Workspace = Depends(get_current_workspace),
    db: AsyncSession = Depends(get_db)
):
    """Returns available categories, occasions, colours, sizes, and brands for filtering."""
    stmt = select(Product).where(Product.workspace_id == workspace.id)
    result = await db.execute(stmt)
    products = result.scalars().all()

    categories = set()
    brands = set()
    all_colours = set()
    all_sizes = set()
    all_occasions = set()

    for p in products:
        if p.category:
            categories.add(p.category)
        if p.brand:
            brands.add(p.brand)
        if p.colours and isinstance(p.colours, list):
            all_colours.update(p.colours)
        if p.sizes and isinstance(p.sizes, list):
            all_sizes.update(p.sizes)
        if p.occasion_tags and isinstance(p.occasion_tags, list):
            all_occasions.update(p.occasion_tags)

    return {
        "categories": sorted(list(categories)),
        "brands": sorted(list(brands)),
        "colours": sorted(list(all_colours)),
        "sizes": sorted(list(all_sizes)),
        "occasions": sorted(list(all_occasions)),
        "total_products": len(products),
    }


# ── Product Endpoints ─────────────────────────────────────────────────────────

@router.get("/products", response_model=ProductListResponse)
async def list_products(
    q: Optional[str] = Query(None, description="Search query"),
    category: Optional[str] = Query(None),
    min_price: Optional[float] = Query(None, ge=0),
    max_price: Optional[float] = Query(None, ge=0),
    size: Optional[str] = Query(None),
    colour: Optional[str] = Query(None),
    occasion: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    availability: Optional[bool] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    workspace: Workspace = Depends(get_current_workspace),
    db: AsyncSession = Depends(get_db)
):
    """List products with multi-tenant isolation, structured fashion filters, and pagination."""
    query = select(Product).where(Product.workspace_id == workspace.id)

    if q:
        search_term = f"%{q}%"
        query = query.where(
            or_(
                Product.name.ilike(search_term),
                Product.description.ilike(search_term),
                Product.brand.ilike(search_term),
                Product.category.ilike(search_term),
                Product.materials.ilike(search_term),
                Product.sku.ilike(search_term),
            )
        )

    if category:
        query = query.where(Product.category.ilike(category))

    if min_price is not None:
        query = query.where(Product.price >= min_price)

    if max_price is not None:
        query = query.where(Product.price <= max_price)

    if availability is not None:
        query = query.where(Product.availability == availability)

    if status_filter:
        query = query.where(Product.status == status_filter)

    # Count total matching
    count_stmt = select(func.count()).select_from(query.subquery())
    total_count = (await db.execute(count_stmt)).scalar() or 0

    # Paginate and load relationships
    offset = (page - 1) * limit
    paged_query = (
        query.options(
            selectinload(Product.variants),
            selectinload(Product.pricing_rule),
            selectinload(Product.size_chart),
        )
        .order_by(Product.created_at.desc())
        .offset(offset)
        .limit(limit)
    )

    items_res = await db.execute(paged_query)
    items = items_res.scalars().all()

    # In-memory post-filters for JSON list fields if specified
    filtered_items = []
    for item in items:
        if size and item.sizes and size.lower() not in [s.lower() for s in item.sizes]:
            continue
        if colour and item.colours and colour.lower() not in [c.lower() for c in item.colours]:
            continue
        if occasion and item.occasion_tags and occasion.lower() not in [o.lower() for o in item.occasion_tags]:
            continue
        filtered_items.append(item)

    pages = (total_count + limit - 1) // limit if total_count > 0 else 1

    return ProductListResponse(
        items=filtered_items,
        total=total_count,
        page=page,
        limit=limit,
        pages=pages,
    )


@router.get("/products/{product_id}", response_model=ProductResponse)
async def get_product_detail(
    product_id: uuid.UUID,
    workspace: Workspace = Depends(get_current_workspace),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve full product details including variants, pricing rules, and size chart."""
    stmt = (
        select(Product)
        .options(
            selectinload(Product.variants),
            selectinload(Product.pricing_rule),
            selectinload(Product.size_chart),
        )
        .where(Product.id == product_id, Product.workspace_id == workspace.id)
    )
    result = await db.execute(stmt)
    product = result.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found in this workspace")
    return product


@router.post("/products", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(
    product_in: ProductCreate,
    workspace: Workspace = Depends(get_current_workspace),
    db: AsyncSession = Depends(get_db)
):
    """Create a new fashion product with optional variants and pricing rule."""
    # Check SKU uniqueness if provided
    if product_in.sku:
        existing = await db.execute(
            select(Product).where(Product.workspace_id == workspace.id, Product.sku == product_in.sku)
        )
        if existing.scalar_one_or_none():
            raise HTTPException(status_code=400, detail=f"Product with SKU '{product_in.sku}' already exists.")

    product = Product(
        workspace_id=workspace.id,
        name=product_in.name,
        description=product_in.description,
        price=product_in.price,
        previous_price=product_in.previous_price,
        currency=product_in.currency,
        availability=product_in.availability,
        category=product_in.category,
        sku=product_in.sku,
        brand=product_in.brand,
        colours=product_in.colours,
        sizes=product_in.sizes,
        materials=product_in.materials,
        care_instructions=product_in.care_instructions,
        fit_notes=product_in.fit_notes,
        occasion_tags=product_in.occasion_tags,
        style_tags=product_in.style_tags,
        images=product_in.images,
        purchase_url=product_in.purchase_url,
        stock_quantity=product_in.stock_quantity,
        status=product_in.status,
        size_chart_id=product_in.size_chart_id,
    )
    db.add(product)
    await db.flush()

    # Add variants if present
    if product_in.variants:
        for v in product_in.variants:
            variant = ProductVariant(
                product_id=product.id,
                sku=v.sku,
                size=v.size,
                colour=v.colour,
                price=v.price,
                stock_quantity=v.stock_quantity,
                availability=v.availability,
                image_url=v.image_url,
            )
            db.add(variant)

    # Add pricing rule if present
    if product_in.pricing_rule:
        rule = PricingRule(
            product_id=product.id,
            minimum_price=product_in.pricing_rule.minimum_price,
            maximum_discount_percent=product_in.pricing_rule.maximum_discount_percent,
            negotiation_enabled=product_in.pricing_rule.negotiation_enabled,
        )
        db.add(rule)

    await db.commit()
    await db.refresh(product)

    # Re-fetch with relationships loaded
    stmt = (
        select(Product)
        .options(
            selectinload(Product.variants),
            selectinload(Product.pricing_rule),
            selectinload(Product.size_chart),
        )
        .where(Product.id == product.id)
    )
    res = await db.execute(stmt)
    return res.scalar_one()


@router.put("/products/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: uuid.UUID,
    product_in: ProductUpdate,
    workspace: Workspace = Depends(get_current_workspace),
    db: AsyncSession = Depends(get_db)
):
    """Update product fields and pricing rules."""
    stmt = (
        select(Product)
        .options(selectinload(Product.pricing_rule), selectinload(Product.variants))
        .where(Product.id == product_id, Product.workspace_id == workspace.id)
    )
    res = await db.execute(stmt)
    product = res.scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    update_data = product_in.model_dump(exclude_unset=True)

    # Handle pricing rule separately
    pricing_rule_data = update_data.pop("pricing_rule", None)
    if pricing_rule_data:
        if product.pricing_rule:
            product.pricing_rule.minimum_price = pricing_rule_data.get("minimum_price", product.pricing_rule.minimum_price)
            product.pricing_rule.maximum_discount_percent = pricing_rule_data.get("maximum_discount_percent", product.pricing_rule.maximum_discount_percent)
            product.pricing_rule.negotiation_enabled = pricing_rule_data.get("negotiation_enabled", product.pricing_rule.negotiation_enabled)
        else:
            rule = PricingRule(
                product_id=product.id,
                minimum_price=pricing_rule_data["minimum_price"],
                maximum_discount_percent=pricing_rule_data.get("maximum_discount_percent"),
                negotiation_enabled=pricing_rule_data.get("negotiation_enabled", True),
            )
            db.add(rule)

    for field, val in update_data.items():
        setattr(product, field, val)

    await db.commit()
    await db.refresh(product)

    # Reload full
    reload_stmt = (
        select(Product)
        .options(
            selectinload(Product.variants),
            selectinload(Product.pricing_rule),
            selectinload(Product.size_chart),
        )
        .where(Product.id == product.id)
    )
    return (await db.execute(reload_stmt)).scalar_one()


@router.delete("/products/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(
    product_id: uuid.UUID,
    workspace: Workspace = Depends(get_current_workspace),
    db: AsyncSession = Depends(get_db)
):
    """Delete a product and its associated variants and pricing rules."""
    stmt = select(Product).where(Product.id == product_id, Product.workspace_id == workspace.id)
    product = (await db.execute(stmt)).scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    await db.delete(product)
    await db.commit()
    return None


# ── Variant Management ────────────────────────────────────────────────────────

@router.post("/products/{product_id}/variants", response_model=ProductVariantResponse, status_code=status.HTTP_201_CREATED)
async def add_product_variant(
    product_id: uuid.UUID,
    variant_in: ProductVariantCreate,
    workspace: Workspace = Depends(get_current_workspace),
    db: AsyncSession = Depends(get_db)
):
    """Add a variant (size, colour, inventory) to an existing product."""
    product = (
        await db.execute(
            select(Product).where(Product.id == product_id, Product.workspace_id == workspace.id)
        )
    ).scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    variant = ProductVariant(
        product_id=product.id,
        sku=variant_in.sku,
        size=variant_in.size,
        colour=variant_in.colour,
        price=variant_in.price,
        stock_quantity=variant_in.stock_quantity,
        availability=variant_in.availability,
        image_url=variant_in.image_url,
    )
    db.add(variant)
    await db.commit()
    await db.refresh(variant)
    return variant


@router.delete("/variants/{variant_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_variant(
    variant_id: uuid.UUID,
    workspace: Workspace = Depends(get_current_workspace),
    db: AsyncSession = Depends(get_db)
):
    """Delete a specific variant."""
    stmt = (
        select(ProductVariant)
        .join(Product)
        .where(ProductVariant.id == variant_id, Product.workspace_id == workspace.id)
    )
    variant = (await db.execute(stmt)).scalar_one_or_none()
    if not variant:
        raise HTTPException(status_code=404, detail="Variant not found")

    await db.delete(variant)
    await db.commit()
    return None


# ── CSV Import ─────────────────────────────────────────────────────────────────

@router.post("/products/csv-import", response_model=CSVImportResult)
async def import_products_from_csv(
    file: UploadFile = File(...),
    workspace: Workspace = Depends(get_current_workspace),
    db: AsyncSession = Depends(get_db)
):
    """
    Import fashion products from CSV.
    Supports columns:
    name (required), price (required), description, category, sku, brand,
    colours, sizes, materials, care_instructions, fit_notes, occasion_tags,
    style_tags, images, purchase_url, stock_quantity, status, previous_price
    """
    contents = await file.read()
    try:
        decoded = contents.decode("utf-8-sig")
    except UnicodeDecodeError:
        decoded = contents.decode("latin-1")

    reader = csv.DictReader(io.StringIO(decoded))
    if not reader.fieldnames:
        raise HTTPException(status_code=400, detail="CSV file has no headers")

    total_rows = 0
    imported_count = 0
    skipped_count = 0
    errors = []
    preview_items = []
    seen_skus: set[str] = set()

    for row_idx, row in enumerate(reader, start=2):
        total_rows += 1
        name = sanitize_csv_cell(row.get("name", "").strip())
        price_raw = row.get("price", "").strip()

        if not name:
            errors.append({"row": row_idx, "error": "Missing product name"})
            skipped_count += 1
            continue

        try:
            price = float(price_raw.replace(",", "").replace("$", "").replace("₦", ""))
            if price <= 0:
                raise ValueError("Price must be greater than zero")
        except (ValueError, TypeError):
            errors.append({"row": row_idx, "error": f"Invalid price '{price_raw}'"})
            skipped_count += 1
            continue

        sku = sanitize_csv_cell(row.get("sku", "").strip() or None)
        if sku:
            sku_lower = sku.lower()
            if sku_lower in seen_skus:
                errors.append({"row": row_idx, "error": f"Duplicate SKU '{sku}' found within this CSV batch. Row skipped."})
                skipped_count += 1
                continue

            # Check duplicate SKU in this workspace in database
            existing = (
                await db.execute(
                    select(Product).where(Product.workspace_id == workspace.id, Product.sku == sku)
                )
            ).scalar_one_or_none()
            if existing:
                errors.append({"row": row_idx, "error": f"SKU '{sku}' already exists in workspace. Row skipped."})
                skipped_count += 1
                continue
            seen_skus.add(sku_lower)

        # Helper to parse comma-separated lists and sanitize cells
        def parse_list(val: Optional[str]) -> List[str]:
            if not val:
                return []
            return [sanitize_csv_cell(x.strip()) for x in val.split(",") if x.strip()]

        prev_price = None
        if row.get("previous_price", "").strip():
            try:
                parsed_prev = float(row.get("previous_price", "").strip().replace(",", ""))
                if parsed_prev > 0:
                    prev_price = parsed_prev
            except ValueError:
                pass

        stock_qty = 0
        if row.get("stock_quantity", "").strip():
            try:
                stock_qty = max(0, int(row.get("stock_quantity", "").strip()))
            except ValueError:
                pass

        raw_status = (row.get("status") or "published").strip().lower()
        status_val = raw_status if raw_status in ("published", "draft", "archived") else "published"

        product = Product(
            workspace_id=workspace.id,
            name=name,
            description=sanitize_csv_cell(row.get("description", "").strip()) or None,
            price=price,
            previous_price=prev_price,
            currency=sanitize_csv_cell(row.get("currency", "NGN").strip()) or "NGN",
            category=sanitize_csv_cell(row.get("category", "").strip()) or None,
            sku=sku,
            brand=sanitize_csv_cell(row.get("brand", "").strip()) or None,
            colours=parse_list(row.get("colours")),
            sizes=parse_list(row.get("sizes")),
            materials=sanitize_csv_cell(row.get("materials", "").strip()) or None,
            care_instructions=sanitize_csv_cell(row.get("care_instructions", "").strip()) or None,
            fit_notes=sanitize_csv_cell(row.get("fit_notes", "").strip()) or None,
            occasion_tags=parse_list(row.get("occasion_tags")),
            style_tags=parse_list(row.get("style_tags")),
            images=parse_list(row.get("images")),
            purchase_url=sanitize_csv_cell(row.get("purchase_url", "").strip()) or None,
            stock_quantity=stock_qty,
            status=status_val,
            availability=True,
        )
        db.add(product)
        imported_count += 1

        if len(preview_items) < 5:
            preview_items.append({
                "name": name,
                "price": price,
                "category": product.category,
                "sku": sku,
            })

    await db.commit()

    return CSVImportResult(
        total_rows=total_rows,
        imported_count=imported_count,
        skipped_count=skipped_count,
        error_count=len(errors),
        errors=errors[:50],
        preview_items=preview_items,
    )


# ── Size Charts Endpoints ──────────────────────────────────────────────────────

@router.get("/size-charts", response_model=List[SizeChartResponse])
async def list_size_charts(
    workspace: Workspace = Depends(get_current_workspace),
    db: AsyncSession = Depends(get_db)
):
    """List brand-specific size guides and charts."""
    stmt = (
        select(SizeChart)
        .where(SizeChart.workspace_id == workspace.id)
        .order_by(SizeChart.name)
    )
    res = await db.execute(stmt)
    return res.scalars().all()


@router.post("/size-charts", response_model=SizeChartResponse, status_code=status.HTTP_201_CREATED)
async def create_size_chart(
    chart_in: SizeChartCreate,
    workspace: Workspace = Depends(get_current_workspace),
    db: AsyncSession = Depends(get_db)
):
    """Create a brand-specific size guide."""
    chart = SizeChart(
        workspace_id=workspace.id,
        name=chart_in.name,
        category=chart_in.category,
        unit=chart_in.unit,
        chart_data=chart_in.chart_data,
    )
    db.add(chart)
    await db.commit()
    await db.refresh(chart)
    return chart


@router.get("/size-charts/{chart_id}", response_model=SizeChartResponse)
async def get_size_chart(
    chart_id: uuid.UUID,
    workspace: Workspace = Depends(get_current_workspace),
    db: AsyncSession = Depends(get_db)
):
    """Retrieve a single size chart by ID, scoped to the current workspace."""
    stmt = select(SizeChart).where(SizeChart.id == chart_id, SizeChart.workspace_id == workspace.id)
    chart = (await db.execute(stmt)).scalar_one_or_none()
    if not chart:
        raise HTTPException(status_code=404, detail="Size chart not found in this workspace")
    return chart


@router.delete("/size-charts/{chart_id}", status_code=status.HTTP_204_NO_CONTENT)

async def delete_size_chart(
    chart_id: uuid.UUID,
    workspace: Workspace = Depends(get_current_workspace),
    db: AsyncSession = Depends(get_db)
):
    """Delete a size chart."""
    stmt = select(SizeChart).where(SizeChart.id == chart_id, SizeChart.workspace_id == workspace.id)
    chart = (await db.execute(stmt)).scalar_one_or_none()
    if not chart:
        raise HTTPException(status_code=404, detail="Size chart not found")

    await db.delete(chart)
    await db.commit()
    return None


# ── Public Hosted Storefront Endpoints ─────────────────────────────────────────

@router.get("/storefront/{slug}")
async def get_public_storefront(
    slug: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Public storefront endpoint for brands.
    Guarantees public/private isolation: only returns published products,
    never exposes internal pricing rules or minimum floor prices.
    """
    res = await db.execute(select(Workspace).where(Workspace.slug == slug, Workspace.is_active == True))
    workspace = res.scalar_one_or_none()
    if not workspace:
        raise HTTPException(status_code=404, detail="Storefront not found")

    # Fetch published, available products
    stmt = (
        select(Product)
        .options(
            selectinload(Product.variants),
            selectinload(Product.size_chart)
        )
        .where(
            Product.workspace_id == workspace.id,
            Product.status == "published",
            Product.availability == True
        )
        .order_by(Product.created_at.desc())
    )
    products_res = await db.execute(stmt)
    products = products_res.scalars().all()

    # Get widget config if exists
    from app.models.widget import WidgetConfig
    w_res = await db.execute(select(WidgetConfig).where(WidgetConfig.workspace_id == workspace.id).limit(1))
    widget = w_res.scalar_one_or_none()

    clean_products = []
    for p in products:
        clean_products.append({
            "id": str(p.id),
            "name": p.name,
            "description": p.description,
            "price": p.price,
            "previous_price": p.previous_price,
            "currency": p.currency,
            "category": p.category,
            "brand": p.brand,
            "colours": p.colours or [],
            "sizes": p.sizes or [],
            "materials": p.materials,
            "care_instructions": p.care_instructions,
            "fit_notes": p.fit_notes,
            "occasion_tags": p.occasion_tags or [],
            "style_tags": p.style_tags or [],
            "images": p.images or [],
            "purchase_url": p.purchase_url,
            "stock_quantity": p.stock_quantity,
            "variants": [
                {
                    "id": str(v.id),
                    "sku": v.sku,
                    "size": v.size,
                    "colour": v.colour,
                    "price": v.price,
                    "stock_quantity": v.stock_quantity,
                    "availability": v.availability,
                    "image_url": v.image_url
                }
                for v in (p.variants or []) if v.availability
            ]
        })

    return {
        "storefront": {
            "name": workspace.name,
            "slug": workspace.slug,
            "widget_id": widget.public_id if widget else "default",
            "currency": clean_products[0]["currency"] if clean_products else "NGN"
        },
        "products": clean_products,
        "categories": sorted(list({p["category"] for p in clean_products if p.get("category")})),
    }


@router.get("/storefront/{slug}/products/{product_id}")
async def get_public_storefront_product(
    slug: str,
    product_id: uuid.UUID,
    db: AsyncSession = Depends(get_db)
):
    """Public product detail page endpoint."""
    res = await db.execute(select(Workspace).where(Workspace.slug == slug, Workspace.is_active == True))
    workspace = res.scalar_one_or_none()
    if not workspace:
        raise HTTPException(status_code=404, detail="Storefront not found")

    stmt = (
        select(Product)
        .options(
            selectinload(Product.variants),
            selectinload(Product.size_chart)
        )
        .where(
            Product.id == product_id,
            Product.workspace_id == workspace.id,
            Product.status == "published"
        )
    )
    product = (await db.execute(stmt)).scalar_one_or_none()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found or not published")

    return {
        "id": str(product.id),
        "name": product.name,
        "description": product.description,
        "price": product.price,
        "previous_price": product.previous_price,
        "currency": product.currency,
        "category": product.category,
        "brand": product.brand,
        "colours": product.colours or [],
        "sizes": product.sizes or [],
        "materials": product.materials,
        "care_instructions": product.care_instructions,
        "fit_notes": product.fit_notes,
        "occasion_tags": product.occasion_tags or [],
        "style_tags": product.style_tags or [],
        "images": product.images or [],
        "purchase_url": product.purchase_url,
        "stock_quantity": product.stock_quantity,
        "size_chart": {
            "name": product.size_chart.name,
            "unit": product.size_chart.unit,
            "chart_data": product.size_chart.chart_data
        } if product.size_chart else None,
        "variants": [
            {
                "id": str(v.id),
                "sku": v.sku,
                "size": v.size,
                "colour": v.colour,
                "price": v.price,
                "stock_quantity": v.stock_quantity,
                "availability": v.availability,
                "image_url": v.image_url
            }
            for v in (product.variants or []) if v.availability
        ]
    }

