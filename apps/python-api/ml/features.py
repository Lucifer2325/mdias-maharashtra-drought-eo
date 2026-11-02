"""Feature engineering for drought risk assessment and ML classification."""

from __future__ import annotations

import math
from datetime import date
from typing import Any

import numpy as np
import pandas as pd

FEATURE_COLUMNS = [
    "ndvi_anomaly",
    "spi_1m",
    "spi_3m",
    "spi_6m",
    "soil_moisture",
    "lst_anomaly",
    "reservoir_fill_pct",
    "gwt_anomaly",
    "month_sin",
    "month_cos",
]


def encode_cyclical_month(month: int) -> tuple[float, float]:
    """Sin/Cos cyclical encoding for months (1-12)."""
    rad = 2 * math.pi * (month - 1) / 12
    return math.sin(rad), math.cos(rad)


def engineer_features(features: dict[str, Any], obs_date: date | None = None) -> np.ndarray:
    """
    Extract and engineer feature vector for ML inference.
    Fills reasonable defaults if values are missing.
    """
    if obs_date is None:
        obs_date = date.today()

    month_sin, month_cos = encode_cyclical_month(obs_date.month)

    vector = [
        float(features.get("ndvi_anomaly", -0.1) or -0.1),
        float(features.get("spi_1m", -0.5) or -0.5),
        float(features.get("spi_3m", -1.0) or -1.0),
        float(features.get("spi_6m", -0.8) or -0.8),
        float(features.get("soil_moisture", 0.22) or 0.22),
        float(features.get("lst_anomaly", 1.0) or 1.0),
        float(features.get("reservoir_fill_pct", 40.0) or 40.0),
        float(features.get("gwt_anomaly", -1.0) or -1.0),
        month_sin,
        month_cos,
    ]
    return np.array(vector, dtype=np.float32).reshape(1, -1)
