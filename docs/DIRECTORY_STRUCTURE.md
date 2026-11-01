# WorkNest HRMS — Directory Structure

This document details the layout and architecture of the WorkNest HRMS repository.

```
worknest-hrms/
├── backend/                       # Python & FastAPI REST API service
│   ├── app/                       # Core application package
│   │   ├── api/                   # Typed REST API endpoints
│   │   │   ├── assets.py          # Corporate hardware inventory & allocation
│   │   │   ├── attendance.py      # Attendance clock-in/out & punch logs
│   │   │   ├── auth.py            # Authentication, JWT sessions & login
│   │   │   ├── dashboard.py       # Aggregated KPIs and live statistics
│   │   │   ├── employees.py       # Staff directory & Indian tax tags
│   │   │   ├── health.py          # Liveness & database status probes
│   │   │   ├── leaves.py          # Leave applications & approval workflows
│   │   │   ├── payroll.py         # Indian remuneration ledger & payslips (₹)
│   │   │   └── recruitment.py     # Job requisitions & candidate pipeline
│   │   ├── core/                  # Database engine, JWT, config & security
│   │   ├── models/                # SQLAlchemy relational entity models
│   │   ├── schemas/               # Pydantic v2 schemas and request contracts
│   │   ├── main.py                # FastAPI ASGI application & middleware
│   │   └── seed.py                # Database seeder with Indian corporate roster
│   ├── Dockerfile                 # Container build definition (Uvicorn ASGI)
│   └── requirements.txt           # Python dependencies
│
├── frontend/                      # React 19 + TypeScript + Tailwind CSS v4 SPA
│   ├── src/
│   │   ├── components/            # High-fidelity TSX Views & Modals
│   │   │   ├── dashboards/        # Role-Dedicated Command Centers (RBAC)
│   │   │   │   ├── AdminDashboard.tsx      # Super Admin executive control
│   │   │   │   ├── ManagerDashboard.tsx    # Department team & approvals
│   │   │   │   └── EmployeeDashboard.tsx   # Personal punch, leaves & salary slip
│   │   │   ├── AddEmployeeModal.tsx
│   │   │   ├── ApplyLeaveModal.tsx
│   │   │   ├── AssetsView.tsx
│   │   │   ├── AttendanceView.tsx
│   │   │   ├── DashboardView.tsx   # Dynamic role dispatcher
│   │   │   ├── EmployeesView.tsx
│   │   │   ├── HomePage.tsx        # Dedicated full-width public corporate portal
│   │   │   ├── LeavesView.tsx
│   │   │   ├── LoginModal.tsx
│   │   │   ├── PayrollView.tsx
│   │   │   ├── RecruitmentView.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Topbar.tsx
│   │   ├── types/                 # Strict TypeScript types & data contracts
│   │   ├── api.ts                 # Typed API client with auto JWT bearer
│   │   ├── index.css              # Tailwind CSS v4 styling & tokens
│   │   ├── App.tsx                # Central reactive state & view routing
│   │   └── main.tsx               # React 19 root entrypoint
│   ├── Dockerfile                 # Node 22 Alpine container definition
│   ├── package.json               # Frontend dependencies & scripts
│   ├── tsconfig.json              # Strict TypeScript compiler options
│   └── vite.config.ts             # Tailwind CSS v4 Vite plugin & /api proxy
│
└── docker-compose.yml             # Orchestration for Backend, Frontend, Postgres
```
