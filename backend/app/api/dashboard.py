from datetime import date
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.models.entities import Employee, Attendance, Leave, Job, Asset, Payroll, Department
from app.schemas.entities import DashboardStats

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    today = date.today()

    total_employees = db.query(Employee).count()
    present_today = db.query(Attendance).filter(
        Attendance.date == today,
        Attendance.status.in_(["present", "half_day"])
    ).count()

    on_leave_today = db.query(Leave).filter(
        Leave.status == "approved",
        Leave.start_date <= today,
        Leave.end_date >= today
    ).count()

    active_jobs = db.query(Job).filter(Job.status == "active").count()
    pending_leaves = db.query(Leave).filter(Leave.status == "pending").count()
    total_assets = db.query(Asset).count()
    departments_count = db.query(Department).count()

    # Sum monthly payroll
    payroll_sum = db.query(func.sum(Payroll.net_salary)).scalar() or 0.0

    return {
        "total_employees": total_employees,
        "present_today": present_today,
        "on_leave_today": on_leave_today,
        "active_jobs": active_jobs,
        "pending_leaves": pending_leaves,
        "total_assets": total_assets,
        "monthly_payroll": float(payroll_sum),
        "departments_count": departments_count,
    }
