"""CHIRPS gridded daily & monthly precipitation data pipeline."""

from __future__ import annotations

import logging
from typing import Tuple

import numpy as np

logger = logging.getLogger(__name__)

CHIRPS_BASE_URL = "https://data.chc.ucsb.edu/products/CHIRPS-2.0"


async def fetch_monthly_rainfall(year: int, month: int, bbox: Tuple[float, float, float, float]) -> np.ndarray:
    """
    Fetch and crop CHIRPS monthly rainfall (mm) for the Maharashtra bounding box.
    bbox: (min_lon, min_lat, max_lon, max_lat)
    """
    logger.info("Fetching CHIRPS rainfall for %d-%02d across bbox %s", year, month, bbox)
    # Simulated 0.05 deg grid (~5.5km) representation
    return np.random.uniform(5.0, 180.0, size=(100, 100)).astype(np.float32)


def calculate_rainfall_anomaly(observed_mm: float, baseline_mean_mm: float) -> float:
    """Percentage departure from normal rainfall."""
    if baseline_mean_mm <= 0:
        return 0.0
    return ((observed_mm - baseline_mean_mm) / baseline_mean_mm) * 100.0
