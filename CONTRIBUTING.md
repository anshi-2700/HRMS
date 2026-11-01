# WorkNest HRMS — Engineering Standards

This document outlines the coding standards and guidelines for engineering teams contributing to **WorkNest HRMS**.

---

## 🏗️ Architecture Principles

1. **Decoupled Architecture**: All business logic resides in `backend/` and exposes clean REST endpoints via **FastAPI**. The presentation layer lives strictly in `frontend/` as a **React 19 + TypeScript + Tailwind CSS v4** Single Page Application.
2. **Type Safety & OpenAPI Validation**: All API inputs and outputs must define explicit Pydantic v2 schemas in `backend/app/schemas/entities.py`.
3. **Role-Based Access Control (RBAC)**: All sensitive routes must enforce JWT authentication (`require_current_user`) and role-based permissions (`require_roles`).
4. **Indian Statutory Compliance**: Payroll logic must strictly account for Basic, HRA, Special Allowance, Employee Provident Fund (EPF), Professional Tax (PT ₹200), and TDS withholding.
5. **Resilience & Reliability**: Critical business operations (payroll calculations, biometric attendance punches, leave authorizations) must have verified error handling and database rollback protection.

---

## 🛠️ Verification & Quality Checks

```bash
# Backend verification
cd backend
python -c "from app.main import app; print('WorkNest FastAPI Loaded')"

# Frontend build & typecheck
cd frontend
npm run build
npx tsc -p tsconfig.json --noEmit
```

---

## 📋 Definition of Done

A task is considered complete when:
- [ ] Backend endpoints include typed Pydantic contracts and render cleanly in Swagger at `/api/docs`.
- [ ] Frontend UI integrates responsive error handling, toasts, and role-appropriate displays.
- [ ] Code builds without errors in both local and Docker container environments.
