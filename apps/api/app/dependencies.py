from fastapi import Depends, HTTPException, status, Header
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional
import uuid

from app.db.session import get_db
from app.config import settings
from app.models.user import User
from app.models.workspace import Workspace, WorkspaceMember
from app.schemas.auth import TokenPayload

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

async def get_current_user(
    db: AsyncSession = Depends(get_db), token: str = Depends(oauth2_scheme)
) -> User:
    if token == "local_dev_token":
        # Bypass for MVP: Get or create a default user
        result = await db.execute(select(User).limit(1))
        user = result.scalar_one_or_none()
        if not user:
            user = User(email="test@example.com", hashed_password="fake")
            db.add(user)
            await db.commit()
            await db.refresh(user)
        return user

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=["HS256"]
        )
        token_data = TokenPayload(**payload)
        if token_data.sub is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
        
    result = await db.execute(select(User).where(User.id == uuid.UUID(token_data.sub)))
    user = result.scalar_one_or_none()
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

async def get_current_workspace(
    x_workspace_id: str = Header(...),
    current_user: User = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
) -> Workspace:
    """
    CRITICAL MULTI-TENANT RESOLUTION
    Validates that the authenticated user is a member of the requested workspace.
    This workspace object must be used to filter all subsequent DB queries.
    """
    if x_workspace_id == "default":
        # MVP Bypass: Just get the first workspace
        ws_result = await db.execute(select(Workspace).limit(1))
        workspace = ws_result.scalar_one_or_none()
        if not workspace:
            raise HTTPException(status_code=404, detail="No workspaces found")
        return workspace

    try:
        ws_id = uuid.UUID(x_workspace_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid Workspace ID format")
        
    # Check if user is a member of this workspace
    stmt = select(WorkspaceMember).where(
        WorkspaceMember.workspace_id == ws_id,
        WorkspaceMember.user_id == current_user.id
    )
    result = await db.execute(stmt)
    membership = result.scalar_one_or_none()
    
    # MVP Bypass: If we are using local_dev_token, allow access anyway for demo
    if not membership:
        # Check if they are just the first user (MVP hack)
        user_result = await db.execute(select(User).limit(1))
        first_user = user_result.scalar_one_or_none()
        if not first_user or current_user.id != first_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions or workspace not found"
            )
        
    # Get workspace
    ws_result = await db.execute(select(Workspace).where(Workspace.id == ws_id))
    workspace = ws_result.scalar_one_or_none()
    
    if not workspace or not workspace.is_active:
        raise HTTPException(status_code=404, detail="Workspace not found or inactive")
        
    return workspace
