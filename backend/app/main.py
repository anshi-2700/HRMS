from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse

from app.core.config import settings
from app.core.database import engine, Base, SessionLocal
from app.models import entities  # ensure all models register with Base.metadata
from app.seed import seed_database

from app.api.health import router as health_router
from app.api.auth import router as auth_router
from app.api.dashboard import router as dashboard_router
from app.api.employees import router as employees_router
from app.api.attendance import router as attendance_router
from app.api.leaves import router as leaves_router
from app.api.payroll import router as payroll_router
from app.api.recruitment import router as recruitment_router
from app.api.assets import router as assets_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure tables and seed demo data exist
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield
    # Shutdown

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Enterprise Human Capital Management & Workforce Intelligence REST API",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
    lifespan=lifespan,
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers under /api
app.include_router(health_router, prefix=settings.API_V1_STR)
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(dashboard_router, prefix=settings.API_V1_STR)
app.include_router(employees_router, prefix=settings.API_V1_STR)
app.include_router(attendance_router, prefix=settings.API_V1_STR)
app.include_router(leaves_router, prefix=settings.API_V1_STR)
app.include_router(payroll_router, prefix=settings.API_V1_STR)
app.include_router(recruitment_router, prefix=settings.API_V1_STR)
app.include_router(assets_router, prefix=settings.API_V1_STR)

@app.get("/", include_in_schema=False)
def root():
    return RedirectResponse(url=f"{settings.API_V1_STR}/docs")
