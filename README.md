# WorkNest HRMS

> **Enterprise Workforce Management, Biometric Attendance & Payroll Platform**  
> Tailored for Indian enterprise operations with statutory compliance, role-based access control (RBAC), dedicated homepage, and high-performance asynchronous architecture.
> - **Frontend**: React 19 + TypeScript + Tailwind CSS v4 + Vite
> - **Backend**: Python 3.11+ (FastAPI) + SQLAlchemy 2.0 + Pydantic v2 + PostgreSQL / SQLite

---

## 🌟 Key Capabilities

1. **Dedicated Homepage (`HomePage.tsx`)**:
   - Visitors and signed-out users land directly on a modern corporate homepage featuring 1-click role logins, company metrics, open technical careers, Indian tech centers (Bengaluru HQ, Pune, Hyderabad, Mumbai), and the official Indian gazetted holiday calendar.
2. **Dedicated Role-Based Dashboards (RBAC)**:
   - **Super Admin Dashboard (`AdminDashboard.tsx`)**: Executive command center, headcount breakdown, ₹8.99L monthly CTC payroll ledger, pending approvals queue, and department distribution.
   - **Manager Dashboard (`ManagerDashboard.tsx`)**: Engineering & Technology team operations, shift presence rates, technical leave approvals, and candidate screening.
   - **Employee Dashboard (`EmployeeDashboard.tsx`)**: Personal IST biometric clock-in/out, statutory leave balance counters (CL, PL, SL), printable October 2026 salary slip snapshot, and assigned IT hardware.
3. **Statutory Indian Compliance & Formatting**:
   - All monetary figures in Indian Rupees (`₹`).
   - Indian pay structure: Basic (50%), HRA (25%), Special Allowance (25%), EPF (12% capped at ₹1,800), Professional Tax (`₹200`), and TDS withholding.
   - Authentic Indian identifiers: PAN card numbers and UAN numbers.
4. **Enterprise White & Royal Blue Design System**:
   - Built with crisp enterprise white surfaces (`#ffffff`), corporate royal blue accents (`#2563eb`), high-contrast typography, and accessible data tables.

---

## 🏛️ System Architecture

WorkNest HRMS is built with a decoupled architecture:

```
worknest_hrms/
├── backend/                       # Python & FastAPI High-Performance REST API
│   ├── app/                       # Core Application Package
│   │   ├── api/                   # Typed REST API Routers
│   │   │   ├── auth.py            # JWT Authentication & /auth/me sessions
│   │   │   ├── dashboard.py       # Aggregated executive KPIs & role metrics
│   │   │   ├── employees.py       # Indian personnel directory & CTC profiles
│   │   │   ├── attendance.py      # IST clock-in / clock-out punches & registers
│   │   │   ├── leaves.py          # Casual, Privilege & Sick leave approvals
│   │   │   ├── payroll.py         # Remuneration register, HRA, PF, PT & TDS
│   │   │   ├── recruitment.py     # Tech requisitions & ATS candidate pipeline
│   │   │   ├── assets.py          # IT hardware asset registry & valuation
│   │   │   └── health.py          # Liveness & database status probes
│   │   ├── core/                  # Engine, DB pooling, JWT & RBAC dependencies
│   │   ├── models/                # SQLAlchemy relational entity models
│   │   ├── schemas/               # Pydantic validation contracts
│   │   ├── main.py                # FastAPI ASGI application & middleware
│   │   └── seed.py                # Indian Enterprise demo database seeder
│   ├── .env.example               # PostgreSQL connection string instructions
│   ├── Dockerfile                 # Container definition with Uvicorn ASGI
│   └── requirements.txt           # Python dependencies (FastAPI, SQLAlchemy, Uvicorn)
│
├── frontend/                      # React 19 + TypeScript + Tailwind CSS v4 SPA
│   ├── src/
│   │   ├── components/            # React TSX Views & Modals
│   │   │   ├── HomePage.tsx       # Dedicated corporate portal after logout
│   │   │   ├── dashboards/        # Role-Dedicated Command Centers
│   │   │   │   ├── AdminDashboard.tsx
│   │   │   │   ├── ManagerDashboard.tsx
│   │   │   │   └── EmployeeDashboard.tsx
│   │   │   ├── DashboardView.tsx  # Dynamic role-based dispatcher
│   │   │   ├── EmployeesView.tsx  # Personnel directory with PAN & Indian CTC
│   │   │   ├── AttendanceView.tsx # IST live clock-in/out & presence register
│   │   │   ├── LeavesView.tsx     # CL, PL & SL approval workflows
│   │   │   ├── PayrollView.tsx    # Monthly salary slips & full Indian payslip view
│   │   │   ├── RecruitmentView.tsx# ATS hiring pipeline & open requisitions
│   │   │   ├── AssetsView.tsx     # IT hardware inventory & valuation
│   │   │   ├── Sidebar.tsx        # Responsive navigation sidebar
│   │   │   ├── Topbar.tsx         # Persona switch, search & system health
│   │   │   ├── AddEmployeeModal.tsx
│   │   │   ├── ApplyLeaveModal.tsx
│   │   │   └── LoginModal.tsx     # 1-Click demo persona authentication
│   │   ├── types/                 # Strict TypeScript data models & interfaces
│   │   ├── api.ts                 # Typed API client with auto-JWT handling
│   │   ├── index.css              # Tailwind CSS styling & scrollbars
│   │   ├── App.tsx                # Central reactive state & view routing
│   │   └── main.tsx               # React 19 root entrypoint
│   ├── Dockerfile                 # Node Alpine container definition
│   ├── package.json               # Frontend dependencies & scripts
│   ├── tsconfig.json              # Strict TypeScript compiler options
│   └── vite.config.ts             # Tailwind CSS v4 Vite plugin & /api proxy
│
└── docker-compose.yml             # Orchestrates Frontend, FastAPI Backend, & 
```

