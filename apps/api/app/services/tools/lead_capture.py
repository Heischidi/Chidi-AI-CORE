import re
from typing import Any, Dict
from app.services.tools.base import BaseTool, ToolContext, ToolResult

class LeadCaptureTool(BaseTool):
    name = "capture_lead"
    description = "Collects customer information to create a lead in the business system."
    input_schema = {
        "type": "object",
        "properties": {
            "name": {"type": "string"},
            "email": {"type": "string"},
            "phone": {"type": "string"},
            "interest": {"type": "string"}
        },
        "required": ["name", "email"]
    }
    
    async def execute(self, context: ToolContext, arguments: Dict[str, Any]) -> ToolResult:
        name = arguments.get("name")
        email = arguments.get("email")
        
        if not name or not email:
            return ToolResult(success=False, error="Name and email are required.", status_code="MISSING_FIELDS")
            
        if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
            return ToolResult(success=False, error="Invalid email format.", status_code="INVALID_EMAIL")
            
        # In a real system, save to CRM or local Leads table
        return ToolResult(
            success=True,
            data={"status": "captured", "lead_id": "LD-999"},
            status_code="SUCCESS"
        )
