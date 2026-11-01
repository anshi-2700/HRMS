from typing import List, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.auth_deps import get_current_user
from app.models.entities import Payroll, User
from app.schemas.entities import PayrollOut

router = APIRouter(prefix="/payroll", tags=["Payroll"])

@router.get("/", response_model=List[PayrollOut])
def list_payroll_slips(
    month: Optional[str] = None,
    year: Optional[int] = None,
    employee_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    query = db.query(Payroll)
    if month and month != "All":
        query = query.filter(Payroll.month.ilike(month))
    if year:
        query = query.filter(Payroll.year == year)

    # RBAC: staff only see their own payslips
    if current_user and current_user.role == "employee" and current_user.employee_id:
        query = query.filter(Payroll.employee_id == current_user.employee_id)
    elif employee_id:
        query = query.filter(Payroll.employee_id == employee_id)

    records = query.order_by(Payroll.id.desc()).all()
    out = []
    for r in records:
        emp_name = r.employee.full_name if r.employee else "Unknown Employee"
        out.append({
            "id": r.id,
            "employee_id": r.employee_id,
            "employee_name": emp_name,
            "month": r.month,
            "year": r.year,
            "basic_salary": r.basic_salary,
            "hra": r.hra,
            "special_allowance": r.special_allowance,
            "allowances": r.allowances,
            "pf_deduction": r.pf_deduction,
            "pt_deduction": r.pt_deduction,
            "tds_deduction": r.tds_deduction,
            "deductions": r.deductions,
            "net_salary": r.net_salary,
            "status": r.status,
            "payment_date": r.payment_date,
        })
    return out
