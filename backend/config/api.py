from datetime import date, datetime
from decimal import Decimal
from typing import List, Optional
import uuid

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.db.models import Count, Q
from django.shortcuts import get_object_or_404
from ninja import NinjaAPI, Schema
from ninja.responses import Response

from apps.asset.models import Asset
from apps.candidate.models import Candidate
from apps.employee.models import AttendanceRegister, Department, Designation, Employee, Leave, LeaveType
from apps.job.models import Job
from apps.main.models import Company
from apps.main.functions import get_auto_id, get_a_id
from apps.payroll.models import Salary

# Initialize Ninja API with automatic Swagger docs at /api/docs
api = NinjaAPI(
    title="Nexus Workforce API",
    version="1.0.0",
    description="Nexus Workforce OS - Enterprise REST API powered by Django Ninja",
)


def get_default_company(user=None):
    company = Company.objects.filter(is_deleted=False).first()
    if not company:
        admin_user = User.objects.filter(is_superuser=True).first() or user
        if not admin_user:
            admin_user = User.objects.first()
        company = Company.objects.create(
            auto_id=1,
            creator=admin_user,
            updator=admin_user,
            name="Nexus Global Technologies",
            contact_person="Director of HR",
            email="hr@nexushr.io",
            phone="+1 (555) 234-5678",
        )
    return company


def get_user_role(user: User) -> str:
    if not user or not user.is_authenticated:
        return "Guest"
    if user.is_superuser:
        return "Admin"
    if user.groups.filter(name="hrms_clients").exists():
        return "Client"
    if Employee.objects.filter(user=user, is_deleted=False).exists():
        return "Employee"
    return "User"


# ==========================================
# SCHEMAS
# ==========================================

class LoginSchema(Schema):
    username: str
    password: str


class UserProfileSchema(Schema):
    id: int
    username: str
    email: str
    first_name: str
    last_name: str
    role: str
    is_authenticated: bool
    company_name: Optional[str] = None
    employee_id: Optional[str] = None


class HealthSchema(Schema):
    status: str
    service: str
    version: str
    timestamp: str


class DepartmentSchema(Schema):
    id: str
    name: str
    employee_count: Optional[int] = 0


class DepartmentCreateSchema(Schema):
    name: str


class DesignationSchema(Schema):
    id: str
    name: str
    department_id: Optional[str] = None
    department_name: Optional[str] = None


class DesignationCreateSchema(Schema):
    name: str
    department_id: str


class EmployeeSchema(Schema):
    id: str
    first_name: str
    last_name: str
    full_name: str
    email: str
    phone: str
    department: str
    department_id: Optional[str] = None
    designation: str
    designation_id: Optional[str] = None
    employeeid: str
    gender: Optional[str] = None
    joindate: Optional[str] = None
    is_blocked: bool
    address: Optional[str] = None


class EmployeeCreateSchema(Schema):
    first_name: str
    last_name: str
    email: str
    phone: str
    department_id: str
    designation_id: str
    employeeid: str
    gender: Optional[str] = "Male"
    joindate: Optional[str] = None
    username: Optional[str] = None
    password: Optional[str] = "password@123"
    address: Optional[str] = ""


class AttendanceRecordSchema(Schema):
    id: str
    employee_id: str
    employee_name: str
    employee_code: str
    department: str
    date: str
    status: str
    is_attended: bool


class ClockInSchema(Schema):
    employee_id: Optional[str] = None
    status: Optional[str] = "present"
    date: Optional[str] = None


class LeaveTypeSchema(Schema):
    id: str
    name: str
    days: Optional[int] = 0


class LeaveRequestSchema(Schema):
    id: str
    employee_id: str
    employee_name: str
    employee_code: str
    leavetype_id: str
    leavetype_name: str
    startdate: str
    enddate: str
    leave_days: int
    reason: str
    status: str
    is_approved: bool
    is_rejected: bool


class ApplyLeaveSchema(Schema):
    employee_id: Optional[str] = None
    leavetype_id: str
    startdate: str
    enddate: str
    leave_days: int
    reason: str


