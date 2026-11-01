from typing import List, Optional
from datetime import date
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.auth_deps import require_current_user, require_roles
from app.models.entities import Employee, User
from app.schemas.entities import EmployeeCreate, EmployeeOut

router = APIRouter(prefix="/employees", tags=["Employees"])

@router.get("/", response_model=List[EmployeeOut])
def list_employees(
    department: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Employee)
    if department and department != "All":
        query = query.filter(Employee.department == department)
    if status:
        query = query.filter(Employee.status == status)
    return query.order_by(Employee.id.asc()).all()

@router.post("/", response_model=EmployeeOut, status_code=status.HTTP_201_CREATED)
def create_employee(
    payload: EmployeeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "manager"]))
):
    # Check if email already registered
    existing = db.query(Employee).filter(Employee.email == payload.email.strip().lower()).first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail=f"Personnel record with email '{payload.email}' already exists."
        )

    # Generate custom Indian corporate ID: WN-IND-XXXX
    count = db.query(Employee).count() + 1
    generated_id = f"WN-IND-{1000 + count}"

    emp = Employee(
        employee_id=generated_id,
        first_name=payload.first_name.strip(),
        last_name=payload.last_name.strip(),
        email=payload.email.strip().lower(),
        phone=payload.phone.strip() if payload.phone else None,
        department=payload.department,
        designation=payload.designation,
        location=payload.location,
        salary=payload.salary,
        pan_number=payload.pan_number,
        uan_number=payload.uan_number,
        date_of_joining=date.today(),
        status=payload.status,
    )
    db.add(emp)
    db.commit()
    db.refresh(emp)
    return emp

@router.get("/{id}", response_model=EmployeeOut)
def get_employee(id: int, db: Session = Depends(get_db)):
    emp = db.query(Employee).filter(Employee.id == id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Personnel record not found")
    return emp
