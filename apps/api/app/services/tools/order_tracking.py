from typing import Any, Dict
import httpx
from sqlalchemy import select
from app.services.tools.base import BaseTool, ToolContext, ToolResult
from app.models.integration import Integration
from app.services.security import is_safe_url

class OrderTrackingTool(BaseTool):
    name = "track_order"
    description = "Retrieves the status of an order using the order ID and customer email. Do not guess the tracking status."
    input_schema = {
        "type": "object",
        "properties": {
            "order_id": {
                "type": "string",
                "description": "The unique order identifier."
            },
            "email": {
                "type": "string",
                "description": "The customer's email address for verification."
            }
        },
        "required": ["order_id", "email"]
    }
    
    async def execute(self, context: ToolContext, arguments: Dict[str, Any]) -> ToolResult:
        order_id = arguments.get("order_id")
        email = arguments.get("email")
        
        if not order_id or not email:
            return ToolResult(success=False, error="Order ID and email are required.", status_code="INVALID_ARGUMENTS")
            
        # Fetch the active integration configuration for ORDER_TRACKING
        stmt = select(Integration).where(
            Integration.workspace_id == context.workspace_id,
            Integration.provider == "HTTP_API",
            Integration.enabled == True
        )
        result = await context.db.execute(stmt)
        # In a real app we'd filter by capability or integration 'type'. We'll assume the first HTTP_API is the order system for now.
        integrations = result.scalars().all()
        order_integration = next((i for i in integrations if i.configuration.get("purpose") == "ORDER_TRACKING"), None)
        
        if not order_integration:
            return ToolResult(success=False, error="Order tracking integration is not configured.", status_code="INTEGRATION_UNAVAILABLE")
            
        endpoint = order_integration.configuration.get("endpoint")
        if not endpoint or not is_safe_url(endpoint):
            return ToolResult(success=False, error="Invalid or unsafe integration endpoint.", status_code="SECURITY_ERROR")
            
        # Optional: Append parameters safely
        # Note: LLM cannot change the base endpoint, only pass structured params
        params = {"order_id": order_id, "email": email}
        
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.get(endpoint, params=params)
                if response.status_code == 404:
                    return ToolResult(success=False, error="Order not found or email does not match.", status_code="ORDER_NOT_FOUND")
                
                response.raise_for_status()
                data = response.json()
                
                return ToolResult(
                    success=True,
                    data={
                        "order_id": order_id,
                        "status": data.get("status", "unknown"),
                        "estimated_delivery": data.get("estimated_delivery"),
                        "tracking_number": data.get("tracking_number")
                    },
                    status_code="SUCCESS"
                )
        except httpx.TimeoutException:
            return ToolResult(success=False, error="The business system timed out.", status_code="TIMEOUT")
        except httpx.HTTPError as e:
            return ToolResult(success=False, error="The business system returned an error.", status_code="INTEGRATION_INVALID_RESPONSE")
        except ValueError: # JSON decode error
            return ToolResult(success=False, error="The business system returned malformed data.", status_code="INTEGRATION_INVALID_RESPONSE")
