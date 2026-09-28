import uuid
import time
from typing import Dict, List, Type, Any
from sqlalchemy import select
from app.services.tools.base import BaseTool, ToolContext, ToolResult
from app.services.tools.price_negotiation import PriceNegotiationTool
from app.services.tools.product_search import ProductSearchTool
from app.services.tools.order_tracking import OrderTrackingTool
from app.services.tools.appointment_booking import AppointmentBookingTool
from app.services.tools.lead_capture import LeadCaptureTool
from app.services.tools.human_handoff import HumanHandoffTool
from app.services.tools.custom_http import CustomHTTPTool
from app.models.capability import Capability, ToolExecution
from app.models.integration import CustomTool

class ToolRegistryService:
    def __init__(self, db):
        self.db = db
        # Static mapping of built-in deterministic tools
        self._available_tools: Dict[str, Type[BaseTool]] = {
            PriceNegotiationTool.name: PriceNegotiationTool,
            ProductSearchTool.name: ProductSearchTool,
            OrderTrackingTool.name: OrderTrackingTool,
            AppointmentBookingTool.name: AppointmentBookingTool,
            LeadCaptureTool.name: LeadCaptureTool,
            HumanHandoffTool.name: HumanHandoffTool,
        }
        
    async def get_authorized_tools(self, workspace_id: uuid.UUID) -> List[BaseTool]:
        """
        Returns instantiated tools that are enabled for this workspace.
        This enforces Capability authorization before LLM even sees the tools.
        """
        # Fetch enabled capabilities
        stmt = select(Capability).where(
            Capability.workspace_id == workspace_id,
            Capability.enabled == True
        )
        result = await self.db.execute(stmt)
        capabilities = result.scalars().all()
        
        cap_keys = {c.capability_key for c in capabilities}
        
        authorized = []
        if "PRICE_NEGOTIATION" in cap_keys:
            authorized.append(PriceNegotiationTool())
        if "PRODUCT_SEARCH" in cap_keys:
            authorized.append(ProductSearchTool())
        if "ORDER_TRACKING" in cap_keys:
            authorized.append(OrderTrackingTool())
        if "APPOINTMENT_BOOKING" in cap_keys:
            authorized.append(AppointmentBookingTool())
        if "LEAD_CAPTURE" in cap_keys:
            authorized.append(LeadCaptureTool())
        if "HUMAN_HANDOFF" in cap_keys:
            authorized.append(HumanHandoffTool())
            
        # Load DB custom tools for this workspace
        stmt_custom = select(CustomTool).where(
            CustomTool.workspace_id == workspace_id,
            CustomTool.enabled == True
        )
        res_custom = await self.db.execute(stmt_custom)
        custom_tools = res_custom.scalars().all()
        
        for ct in custom_tools:
            authorized.append(
                CustomHTTPTool(
                    name=ct.name,
                    description=ct.description,
                    input_schema=ct.input_schema,
                    method=ct.method,
                    endpoint=ct.endpoint,
                    credential_id=ct.credential_id
                )
            )
            
        return authorized

    async def execute_tool(self, context: ToolContext, tool_name: str, arguments: Dict[str, Any]) -> ToolResult:
        start_time = time.time()
        
        # 1. Verification
        authorized_tools = await self.get_authorized_tools(context.workspace_id)
        tool_instance = next((t for t in authorized_tools if t.name == tool_name), None)
        
        if not tool_instance:
            result = ToolResult(success=False, error="Tool is disabled, unauthorized, or does not exist.", status_code="UNAUTHORIZED")
        else:
            # 2. Execution
            try:
                # Actually run the deterministic backend code
                result = await tool_instance.execute(context, arguments)
            except Exception as e:
                result = ToolResult(success=False, error=str(e), status_code="INTERNAL_ERROR")
                
        duration_ms = int((time.time() - start_time) * 1000)
        
        # 3. Audit Logging
        execution_record = ToolExecution(
            workspace_id=context.workspace_id,
            conversation_id=context.conversation_id,
            tool_name=tool_name,
            input_payload=arguments,
            output_payload=result.model_dump(),
            status=result.status_code,
            error_message=result.error,
            duration_ms=duration_ms
        )
        self.db.add(execution_record)
        await self.db.commit()
        
        return result
