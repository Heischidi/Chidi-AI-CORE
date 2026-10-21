from typing import Any, Dict
from sqlalchemy import select, or_
from app.services.tools.base import BaseTool, ToolContext, ToolResult
from app.models.product import Product

class ProductSearchTool(BaseTool):
    name = "search_products"
    description = (
        "Search for fashion products and catalogue items available from this business. "
        "Returns verified prices, sizes, colours, availability, descriptions, and purchase URLs."
    )
    input_schema = {
        "type": "object",
        "properties": {
            "query": {
                "type": "string",
                "description": "The search term to look for in product names, categories, descriptions, or materials."
            }
        },
        "required": ["query"]
    }
    
    async def execute(self, context: ToolContext, arguments: Dict[str, Any]) -> ToolResult:
        query = arguments.get("query", "").strip()
        if not query:
            return ToolResult(success=False, error="Query is required.", status_code="INVALID_ARGUMENTS")
            
        search_pattern = f"%{query}%"
        stmt = select(Product).where(
            Product.workspace_id == context.workspace_id,
            Product.status == "published",
            or_(
                Product.name.ilike(search_pattern),
                Product.category.ilike(search_pattern),
                Product.brand.ilike(search_pattern),
                Product.description.ilike(search_pattern),
                Product.materials.ilike(search_pattern),
                Product.sku.ilike(search_pattern),
            )
        ).limit(6)
        
        result = await context.db.execute(stmt)
        products = result.scalars().all()
        
        if not products:
            return ToolResult(success=True, data={"products": []}, status_code="PRODUCT_NOT_FOUND")
            
        product_list = [
            {
                "id": str(p.id),
                "name": p.name,
                "price": p.price,
                "previous_price": p.previous_price,
                "currency": p.currency,
                "availability": p.availability,
                "category": p.category,
                "brand": p.brand,
                "colours": p.colours or [],
                "sizes": p.sizes or [],
                "materials": p.materials,
                "fit_notes": p.fit_notes,
                "image_url": p.images[0] if p.images and len(p.images) > 0 else None,
                "purchase_url": p.purchase_url,
                "stock_quantity": p.stock_quantity,
                "description": p.description
            }
            for p in products
        ]
        
        return ToolResult(success=True, data={"products": product_list}, status_code="SUCCESS")
