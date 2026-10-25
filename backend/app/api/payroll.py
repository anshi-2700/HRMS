from typing import List, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.entities import Payroll
from app.schemas.entities import PayrollOut

router = APIRouter(prefix="/payroll", tags=["Payroll"])

@router.get("/", response_model=List[PayrollOut])
def list_payroll_slips(
    month: Optional[str] = None,
    year: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Payroll)
    if month:
        query = query.filter(Payroll.month == month)
    if year:
        query = query.filter(Payroll.year == year)

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
            "allowances": r.allowances,
            "deductions": r.deductions,
            "net_salary": r.net_salary,
            "status": r.status,
            "payment_date": r.payment_date,
        })
    return out
