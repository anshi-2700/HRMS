# Nexus Workforce OS — Engineering & Contribution Standards

This document outlines the coding standards, branch conventions, and testing guidelines for engineering teams contributing to **Nexus Workforce OS**.

---

## 🏗️ Architecture Principles

1. **Decoupled Architecture**: All business logic resides in `backend/` and exposes clean REST endpoints via Django Ninja. The presentation layer lives strictly in `frontend/` as a React SPA.
2. **Type Safety & OpenAPI Validation**: All API inputs and outputs must define explicit Pydantic schemas in `backend/config/api.py`.
3. **Responsive & Accessible UI**: All frontend components must support both dark and light modes using the established CSS token design system in `frontend/src/index.css`.
4. **Resilience & Testing**: Critical paths (payroll calculations, attendance records, leave approvals) must have unit test coverage.

---

## 🛠️ Development Workflow

### 1. Branch Strategy
- `main`: Production-ready releases.
- `develop`: Integration branch for sprint features.
- Feature branches: `feature/<module-name>` (e.g., `feature/attendance-biometrics`).
- Bugfix branches: `fix/<issue-name>` (e.g., `fix/payroll-calculation`).

### 2. Code Quality & Formatting
```bash
# Backend linting and formatting
cd backend
flake8
black --check .

# Run test suite
pytest
```

```bash
# Frontend build verification
cd frontend
npm run build
```

---

## 📋 Definition of Done

A task is considered complete when:
- [ ] Backend endpoints include typed schemas and display in Swagger `/api/docs`.
- [ ] Frontend UI integrates cleanly with error handling and toast notifications.
- [ ] New database changes include clean Django migration files.
- [ ] Code builds without errors in both local and Docker container environments.
