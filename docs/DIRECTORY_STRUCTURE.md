# Nexus Workforce OS — Directory Structure

This document details the layout and architecture of the Nexus Workforce OS repository.

```
nexus-workforce-os/
├── backend/                       # Python & FastAPI REST API service
│   ├── app/                       # Core application package
│   │   ├── api/                   # Typed REST API endpoints
│   │   │   ├── assets.py          # Corporate hardware inventory & allocation
│   │   │   ├── attendance.py      # Attendance clock-in/out & punch logs
│   │   │   ├── auth.py            # Authentication, JWT sessions & login
│   │   │   ├── dashboard.py       # Aggregated KPIs and live statistics
│   │   │   ├── employees.py       # Staff directory & department filtering
│   │   │   ├── health.py          # Liveness & database status probes
│   │   │   ├── leaves.py          # Leave applications & approval workflows
│   │   │   ├── payroll.py         # Remuneration ledger & payslip records
│   │   │   └── recruitment.py     # Job requisitions & candidate pipeline
│   │   ├── core/                  # Database engine, JWT, config & security
│   │   ├── models/                # SQLAlchemy relational entity models
│   │   ├── schemas/               # Pydantic v2 schemas and request contracts
│   │   ├── main.py                # FastAPI ASGI application & middleware
│   │   └── seed.py                # Database seeder with realistic test data
│   ├── Dockerfile                 # Container build definition (Uvicorn ASGI)
│   └── requirements.txt           # Python dependencies
│
├── frontend/                      # React 19 + TypeScript + Tailwind CSS v4 SPA
│   ├── src/
│   │   ├── components/            # High-fidelity TSX Views & Modals
│   │   │   ├── AddEmployeeModal.tsx
│   │   │   ├── ApplyLeaveModal.tsx
│   │   │   ├── AssetsView.tsx
│   │   │   ├── AttendanceView.tsx
│   │   │   ├── DashboardView.tsx
│   │   │   ├── EmployeesView.tsx
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
├── docker-compose.yml             # Orchestration for Backend, Frontend, Postgres
├── start-all.bat                  # 1-Click launcher using Docker Compose
├── start-local.bat                # 1-Click launcher for local dev
├── start-backend.bat              # Backend standalone launcher (FastAPI)
├── start-frontend.bat             # Frontend standalone launcher (React + TS)
└── stop-all.bat                   # Stop running containers
```
