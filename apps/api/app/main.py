from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from app.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Widget routes must work from ANY external domain (they are public embeds).
# This raw middleware ensures CORS headers are ALWAYS present, even on 500 errors,
# which is critical because FastAPI's CORSMiddleware strips headers from error responses.
class AlwaysCORSMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        if request.url.path.startswith("/api/v1/widget"):
            response.headers["Access-Control-Allow-Origin"] = "*"
            response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
            response.headers["Access-Control-Allow-Headers"] = "*"
        return response

app.add_middleware(AlwaysCORSMiddleware)

# Standard CORS for dashboard/auth routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://chidi-ai-core.vercel.app", "*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "ok", "project": settings.PROJECT_NAME}

from app.routers import auth, workspaces, conversations, websites, documents, public_widget, capabilities, tools, integrations, custom_tools, usage, analytics, plans, voice, knowledge_base

app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(workspaces.router, prefix=f"{settings.API_V1_STR}/workspaces", tags=["workspaces"])
app.include_router(conversations.router, prefix=f"{settings.API_V1_STR}/conversations", tags=["conversations"])
app.include_router(websites.router, prefix=f"{settings.API_V1_STR}/websites", tags=["websites"])
app.include_router(documents.router, prefix=f"{settings.API_V1_STR}/documents", tags=["documents"])
app.include_router(public_widget.router, prefix=f"{settings.API_V1_STR}/widget", tags=["widget"])
app.include_router(capabilities.router, prefix=f"{settings.API_V1_STR}/capabilities", tags=["capabilities"])
app.include_router(tools.router, prefix=f"{settings.API_V1_STR}/tools", tags=["tools"])
app.include_router(integrations.router, prefix=f"{settings.API_V1_STR}/integrations", tags=["integrations"])
app.include_router(custom_tools.router, prefix=f"{settings.API_V1_STR}/custom-tools", tags=["custom_tools"])
app.include_router(usage.router, prefix=f"{settings.API_V1_STR}/usage", tags=["usage"])
app.include_router(analytics.router, prefix=f"{settings.API_V1_STR}/analytics", tags=["analytics"])
app.include_router(plans.router, prefix=f"{settings.API_V1_STR}/plans", tags=["plans"])
app.include_router(voice.router, prefix=f"{settings.API_V1_STR}/voice", tags=["voice"])
app.include_router(knowledge_base.router, prefix=f"{settings.API_V1_STR}/knowledge", tags=["knowledge"])
