from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import verify_password, create_access_token
from app.core.auth_deps import require_current_user
from app.models.entities import User
from app.schemas.entities import LoginRequest, Token, UserOut

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=Token)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == payload.username.strip()).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials. Please verify your username and password."
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account has been deactivated. Please contact HR operations."
        )

    # Encode user metadata and role in token
    token_payload = {
        "sub": user.username,
        "role": user.role,
        "full_name": user.full_name,
        "email": user.email,
        "employee_id": user.employee_id,
    }
    token = create_access_token(data=token_payload)

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role,
            "employee_id": user.employee_id,
            "is_active": user.is_active,
        }
    }

@router.get("/me", response_model=UserOut)
def get_current_user_profile(current_user: User = Depends(require_current_user)):
    return current_user

@router.post("/logout")
def logout():
    return {"message": "Session invalidated successfully"}
