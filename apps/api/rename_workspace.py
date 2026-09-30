import asyncio
from sqlalchemy import select
from app.db.session import AsyncSessionLocal
from app.models.workspace import Workspace

async def rename_workspace():
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(Workspace).limit(1))
        workspace = result.scalar_one_or_none()
        if workspace:
            workspace.name = "Grand Lynks Homes"
            workspace.slug = "grand-lynks-homes"
            await db.commit()
            print("Renamed workspace to Grand Lynks Homes!")
        else:
            print("No workspace found.")

if __name__ == "__main__":
    asyncio.run(rename_workspace())
