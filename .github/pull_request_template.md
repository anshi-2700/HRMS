## Summary

<!-- What does this PR do? Link issue: Fixes #123 -->

## Type of change

- [ ] Bug fix
- [ ] New feature
- [ ] Refactor / cleanup
- [ ] Documentation

## Module

- [ ] Authentication & RBAC (`backend/app/api/auth.py`)
- [ ] Attendance & Biometrics (`backend/app/api/attendance.py`)
- [ ] Leave Management (`backend/app/api/leaves.py`)
- [ ] Indian Payroll & Tax (`backend/app/api/payroll.py`)
- [ ] Frontend Portal / Dashboards (`frontend/src/`)
- [ ] Other: ___

## Checklist (Definition of Done)

- [ ] Type checks pass (`npm run build`)
- [ ] Role-based access control (Admin, Manager, Employee) validated
- [ ] Indian compliance standards verified (PAN, UAN, EPF, PT, INR format)
- [ ] Verified locally (`docker compose up` or `./start-local.bat`)

## Verification Steps

```bash
docker compose up --build
```
