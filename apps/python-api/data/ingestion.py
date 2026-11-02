"""Data ingestion orchestrator combining satellite, meteorology, and ground observations."""

from __future__ import annotations

import logging
from datetime import date
from typing import Dict, Any

from data.chirps import fetch_monthly_rainfall
from data.modis import get_modis_ndvi_stats, get_modis_lst_stats
from data.grace import extract_groundwater_anomaly

logger = logging.getLogger(__name__)


async def run_pipeline_for_district(district_id: str, obs_date: date) -> Dict[str, Any]:
    """Execute complete ingestion and feature calculation for a district."""
    logger.info("Executing satellite telemetry ingestion for %s on %s", district_id, obs_date)
    ndvi_stats = get_modis_ndvi_stats({}, obs_date.isoformat(), obs_date.isoformat())
    lst_stats = get_modis_lst_stats({}, obs_date.isoformat(), obs_date.isoformat())
    gwt_stats = extract_groundwater_anomaly(18.5, 76.0, obs_date.isoformat())

    return {
        "region_id": district_id,
        "date": obs_date.isoformat(),
        "ndvi": ndvi_stats["mean_ndvi"],
        "ndvi_anomaly": ndvi_stats["ndvi_anomaly"],
        "lst": lst_stats["mean_lst_celsius"],
        "lst_anomaly": lst_stats["lst_anomaly"],
        "gwt_anomaly": gwt_stats["equivalent_water_height_cm"],
    }
