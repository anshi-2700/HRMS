from datetime import date, datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr

# Auth Schemas
class LoginRequest(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

class TokenData(BaseModel):
    username: Optional[str] = None

class UserOut(BaseModel):
    id: int
    username: str
    email: str
    full_name: str
    role: str
    is_active: bool

    class Config:
        from_attributes = True

# Employee Schemas
class EmployeeBase(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: Optional[str] = None
    department: str = "Engineering"
    designation: str = "Software Engineer"
    salary: float = 75000.0
    status: str = "active"

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeOut(EmployeeBase):
    id: int
    employee_id: str
    date_of_joining: date

    class Config:
        from_attributes = True

# Attendance Schemas
class AttendancePunchRequest(BaseModel):
    employee_id: int
    punch_type: str = "clock_in"  # clock_in or clock_out

class AttendanceOut(BaseModel):
    id: int
    employee_id: int
    employee_name: Optional[str] = None
    date: date
    punch_in: Optional[str] = None
    punch_out: Optional[str] = None
    work_hours: float
    status: str

    class Config:
        from_attributes = True

# Leave Schemas
class LeaveApplyRequest(BaseModel):
    employee_id: int
    leave_type: str = "Annual Leave"
    start_date: date
    end_date: date
    days: int = 1
    reason: Optional[str] = None

class LeaveOut(BaseModel):
    id: int
    employee_id: int
    employee_name: Optional[str] = None
    leave_type: str
    start_date: date
    end_date: date
    days: int
    reason: Optional[str] = None
    status: str
    applied_on: date

    class Config:
        from_attributes = True

# Payroll Schemas
class PayrollOut(BaseModel):
    id: int
    employee_id: int
    employee_name: Optional[str] = None
    month: str
    year: int
    basic_salary: float
    allowances: float
    deductions: float
    net_salary: float
    status: str
    payment_date: date

    class Config:
        from_attributes = True

# Recruitment Schemas
class CandidateOut(BaseModel):
    id: int
    job_id: int
    full_name: str
    email: str
    phone: Optional[str] = None
    stage: str
    rating: float
    applied_date: date

    class Config:
        from_attributes = True

class JobOut(BaseModel):
    id: int
    title: str
    department: str
    location: str
    job_type: str
    description: Optional[str] = None
    vacancies: int
    status: str
    posted_date: date
    candidates_count: Optional[int] = 0

    class Config:
        from_attributes = True

# Asset Schemas
class AssetCreate(BaseModel):
    asset_tag: str
    name: str
    category: str = "Laptop"
    serial_number: Optional[str] = None
    assigned_to: Optional[str] = None
    value: float = 1200.0
    status: str = "in_use"

class AssetOut(BaseModel):
    id: int
    asset_tag: str
    name: str
    category: str
    serial_number: Optional[str] = None
    assigned_to: Optional[str] = None
    purchase_date: date
    value: float
    status: str

    class Config:
        from_attributes = True

# Dashboard Stats Schema
class DashboardStats(BaseModel):
    total_employees: int
    present_today: int
    on_leave_today: int
    active_jobs: int
    pending_leaves: int
    total_assets: int
    monthly_payroll: float
    departments_count: int
