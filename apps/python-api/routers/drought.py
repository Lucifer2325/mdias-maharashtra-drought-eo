"""Drought monitoring and prediction API router."""

from __future__ import annotations

from datetime import date
from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query, Request

from ml.predict import run_drought_prediction
from schemas.drought import (
    DroughtClass,
    DroughtIndicatorResponse,
    PredictionRequest,
    PredictionResponse,
)

router = APIRouter(prefix="/drought", tags=["drought"])


# District-level mock dataset for Maharashtra
SAMPLE_DATA = {
    "osmanabad": {
        "ndvi": 0.28, "ndvi_anomaly": -0.38, "spi_1m": -1.4, "spi_3m": -1.9,
        "spi_6m": -1.6, "spi_12m": -1.1, "soil_moisture": 0.14, "lst": 39.4,
        "lst_anomaly": 2.4, "reservoir_fill_pct": 22.5, "gwt_anomaly": -2.4,
        "drought_risk_score": 84.5, "drought_class": DroughtClass.ALERT,
    },
    "beed": {
        "ndvi": 0.31, "ndvi_anomaly": -0.32, "spi_1m": -1.2, "spi_3m": -1.7,
        "spi_6m": -1.4, "spi_12m": -0.9, "soil_moisture": 0.16, "lst": 38.6,
        "lst_anomaly": 1.9, "reservoir_fill_pct": 28.0, "gwt_anomaly": -2.1,
        "drought_risk_score": 78.2, "drought_class": DroughtClass.WARNING,
    },
    "latur": {
        "ndvi": 0.34, "ndvi_anomaly": -0.29, "spi_1m": -0.9, "spi_3m": -1.5,
        "spi_6m": -1.3, "spi_12m": -0.8, "soil_moisture": 0.18, "lst": 37.8,
        "lst_anomaly": 1.6, "reservoir_fill_pct": 34.5, "gwt_anomaly": -1.8,
        "drought_risk_score": 72.0, "drought_class": DroughtClass.WARNING,
    },
    "yavatmal": {
        "ndvi": 0.36, "ndvi_anomaly": -0.24, "spi_1m": -0.8, "spi_3m": -1.2,
        "spi_6m": -1.0, "spi_12m": -0.6, "soil_moisture": 0.21, "lst": 36.5,
        "lst_anomaly": 1.2, "reservoir_fill_pct": 41.0, "gwt_anomaly": -1.2,
        "drought_risk_score": 64.0, "drought_class": DroughtClass.WATCH,
    },
}


@router.get("/indicators/{region_id}", response_model=DroughtIndicatorResponse)
async def get_indicators(
    region_id: str,
    obs_date: date | None = None,
) -> DroughtIndicatorResponse:
    """Fetch satellite drought indicators for a specific district/taluka."""
    reg = region_id.lower()
    data = SAMPLE_DATA.get(reg, SAMPLE_DATA["osmanabad"])

    return DroughtIndicatorResponse(
        region_id=region_id,
        date=obs_date or date.today(),
        **data,
    )


@router.get("/current", response_model=List[DroughtIndicatorResponse])
async def get_current_state(
    district_ids: List[str] = Query(default=["osmanabad", "beed", "latur", "yavatmal"]),
) -> List[DroughtIndicatorResponse]:
    """Get current snapshot across multiple regions."""
    results = []
    today = date.today()
    for d_id in district_ids:
        reg = d_id.lower()
        data = SAMPLE_DATA.get(reg, SAMPLE_DATA["osmanabad"])
        results.append(
            DroughtIndicatorResponse(
                region_id=d_id,
                date=today,
                **data,
            )
        )
    return results


@router.post("/predict", response_model=PredictionResponse)
async def predict_drought(
    request: PredictionRequest,
    req_context: Request,
) -> PredictionResponse:
    """Run ML early warning forecast model on submitted indicators."""
    model = getattr(req_context.app.state, "drought_model", None)
    if model is None:
        from ml.model import DroughtRiskModel
        model = DroughtRiskModel()

    return await run_drought_prediction(request, model)
