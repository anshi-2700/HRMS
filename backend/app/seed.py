from datetime import date, timedelta
from sqlalchemy.orm import Session
from app.core.security import get_password_hash
from app.models.entities import (
    User,
    Department,
    Employee,
    Attendance,
    Leave,
    Payroll,
    Job,
    Candidate,
    Asset,
)

def seed_database(db: Session):
    # Check if already seeded
    if db.query(User).first():
        return

    print("Seeding database with Nexus Workforce OS initial demo data...")

    # 1. Users
    users = [
        User(
            username="admin",
            email="admin@nexushr.io",
            full_name="Nexus System Administrator",
            hashed_password=get_password_hash("admin"),
            role="admin",
            is_active=True,
        ),
        User(
            username="hrmsclient1",
            email="client@nexushr.io",
            full_name="Sarah Jenkins (Client Manager)",
            hashed_password=get_password_hash("password@123"),
            role="client",
            is_active=True,
        ),
        User(
            username="employee1",
            email="employee1@nexushr.io",
            full_name="Marcus Vance",
            hashed_password=get_password_hash("password@123"),
            role="employee",
            is_active=True,
        ),
    ]
    db.add_all(users)
    db.commit()

    # 2. Departments
    departments = [
        Department(name="Engineering", code="ENG", description="Software & Platform Engineering"),
        Department(name="Product Management", code="PROD", description="Product Design & Strategy"),
        Department(name="Human Resources", code="HR", description="People Operations & Talent Acquisition"),
        Department(name="Finance & Accounting", code="FIN", description="Financial Planning & Payroll"),
        Department(name="Sales & Enterprise", code="SALES", description="Global Client Partnerships"),
    ]
    db.add_all(departments)
    db.commit()

    # 3. Employees
    emp_data = [
        ("NEX-1001", "Marcus", "Vance", "marcus.vance@nexushr.io", "+1 555-0101", "Engineering", "Staff Software Engineer", 145000.0, date(2023, 3, 15), "active"),
        ("NEX-1002", "Elena", "Rostova", "elena.rostova@nexushr.io", "+1 555-0102", "Product Management", "Principal Product Designer", 132000.0, date(2023, 6, 1), "active"),
        ("NEX-1003", "David", "Kim", "david.kim@nexushr.io", "+1 555-0103", "Engineering", "Senior DevOps Architect", 138000.0, date(2023, 8, 10), "active"),
        ("NEX-1004", "Sophia", "Martinez", "sophia.martinez@nexushr.io", "+1 555-0104", "Human Resources", "Director of People Ops", 125000.0, date(2022, 11, 20), "active"),
        ("NEX-1005", "Tariq", "Al-Mansoor", "tariq.mansoor@nexushr.io", "+1 555-0105", "Finance & Accounting", "Lead Payroll Controller", 118000.0, date(2023, 2, 5), "active"),
        ("NEX-1006", "Chloe", "Dupont", "chloe.dupont@nexushr.io", "+1 555-0106", "Sales & Enterprise", "VP Global Partnerships", 155000.0, date(2022, 5, 12), "active"),
        ("NEX-1007", "James", "O'Connor", "james.oconnor@nexushr.io", "+1 555-0107", "Engineering", "Frontend Tech Lead", 128000.0, date(2024, 1, 15), "active"),
        ("NEX-1008", "Aisha", "Patel", "aisha.patel@nexushr.io", "+1 555-0108", "Product Management", "Product Operations Manager", 98000.0, date(2024, 4, 1), "on_leave"),
    ]

    employees = []
    for code, fn, ln, email, phone, dept, desig, sal, doj, status in emp_data:
        emp = Employee(
            employee_id=code,
            first_name=fn,
            last_name=ln,
            email=email,
            phone=phone,
            department=dept,
            designation=desig,
            salary=sal,
            date_of_joining=doj,
            status=status
        )
        employees.append(emp)
    db.add_all(employees)
    db.commit()

    # Refresh employees to get generated IDs
    emp_map = {e.employee_id: e.id for e in db.query(Employee).all()}

    # 4. Attendance
    today = date.today()
    attendances = [
        Attendance(employee_id=emp_map["NEX-1001"], date=today, punch_in="08:45 AM", punch_out="05:15 PM", work_hours=8.5, status="present"),
        Attendance(employee_id=emp_map["NEX-1002"], date=today, punch_in="09:00 AM", punch_out="05:00 PM", work_hours=8.0, status="present"),
        Attendance(employee_id=emp_map["NEX-1003"], date=today, punch_in="08:30 AM", punch_out="05:30 PM", work_hours=9.0, status="present"),
        Attendance(employee_id=emp_map["NEX-1004"], date=today, punch_in="09:15 AM", punch_out="05:15 PM", work_hours=8.0, status="present"),
        Attendance(employee_id=emp_map["NEX-1005"], date=today, punch_in="09:00 AM", punch_out=None, work_hours=4.0, status="present"),
        Attendance(employee_id=emp_map["NEX-1006"], date=today, punch_in="09:30 AM", punch_out=None, work_hours=3.5, status="present"),
        Attendance(employee_id=emp_map["NEX-1007"], date=today, punch_in="09:00 AM", punch_out="01:00 PM", work_hours=4.0, status="half_day"),
        Attendance(employee_id=emp_map["NEX-1008"], date=today, punch_in=None, punch_out=None, work_hours=0.0, status="absent"),
    ]
    db.add_all(attendances)
    db.commit()

    # 5. Leaves
    leaves = [
        Leave(
            employee_id=emp_map["NEX-1008"],
            leave_type="Annual Leave",
            start_date=today,
            end_date=today + timedelta(days=3),
            days=4,
            reason="Family vacation and personal travel",
            status="approved",
            applied_on=today - timedelta(days=5),
        ),
        Leave(
            employee_id=emp_map["NEX-1001"],
            leave_type="Medical Leave",
            start_date=today + timedelta(days=2),
            end_date=today + timedelta(days=3),
            days=2,
            reason="Scheduled outpatient medical appointment",
            status="pending",
            applied_on=today - timedelta(days=1),
        ),
        Leave(
            employee_id=emp_map["NEX-1003"],
            leave_type="Casual Leave",
            start_date=today + timedelta(days=7),
            end_date=today + timedelta(days=7),
            days=1,
            reason="Home maintenance and deliveries",
            status="pending",
            applied_on=today,
        ),
        Leave(
            employee_id=emp_map["NEX-1006"],
            leave_type="Annual Leave",
            start_date=today - timedelta(days=20),
            end_date=today - timedelta(days=18),
            days=3,
            reason="Personal travel",
            status="approved",
            applied_on=today - timedelta(days=25),
        ),
    ]
    db.add_all(leaves)
    db.commit()

    # 6. Payroll
    payrolls = [
        Payroll(
            employee_id=emp_map["NEX-1001"],
            month="October",
            year=2026,
            basic_salary=12083.33,
            allowances=1200.0,
            deductions=1850.0,
            net_salary=11433.33,
            status="paid",
            payment_date=today - timedelta(days=10),
        ),
        Payroll(
            employee_id=emp_map["NEX-1002"],
            month="October",
            year=2026,
            basic_salary=11000.00,
            allowances=1000.0,
            deductions=1650.0,
            net_salary=10350.00,
            status="paid",
            payment_date=today - timedelta(days=10),
        ),
        Payroll(
            employee_id=emp_map["NEX-1003"],
            month="October",
            year=2026,
            basic_salary=11500.00,
            allowances=1100.0,
            deductions=1725.0,
            net_salary=10875.00,
            status="paid",
            payment_date=today - timedelta(days=10),
        ),
        Payroll(
            employee_id=emp_map["NEX-1004"],
            month="October",
            year=2026,
            basic_salary=10416.67,
            allowances=950.0,
            deductions=1562.5,
            net_salary=9804.17,
            status="paid",
            payment_date=today - timedelta(days=10),
        ),
    ]
    db.add_all(payrolls)
    db.commit()

    # 7. Jobs & Candidates
    jobs = [
        Job(
            title="Senior React & TypeScript Architect",
            department="Engineering",
            location="Remote / New York",
            job_type="Full Time",
            description="Leading front-end platform design and UI component system architecture.",
            vacancies=2,
            status="active",
            posted_date=today - timedelta(days=12),
        ),
        Job(
            title="Staff Python & FastAPI Backend Engineer",
            department="Engineering",
            location="Remote / San Francisco",
            job_type="Full Time",
            description="Architecting high-throughput asynchronous microservices, PostgreSQL data modeling, and OpenAPI specs.",
            vacancies=1,
            status="active",
            posted_date=today - timedelta(days=8),
        ),
        Job(
            title="Director of People Operations",
            department="Human Resources",
            location="New York Headquarters",
            job_type="Full Time",
            description="Scaling global employee experience, compensation strategies, and enterprise compliance.",
            vacancies=1,
            status="active",
            posted_date=today - timedelta(days=20),
        ),
    ]
    db.add_all(jobs)
    db.commit()

    job_records = db.query(Job).all()
    candidates = [
        Candidate(job_id=job_records[0].id, full_name="Alexander Wright", email="a.wright@email.com", phone="+1 555-8891", stage="interview", rating=4.8, applied_date=today - timedelta(days=5)),
        Candidate(job_id=job_records[0].id, full_name="Jessica Lin", email="j.lin@email.com", phone="+1 555-8892", stage="offered", rating=5.0, applied_date=today - timedelta(days=9)),
        Candidate(job_id=job_records[1].id, full_name="Rahul Sharma", email="r.sharma@email.com", phone="+1 555-8893", stage="screened", rating=4.5, applied_date=today - timedelta(days=3)),
        Candidate(job_id=job_records[1].id, full_name="Emily Zhao", email="emily.zhao@email.com", phone="+1 555-8894", stage="interview", rating=4.7, applied_date=today - timedelta(days=6)),
    ]
    db.add_all(candidates)
    db.commit()

    # 8. Assets
    assets = [
        Asset(asset_tag="AST-2026-001", name='MacBook Pro 16" M3 Max', category="Workstation", serial_number="C02FX932MD6R", assigned_to="Marcus Vance", value=3499.0, status="in_use", purchase_date=date(2024, 1, 10)),
        Asset(asset_tag="AST-2026-002", name='Dell UltraSharp 32" 4K USB-C Hub Monitor', category="Display", serial_number="U3223QE-89211", assigned_to="Marcus Vance", value=899.0, status="in_use", purchase_date=date(2024, 1, 15)),
        Asset(asset_tag="AST-2026-003", name='MacBook Pro 14" M3 Pro', category="Workstation", serial_number="C02GL110MD6S", assigned_to="Elena Rostova", value=2399.0, status="in_use", purchase_date=date(2023, 11, 20)),
        Asset(asset_tag="AST-2026-004", name='Lenovo ThinkPad X1 Carbon Gen 11', category="Workstation", serial_number="PF-49820-X1", assigned_to="David Kim", value=1950.0, status="in_use", purchase_date=date(2024, 2, 5)),
        Asset(asset_tag="AST-2026-005", name="Apple Magic Keyboard & Trackpad Set", category="Peripherals", serial_number="MK-2024-9128", assigned_to="Sophia Martinez", value=299.0, status="in_use", purchase_date=date(2023, 8, 1)),
        Asset(asset_tag="AST-2026-006", name='MacBook Air 15" M3 (Spare Pool)', category="Workstation", serial_number="C02HJ489MD6T", assigned_to=None, value=1499.0, status="available", purchase_date=date(2024, 5, 1)),
    ]
    db.add_all(assets)
    db.commit()

    print("Database seeding completed successfully.")