class SalaryItemSchema(Schema):
    id: str
    employee_id: str
    employee_name: str
    employee_code: str
    designation: str
    net_salary: float
    date: str


class GenerateSalarySchema(Schema):
    employee_id: str
    net_salary: float
    date: str


class JobSchema(Schema):
    id: str
    job_title: str
    department: Optional[str] = None
    job_location: Optional[str] = None
    job_type: Optional[str] = None
    status: Optional[str] = "Open"
    vacancies: Optional[int] = 1


class JobCreateSchema(Schema):
    job_title: str
    department_id: Optional[str] = None
    job_location: Optional[str] = "Remote"
    job_type: Optional[str] = "Full Time"
    vacancies: Optional[int] = 1


class CandidateSchema(Schema):
    id: str
    first_name: str
    last_name: str
    full_name: str
    email: str
    phone: str
    job_type: Optional[str] = None
    status: Optional[str] = "No Offer"
    skills: Optional[str] = None
    date_applied: Optional[str] = None


class CandidateCreateSchema(Schema):
    first_name: str
    last_name: str
    email: str
    phone: str
    job_type: Optional[str] = "Full Time"
    skills: Optional[str] = ""


class CandidateStatusUpdateSchema(Schema):
    status: str


class AssetSchema(Schema):
    id: str
    name: str
    description: Optional[str] = None
    purchase_date: str
    purchase_price: float
    useful_life_years: int
    salvage_value: float
    current_value: float


class AssetCreateSchema(Schema):
    name: str
    description: Optional[str] = ""
    purchase_date: str
    purchase_price: float
    useful_life_years: int
    salvage_value: float


# ==========================================
# HEALTH & SYSTEM
# ==========================================

@api.get("/health", response=HealthSchema, tags=["System"])
def health_check(request):
    return {
        "status": "healthy",
        "service": "nexus-workforce-api",
        "version": "1.0.0",
        "timestamp": datetime.now().isoformat(),
    }


# ==========================================
# AUTHENTICATION
# ==========================================

@api.post("/auth/login", tags=["Auth"])
def login_view(request, data: LoginSchema):
    user = authenticate(request, username=data.username, password=data.password)
    if user is not None:
        login(request, user)
        company = get_default_company(user)
        role = get_user_role(user)
        employee = Employee.objects.filter(user=user, is_deleted=False).first()
        return {
            "success": True,
            "message": "Login successful",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "role": role,
                "is_authenticated": True,
                "company_name": company.name if company else "Nexus Global Technologies",
                "employee_id": str(employee.id) if employee else None,
            },
        }
    return Response({"success": False, "message": "Invalid username or password"}, status=401)


@api.post("/auth/logout", tags=["Auth"])
def logout_view(request):
    logout(request)
    return {"success": True, "message": "Logged out successfully"}


@api.get("/auth/me", response=UserProfileSchema, tags=["Auth"])
def me_view(request):
    user = request.user
    if user.is_authenticated:
        company = get_default_company(user)
        role = get_user_role(user)
        employee = Employee.objects.filter(user=user, is_deleted=False).first()
        return {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name or user.username,
            "last_name": user.last_name or "",
            "role": role,
            "is_authenticated": True,
            "company_name": company.name if company else "Nexus Global Technologies",
            "employee_id": str(employee.id) if employee else None,
        }

    # If unauthenticated, return default guest profile
    return {
        "id": 0,
        "username": "guest",
        "email": "",
        "first_name": "Guest",
        "last_name": "User",
        "role": "Guest",
        "is_authenticated": False,
        "company_name": "Nexus Global Technologies",
        "employee_id": None,
    }


# ==========================================
# DASHBOARD
# ==========================================