---

## 🔑 Demo Access Personas (Authentic Indian Profiles)

You can sign in from the dedicated **HomePage**, click any persona card, or use the top-bar credentials:

| Persona | Role | Username | Password | Access Rights & Experience |
| :--- | :--- | :--- | :--- | :--- |
| **Aarav Sharma** | `admin` | `admin` | `admin` | **Chief People Officer & Super Admin**: Full platform access, employee enrollment, payroll ledger approval, leave authorizations, ATS hiring pipeline. |
| **Priya Iyer** | `manager` | `manager1` | `password@123` | **Engineering Manager**: Department team monitoring, leave approvals, recruitment review. |
| **Vikram Malhotra** | `employee` | `employee1` | `password@123` | **Senior Full-Stack Engineer**: Self-service workspace, personal IST time punch, statutory leave balance cards (CL/PL/SL), full Indian payslip view, assigned hardware. |

---

## 🗄️ Database & PostgreSQL Configuration

The backend is 100% pure **FastAPI + SQLAlchemy 2.0**. It supports both **PostgreSQL** and local **SQLite**:

1. Copy `.env.example` to `.env` in the `backend/` folder:
   ```bash
   cp backend/.env.example backend/.env
   ```
2. Provide your PostgreSQL credentials:
   ```env
   DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database_name>
   ```
   *(Example: `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/worknest_hrms`)*
3. If `DATABASE_URL` is omitted, the backend automatically uses `sqlite:///./hrms.db` for instant local development.

---

## 🚀 How to Run the Platform

### Option 1: Local Development

Execute the following commands in separate terminals:

#### 1. FastAPI Backend:
```bash
cd backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
- **Backend API & Swagger Docs**: [http://localhost:8000/api/docs](http://localhost:8000/api/docs)
- **Health Probe**: [http://localhost:8000/api/health](http://localhost:8000/api/health)

#### 2. React Frontend:
```bash
cd frontend
npm install
npm run dev
```
- **WorkNest Application Portal**: [http://localhost:5173](http://localhost:5173)

---

### Option 2: Docker Compose

```bash
docker compose up -d
```

---

&copy; 2026 WorkNest All Rights Reserved.
#   H R M S  
 #   H R M S  
 