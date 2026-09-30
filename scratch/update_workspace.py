import asyncio
import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text
from dotenv import load_dotenv

load_dotenv("apps/api/.env")

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("No DATABASE_URL")
    exit(1)

engine = create_async_engine(DATABASE_URL)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def update_name():
    async with AsyncSessionLocal() as session:
        await session.execute(
            text("UPDATE workspaces SET name = 'Grand Lynks Homes', slug = 'grand-lynks-homes' WHERE name = 'Default Workspace'")
        )
        await session.commit()
        print("Updated successfully!")

asyncio.run(update_name())