@api.get("/dashboard/stats", tags=["Dashboard"])
def get_dashboard_stats(request):
    today = date.today()
    company = get_default_company(request.user)

    total_employees = Employee.objects.filter(is_deleted=False).count()
    total_departments = Department.objects.filter(is_deleted=False).count()
    total_jobs = Job.objects.filter(is_deleted=False, status="Open").count()
    total_candidates = Candidate.objects.filter(is_deleted=False).count()
    total_assets = Asset.objects.filter(is_deleted=False).count()

    present_today = AttendanceRegister.objects.filter(
        date=today,
        status="present",
        is_deleted=False,
    ).count()

    on_leave_today = Leave.objects.filter(
        startdate__lte=today,
        enddate__gte=today,
        status="Approved",
        is_deleted=False,
    ).count()

    recent_employees = [
        {
            "id": str(emp.id),
            "name": emp.get_full_name,
            "department": emp.department.name if emp.department else "-",
            "designation": emp.designation.name if emp.designation else "-",
            "joindate": str(emp.joindate) if emp.joindate else "-",
            "employeeid": emp.employeeid,
        }
        for emp in Employee.objects.filter(is_deleted=False).order_by("-date_added")[:5]
    ]

    recent_leaves = [
        {
            "id": str(l.id),
            "employee": l.employee.get_full_name,
            "type": l.leavetype.name if l.leavetype else "Leave",
            "from_date": str(l.startdate),
            "to_date": str(l.enddate),
            "days": l.leave_days,
            "status": l.status,
        }
        for l in Leave.objects.filter(is_deleted=False).order_by("-date_added")[:5]
    ]

    recent_candidates = [
        {
            "id": str(c.id),
            "name": c.get_full_name,
            "email": c.email,
            "job_type": c.job_type,
            "status": c.status,
        }
        for c in Candidate.objects.filter(is_deleted=False).order_by("-date_applied")[:5]
    ]

    return {
        "total_employees": total_employees,
        "total_departments": total_departments,
        "total_jobs": total_jobs,
        "total_candidates": total_candidates,
        "total_assets": total_assets,
        "present_today": present_today,
        "on_leave_today": on_leave_today,
        "recent_employees": recent_employees,
        "recent_leaves": recent_leaves,
        "recent_candidates": recent_candidates,
    }


# ==========================================
# EMPLOYEES & DEPARTMENTS
# ==========================================

@api.get("/employees", response=List[EmployeeSchema], tags=["Employees"])
def list_employees(request, search: Optional[str] = None, department: Optional[str] = None):
    qs = Employee.objects.filter(is_deleted=False).select_related("department", "designation")
    if search:
        qs = qs.filter(
            Q(firstname__icontains=search)
            | Q(lastname__icontains=search)
            | Q(employeeid__icontains=search)
            | Q(email__icontains=search)
        )
    if department:
        qs = qs.filter(department__name__iexact=department)

    return [
        {
            "id": str(emp.id),
            "first_name": emp.firstname,
            "last_name": emp.lastname,
            "full_name": emp.get_full_name,
            "email": emp.email,
            "phone": emp.phone,
            "department": emp.department.name if emp.department else "General",
            "department_id": str(emp.department.id) if emp.department else None,
            "designation": emp.designation.name if emp.designation else "Staff",
            "designation_id": str(emp.designation.id) if emp.designation else None,
            "employeeid": emp.employeeid,
            "gender": emp.gender,
            "joindate": str(emp.joindate) if emp.joindate else "",
            "is_blocked": emp.is_blocked,
            "address": emp.address or "",
        }
        for emp in qs
    ]


@api.post("/employees", response=EmployeeSchema, tags=["Employees"])
def create_employee(request, data: EmployeeCreateSchema):
    company = get_default_company(request.user)
    department = get_object_or_404(Department, id=data.department_id, is_deleted=False)
    designation = get_object_or_404(Designation, id=data.designation_id, is_deleted=False)

    creator = request.user if request.user.is_authenticated else User.objects.filter(is_superuser=True).first()

    username = data.username or f"emp_{data.employeeid.lower()}"
    user, _ = User.objects.get_or_create(
        username=username,
        defaults={
            "email": data.email,
            "first_name": data.first_name,
            "last_name": data.last_name,
        },
    )
    if data.password:
        user.set_password(data.password)
        user.save()

    auto_id = get_auto_id(Employee)
    a_id = auto_id

    emp = Employee.objects.create(
        company=company,
        user=user,
        creator=creator,
        updator=creator,
        auto_id=auto_id,
        a_id=a_id,
        firstname=data.first_name,
        lastname=data.last_name,
        email=data.email,
        phone=data.phone,
        department=department,
        designation=designation,
        employeeid=data.employeeid,
        gender=data.gender,
        joindate=data.joindate or date.today(),
        address=data.address,
        username=username,
        password=data.password or "password@123",
    )

    return {
        "id": str(emp.id),
        "first_name": emp.firstname,
        "last_name": emp.lastname,
        "full_name": emp.get_full_name,
        "email": emp.email,
        "phone": emp.phone,
        "department": emp.department.name,
        "department_id": str(emp.department.id),
        "designation": emp.designation.name,
        "designation_id": str(emp.designation.id),
        "employeeid": emp.employeeid,
        "gender": emp.gender,
        "joindate": str(emp.joindate) if emp.joindate else "",
        "is_blocked": emp.is_blocked,
        "address": emp.address or "",
    }


