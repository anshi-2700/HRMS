from typing import List, Optional
from datetime import date
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.entities import Leave, Employee
from app.schemas.entities import LeaveOut, LeaveApplyRequest

router = APIRouter(prefix="/leaves", tags=["Leaves"])

@router.get("/", response_model=List[LeaveOut])
def list_leaves(
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Leave)
    if status:
        query = query.filter(Leave.status == status)

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
        })
    return out

@router.post("/apply", response_model=LeaveOut)
def apply_leave(payload: LeaveApplyRequest, db: Session = Depends(get_db)):
    emp = db.query(Employee).filter(Employee.id == payload.employee_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")

    leave = Leave(
        employee_id=payload.employee_id,
        leave_type=payload.leave_type,
        start_date=payload.start_date,
        end_date=payload.end_date,
        days=payload.days,
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
    }

@router.post("/{id}/approve")
def approve_leave(id: int, db: Session = Depends(get_db)):
    leave = db.query(Leave).filter(Leave.id == id).first()
    if not leave:
        raise HTTPException(status_code=404, detail="Leave request not found")
    leave.status = "approved"
    db.commit()
    return {"message": "Leave request approved successfully", "status": "approved"}

@router.post("/{id}/reject")
def reject_leave(id: int, db: Session = Depends(get_db)):
    leave = db.query(Leave).filter(Leave.id == id).first()
    if not leave:
        raise HTTPException(status_code=404, detail="Leave request not found")
    leave.status = "rejected"
    db.commit()
    return {"message": "Leave request rejected", "status": "rejected"}
