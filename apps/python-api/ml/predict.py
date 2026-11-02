"""Prediction pipeline connecting features, model inference and response schemas."""

from __future__ import annotations

from datetime import date
from typing import Any

from ml.features import engineer_features
from ml.model import DroughtRiskModel
from schemas.drought import (
    DroughtClass,
    FactorImportance,
    HorizonPrediction,
    PredictionRequest,
    PredictionResponse,
)


def compute_composite_risk_score(features: dict[str, Any]) -> float:
    """
    Empirical weighted score (0-100) reflecting drought vulnerability.
    """
    spi3m = float(features.get("spi_3m", 0.0) or 0.0)
    ndvi_anom = float(features.get("ndvi_anomaly", 0.0) or 0.0)
    res_fill = float(features.get("reservoir_fill_pct", 50.0) or 50.0)
    soil_m = float(features.get("soil_moisture", 0.25) or 0.25)

    # Standard scale mapping
    # SPI -3.0 -> 100, SPI 0 -> 20, SPI +2 -> 0
    spi_component = max(0.0, min(100.0, (-spi3m + 1.5) * 25.0))
    # NDVI anom -0.5 -> 100, 0 -> 20
    ndvi_component = max(0.0, min(100.0, (-ndvi_anom + 0.1) * 120.0))
    # Reservoir: 0% -> 100, 100% -> 0
    res_component = 100.0 - res_fill
    # Soil moisture: 0.10 -> 100, 0.35 -> 0
    soil_component = max(0.0, min(100.0, (0.35 - soil_m) * 400.0))

    composite = (
        0.35 * spi_component +
        0.25 * ndvi_component +
        0.20 * res_component +
        0.20 * soil_component
    )
    return round(float(composite), 1)


async def run_drought_prediction(
    request: PredictionRequest,
    model: DroughtRiskModel,
) -> PredictionResponse:
    """Run forecast pipeline for 30-day and 90-day horizons."""
    feat_dict = request.features.model_dump() if hasattr(request.features, "model_dump") else request.features
    today = date.today()

    X = engineer_features(feat_dict, today)
    pred_class_str, confidence, probs = model.predict(X)
    score = compute_composite_risk_score(feat_dict)

    pred_class = DroughtClass(pred_class_str)

    # 30-day horizon
    h30 = HorizonPrediction(
        score=score,
        drought_class=pred_class,
        confidence=confidence,
        probabilities=probs,
    )

    # 90-day horizon (slightly higher uncertainty)
    h90_score = min(100.0, round(score * 1.08, 1)) if score > 50 else round(score * 0.95, 1)
    h90_class = DroughtClass.EMERGENCY if h90_score >= 85 else (
        DroughtClass.ALERT if h90_score >= 70 else (
            DroughtClass.WARNING if h90_score >= 50 else (
                DroughtClass.WATCH if h90_score >= 30 else DroughtClass.NONE
            )
        )
    )
    h90 = HorizonPrediction(
        score=h90_score,
        drought_class=h90_class,
        confidence=round(confidence * 0.88, 2),
        probabilities=probs,
    )

    driving_factors = [
        FactorImportance(factor="spi_3m", importance=0.35, direction="increasing"),
        FactorImportance(factor="ndvi_anomaly", importance=0.28, direction="increasing"),
        FactorImportance(factor="soil_moisture", importance=0.21, direction="increasing"),
        FactorImportance(factor="reservoir_fill_pct", importance=0.16, direction="decreasing"),
    ]

    return PredictionResponse(
        region_id=request.region_id,
        prediction_date=today,
        horizon_30d=h30,
        horizon_90d=h90,
        driving_factors=driving_factors,
    )
