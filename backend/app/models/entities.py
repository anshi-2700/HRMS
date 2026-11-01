from datetime import datetime, date
from sqlalchemy import Column, Integer, String, Float, Boolean, Date, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(100), nullable=False)
    role = Column(String(20), default="employee")  # admin, manager, employee
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    employee_id = Column(Integer, ForeignKey("employees.id", ondelete="SET NULL"), nullable=True)

    employee = relationship("Employee", foreign_keys=[employee_id])

class Department(Base):
    __tablename__ = "departments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    code = Column(String(20), unique=True, nullable=False)
    description = Column(String(255), nullable=True)
    lead_name = Column(String(100), nullable=True)

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(String(20), unique=True, index=True, nullable=False)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    phone = Column(String(20), nullable=True)
    department = Column(String(100), default="Engineering & Tech")
    designation = Column(String(100), default="Senior Software Engineer")
    location = Column(String(100), default="Bengaluru (HQ)")
    salary = Column(Float, default=1450000.0)  # Annual CTC in INR
    pan_number = Column(String(20), nullable=True)
    uan_number = Column(String(20), nullable=True)
    date_of_joining = Column(Date, default=date.today)
    status = Column(String(20), default="active")  # active, on_leave, inactive

    attendances = relationship("Attendance", back_populates="employee", cascade="all, delete-orphan")
    leaves = relationship("Leave", back_populates="employee", cascade="all, delete-orphan")
    payrolls = relationship("Payroll", back_populates="employee", cascade="all, delete-orphan")

    @property
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}"

class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id", ondelete="CASCADE"), nullable=False)
    date = Column(Date, default=date.today, index=True)
    punch_in = Column(String(20), default="09:15 AM")
    punch_out = Column(String(20), nullable=True)
    work_hours = Column(Float, default=8.5)
    status = Column(String(20), default="present")  # present, half_day, absent, wfh

    employee = relationship("Employee", back_populates="attendances")

class Leave(Base):
    __tablename__ = "leaves"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id", ondelete="CASCADE"), nullable=False)
    leave_type = Column(String(50), default="Casual Leave")  # Casual Leave, Privilege Leave, Sick Leave, Maternity Leave
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    days = Column(Integer, default=1)
    reason = Column(Text, nullable=True)
    status = Column(String(20), default="pending")  # pending, approved, rejected
    applied_on = Column(Date, default=date.today)
    reviewed_by = Column(String(100), nullable=True)

    employee = relationship("Employee", back_populates="leaves")

class Payroll(Base):
    __tablename__ = "payroll"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id", ondelete="CASCADE"), nullable=False)
    month = Column(String(20), nullable=False)
    year = Column(Integer, default=2026)
    basic_salary = Column(Float, nullable=False)
    hra = Column(Float, default=0.0)
    special_allowance = Column(Float, default=0.0)
    allowances = Column(Float, default=0.0)
    pf_deduction = Column(Float, default=0.0)
    pt_deduction = Column(Float, default=200.0)
    tds_deduction = Column(Float, default=0.0)
    deductions = Column(Float, default=0.0)
    net_salary = Column(Float, nullable=False)
    status = Column(String(20), default="paid")  # paid, pending
    payment_date = Column(Date, default=date.today)

    employee = relationship("Employee", back_populates="payrolls")

class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    department = Column(String(100), default="Engineering & Tech")
    location = Column(String(100), default="Bengaluru (Hybrid)")
    job_type = Column(String(50), default="Full Time")
    experience_level = Column(String(50), default="3-6 Years")
    description = Column(Text, nullable=True)
    vacancies = Column(Integer, default=1)
    status = Column(String(20), default="active")  # active, closed
    posted_date = Column(Date, default=date.today)

    candidates = relationship("Candidate", back_populates="job", cascade="all, delete-orphan")

class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False)
    full_name = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=True)
    current_company = Column(String(100), nullable=True)
    experience_years = Column(Float, default=3.0)
    stage = Column(String(30), default="applied")  # applied, screened, interview, offered, hired, rejected
    rating = Column(Float, default=4.5)
    applied_date = Column(Date, default=date.today)

    job = relationship("Job", back_populates="candidates")

class Asset(Base):
    __tablename__ = "assets"

    id = Column(Integer, primary_key=True, index=True)
    asset_tag = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    category = Column(String(50), default="Laptop")
    serial_number = Column(String(100), nullable=True)
    assigned_to = Column(String(100), nullable=True)
    purchase_date = Column(Date, default=date.today)
    value = Column(Float, default=85000.0)  # Value in INR
    status = Column(String(20), default="in_use")  # in_use, available, maintenance
