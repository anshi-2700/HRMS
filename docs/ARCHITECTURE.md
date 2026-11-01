# WorkNest HRMS — Technical Architecture

WorkNest HRMS is an enterprise-grade workforce intelligence platform built on a modern decoupled architecture.

---

## 🏛️ System Overview

The system is split into two primary layers:

### 1. Presentation Layer (`frontend/`)
- **Technology**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Vite.
- **Role**: High-performance Single Page Application (SPA) offering dedicated dashboards for Admin, Manager, and Employee, a dedicated corporate landing page (`HomePage.tsx`), and full management consoles for attendance, workforce directory, leave tracking, Indian payroll, ATS recruiting, and IT assets.
- **API Connection**: Interacts with the backend via typed REST calls with JWT bearer tokens (`worknest_auth_token`) and CORS handling.

### 2. Business Logic & API Layer (`backend/`)
- **Technology**: Python 3.11+, FastAPI (ASGI), SQLAlchemy 2.0 ORM, Pydantic v2 schemas, PostgreSQL / SQLite fallback, Uvicorn ASGI server.
- **Role**: High-throughput REST APIs, JWT Role-Based Access Control (`admin`, `manager`, `employee`, `guest`), transactional persistence, auto database seeding with Indian corporate roster, and automated OpenAPI 3.0 documentation at `/api/docs`.

---

## 📦 Domain Modules

| Domain Module | API Route | Responsibilities |
| :--- | :--- | :--- |
| **Identity & Access** | `/api/auth` | JWT issuance, verification, role-based access control (Admin, Manager, Employee, Guest) |
| **Workforce Directory** | `/api/employees` | Personnel profiles, Indian PAN/UAN, department affiliation, salary, and status tracking |
| **Attendance Clock** | `/api/attendance` | Real-time clock-in/out, punch ledger, work hour computation |
| **Leave Management** | `/api/leaves` | Leave applications, statutory quotas (CL, PL, SL), managerial review workflows |
| **Payroll Ledger** | `/api/payroll` | Indian salary slips (₹), Basic, HRA, EPF, PT, TDS deductions, net disbursements |
| **Talent Acquisition** | `/api/recruitment` | Requisitions, ATS candidate scoring, Indian hiring hub pipeline |
| **Asset Register** | `/api/assets` | Hardware assets, serial identifiers, allocation, and valuation tracking |
| **Executive Metrics** | `/api/dashboard` | Role-tailored KPIs, presence rates, CTC ledger, and operational summaries |

---

## ⚡ Deployment & Orchestration

- **Containerization**: Multi-stage Dockerfiles and Docker Compose orchestration (`docker-compose.yml`).
- **Database**: PostgreSQL with connection pooling in production/container environments; SQLite fallback for instant zero-dependency local development.
- **API Gateway**: Direct CORS-enabled REST communication and reverse proxy compatibility.
