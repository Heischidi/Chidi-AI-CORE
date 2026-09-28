from typing import Any, Dict
import httpx
from app.services.tools.base import BaseTool, ToolContext, ToolResult
from app.services.security import is_safe_url
from app.services.secret_store import SecretStore

class CustomHTTPTool(BaseTool):
    """
    Dynamically instantiated tool based on tenant's CustomTool DB record.
    """
    def __init__(self, name: str, description: str, input_schema: dict, method: str, endpoint: str, credential_id: str = None):
        self.name = name
        self.description = description
        self.input_schema = input_schema
        self.method = method
        self.endpoint = endpoint
        self.credential_id = credential_id

    async def execute(self, context: ToolContext, arguments: Dict[str, Any]) -> ToolResult:
        if not is_safe_url(self.endpoint):
            return ToolResult(success=False, error="Invalid or unsafe endpoint configuration.", status_code="SECURITY_ERROR")
            
        headers = {"Content-Type": "application/json"}
        
        # In a real app we'd resolve credentials securely from the SecretStore
        if self.credential_id:
            store = SecretStore()
            secret = await store.retrieve(self.credential_id)
            if secret:
                headers["Authorization"] = f"Bearer {secret}"
                
        # To prevent URL manipulation, we do not let LLM inject path parameters directly into endpoint
        # unless strictly validated. For this phase, we append arguments as query params or JSON body.
        
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                if self.method.upper() == "GET":
                    response = await client.get(self.endpoint, params=arguments, headers=headers)
                elif self.method.upper() in ["POST", "PUT", "PATCH"]:
                    response = await client.request(self.method.upper(), self.endpoint, json=arguments, headers=headers)
                else:
                    return ToolResult(success=False, error="Unsupported HTTP method.", status_code="INVALID_METHOD")
                    
                response.raise_for_status()
                return ToolResult(success=True, data=response.json(), status_code="SUCCESS")
                
        except httpx.TimeoutException:
            return ToolResult(success=False, error="The business system timed out.", status_code="TIMEOUT")
        except httpx.HTTPError:
            return ToolResult(success=False, error="The business system returned an error.", status_code="INTEGRATION_INVALID_RESPONSE")
        except ValueError:
            return ToolResult(success=False, error="The business system returned malformed data.", status_code="INTEGRATION_INVALID_RESPONSE")
