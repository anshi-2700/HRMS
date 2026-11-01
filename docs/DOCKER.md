# WorkNest HRMS — Docker Architecture & Deployment

WorkNest HRMS provides production-grade containerization with zero-configuration orchestration for both Frontend and Backend services.

---

## 📦 Container Services

| Service | Container Name | Image / Build | Port | Role |
| :--- | :--- | :--- | :--- | :--- |
| **`frontend`** | `worknest-frontend` | Node 22 Alpine (`./frontend/Dockerfile`) | `5173:5173` | React 19 + TypeScript + Tailwind CSS v4 SPA |
| **`backend`** | `worknest-backend` | Python 3.11 Slim (`./backend/Dockerfile`) | `8000:8000` | FastAPI High-Performance ASGI REST API |
| **`db`** | `worknest-db` | `postgres:15-alpine` | `5432` (internal) | PostgreSQL relational data store |

---

## 🚀 Execution Commands

```bash
# Start all containers in the background:
docker compose up -d

# Rebuild images after dependency changes:
docker compose up -d --build

# View real-time logs:
docker compose logs -f

# Halt all services:
docker compose down
```

---

## ⚡ First-Time Initialization Sequence

When the backend container boots:
1. Connects to PostgreSQL (or SQLite fallback).
2. Automatically generates relational tables via SQLAlchemy ORM.
3. Automatically executes database seeder (`app.seed.seed_database()`) creating demo users, 5 departments, 10 Indian personnel, attendance punch logs, statutory leaves, Indian payroll slips (₹), ATS candidates, and IT hardware assets.
4. Launches the ASGI server on `0.0.0.0:8000` via Uvicorn.
