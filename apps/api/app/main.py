from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://chidi-ai-core.vercel.app"], # Allow frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    return {"status": "ok", "project": settings.PROJECT_NAME}

from app.routers import auth, workspaces, conversations, websites, documents, public_widget, capabilities, tools, integrations, custom_tools, usage, analytics, plans, voice

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
