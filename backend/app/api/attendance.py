from typing import List, Optional
from datetime import date, datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.entities import Attendance, Employee
from app.schemas.entities import AttendanceOut, AttendancePunchRequest

router = APIRouter(prefix="/attendance", tags=["Attendance"])

@router.get("/", response_model=List[AttendanceOut])
def list_attendance(
    target_date: Optional[date] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Attendance)
    if target_date:
        query = query.filter(Attendance.date == target_date)
    else:
        query = query.filter(Attendance.date == date.today())

    records = query.order_by(Attendance.id.desc()).all()
    out = []
    for r in records:
        emp_name = r.employee.full_name if r.employee else "Unknown Employee"
        out.append({
            "id": r.id,
            "employee_id": r.employee_id,
            "employee_name": emp_name,
            "date": r.date,
            "punch_in": r.punch_in,
            "punch_out": r.punch_out,
            "work_hours": r.work_hours,
            "status": r.status,
        })
    return out

@router.post("/punch")
def record_punch(payload: AttendancePunchRequest, db: Session = Depends(get_db)):
    today = date.today()
    now_time = datetime.now().strftime("%I:%M %p")

    emp = db.query(Employee).filter(Employee.id == payload.employee_id).first()
    if not emp:
        raise HTTPException(status_code=404, detail="Employee not found")

    record = db.query(Attendance).filter(
        Attendance.employee_id == payload.employee_id,
        Attendance.date == today
    ).first()

    if payload.punch_type == "clock_in":
        if not record:
            record = Attendance(
                employee_id=payload.employee_id,
                date=today,
                punch_in=now_time,
                punch_out=None,
                work_hours=4.0,
                status="present"
            )
            db.add(record)
        else:
            record.punch_in = now_time
            record.status = "present"
        db.commit()
        return {"message": f"Clocked IN successfully at {now_time}", "status": "present"}

    elif payload.punch_type == "clock_out":
        if not record:
            record = Attendance(
                employee_id=payload.employee_id,
                date=today,
                punch_in="09:00 AM",
                punch_out=now_time,
                work_hours=8.0,
                status="present"
            )
            db.add(record)
        else:
            record.punch_out = now_time
            record.work_hours = 8.5
        db.commit()
        return {"message": f"Clocked OUT successfully at {now_time}", "status": "completed"}

    raise HTTPException(status_code=400, detail="Invalid punch type. Choose 'clock_in' or 'clock_out'.")
