# WorkNest HRMS — Technical Documentation

Welcome to the internal engineering and operational documentation for **WorkNest HRMS**, an enterprise Human Resource Management and Workforce Intelligence platform developed by **WorkNest**

---

## Documentation Index

| Document | Scope & Purpose |
|----------|-----------------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | Distributed architecture, decoupled React SPA + FastAPI API, database schema, and RBAC topology |
| [DIRECTORY_STRUCTURE.md](DIRECTORY_STRUCTURE.md) | High-level repository layout for `frontend/`, `backend/`, container manifests, and environment configs |
| [DOCKER.md](DOCKER.md) | Enterprise orchestration, multi-container deployment, environment configurations, and PostgreSQL scaling |

---

## System Overview

WorkNest HRMS delivers end-to-end personnel, payroll, and organizational operations with complete Indian statutory localization:
- **Core HR & Personnel Records**: Employee lifecycle, organizational departments, Indian identity tags (PAN, UAN), and Role-Based Access Control (RBAC).
- **Dedicated Role Dashboards**: Separate tailored command centers for Super Admins, Department Managers, and Staff Employees.
- **Dedicated Homepage**: Modern corporate landing portal for visitors and employees with one-click role demo access, open careers, and office hubs.
- **Time, Attendance & Bio-Sync**: Real-time punch clocking, IST shifts, and automated work-hour audits.
- **Leave Management & Approval Chains**: Multi-tier statutory quotas (Casual Leave, Privilege Leave, Sick Leave) with direct managerial review.
- **Indian Payroll Engine**: Precise CTC calculation with statutory components (Basic, HRA, Special Allowance, EPF, Professional Tax, TDS) in Indian Rupees (₹).
- **ATS & Recruitment Pipeline**: Job postings, candidate evaluation stages, and hiring workflow.
- **Enterprise Asset Registry**: Hardware inventory management, device allocation serial numbers, and condition tracking.

---

## Deployment & Local Development

### Containerized Environment (Recommended)

```bash
docker compose up -d --build
```
- **WorkNest Web Application Portal**: `http://localhost:5173`
- **FastAPI RESTful Service**: `http://localhost:8000/api`
- **Interactive OpenAPI / Swagger Documentation**: `http://localhost:8000/api/docs`

### Native Local Development

```bash
# Start backend API (Terminal 1)
cd backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload

# Start frontend SPA (Terminal 2)
cd frontend
npm run dev
```

---

## Security & Compliance

WorkNest HRMS enforces strict enterprise-grade security policies:
- Isolated decoupled REST communication via JWT & CORS.
- Database credentials and encryption keys managed via isolated environment configurations.
- Audit logging for administrative actions, salary modifications, and employee credential provisioning.

---

&copy; 2026 WorkNest All Rights Reserved.
