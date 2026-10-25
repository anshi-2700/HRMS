import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Nexus Workforce OS API"
    VERSION: str = "2.5.0"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "nexus-super-secret-key-change-in-production-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # Database: Supports PostgreSQL or fallbacks to SQLite for seamless local dev
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "sqlite:///./nexus.db"
    )

    # CORS origins
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "https://nexushr.io",
    ]

    class Config:
        case_sensitive = True

settings = Settings()