@api.get("/employees/{employee_id}", response=EmployeeSchema, tags=["Employees"])
def get_employee(request, employee_id: str):
    emp = get_object_or_404(Employee, id=employee_id, is_deleted=False)
    return {
        "id": str(emp.id),
        "first_name": emp.firstname,
        "last_name": emp.lastname,
        "full_name": emp.get_full_name,
        "email": emp.email,
        "phone": emp.phone,
        "department": emp.department.name if emp.department else "General",
        "department_id": str(emp.department.id) if emp.department else None,
        "designation": emp.designation.name if emp.designation else "Staff",
        "designation_id": str(emp.designation.id) if emp.designation else None,
        "employeeid": emp.employeeid,
        "gender": emp.gender,
        "joindate": str(emp.joindate) if emp.joindate else "",
        "is_blocked": emp.is_blocked,
        "address": emp.address or "",
    }


@api.delete("/employees/{employee_id}", tags=["Employees"])
def delete_employee(request, employee_id: str):
    emp = get_object_or_404(Employee, id=employee_id)
    emp.is_deleted = True
    emp.save()
    return {"success": True, "message": "Employee deleted"}


@api.get("/departments", response=List[DepartmentSchema], tags=["Departments"])
def list_departments(request):
    departments = Department.objects.filter(is_deleted=False).annotate(
        emp_count=Count("employee", filter=Q(employee__is_deleted=False))
    )
    return [
        {
            "id": str(d.id),
            "name": d.name,
            "employee_count": d.emp_count,
        }
        for d in departments
    ]


@api.post("/departments", response=DepartmentSchema, tags=["Departments"])
def create_department(request, data: DepartmentCreateSchema):
    company = get_default_company(request.user)
    creator = request.user if request.user.is_authenticated else User.objects.filter(is_superuser=True).first()
    auto_id = get_auto_id(Department)

    dept = Department.objects.create(
        company=company,
        name=data.name,
        creator=creator,
        updator=creator,
        auto_id=auto_id,
        a_id=auto_id,
    )
    return {"id": str(dept.id), "name": dept.name, "employee_count": 0}


@api.get("/designations", response=List[DesignationSchema], tags=["Departments"])
def list_designations(request, department_id: Optional[str] = None):
    qs = Designation.objects.filter(is_deleted=False).select_related("department")
    if department_id:
        qs = qs.filter(department_id=department_id)
    return [
        {
            "id": str(d.id),
            "name": d.name,
            "department_id": str(d.department.id) if d.department else None,
            "department_name": d.department.name if d.department else None,
        }
        for d in qs
    ]


@api.post("/designations", response=DesignationSchema, tags=["Departments"])
def create_designation(request, data: DesignationCreateSchema):
    company = get_default_company(request.user)
    creator = request.user if request.user.is_authenticated else User.objects.filter(is_superuser=True).first()
    dept = get_object_or_404(Department, id=data.department_id, is_deleted=False)
    auto_id = get_auto_id(Designation)

    desig = Designation.objects.create(
        company=company,
        department=dept,
        name=data.name,
        creator=creator,
        updator=creator,
        auto_id=auto_id,
        a_id=auto_id,
    )
    return {
        "id": str(desig.id),
        "name": desig.name,
        "department_id": str(dept.id),
        "department_name": dept.name,
    }


# ==========================================
# ATTENDANCE
# ==========================================

