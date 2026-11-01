from typing import List, Optional
from datetime import date
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.auth_deps import get_current_user, require_roles
from app.models.entities import Leave, Employee, User
from app.schemas.entities import LeaveOut, LeaveApplyRequest

router = APIRouter(prefix="/leaves", tags=["Leaves"])

@router.get("/", response_model=List[LeaveOut])
def list_leaves(
    status: Optional[str] = None,
    employee_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    query = db.query(Leave)
    if status and status != "all":
        query = query.filter(Leave.status == status)

    if employee_id:
        query = query.filter(Leave.employee_id == employee_id)
    elif current_user and current_user.role == "employee" and current_user.employee_id:
        # By default for employee persona, show their own requests
        query = query.filter(Leave.employee_id == current_user.employee_id)

    records = query.order_by(Leave.id.desc()).all()
    out = []
    for r in records:
        emp_name = r.employee.full_name if r.employee else "Unknown Employee"
        out.append({
            "id": r.id,
            "employee_id": r.employee_id,
            "employee_name": emp_name,
            "leave_type": r.leave_type,
            "start_date": r.start_date,
            "end_date": r.end_date,
            "days": r.days,
            "reason": r.reason,
            "status": r.status,
            "applied_on": r.applied_on,
            "reviewed_by": r.reviewed_by,
        })
    return out

@router.post("/apply", response_model=LeaveOut)
def apply_leave(
    payload: LeaveApplyRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    target_emp_id = payload.employee_id
    if current_user and current_user.role == "employee" and current_user.employee_id:
        # Lock to authenticated employee
        target_emp_id = current_user.employee_id

    if not target_emp_id:
        raise HTTPException(status_code=400, detail="Employee ID is required to file a leave application.")

    emp = db.query(Employee).filter(Employee.id == target_emp_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")

    leave = Leave(
        employee_id=target_emp_id,
        leave_type=payload.leave_type,
        start_date=payload.start_date,
        end_date=payload.end_date,
        days=max(1, payload.days),
        reason=payload.reason,
        status="pending",
        applied_on=date.today(),
    )
    db.add(leave)
    db.commit()
    db.refresh(leave)

    return {
        "id": leave.id,
        "employee_id": leave.employee_id,
        "employee_name": emp.full_name,
        "leave_type": leave.leave_type,
        "start_date": leave.start_date,
        "end_date": leave.end_date,
        "days": leave.days,
        "reason": leave.reason,
        "status": leave.status,
        "applied_on": leave.applied_on,
        "reviewed_by": None,
    }

@router.post("/{id}/approve")
def approve_leave(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "manager"]))
):
    leave = db.query(Leave).filter(Leave.id == id).first()
    if not leave:
        raise HTTPException(status_code=404, detail="Leave request not found")
    leave.status = "approved"
    leave.reviewed_by = current_user.full_name
    db.commit()
    return {"message": f"Leave request #{id} approved by {current_user.full_name}.", "status": "approved"}

@router.post("/{id}/reject")
def reject_leave(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(["admin", "manager"]))
):
    leave = db.query(Leave).filter(Leave.id == id).first()
    if not leave:
        raise HTTPException(status_code=404, detail="Leave request not found")
    leave.status = "rejected"
    leave.reviewed_by = current_user.full_name
    db.commit()
    return {"message": f"Leave request #{id} declined by {current_user.full_name}.", "status": "rejected"}
