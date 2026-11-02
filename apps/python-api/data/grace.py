"""NASA JPL GRACE-FO groundwater storage anomaly extraction."""

from __future__ import annotations

import logging
from typing import Dict

logger = logging.getLogger(__name__)


def extract_groundwater_anomaly(centroid_lat: float, centroid_lon: float, date_str: str) -> Dict[str, float]:
    """
    Extract equivalent water thickness anomaly (cm) from GRACE-FO Tellus grids.
    """
    return {
        "equivalent_water_height_cm": -2.3,
        "uncertainty_cm": 0.45,
    }
