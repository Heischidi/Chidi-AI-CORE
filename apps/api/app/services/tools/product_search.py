from typing import Any, Dict
from sqlalchemy import select
from app.services.tools.base import BaseTool, ToolContext, ToolResult
from app.models.product import Product

class ProductSearchTool(BaseTool):
    name = "search_products"
    description = "Search for products available from this business. Returns price, availability, and description."
    input_schema = {
        "type": "object",
        "properties": {
            "query": {
                "type": "string",
                "description": "The search term to look for in product names or descriptions."
            }
        },
        "required": ["query"]
    }
    
    async def execute(self, context: ToolContext, arguments: Dict[str, Any]) -> ToolResult:
        query = arguments.get("query", "")
        if not query:
            return ToolResult(success=False, error="Query is required.", status_code="INVALID_ARGUMENTS")
            
        # Hard-coded deterministic search logic
        # Never allow LLM to construct SQL
        
        stmt = select(Product).where(
            Product.workspace_id == context.workspace_id,
            Product.name.ilike(f"%{query}%")
        ).limit(5)
        
        result = await context.db.execute(stmt)
        products = result.scalars().all()
        
        if not products:
            return ToolResult(success=True, data={"products": []}, status_code="PRODUCT_NOT_FOUND")
            
        product_list = [
            {
                "id": str(p.id),
                "name": p.name,
                "price": p.price,
                "currency": p.currency,
                "availability": p.availability,
                "description": p.description
            }
            for p in products
        ]
        
        return ToolResult(success=True, data={"products": product_list}, status_code="SUCCESS")
