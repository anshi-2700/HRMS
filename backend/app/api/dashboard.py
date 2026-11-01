from datetime import date
from typing import Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.core.auth_deps import get_current_user
from app.models.entities import Employee, Attendance, Leave, Job, Asset, Payroll, Department, User
from app.schemas.entities import DashboardStats

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    today = date.today()

    total_employees = db.query(Employee).count()
    present_today = db.query(Attendance).filter(
        Attendance.date == today,
        Attendance.status.in_(["present", "half_day", "wfh"])
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

    # RBAC: Only Admin sees company-wide financial payroll sum
    payroll_sum = 0.0
    if current_user and current_user.role == "admin":
        payroll_sum = float(db.query(func.sum(Payroll.net_salary)).scalar() or 0.0)

    my_leave_bal = None
    my_assets_cnt = 0
    dept_team_count = None
    dept_present_today = None
    dept_name = None

    if current_user and current_user.employee_id:
        emp = db.query(Employee).filter(Employee.id == current_user.employee_id).first()
        if emp:
            dept_name = emp.department

        # Calculate used leaves for current employee
        used_casual = db.query(func.sum(Leave.days)).filter(
            Leave.employee_id == current_user.employee_id,
            Leave.leave_type.ilike("%casual%"),
            Leave.status == "approved"
        ).scalar() or 0

        used_sick = db.query(func.sum(Leave.days)).filter(
            Leave.employee_id == current_user.employee_id,
            Leave.leave_type.ilike("%sick%"),
            Leave.status == "approved"
        ).scalar() or 0

        used_privilege = db.query(func.sum(Leave.days)).filter(
            Leave.employee_id == current_user.employee_id,
            Leave.leave_type.ilike("%privilege%"),
            Leave.status == "approved"
        ).scalar() or 0

        my_leave_bal = {
            "casual_leave": max(0, 12 - int(used_casual)),
            "casual_total": 12,
            "privilege_leave": max(0, 18 - int(used_privilege)),
            "privilege_total": 18,
            "sick_leave": max(0, 12 - int(used_sick)),
            "sick_total": 12,
        }

        # Check assigned assets
        if current_user.full_name:
            my_assets_cnt = db.query(Asset).filter(
                Asset.assigned_to.ilike(f"%{current_user.full_name}%")
            ).count()

        # If manager, compute department-level metrics
        if current_user.role in ["manager", "client"] and dept_name:
            dept_team_count = db.query(Employee).filter(Employee.department == dept_name).count()
            dept_present_today = db.query(Attendance).join(Employee).filter(
                Employee.department == dept_name,
                Attendance.date == today,
                Attendance.status.in_(["present", "half_day", "wfh"])
            ).count()

    return {
        "total_employees": total_employees,
        "present_today": present_today,
        "on_leave_today": on_leave_today,
        "active_jobs": active_jobs,
        "pending_leaves": pending_leaves,
        "total_assets": total_assets,
        "monthly_payroll": payroll_sum,
        "departments_count": departments_count,
        "my_leave_balance": my_leave_bal,
        "my_assigned_assets": my_assets_cnt,
        "dept_team_count": dept_team_count,
        "dept_present_today": dept_present_today,
        "dept_name": dept_name,
        "view_role": current_user.role if current_user else "guest",
    }
