from typing import Any, Dict
from sqlalchemy import select
from app.services.tools.base import BaseTool, ToolContext, ToolResult
from app.models.integration import ActionState

class AppointmentBookingTool(BaseTool):
    name = "book_appointment"
    description = "Book an appointment. Requires a date and time. Before executing, make sure you confirm the time with the user."
    input_schema = {
        "type": "object",
        "properties": {
            "date": {
                "type": "string",
                "description": "The requested date (YYYY-MM-DD)"
            },
            "time": {
                "type": "string",
                "description": "The requested time (e.g. '14:00')"
            },
            "user_confirmed": {
                "type": "boolean",
                "description": "True only if the user explicitly confirmed this exact slot."
            }
        },
        "required": ["date", "time", "user_confirmed"]
    }
    
    async def execute(self, context: ToolContext, arguments: Dict[str, Any]) -> ToolResult:
        date = arguments.get("date")
        time = arguments.get("time")
        user_confirmed = arguments.get("user_confirmed", False)
        
        if not date or not time:
            return ToolResult(success=False, error="Date and time are required.", status_code="INVALID_ARGUMENTS")
            
        idempotency_key = f"{date}_{time}"
        
        # Action State Machine lookup
        stmt = select(ActionState).where(
            ActionState.conversation_id == context.conversation_id,
            ActionState.tool_name == self.name,
            ActionState.idempotency_key == idempotency_key
        )
        result = await context.db.execute(stmt)
        action = result.scalar_one_or_none()
        
        if not action:
            action = ActionState(
                workspace_id=context.workspace_id,
                conversation_id=context.conversation_id,
                tool_name=self.name,
                idempotency_key=idempotency_key,
                state="READY_FOR_CONFIRMATION" if user_confirmed else "AWAITING_INFORMATION",
                context_data={"date": date, "time": time}
            )
            context.db.add(action)
            await context.db.commit()
            
        if not user_confirmed:
            action.state = "AWAITING_INFORMATION"
            await context.db.commit()
            return ToolResult(
                success=True, 
                data={"availability": True, "message": f"{date} at {time} is available. Ask user to confirm booking."},
                status_code="CONFIRMATION_REQUIRED"
            )
            
        if action.state in ["COMPLETED", "EXECUTING"]:
            return ToolResult(success=True, data={"message": "Booking already completed."}, status_code="SUCCESS")
            
        # Execute booking
        action.state = "EXECUTING"
        await context.db.commit()
        
        # Simulate integration execution...
        action.state = "COMPLETED"
        await context.db.commit()
        
        return ToolResult(
            success=True,
            data={"status": "booked", "date": date, "time": time, "booking_reference": "CONF-12345"},
            status_code="SUCCESS"
        )
