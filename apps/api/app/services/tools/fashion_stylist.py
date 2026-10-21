import uuid
from typing import Any, Dict, List, Optional
from sqlalchemy import select, or_, and_
from sqlalchemy.orm import selectinload

from app.services.tools.base import BaseTool, ToolContext, ToolResult
from app.models.product import Product

class FashionStylistTool(BaseTool):
    name = "recommend_fashion_outfit"
    description = (
        "Recommend fashion outfits or complementary pieces from the brand's verified catalogue "
        "based on occasion, budget, preferred style, colour, and size. Only recommends real products in stock."
    )
    input_schema = {
        "type": "object",
        "properties": {
            "occasion": {
                "type": "string",
                "description": "Event or occasion (e.g., 'wedding', 'cocktail', 'workwear', 'dinner', 'brunch', 'casual')."
            },
            "max_budget": {
                "type": "number",
                "description": "Maximum budget limit in the business's currency (e.g. 50000)."
            },
            "style_preference": {
                "type": "string",
                "description": "Style aesthetic (e.g., 'minimalist', 'luxury', 'contemporary', 'tailored', 'relaxed')."
            },
            "preferred_colour": {
                "type": "string",
                "description": "Desired colour family (e.g., 'emerald', 'black', 'sage', 'white')."
            },
            "size": {
                "type": "string",
                "description": "Customer's clothing size (e.g., 'XS', 'S', 'M', 'L', 'XL')."
            },
            "category": {
                "type": "string",
                "description": "Optional specific category to focus on (e.g., 'Dresses', 'Outerwear', 'Trousers')."
            }
        }
    }

    async def execute(self, context: ToolContext, arguments: Dict[str, Any]) -> ToolResult:
        occasion = arguments.get("occasion", "").strip().lower()
        max_budget = arguments.get("max_budget")
        style = arguments.get("style_preference", "").strip().lower()
        colour = arguments.get("preferred_colour", "").strip().lower()
        size = arguments.get("size", "").strip().upper()
        target_category = arguments.get("category", "").strip().lower()

        # Deterministic query - only tenant's published and available products
        stmt = (
            select(Product)
            .options(selectinload(Product.variants))
            .where(
                Product.workspace_id == context.workspace_id,
                Product.availability == True,
                Product.status == "published"
            )
        )

        if max_budget is not None and max_budget > 0:
            stmt = stmt.where(Product.price <= float(max_budget))

        if target_category:
            stmt = stmt.where(Product.category.ilike(f"%{target_category}%"))

        result = await context.db.execute(stmt)
        products = result.scalars().all()

        if not products:
            return ToolResult(
                success=True,
                data={
                    "outfit_recommendations": [],
                    "message": "No products found matching these exact criteria within budget. Consider expanding your budget or trying another occasion."
                },
                status_code="NO_MATCHING_PRODUCTS"
            )

        # Score and rank candidates based on fashion parameters
        scored_products = []
        for p in products:
            score = 10  # base score

            # Occasion match
            if occasion and p.occasion_tags:
                matched_occ = any(occasion in str(t).lower() for t in p.occasion_tags)
                if matched_occ:
                    score += 25

            # Style tag match
            if style and p.style_tags:
                matched_style = any(style in str(t).lower() for t in p.style_tags)
                if matched_style:
                    score += 15

            # Colour match
            if colour and p.colours:
                matched_col = any(colour in str(c).lower() for c in p.colours)
                if matched_col:
                    score += 20

            # Size availability check
            if size and p.sizes:
                has_size = any(size == str(s).upper() for s in p.sizes)
                if has_size:
                    score += 20
                else:
                    # Deduct score if size is explicitly requested but not in this product
                    score -= 15

            scored_products.append((score, p))

        # Sort descending by score
        scored_products.sort(key=lambda x: x[0], reverse=True)
        top_candidates = [p for _, p in scored_products[:4]]

        formatted_items = []
        total_price = 0.0

        for p in top_candidates:
            total_price += p.price
            formatted_items.append({
                "id": str(p.id),
                "name": p.name,
                "price": p.price,
                "previous_price": p.previous_price,
                "currency": p.currency,
                "category": p.category,
                "brand": p.brand,
                "colours": p.colours or [],
                "sizes": p.sizes or [],
                "materials": p.materials,
                "fit_notes": p.fit_notes,
                "image_url": p.images[0] if p.images and len(p.images) > 0 else None,
                "purchase_url": p.purchase_url,
                "stock_quantity": p.stock_quantity,
            })

        return ToolResult(
            success=True,
            data={
                "outfit_recommendations": formatted_items,
                "total_price": total_price,
                "currency": formatted_items[0]["currency"] if formatted_items else "NGN",
                "occasion": occasion or "general styling",
                "count": len(formatted_items),
            },
            status_code="SUCCESS"
        )
