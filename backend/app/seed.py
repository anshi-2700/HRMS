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

    print("Seeding database with WorkNest HRMS Indian Enterprise demo data...")

    # 1. Departments
    departments = [
        Department(name="Engineering & Technology", code="ENG", description="Core platform architecture, distributed systems & cloud engineering", lead_name="Priya Iyer"),
        Department(name="Product Design & UI/UX", code="PROD", description="Product strategy, customer discovery & design systems", lead_name="Ananya Deshmukh"),
        Department(name="People Operations (HR)", code="HR", description="People partner, performance management, statutory compliance & talent acquisition", lead_name="Aarav Sharma"),
        Department(name="Finance & Accounts", code="FIN", description="Statutory audits, corporate taxation, payroll disbursement & FP&A", lead_name="Rajesh Varma"),
        Department(name="Enterprise Client Partnerships", code="SALES", description="Strategic enterprise growth & key client management", lead_name="Kavita Reddy"),
    ]
    db.add_all(departments)
    db.commit()

    # 2. Employees (Indian Corporate Roster - WorkNest)
    emp_data = [
        ("WN-IND-1001", "Aarav", "Sharma", "aarav.sharma@worknest.in", "+91 98201 44101", "People Operations (HR)", "Chief People Officer & HR Director", "Bengaluru (HQ)", 2800000.0, "AABCS1234F", "100982341001", date(2022, 4, 10), "active"),
        ("WN-IND-1002", "Priya", "Iyer", "priya.iyer@worknest.in", "+91 98450 12345", "Engineering & Technology", "Engineering Manager & Tech Lead", "Bengaluru (HQ)", 3200000.0, "BXYPI5678K", "100982341002", date(2022, 8, 15), "active"),
        ("WN-IND-1003", "Vikram", "Malhotra", "vikram.malhotra@worknest.in", "+91 98112 34567", "Engineering & Technology", "Senior Full-Stack Engineer", "Pune Technology Center", 2200000.0, "CLKVM9012M", "100982341003", date(2023, 2, 1), "active"),
        ("WN-IND-1004", "Ananya", "Deshmukh", "ananya.deshmukh@worknest.in", "+91 97654 89012", "Product Design & UI/UX", "Lead Product Designer", "Mumbai Corporate Office", 2000000.0, "DEPAD3456N", "100982341004", date(2023, 5, 10), "active"),
        ("WN-IND-1005", "Rohan", "Kulkarni", "rohan.kulkarni@worknest.in", "+91 99203 45678", "Engineering & Technology", "Senior DevOps & Cloud Architect", "Hyderabad Hub", 2400000.0, "EFGRK7890P", "100982341005", date(2023, 7, 20), "active"),
        ("WN-IND-1006", "Neha", "Sundaram", "neha.sundaram@worknest.in", "+91 94441 23890", "People Operations (HR)", "Lead Talent Acquisition Specialist", "Bengaluru (HQ)", 1400000.0, "GHINS1234Q", "100982341006", date(2023, 10, 5), "active"),
        ("WN-IND-1007", "Rajesh", "Varma", "rajesh.varma@worknest.in", "+91 98210 98765", "Finance & Accounts", "Finance & Tax Controller", "Mumbai Corporate Office", 2600000.0, "HIJRV5678R", "100982341007", date(2022, 11, 1), "active"),
        ("WN-IND-1008", "Kavita", "Reddy", "kavita.reddy@worknest.in", "+91 98490 65432", "Enterprise Client Partnerships", "Director of Enterprise Sales", "Hyderabad Hub", 2500000.0, "IJKKR9012S", "100982341008", date(2023, 1, 15), "active"),
        ("WN-IND-1009", "Arjun", "Nair", "arjun.nair@worknest.in", "+91 97412 11223", "Engineering & Technology", "Backend Python & FastAPI Specialist", "Bengaluru (HQ)", 1650000.0, "JKLNA3456T", "100982341009", date(2024, 1, 10), "active"),
        ("WN-IND-1010", "Meera", "Joshi", "meera.joshi@worknest.in", "+91 98860 33445", "Product Design & UI/UX", "Product Operations Specialist", "Pune Technology Center", 1500000.0, "KLMMJ7890U", "100982341010", date(2024, 3, 1), "on_leave"),
    ]

    employees = []
    for code, fn, ln, email, phone, dept, desig, loc, sal, pan, uan, doj, status in emp_data:
        emp = Employee(
            employee_id=code,
            first_name=fn,
            last_name=ln,
            email=email,
            phone=phone,
            department=dept,
            designation=desig,
            location=loc,
            salary=sal,
            pan_number=pan,
            uan_number=uan,
            date_of_joining=doj,
            status=status
        )
        employees.append(emp)
    db.add_all(employees)
    db.commit()

    # Map created employee IDs
    emp_map = {e.employee_id: e.id for e in db.query(Employee).all()}

    # 3. Users with Roles (Admin, Manager, Employee)
    users = [
        User(
            username="admin",
            email="aarav.sharma@worknest.in",
            full_name="Aarav Sharma",
            hashed_password=get_password_hash("admin"),
            role="admin",
            is_active=True,
            employee_id=emp_map["WN-IND-1001"]
        ),
        User(
            username="manager1",
            email="priya.iyer@worknest.in",
            full_name="Priya Iyer",
            hashed_password=get_password_hash("password@123"),
            role="manager",
            is_active=True,
            employee_id=emp_map["WN-IND-1002"]
        ),
        User(
            username="employee1",
            email="vikram.malhotra@worknest.in",
            full_name="Vikram Malhotra",
            hashed_password=get_password_hash("password@123"),
            role="employee",
            is_active=True,
            employee_id=emp_map["WN-IND-1003"]
        ),
    ]
    db.add_all(users)
    db.commit()

    # 4. Attendance (Today's Presence & Time Punches)
    today = date.today()
    attendances = [
        Attendance(employee_id=emp_map["WN-IND-1001"], date=today, punch_in="08:50 AM", punch_out="05:30 PM", work_hours=8.5, status="present"),
        Attendance(employee_id=emp_map["WN-IND-1002"], date=today, punch_in="09:05 AM", punch_out="05:15 PM", work_hours=8.2, status="present"),
        Attendance(employee_id=emp_map["WN-IND-1003"], date=today, punch_in="09:15 AM", punch_out=None, work_hours=5.0, status="present"),
        Attendance(employee_id=emp_map["WN-IND-1004"], date=today, punch_in="09:10 AM", punch_out="05:45 PM", work_hours=8.5, status="present"),
        Attendance(employee_id=emp_map["WN-IND-1005"], date=today, punch_in="08:45 AM", punch_out=None, work_hours=5.5, status="present"),
        Attendance(employee_id=emp_map["WN-IND-1006"], date=today, punch_in="09:25 AM", punch_out="05:30 PM", work_hours=8.0, status="present"),
        Attendance(employee_id=emp_map["WN-IND-1007"], date=today, punch_in="09:00 AM", punch_out="05:00 PM", work_hours=8.0, status="present"),
        Attendance(employee_id=emp_map["WN-IND-1008"], date=today, punch_in="09:30 AM", punch_out=None, work_hours=4.5, status="present"),
        Attendance(employee_id=emp_map["WN-IND-1009"], date=today, punch_in="09:15 AM", punch_out="01:30 PM", work_hours=4.2, status="half_day"),
        Attendance(employee_id=emp_map["WN-IND-1010"], date=today, punch_in=None, punch_out=None, work_hours=0.0, status="absent"),
    ]
    db.add_all(attendances)
    db.commit()

    # 5. Leaves (Indian Statutory Categories: Casual Leave, Privilege Leave, Sick Leave)
    leaves = [
        Leave(
            employee_id=emp_map["WN-IND-1010"],
            leave_type="Privilege Leave",
            start_date=today - timedelta(days=1),
            end_date=today + timedelta(days=3),
            days=4,
            reason="Family event and personal travel to Jaipur",
            status="approved",
            applied_on=today - timedelta(days=6),
            reviewed_by="Aarav Sharma"
        ),
        Leave(
            employee_id=emp_map["WN-IND-1003"],
            leave_type="Casual Leave",
            start_date=today + timedelta(days=4),
            end_date=today + timedelta(days=5),
            days=2,
            reason="Home maintenance and vehicle registration in Pune",
            status="pending",
            applied_on=today - timedelta(days=1),
            reviewed_by=None
        ),
        Leave(
            employee_id=emp_map["WN-IND-1004"],
            leave_type="Sick Leave",
            start_date=today + timedelta(days=7),
            end_date=today + timedelta(days=8),
            days=2,
            reason="Dental surgical procedure and recovery",
            status="pending",
            applied_on=today,
            reviewed_by=None
        ),
        Leave(
            employee_id=emp_map["WN-IND-1005"],
            leave_type="Privilege Leave",
            start_date=today - timedelta(days=18),
            end_date=today - timedelta(days=15),
            days=4,
            reason="Annual vacation with family in Kerala",
            status="approved",
            applied_on=today - timedelta(days=25),
            reviewed_by="Priya Iyer"
        ),
        Leave(
            employee_id=emp_map["WN-IND-1009"],
            leave_type="Casual Leave",
            start_date=today - timedelta(days=10),
            end_date=today - timedelta(days=10),
            days=1,
            reason="Passport renewal appointment",
            status="approved",
            applied_on=today - timedelta(days=14),
            reviewed_by="Priya Iyer"
        ),
    ]
    db.add_all(leaves)
    db.commit()

    # 6. Payroll (Realistic Indian CTC & Monthly Payslip Structure in ₹ INR)
    payrolls = [
        Payroll(
            employee_id=emp_map["WN-IND-1001"],
            month="October",
            year=2026,
            basic_salary=116667.0,
            hra=46667.0,
            special_allowance=70000.0,
            allowances=116667.0,
            pf_deduction=3600.0,
            pt_deduction=200.0,
            tds_deduction=29500.0,
            deductions=33300.0,
            net_salary=200034.0,
            status="paid",
            payment_date=today - timedelta(days=7),
        ),
        Payroll(
            employee_id=emp_map["WN-IND-1002"],
            month="October",
            year=2026,
            basic_salary=133333.0,
            hra=53333.0,
            special_allowance=80000.0,
            allowances=133333.0,
            pf_deduction=3600.0,
            pt_deduction=200.0,
            tds_deduction=37200.0,
            deductions=41000.0,
            net_salary=225666.0,
            status="paid",
            payment_date=today - timedelta(days=7),
        ),
        Payroll(
            employee_id=emp_map["WN-IND-1003"],
            month="October",
            year=2026,
            basic_salary=91667.0,
            hra=36667.0,
            special_allowance=55000.0,
            allowances=91667.0,
            pf_deduction=3600.0,
            pt_deduction=200.0,
            tds_deduction=21800.0,
            deductions=25600.0,
            net_salary=157734.0,
            status="paid",
            payment_date=today - timedelta(days=7),
        ),
        Payroll(
            employee_id=emp_map["WN-IND-1004"],
            month="October",
            year=2026,
            basic_salary=83333.0,
            hra=33333.0,
            special_allowance=50000.0,
            allowances=83333.0,
            pf_deduction=3600.0,
            pt_deduction=200.0,
            tds_deduction=18200.0,
            deductions=22000.0,
            net_salary=144666.0,
            status="paid",
            payment_date=today - timedelta(days=7),
        ),
        Payroll(
            employee_id=emp_map["WN-IND-1005"],
            month="October",
            year=2026,
            basic_salary=100000.0,
            hra=40000.0,
            special_allowance=60000.0,
            allowances=100000.0,
            pf_deduction=3600.0,
            pt_deduction=200.0,
            tds_deduction=24500.0,
            deductions=28300.0,
            net_salary=171700.0,
            status="paid",
            payment_date=today - timedelta(days=7),
        ),
    ]
    db.add_all(payrolls)
    db.commit()

    # 7. Jobs & Candidates (Indian Tech Hubs & Roles)
    jobs = [
        Job(
            title="Senior React & TypeScript Architect",
            department="Engineering & Technology",
            location="Bengaluru (Hybrid)",
            job_type="Full Time",
            experience_level="5-8 Years",
            description="Leading front-end platform architecture, enterprise design system governance, and high-performance SPA design.",
            vacancies=2,
            status="active",
            posted_date=today - timedelta(days=12),
        ),
        Job(
            title="Staff FastAPI & Python Distributed Systems Engineer",
            department="Engineering & Technology",
            location="Hyderabad (Hybrid / Remote)",
            job_type="Full Time",
            experience_level="6-10 Years",
            description="Architecting high-concurrency asynchronous microservices, PostgreSQL query performance optimization, and OpenAPI spec contracts.",
            vacancies=1,
            status="active",
            posted_date=today - timedelta(days=8),
        ),
        Job(
            title="Lead Product Designer (B2B SaaS)",
            department="Product Design & UI/UX",
            location="Pune Technology Center",
            job_type="Full Time",
            experience_level="4-7 Years",
            description="Spearheading user research, complex workflow simplification, and design system scaling across web and mobile surfaces.",
            vacancies=1,
            status="active",
            posted_date=today - timedelta(days=15),
        ),
    ]
    db.add_all(jobs)
    db.commit()

    job_records = db.query(Job).all()
    candidates = [
        Candidate(
            job_id=job_records[0].id,
            full_name="Siddharth Verma",
            email="siddharth.verma@example.com",
            phone="+91 98234 11001",
            current_company="Flipkart Tech",
            experience_years=6.5,
            stage="interview",
            rating=4.8,
            applied_date=today - timedelta(days=5)
        ),
        Candidate(
            job_id=job_records[0].id,
            full_name="Divya Menon",
            email="divya.menon@example.com",
            phone="+91 97412 88202",
            current_company="Swiggy Platform",
            experience_years=5.0,
            stage="offered",
            rating=4.9,
            applied_date=today - timedelta(days=9)
        ),
        Candidate(
            job_id=job_records[1].id,
            full_name="Karthik Venkatraman",
            email="karthik.v@example.com",
            phone="+91 98450 77303",
            current_company="Razorpay Core",
            experience_years=7.0,
            stage="interview",
            rating=4.7,
            applied_date=today - timedelta(days=3)
        ),
        Candidate(
            job_id=job_records[1].id,
            full_name="Pooja Hegde",
            email="pooja.hegde@example.com",
            phone="+91 99160 55404",
            current_company="Freshworks",
            experience_years=6.0,
            stage="screened",
            rating=4.6,
            applied_date=today - timedelta(days=6)
        ),
        Candidate(
            job_id=job_records[2].id,
            full_name="Ritu Agarwal",
            email="ritu.agarwal@example.com",
            phone="+91 98300 44505",
            current_company="Zoho Corp",
            experience_years=4.5,
            stage="applied",
            rating=4.4,
            applied_date=today - timedelta(days=2)
        ),
    ]
    db.add_all(candidates)
    db.commit()

    # 8. Assets (Corporate IT Hardware Inventory with INR Values)
    assets = [
        Asset(
            asset_tag="WN-AST-0101",
            name='Apple MacBook Pro 16" M3 Max (36GB RAM / 1TB SSD)',
            category="Workstation",
            serial_number="C02FX932MD6R",
            assigned_to="Vikram Malhotra",
            value=319900.0,
            status="in_use",
            purchase_date=date(2024, 1, 10)
        ),
        Asset(
            asset_tag="WN-AST-0102",
            name='Dell UltraSharp 32" 4K USB-C Hub Monitor (U3223QE)',
            category="Display",
            serial_number="U3223QE-89211",
            assigned_to="Vikram Malhotra",
            value=78500.0,
            status="in_use",
            purchase_date=date(2024, 1, 15)
        ),
        Asset(
            asset_tag="WN-AST-0103",
            name='Apple MacBook Pro 14" M3 Pro (18GB RAM / 512GB SSD)',
            category="Workstation",
            serial_number="C02GL110MD6S",
            assigned_to="Ananya Deshmukh",
            value=199900.0,
            status="in_use",
            purchase_date=date(2023, 11, 20)
        ),
        Asset(
            asset_tag="WN-AST-0104",
            name='Lenovo ThinkPad X1 Carbon Gen 11 (Intel i7, 32GB RAM)',
            category="Workstation",
            serial_number="PF-49820-X1",
            assigned_to="Rohan Kulkarni",
            value=175000.0,
            status="in_use",
            purchase_date=date(2024, 2, 5)
        ),
        Asset(
            asset_tag="WN-AST-0105",
            name='Apple MacBook Air 15" M3 (Spare Inventory)',
            category="Workstation",
            serial_number="C02HJ489MD6T",
            assigned_to=None,
            value=134900.0,
            status="available",
            purchase_date=date(2024, 5, 1)
        ),
        Asset(
            asset_tag="WN-AST-0106",
            name='Apple Magic Keyboard with Touch ID & Magic Trackpad',
            category="Peripherals",
            serial_number="MK-2024-9128",
            assigned_to="Priya Iyer",
            value=24900.0,
            status="in_use",
            purchase_date=date(2023, 8, 1)
        ),
    ]
    db.add_all(assets)
    db.commit()

    print("WorkNest HRMS Indian Enterprise database seeding completed successfully.")
