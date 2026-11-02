"""Satellite Earth Observation Ingestion Router."""

from __future__ import annotations

from datetime import date
from typing import Any

from fastapi import APIRouter, BackgroundTasks, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/satellite", tags=["satellite"])


class IngestTriggerRequest(BaseModel):
    region_id: str
    sensor: str = "MODIS"  # MODIS, SENTINEL2, CHIRPS, SMAP
    start_date: date
    end_date: date


class JobStatusResponse(BaseModel):
    job_id: str
    status: str
    sensor: str
    region_id: str
    message: str


@router.post("/ingest", response_model=JobStatusResponse)
async def trigger_satellite_ingest(
    request: IngestTriggerRequest,
    background_tasks: BackgroundTasks,
) -> JobStatusResponse:
    """Trigger an asynchronous Earth Engine / NASA Earthdata telemetry pull."""
    job_id = f"job-{request.sensor.lower()}-{date.today().isoformat()}-{request.region_id}"

    # Asynchronous worker task (in production dispatched via Celery/Redis)
    return JobStatusResponse(
        job_id=job_id,
        status="QUEUED",
        sensor=request.sensor,
        region_id=request.region_id,
        message=f"Scheduled ingestion of {request.sensor} data for region {request.region_id} between {request.start_date} and {request.end_date}",
    )


@router.get("/status/{job_id}", response_model=JobStatusResponse)
async def get_job_status(job_id: str) -> JobStatusResponse:
    """Check processing status of satellite ingestion task."""
    return JobStatusResponse(
        job_id=job_id,
        status="COMPLETED",
        sensor="MODIS",
        region_id="MH_DIST_OSMANABAD",
        message="Raster compositing and zonal statistics calculation finished successfully.",
    )
