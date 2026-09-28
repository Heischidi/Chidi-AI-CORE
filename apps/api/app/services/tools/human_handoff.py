from typing import Any, Dict
from sqlalchemy import select
from app.services.tools.base import BaseTool, ToolContext, ToolResult
from app.models.integration import HumanHandoff
from app.models.conversation import Conversation

class HumanHandoffTool(BaseTool):
    name = "human_handoff"
    description = "Escalates the conversation to a human representative."
    input_schema = {
        "type": "object",
        "properties": {
            "reason": {
                "type": "string",
                "description": "Why the user wants to speak to a human."
            }
        },
        "required": ["reason"]
    }
    
    async def execute(self, context: ToolContext, arguments: Dict[str, Any]) -> ToolResult:
        reason = arguments.get("reason", "User requested human agent.")
        
        # Check if already requested
        stmt = select(HumanHandoff).where(
            HumanHandoff.conversation_id == context.conversation_id,
            HumanHandoff.status.in_(["REQUESTED", "QUEUED", "ASSIGNED"])
        )
        result = await context.db.execute(stmt)
        existing = result.scalar_one_or_none()
        
        if existing:
            return ToolResult(success=True, data={"message": "Handoff already in progress."}, status_code="ALREADY_QUEUED")
            
        handoff = HumanHandoff(
            workspace_id=context.workspace_id,
            conversation_id=context.conversation_id,
            reason=reason,
            status="REQUESTED"
        )
        context.db.add(handoff)
        
        # Mark conversation as handoff
        conv_stmt = select(Conversation).where(Conversation.id == context.conversation_id)
        conv_res = await context.db.execute(conv_stmt)
        conv = conv_res.scalar_one_or_none()
        if conv:
            conv.status = "HANDOFF"
            
        await context.db.commit()
        
        return ToolResult(
            success=True,
            data={"status": "requested", "message": "The conversation has been queued for a human agent."},
            status_code="SUCCESS"
        )
