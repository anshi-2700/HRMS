# Nexus Workforce OS — Docker Architecture & Deployment

Nexus Workforce OS provides production-grade containerization with zero-configuration orchestration for both Frontend and Backend services.

---

## 📦 Container Services

| Service | Container Name | Image / Build | Port | Role |
| :--- | :--- | :--- | :--- | :--- |
| **`frontend`** | `nexus-workforce-frontend-1` | Node 22 (`./frontend/Dockerfile`) | `5173:5173` | React 19 + Vite Single Page Application |
| **`backend`** | `nexus-workforce-backend-1` | Python 3.11 (`./backend/compose/local/Dockerfile`) | `8000:8000` | Django Ninja REST API server |
| **`db`** | `nexus-workforce-db-1` | `postgres:15-alpine` | `5432` (internal) | PostgreSQL relational data store |
| **`redis`** | `nexus-workforce-redis-1` | `redis:7-alpine` | `6379:6379` | High-performance cache and Celery broker |

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

When the backend container boots for the first time, [`entrypoint.sh`](../backend/compose/local/entrypoint.sh) executes the following sequence:
1. Performs socket pinging until PostgreSQL is healthy.
2. Applies pending Django database migrations (`python manage.py migrate`).
3. Loads country and state geographic fixtures (`python manage.py loaddata countries states`).
4. Seeds default user roles, company records, and test accounts (`python manage.py seed_demo_data`).
5. Launches the development server on `0.0.0.0:8000`.