@api.get("/attendance/today", response=List[AttendanceRecordSchema], tags=["Attendance"])
def get_today_attendance(request):
    today = date.today()
    records = AttendanceRegister.objects.filter(
        date=today,
        is_deleted=False,
    ).select_related("employee", "employee__department")

    return [
        {
            "id": str(r.id),
            "employee_id": str(r.employee.id),
            "employee_name": r.employee.get_full_name,
            "employee_code": r.employee.employeeid,
            "department": r.employee.department.name if r.employee.department else "-",
            "date": str(r.date),
            "status": r.status,
            "is_attended": r.is_attended,
        }
        for r in records
    ]


@api.post("/attendance/clock-in", tags=["Attendance"])
def clock_in(request, data: ClockInSchema):
    today = date.today()
    if data.date:
        today = datetime.strptime(data.date, "%Y-%m-%d").date()

    emp = None
    if data.employee_id:
        emp = get_object_or_404(Employee, id=data.employee_id, is_deleted=False)
    elif request.user.is_authenticated:
        emp = Employee.objects.filter(user=request.user, is_deleted=False).first()

    if not emp:
        emp = Employee.objects.filter(is_deleted=False).first()

    if not emp:
        return Response({"success": False, "message": "No employee found"}, status=400)

    company = get_default_company(request.user)
    creator = request.user if request.user.is_authenticated else User.objects.filter(is_superuser=True).first()

    record = AttendanceRegister.objects.filter(employee=emp, date=today, is_deleted=False).first()
    if record:
        record.status = data.status or "present"
        record.is_attended = True
        record.save()
    else:
        auto_id = get_auto_id(AttendanceRegister)
        record = AttendanceRegister.objects.create(
            company=company,
            employee=emp,
            date=today,
            status=data.status or "present",
            is_attended=True,
            creator=creator,
            updator=creator,
            auto_id=auto_id,
            a_id=auto_id,
        )

    return {
        "success": True,
        "message": f"Recorded attendance for {emp.get_full_name} as {record.status}",
        "record_id": str(record.id),
        "status": record.status,
    }


# ==========================================
# LEAVES
# ==========================================

@api.get("/leaves/types", response=List[LeaveTypeSchema], tags=["Leaves"])
def list_leave_types(request):
    types = LeaveType.objects.filter(is_deleted=False, is_active=True)
    if not types.exists():
        company = get_default_company(request.user)
        admin = User.objects.filter(is_superuser=True).first()
        for name, days in [("Annual Leave", 15), ("Sick Leave", 10), ("Casual Leave", 7)]:
            aid = get_auto_id(LeaveType)
            LeaveType.objects.create(
                company=company,
                creator=admin,
                updator=admin,
                auto_id=aid,
                a_id=aid,
                name=name,
                days=days,
            )
        types = LeaveType.objects.filter(is_deleted=False, is_active=True)

    return [{"id": str(t.id), "name": t.name, "days": t.days or 0} for t in types]


@api.get("/leaves/requests", response=List[LeaveRequestSchema], tags=["Leaves"])
def list_leave_requests(request):
    leaves = Leave.objects.filter(is_deleted=False).select_related("employee", "leavetype").order_by("-date_added")
    return [
        {
            "id": str(l.id),
            "employee_id": str(l.employee.id),
            "employee_name": l.employee.get_full_name,
            "employee_code": l.employee.employeeid,
            "leavetype_id": str(l.leavetype.id) if l.leavetype else "",
            "leavetype_name": l.leavetype.name if l.leavetype else "Leave",
            "startdate": str(l.startdate),
            "enddate": str(l.enddate),
            "leave_days": l.leave_days,
            "reason": l.reason,
            "status": l.status,
            "is_approved": l.is_approved,
            "is_rejected": l.is_rejected,
        }
        for l in leaves
    ]


