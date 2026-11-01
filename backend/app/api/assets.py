from typing import List
from datetime import date
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.auth_deps import require_roles
from app.models.entities import Asset, User
from app.schemas.entities import AssetCreate, AssetOut

router = APIRouter(prefix="/assets", tags=["Assets"])

@router.get("/", response_model=List[AssetOut])
def list_assets(db: Session = Depends(get_db)):
    return db.query(Asset).order_by(Asset.id.desc()).all()

@router.post("/", response_model=AssetOut, status_code=status.HTTP_201_CREATED)
def create_asset(
    payload: AssetCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "manager"]))
):
    existing = db.query(Asset).filter(Asset.asset_tag == payload.asset_tag.strip().upper()).first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail=f"An asset with tag '{payload.asset_tag}' already exists."
        )

    asset = Asset(
        asset_tag=payload.asset_tag.strip().upper(),
        name=payload.name.strip(),
        category=payload.category,
        serial_number=payload.serial_number,
        assigned_to=payload.assigned_to,
        purchase_date=date.today(),
        value=payload.value,
        status=payload.status,
    )
    db.add(asset)
    db.commit()
    db.refresh(asset)
    return asset
