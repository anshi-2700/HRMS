# Nexus Workforce OS

> **Enterprise Human Resource & Workforce Intelligence Platform**  
> Built with a decoupled architecture featuring a modern **React SPA frontend** and a high-performance **Django Ninja REST API backend**.

---

## 🏛️ System Architecture

Nexus Workforce OS is engineered with a strict decoupling of the presentation layer from the core business logic and persistence layer:

```
nexus-workforce-os/
├── backend/                       # Python & Django Ninja High-Performance REST API
│   ├── apps/                      # Modular Domain Services
│   │   ├── employee/              # Employee profiles, departments, designations
│   │   ├── attendance/            # Attendance register & punch logs
│   │   ├── leave_tracker/         # Leave policies, balances, & approval workflows
│   │   ├── payroll/               # Fixed-point compensation & salary generation
│   │   ├── job/ & candidate/      # Recruitment, requisitions, & ATS hiring stages
│   │   ├── asset/                 # Corporate hardware inventory & depreciation
│   │   └── user/ & main/          # Access control, multi-company isolation
│   ├── config/
│   │   ├── api.py                 # Django Ninja typed REST API & OpenAPI router
│   │   └── settings/              # Environment configurations (CORS, CSRF, Database)
│   ├── compose/                   # Production & local Dockerfile definitions
│   └── manage.py
│
├── frontend/                      # Modern React + Vite Single Page Application (SPA)
│   ├── src/
│   │   ├── components/            # UI Views (Dashboard, Attendance, Directory, Leaves, etc.)
│   │   ├── api.js                 # Unified REST client with session & cookie management
│   │   ├── index.css              # Custom design system (Dark/Light mode, tokens, animations)
│   │   └── App.jsx                # Main orchestration & reactive state management
│   ├── package.json
│   └── vite.config.js             # Development server with /api proxy
│
├── docker-compose.yml             # Orchestrates Frontend, Backend, PostgreSQL 15, & Redis 7
├── start-all.bat                  # 1-Click launcher using Docker Compose
├── start-local.bat                # 1-Click launcher for local dev (two separate windows)
├── start-backend.bat              # Dedicated launcher for Backend API (Port 8000)
├── start-frontend.bat             # Dedicated launcher for React SPA (Port 5173)
└── stop-all.bat                   # 1-Click stopper to halt all running containers
```

---

## ✨ Platform Capabilities

- **Executive Analytics Dashboard** — Real-time headcount counters, daily presence ratio, on-leave metrics, and workforce activity logs.
- **Employee Directory** — Departmental filtering, role hierarchy, contact information, and automated credential creation.
- **Attendance & Time Clock** — Instant clock-in / clock-out tracking with status validation (Present, Half-Day, Absent).
- **Leave Approval Workflow** — Self-service leave applications with 1-click management review (Approve / Reject) and policy allowances.
- **Compensation & Payroll** — Accurate salary disbursement records, fixed-point calculation, and payslip generation.
- **Recruitment & Applicant Pipeline** — Active job requisitions and candidate hiring pipeline tracking (Applicant → Interview → Offer → Hired).
- **Corporate Asset Management** — Equipment valuation, serial tracking, purchase logs, and automatic useful-life depreciation calculations.
- **Interactive OpenAPI Engine** — Automatic typed documentation and sandbox testing powered by Django Ninja at `/api/docs`.

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

#### 1. Start the Backend API:
```bash
# Windows 1-click launcher:
.\start-backend.bat

# Or manual execution:
cd backend
..\venv\Scripts\activate
pip install -r requirements/local.txt
python manage.py migrate
python manage.py seed_demo_data
python manage.py runserver 0.0.0.0:8000
```
- **Backend URL**: [http://localhost:8000](http://localhost:8000)
- **Interactive Swagger Docs**: [http://localhost:8000/api/docs](http://localhost:8000/api/docs)
- **Django Admin**: [http://localhost:8000/admin/](http://localhost:8000/admin/)

#### 2. Start the Frontend SPA:
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
| **Frontend Application** | [http://localhost:5173](http://localhost:5173) | Interactive React HRMS Dashboard, Attendance, Leaves, & Employees |
| **Backend REST API** | [http://localhost:8000/api/docs](http://localhost:8000/api/docs) | Interactive OpenAPI Swagger API Documentation |
| **API Health Check** | [http://localhost:8000/api/health](http://localhost:8000/api/health) | API Status & Verification Endpoint |
| **Superuser Admin** | [http://localhost:8000/admin/](http://localhost:8000/admin/) | Django Superuser Admin Dashboard |

---

## 🔑 Demo Access Accounts

Use these accounts to sign in or use the 1-click role switcher inside the frontend header:

| Role | Username | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `admin` | Full system administration, approvals, and configurations |
| **Client** | `hrmsclient1` | `password@123` | Client portal, team monitoring, and reporting |
| **Employee** | `employee1` | `password@123` | Self-service attendance punching and leave requests |

---

## 🧪 Testing & Validation

```bash
# Run backend test suite
cd backend
pytest

# Build frontend production bundle
cd frontend
npm run build
```