@api.post("/leaves/apply", tags=["Leaves"])
def apply_leave(request, data: ApplyLeaveSchema):
    emp = None
    if data.employee_id:
        emp = get_object_or_404(Employee, id=data.employee_id, is_deleted=False)
    elif request.user.is_authenticated:
        emp = Employee.objects.filter(user=request.user, is_deleted=False).first()

    if not emp:
        emp = Employee.objects.filter(is_deleted=False).first()

    if not emp:
        return Response({"success": False, "message": "No employee specified"}, status=400)

    leavetype = get_object_or_404(LeaveType, id=data.leavetype_id, is_deleted=False)
    company = get_default_company(request.user)
    creator = request.user if request.user.is_authenticated else User.objects.filter(is_superuser=True).first()
    auto_id = get_auto_id(Leave)

    leave = Leave.objects.create(
        company=company,
        employee=emp,
        leavetype=leavetype,
        startdate=datetime.strptime(data.startdate, "%Y-%m-%d").date(),
        enddate=datetime.strptime(data.enddate, "%Y-%m-%d").date(),
        leave_days=data.leave_days,
        reason=data.reason,
        status="Pending",
        creator=creator,
        updator=creator,
        auto_id=auto_id,
        a_id=auto_id,
    )

    return {"success": True, "message": "Leave application submitted", "leave_id": str(leave.id)}


@api.post("/leaves/{leave_id}/approve", tags=["Leaves"])
def approve_leave(request, leave_id: str):
    leave = get_object_or_404(Leave, id=leave_id, is_deleted=False)
    leave.is_approved = True
    leave.is_rejected = False
    leave.status = "Approved"
    leave.save()
    return {"success": True, "message": "Leave approved"}


@api.post("/leaves/{leave_id}/reject", tags=["Leaves"])
def reject_leave(request, leave_id: str):
    leave = get_object_or_404(Leave, id=leave_id, is_deleted=False)
    leave.is_approved = False
    leave.is_rejected = True
    leave.status = "Rejected"
    leave.save()
    return {"success": True, "message": "Leave rejected"}


# ==========================================
# PAYROLL
# ==========================================

@api.get("/payroll/salaries", response=List[SalaryItemSchema], tags=["Payroll"])
def list_salaries(request):
    salaries = Salary.objects.filter(is_deleted=False).select_related("employee", "employee__designation").order_by("-date")
    return [
        {
            "id": str(s.id),
            "employee_id": str(s.employee.id),
            "employee_name": s.employee.get_full_name,
            "employee_code": s.employee.employeeid,
            "designation": s.employee.designation.name if s.employee.designation else "Staff",
            "net_salary": float(s.net_salary),
            "date": str(s.date),
        }
        for s in salaries
    ]


@api.post("/payroll/generate", tags=["Payroll"])
def generate_salary(request, data: GenerateSalarySchema):
    emp = get_object_or_404(Employee, id=data.employee_id, is_deleted=False)
    company = get_default_company(request.user)
    creator = request.user if request.user.is_authenticated else User.objects.filter(is_superuser=True).first()
    auto_id = get_auto_id(Salary)

    sal = Salary.objects.create(
        company=company,
        employee=emp,
        net_salary=Decimal(str(data.net_salary)),
        date=datetime.strptime(data.date, "%Y-%m-%d").date(),
        creator=creator,
        updator=creator,
        auto_id=auto_id,
        a_id=auto_id,
    )
    return {"success": True, "salary_id": str(sal.id), "message": "Salary record created"}


# ==========================================
# RECRUITMENT & JOBS
# ==========================================

@api.get("/jobs", response=List[JobSchema], tags=["Recruitment"])
def list_jobs(request):
    jobs = Job.objects.filter(is_deleted=False).select_related("department")
    return [
        {
            "id": str(j.id),
            "job_title": j.job_title,
            "department": j.department.name if j.department else "Engineering",
            "job_location": j.job_location or "Remote",
            "job_type": j.job_type or "Full Time",
            "status": j.status or "Open",
            "vacancies": j.no_of_vacancies or 1,
        }
        for j in jobs
    ]


