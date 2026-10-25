# Nexus Workforce OS — Docker Architecture & Deployment

Nexus Workforce OS provides production-grade containerization with zero-configuration orchestration for both Frontend and Backend services.

---

## 📦 Container Services

| Service | Container Name | Image / Build | Port | Role |
| :--- | :--- | :--- | :--- | :--- |
| **`frontend`** | `nexus-workforce-frontend` | Node 22 Alpine (`./frontend/Dockerfile`) | `5173:5173` | React 19 + TypeScript + Tailwind CSS v4 SPA |
| **`backend`** | `nexus-workforce-backend` | Python 3.11 Slim (`./backend/Dockerfile`) | `8000:8000` | FastAPI High-Performance ASGI REST API |
| **`db`** | `nexus-workforce-db` | `postgres:15-alpine` | `5432` (internal) | PostgreSQL relational data store |

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
3. Automatically executes database seeder (`app.seed.seed_all()`) creating demo users, 5 departments, 8 personnel, attendance punch logs, leaves, payroll slips, ATS candidates, and hardware assets.
4. Launches the ASGI server on `0.0.0.0:8000` via Uvicorn.
