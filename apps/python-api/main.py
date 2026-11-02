"""
MDIAS Python API – FastAPI application entry point.

Provides geo/ML microservice capabilities for drought monitoring,
satellite data ingestion, watershed analysis, and intervention planning.
"""

from __future__ import annotations

import logging
import time
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI, Request, Response, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from pydantic_settings import BaseSettings, SettingsConfigDict

# ---------------------------------------------------------------------------
# Settings
# ---------------------------------------------------------------------------


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    API_KEY: str = "changeme"
    ENVIRONMENT: str = "development"
    DEBUG: bool = False

    DATABASE_URL: str = "postgresql://mdias_user:mdias_pass@localhost:5432/mdias_db"
    REDIS_URL: str = "redis://localhost:6379/0"

    ALLOWED_ORIGINS: str = "http://localhost:3000"

    GEE_SERVICE_ACCOUNT: str = ""
    GEE_KEY_FILE: str = ""

    AWS_ACCESS_KEY_ID: str = ""
    AWS_SECRET_ACCESS_KEY: str = ""
    AWS_DEFAULT_REGION: str = "ap-south-1"
    S3_BUCKET: str = "mdias-geospatial-data"

    MODEL_PATH: str = "/app/models/drought_risk_v1.json"

    @property
    def allowed_origins_list(self) -> list[str]:
        return [o.strip() for o in self.ALLOWED_ORIGINS.split(",")]


settings = Settings()

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------

logging.basicConfig(
    level=logging.DEBUG if settings.DEBUG else logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
)
logger = logging.getLogger("mdias.api")

# ---------------------------------------------------------------------------
# Lifespan
# ---------------------------------------------------------------------------


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Startup and shutdown event handler."""
    logger.info("MDIAS API starting up (env=%s)", settings.ENVIRONMENT)

    # Attempt GEE initialisation if credentials are configured
    if settings.GEE_SERVICE_ACCOUNT and settings.GEE_KEY_FILE:
        try:
            from data.modis import initialize_gee

            initialize_gee(settings.GEE_SERVICE_ACCOUNT, settings.GEE_KEY_FILE)
            logger.info("Google Earth Engine initialised")
        except Exception as exc:  # noqa: BLE001
            logger.warning("GEE initialisation skipped: %s", exc)

    # Pre-load ML model into memory
    try:
        from ml.model import DroughtRiskModel

        app.state.drought_model = DroughtRiskModel()
        app.state.drought_model.load(settings.MODEL_PATH)
        logger.info("Drought risk model loaded from %s", settings.MODEL_PATH)
    except Exception as exc:  # noqa: BLE001
        logger.warning("Drought model not loaded (will fall back to rule-based): %s", exc)
        app.state.drought_model = None

    yield

    logger.info("MDIAS API shutting down")


# ---------------------------------------------------------------------------
# Application
# ---------------------------------------------------------------------------

app = FastAPI(
    title="MDIAS Geo/ML API",
    description=(
        "Multi-Dimensional Integrated Agri-drought System – Python microservice "
        "providing drought indicators, satellite data ingestion, watershed analysis, "
        "and ML-based risk prediction."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# ---------------------------------------------------------------------------
# Middleware
# ---------------------------------------------------------------------------

app.add_middleware(GZipMiddleware, minimum_size=1000)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API key authentication middleware
EXCLUDED_PATHS = {"/health", "/docs", "/redoc", "/openapi.json"}


@app.middleware("http")
async def api_key_middleware(request: Request, call_next) -> Response:
    """Enforce x-api-key header on all non-exempt routes."""
    if request.url.path in EXCLUDED_PATHS or request.method == "OPTIONS":
        return await call_next(request)

    api_key = request.headers.get("x-api-key")
    if not api_key or api_key != settings.API_KEY:
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"detail": "Invalid or missing API key"},
        )
    return await call_next(request)


@app.middleware("http")
async def request_timing_middleware(request: Request, call_next) -> Response:
    """Add X-Process-Time header to all responses."""
    start = time.perf_counter()
    response = await call_next(request)
    elapsed = time.perf_counter() - start
    response.headers["X-Process-Time"] = f"{elapsed:.4f}s"
    return response


# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------

from routers.drought import router as drought_router  # noqa: E402
from routers.satellite import router as satellite_router  # noqa: E402
from routers.watershed import router as watershed_router  # noqa: E402
from routers.interventions import router as interventions_router  # noqa: E402

app.include_router(drought_router, prefix="/api/v1")
app.include_router(satellite_router, prefix="/api/v1")
app.include_router(watershed_router, prefix="/api/v1")
app.include_router(interventions_router, prefix="/api/v1")

# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------


class HealthResponse(BaseModel):
    status: str
    version: str
    environment: str
    model_loaded: bool


@app.get("/health", response_model=HealthResponse, tags=["system"])
async def health_check(request: Request) -> HealthResponse:
    """Liveness / readiness probe."""
    return HealthResponse(
        status="ok",
        version=app.version,
        environment=settings.ENVIRONMENT,
        model_loaded=getattr(request.app.state, "drought_model", None) is not None,
    )


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.exception("Unhandled exception for %s %s", request.method, request.url)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal server error", "type": type(exc).__name__},
    )