@api.post("/jobs", response=JobSchema, tags=["Recruitment"])
def create_job(request, data: JobCreateSchema):
    company = get_default_company(request.user)
    creator = request.user if request.user.is_authenticated else User.objects.filter(is_superuser=True).first()
    dept = Department.objects.filter(id=data.department_id).first() if data.department_id else None
    auto_id = get_auto_id(Job)

    job = Job.objects.create(
        company=company,
        job_title=data.job_title,
        department=dept,
        job_location=data.job_location,
        job_type=data.job_type,
        no_of_vacancies=data.vacancies or 1,
        status="Open",
        creator=creator,
        updator=creator,
        auto_id=auto_id,
        a_id=auto_id,
    )

    return {
        "id": str(job.id),
        "job_title": job.job_title,
        "department": job.department.name if job.department else "Engineering",
        "job_location": job.job_location or "Remote",
        "job_type": job.job_type or "Full Time",
        "status": job.status or "Open",
        "vacancies": job.no_of_vacancies or 1,
    }


@api.get("/candidates", response=List[CandidateSchema], tags=["Recruitment"])
def list_candidates(request):
    candidates = Candidate.objects.filter(is_deleted=False).order_by("-date_applied")
    return [
        {
            "id": str(c.id),
            "first_name": c.first_name,
            "last_name": c.last_name,
            "full_name": c.get_full_name,
            "email": c.email,
            "phone": str(c.phone_number),
            "job_type": c.job_type or "Full Time",
            "status": c.status or "No Offer",
            "skills": c.skills or "",
            "date_applied": c.date_applied.strftime("%Y-%m-%d") if c.date_applied else "",
        }
        for c in candidates
    ]


@api.post("/candidates", response=CandidateSchema, tags=["Recruitment"])
def create_candidate(request, data: CandidateCreateSchema):
    c = Candidate.objects.create(
        first_name=data.first_name,
        last_name=data.last_name,
        email=data.email,
        phone_number=data.phone,
        job_type=data.job_type,
        skills=data.skills,
        status="Applicant",
    )
    return {
        "id": str(c.id),
        "first_name": c.first_name,
        "last_name": c.last_name,
        "full_name": c.get_full_name,
        "email": c.email,
        "phone": str(c.phone_number),
        "job_type": c.job_type or "Full Time",
        "status": c.status or "Applicant",
        "skills": c.skills or "",
        "date_applied": c.date_applied.strftime("%Y-%m-%d") if c.date_applied else "",
    }


@api.post("/candidates/{candidate_id}/status", tags=["Recruitment"])
def update_candidate_status(request, candidate_id: str, data: CandidateStatusUpdateSchema):
    c = get_object_or_404(Candidate, id=candidate_id, is_deleted=False)
    c.status = data.status
    c.save()
    return {"success": True, "message": f"Candidate status updated to {c.status}"}


# ==========================================
# ASSETS
# ==========================================

@api.get("/assets", response=List[AssetSchema], tags=["Assets"])
def list_assets(request):
    assets = Asset.objects.filter(is_deleted=False)
    return [
        {
            "id": str(a.id),
            "name": a.name,
            "description": a.description or "",
            "purchase_date": str(a.purchase_date),
            "purchase_price": float(a.purchase_price),
            "useful_life_years": a.useful_life_years,
            "salvage_value": float(a.salvage_value),
            "current_value": float(a.current_value),
        }
        for a in assets
    ]


@api.post("/assets", response=AssetSchema, tags=["Assets"])
def create_asset(request, data: AssetCreateSchema):
    company = get_default_company(request.user)
    creator = request.user if request.user.is_authenticated else User.objects.filter(is_superuser=True).first()
    auto_id = get_auto_id(Asset)

    asset = Asset.objects.create(
        company=company,
        name=data.name,
        description=data.description,
        purchase_date=datetime.strptime(data.purchase_date, "%Y-%m-%d").date(),
        purchase_price=Decimal(str(data.purchase_price)),
        useful_life_years=data.useful_life_years,
        salvage_value=Decimal(str(data.salvage_value)),
        creator=creator,
        updator=creator,
        auto_id=auto_id,
        a_id=auto_id,
    )

    return {
        "id": str(asset.id),
        "name": asset.name,
        "description": asset.description or "",
        "purchase_date": str(asset.purchase_date),
        "purchase_price": float(asset.purchase_price),
        "useful_life_years": asset.useful_life_years,
        "salvage_value": float(asset.salvage_value),
        "current_value": float(asset.current_value),
    }
