# Nexus Workforce OS — Technical Documentation

Welcome to the internal engineering and operational documentation for **Nexus Workforce OS**, an enterprise Human Capital Management (HCM) and Workforce Intelligence platform developed by **Nexus Global Technologies Inc.**

---

## Documentation Index

| Document | Scope & Purpose |
|----------|-----------------|
| [ARCHITECTURE.md](ARCHITECTURE.md) | Distributed architecture, decoupled React SPA + Django Ninja API, database schema, and microservice topology |
| [DIRECTORY_STRUCTURE.md](DIRECTORY_STRUCTURE.md) | High-level repository layout for `frontend/`, `backend/`, container manifests, and environment configs |
| [DOCKER.md](DOCKER.md) | Enterprise orchestration, multi-container deployment, environment configurations, and production scaling |

---

## System Overview

Nexus Workforce OS delivers end-to-end personnel, payroll, and organizational operations:
- **Core HR & Personnel Records**: Employee lifecycle, organizational charting, role-based access control (RBAC).
- **Time, Attendance & Bio-Sync**: Real-time punch clocking, shift scheduling, automated overtime calculation.
- **Leave Management & Approval Chains**: Multi-tier workflows, policy enforcement, accrual tracking.
- **Enterprise Payroll Engine**: Fixed-point mathematical calculation of gross, net pay, statutory deductions, tax withholding, and pay slips.
- **ATS & Recruitment Pipeline**: Job listings, candidate pipeline tracking, interview scheduling, and automated offer letters.
- **Enterprise Asset Registry**: Hardware inventory management, device allocation tracking, and status monitoring.

---

## Deployment & Local Testing

### Containerized Environment (Recommended)

```bash
docker compose up -d --build
```
- **Web Application Portal**: `http://localhost:5173`
- **RESTful API Service**: `http://localhost:8000/api/`
- **Interactive OpenAPI / Swagger Documentation**: `http://localhost:8000/api/docs`

### Native Local Development

```bash
# Start backend API (Terminal 1)
start-backend.bat

# Start frontend SPA (Terminal 2)
start-frontend.bat
```

Or run `start-local.bat` to launch both development environments simultaneously.

---

## Security & Compliance

Nexus Workforce OS enforces strict enterprise-grade security policies:
- Isolated decoupled REST communication via JWT & CSRF-protected CORS.
- Database credentials and encryption keys managed via isolated environment configurations.
- Audit logging for administrative actions, salary modifications, and employee credential provisioning.

---

&copy; 2026 Nexus Global Technologies Inc. All Rights Reserved. Proprietary and Confidential.
