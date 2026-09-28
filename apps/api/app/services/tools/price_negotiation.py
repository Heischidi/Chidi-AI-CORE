import uuid
from typing import Any, Dict
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.services.tools.base import BaseTool, ToolContext, ToolResult
from app.models.product import Product, PricingRule

class PriceNegotiationTool(BaseTool):
    name = "negotiate_price"
    description = "Use this tool to evaluate a customer's offer for a specific product. Never approve a price yourself; always run it through this tool."
    input_schema = {
        "type": "object",
        "properties": {
            "product_id": {
                "type": "string",
                "description": "The UUID of the product being negotiated."
            },
            "offered_price": {
                "type": "number",
                "description": "The price the customer is offering."
            }
        },
        "required": ["product_id", "offered_price"]
    }
    
    async def execute(self, context: ToolContext, arguments: Dict[str, Any]) -> ToolResult:
        product_id_str = arguments.get("product_id")
        offered_price = arguments.get("offered_price")
        
        try:
            product_id = uuid.UUID(product_id_str)
            offered_price = float(offered_price)
        except (ValueError, TypeError):
            return ToolResult(success=False, error="Invalid product_id or offered_price format.", status_code="INVALID_ARGUMENTS")
            
        # Deterministic Business Rule: Backend evaluates the offer.
        # Tenant isolation enforced strictly.
        stmt = select(Product).options(selectinload(Product.pricing_rule)).where(
            Product.id == product_id,
            Product.workspace_id == context.workspace_id
        )
        
        result = await context.db.execute(stmt)
        product = result.scalar_one_or_none()
        
        if not product:
            return ToolResult(success=False, error="Product not found in this workspace.", status_code="PRODUCT_NOT_FOUND")
            
        if not product.pricing_rule:
            return ToolResult(success=False, error="Price negotiation is not configured for this product.", status_code="NEGOTIATION_DISABLED")
            
        if not product.pricing_rule.negotiation_enabled:
            return ToolResult(success=False, error="Negotiation is disabled for this product.", status_code="NEGOTIATION_DISABLED")
            
        # The core rule
        if offered_price < product.pricing_rule.minimum_price:
            return ToolResult(
                success=True, 
                data={
                    "approved": False,
                    "reason": "PRICE_BELOW_MINIMUM",
                    "minimum_allowed_price": product.pricing_rule.minimum_price,
                    "offered_price": offered_price,
                    "listed_price": product.price,
                    "currency": product.currency
                },
                status_code="REJECTED"
            )
            
        # If it passes
        return ToolResult(
            success=True,
            data={
                "approved": True,
                "reason": "PRICE_ACCEPTED",
                "final_price": offered_price,
                "listed_price": product.price,
                "currency": product.currency
            },
            status_code="APPROVED"
        )
