from typing import Optional, List
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import decode_access_token
from app.models.entities import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)

def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> Optional[User]:
    if not token:
        return None
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        return None
    username = payload["sub"]
    user = db.query(User).filter(User.username == username, User.is_active == True).first()
    return user

def require_current_user(
    current_user: Optional[User] = Depends(get_current_user)
) -> User:
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired or token missing. Please sign in to continue.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return current_user

def require_roles(allowed_roles: List[str]):
    def role_checker(current_user: User = Depends(require_current_user)) -> User:
        if current_user.role not in allowed_roles and current_user.role != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Action unauthorized for role '{current_user.role}'. Required: {allowed_roles}."
            )
        return current_user
    return role_checker

