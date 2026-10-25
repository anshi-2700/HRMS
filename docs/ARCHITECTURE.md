# Nexus Workforce OS — Technical Architecture

Nexus Workforce OS is an enterprise-grade workforce intelligence platform built on a modern decoupled architecture.

---

## 🏛️ System Overview

The system is split into two primary layers:

### 1. Presentation Layer (`frontend/`)
- **Technology**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Vite.
- **Role**: High-performance Single Page Application (SPA) offering responsive experiences for attendance, workforce analytics, leave tracking, payroll registers, ATS recruiting pipelines, and hardware assets.
- **API Connection**: Interacts with the backend via typed REST calls with JWT bearer tokens and reverse proxy mapping.

### 2. Business Logic & API Layer (`backend/`)
- **Technology**: Python 3.11+, FastAPI (ASGI), SQLAlchemy 2.0 ORM, Pydantic v2 schemas, PostgreSQL 15 / SQLite, Uvicorn ASGI server.
- **Role**: High-throughput asynchronous REST APIs, RBAC authorization, transactional persistence, auto database seeding, and automated OpenAPI 3.0 documentation at `/api/docs`.

---

## 📦 Domain Modules

| Domain Module | API Route | Responsibilities |
| :--- | :--- | :--- |
| **Identity & Access** | `/api/auth` | JWT issuance, verification, role-based access control (Admin, Client, Employee) |
| **Workforce Directory** | `/api/employees` | Personnel profiles, department affiliation, salary, and status tracking |
| **Attendance Clock** | `/api/attendance` | Real-time clock-in/out, punch ledger, work hour computation |
| **Leave Management** | `/api/leaves` | Leave applications, multi-category quotas, approval/rejection workflows |
| **Payroll Ledger** | `/api/payroll` | Salary slips, allowances, deductions, net remuneration disbursements |
| **Talent Acquisition** | `/api/recruitment` | Requisitions, ATS candidate scoring, hiring pipeline stages |
| **Asset Register** | `/api/assets` | Hardware assets, serial identifiers, allocation, and valuation tracking |
| **Executive Metrics** | `/api/dashboard` | Aggregated executive KPIs, presence rates, and operational summary |

---

## ⚡ Deployment & Orchestration

- **Containerization**: Multi-stage Dockerfiles and Docker Compose orchestration.
- **Database**: PostgreSQL with connection pooling in container environments; SQLite file database for lightweight local development.
- **API Gateway**: Reverse proxy integration via Vite in development, Nginx in production.
