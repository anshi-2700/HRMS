# Nexus Workforce OS

> **Enterprise Human Resource & Workforce Intelligence Platform**  
> Built with a decoupled high-performance architecture:
> - **Frontend**: React 19 + TypeScript + Tailwind CSS v4 + Vite
> - **Backend**: Python 3.11+ (FastAPI) + SQLAlchemy + Pydantic v2 + SQLite / PostgreSQL

---

## 🏛️ System Architecture

Nexus Workforce OS features a decoupled architecture separating enterprise presentation logic from high-throughput asynchronous backend microservices:

```
nexus-workforce-os/
├── backend/                       # Python & FastAPI High-Performance REST API
│   ├── app/                       # Core Application Package
│   │   ├── api/                   # Typed REST API Routers
│   │   │   ├── auth.py            # Authentication, JWT tokens, & sessions
│   │   │   ├── dashboard.py       # Aggregated executive KPIs & metrics
│   │   │   ├── employees.py       # Employee CRUD & department filtering
│   │   │   ├── attendance.py      # Clock-in / clock-out punches & registers
│   │   │   ├── leaves.py          # Leave applications & approval workflows
│   │   │   ├── payroll.py         # Remuneration ledger & payslip records
│   │   │   ├── recruitment.py     # Requisitions & ATS candidate pipeline
│   │   │   ├── assets.py          # IT hardware asset registry & valuation
│   │   │   └── health.py          # Liveness & database status probes
│   │   ├── core/                  # Engine, DB sessions, JWT, & bcrypt security
│   │   ├── models/                # SQLAlchemy relational entity models
│   │   ├── schemas/               # Pydantic v2 validation contracts
│   │   ├── main.py                # FastAPI ASGI application & middleware
│   │   └── seed.py                # Enterprise demo database seeder
│   ├── Dockerfile                 # Container definition with Uvicorn ASGI
│   └── requirements.txt           # Python dependencies
│
├── frontend/                      # React 19 + TypeScript + Tailwind CSS v4 SPA
│   ├── src/
│   │   ├── components/            # High-fidelity TSX Views & Modals
│   │   │   ├── DashboardView.tsx  # Executive overview & workforce charts
│   │   │   ├── EmployeesView.tsx  # Directory, roster search & filtering
│   │   │   ├── AttendanceView.tsx # Live clock-in/out & punch history
│   │   │   ├── LeavesView.tsx     # Leave approval workflow & ledger
│   │   │   ├── PayrollView.tsx    # Monthly salary slips & disbursements
│   │   │   ├── RecruitmentView.tsx# ATS pipeline stages & open requisitions
│   │   │   ├── AssetsView.tsx     # Hardware inventory & capitalization
│   │   │   ├── Sidebar.tsx        # Responsive navigation sidebar
│   │   │   ├── Topbar.tsx         # User status, persona switch & health
│   │   │   ├── AddEmployeeModal.tsx
│   │   │   ├── ApplyLeaveModal.tsx
│   │   │   └── LoginModal.tsx     # 1-Click demo persona authentication
│   │   ├── types/                 # Strict TypeScript data models & interfaces
│   │   ├── api.ts                 # Typed API client with auto-JWT handling
│   │   ├── index.css              # Tailwind CSS v4 styling & modern scrollbars
│   │   ├── App.tsx                # Central reactive state & view routing
│   │   └── main.tsx               # React 19 root entrypoint
│   ├── Dockerfile                 # Node Alpine container definition
│   ├── package.json               # Frontend dependencies & scripts
│   ├── tsconfig.json              # Strict TypeScript compiler options
│   └── vite.config.ts             # Tailwind CSS v4 Vite plugin & /api proxy
│
├── docker-compose.yml             # Orchestrates Frontend, FastAPI Backend, & PostgreSQL 15
├── start-all.bat                  # 1-Click launcher using Docker Compose
├── start-local.bat                # 1-Click launcher for local dev (separate windows)
├── start-backend.bat              # Dedicated launcher for FastAPI Backend (Port 8000)
├── start-frontend.bat             # Dedicated launcher for React SPA (Port 5173)
└── stop-all.bat                   # 1-Click stopper to halt running containers
```

---

## ✨ Platform Capabilities

- **Executive Analytics Dashboard** — Real-time headcount counters, daily presence ratios, active leaves, salary disbursement metrics, and workforce activity logs.
- **Employee Directory** — Departmental filtering, role hierarchy, contact information, and automatic credential provisioning.
- **Attendance & Time Clock** — Instant clock-in / clock-out tracking with status validation (Present, Half-Day, Absent).
- **Leave Governance Workflow** — Self-service leave applications with 1-click management review (Approve / Reject) and policy allowances.
- **Compensation & Payroll** — Accurate monthly salary disbursement records, allowances, tax deductions, and payslip generation.
- **Recruitment & ATS Pipeline** — Active job requisitions and candidate hiring pipeline tracking (Applied → Screened → Interview → Offered → Hired).
- **Corporate Asset Management** — IT workstation inventory, serial identifiers, custodial allocation, and valuation tracking.
- **Interactive OpenAPI 3.0 Engine** — Automatic typed interactive API documentation and sandbox testing powered by FastAPI at `/api/docs`.

---

## 🚀 How to Run the Platform

### Option 1: Docker Compose (All Services in 1 Command)

Ensure Docker Desktop is running, then run:

```bash
docker compose up -d
```
*(Or double-click **`start-all.bat`**)*

To build and run fresh images:
```bash
docker compose up -d --build
```

To view live container logs:
```bash
docker compose logs -f
```

To stop all services:
```bash
docker compose down
```
*(Or double-click **`stop-all.bat`**)*

---

### Option 2: Running Locally Without Docker (Independent Mode)

Double-click **`start-local.bat`** to start both Backend and Frontend in separate windows simultaneously, or run each individually:

#### 1. Start the Backend API (FastAPI):
```bash
# Windows 1-click launcher:
.\start-backend.bat

# Or manual execution:
cd backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
- **Backend URL**: [http://localhost:8000](http://localhost:8000)
- **Interactive Swagger Docs**: [http://localhost:8000/api/docs](http://localhost:8000/api/docs)
- **OpenAPI Schema**: [http://localhost:8000/api/openapi.json](http://localhost:8000/api/openapi.json)

#### 2. Start the Frontend SPA (React + TypeScript + Tailwind v4):
```bash
# Windows 1-click launcher:
.\start-frontend.bat

# Or manual execution:
cd frontend
npm install
npm run dev
```
- **Frontend URL**: [http://localhost:5173](http://localhost:5173)

---

## 🌐 Application URLs

| Service | Address | Description |
| :--- | :--- | :--- |
| **Frontend Application** | [http://localhost:5173](http://localhost:5173) | Interactive React + TypeScript + Tailwind v4 HRMS Application |
| **Backend REST API** | [http://localhost:8000/api/docs](http://localhost:8000/api/docs) | Interactive Swagger UI API Documentation |
| **API Health Check** | [http://localhost:8000/api/health](http://localhost:8000/api/health) | API Status & Database Health Probe |

---

## 🔑 Demo Access Accounts

Use these accounts to sign in or use the 1-click role buttons inside the Sign In modal:

| Role | Username | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `admin` | Full system administration, approvals, and configurations |
| **Client** | `hrmsclient1` | `password@123` | Client portal, team monitoring, and reporting |
| **Employee** | `employee1` | `password@123` | Self-service attendance punching and leave requests |

---

## 🧪 Testing & Validation

```bash
# Run TypeScript type check
cd frontend
npx tsc --noEmit

# Build frontend production bundle
npm run build
```
