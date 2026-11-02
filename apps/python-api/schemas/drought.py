"""Pydantic schemas for drought indicators and ML predictions."""

from __future__ import annotations

from datetime import date
from enum import Enum

from pydantic import BaseModel, Field, field_validator


class DroughtClass(str, Enum):
    NONE = "NONE"
    WATCH = "WATCH"
    WARNING = "WARNING"
    ALERT = "ALERT"
    EMERGENCY = "EMERGENCY"


# SPI threshold → DroughtClass mapping (for reference)
SPI_TO_CLASS: dict[str, DroughtClass] = {
    "≥ -0.5":  DroughtClass.NONE,
    "-0.5 to -1.0": DroughtClass.WATCH,
    "-1.0 to -1.5": DroughtClass.WARNING,
    "-1.5 to -2.0": DroughtClass.ALERT,
    "< -2.0":  DroughtClass.EMERGENCY,
}


class DroughtIndicatorResponse(BaseModel):
    """Composite drought indicator snapshot for a region at a point in time."""

    region_id: str = Field(..., description="Administrative or custom region identifier")
    date: date = Field(..., description="Observation date (YYYY-MM-DD)")

    # Vegetation
    ndvi: float | None = Field(None, ge=-1, le=1, description="MODIS NDVI (−1 to 1)")
    ndvi_anomaly: float | None = Field(None, description="NDVI Z-score vs long-term mean")

    # Precipitation
    spi_1m: float | None = Field(None, description="Standardized Precipitation Index – 1-month")
    spi_3m: float | None = Field(None, description="Standardized Precipitation Index – 3-month")
    spi_6m: float | None = Field(None, description="Standardized Precipitation Index – 6-month")
    spi_12m: float | None = Field(None, description="Standardized Precipitation Index – 12-month")

    # Soil & thermal
    soil_moisture: float | None = Field(None, description="Volumetric soil moisture (m³/m³)")
    lst: float | None = Field(None, description="Land Surface Temperature (°C)")
    lst_anomaly: float | None = Field(None, description="LST Z-score vs long-term mean")

    # Water storage
    reservoir_fill_pct: float | None = Field(None, ge=0, le=100, description="Reservoir fill % (0-100)")
    gwt_anomaly: float | None = Field(None, description="Groundwater table anomaly (m, GRACE-derived)")

    # Derived
    drought_risk_score: float | None = Field(None, ge=0, le=100, description="Composite risk score (0-100)")
    drought_class: DroughtClass = Field(..., description="Drought severity class")

    class Config:
        json_schema_extra = {
            "example": {
                "region_id": "MH_DIST_001",
                "date": "2024-06-01",
                "ndvi": 0.32,
                "ndvi_anomaly": -1.4,
                "spi_1m": -0.8,
                "spi_3m": -1.6,
                "spi_6m": -1.9,
                "spi_12m": -1.2,
                "soil_moisture": 0.18,
                "lst": 38.5,
                "lst_anomaly": 2.1,
                "reservoir_fill_pct": 24.0,
                "gwt_anomaly": -0.8,
                "drought_risk_score": 67.3,
                "drought_class": "ALERT",
            }
        }


class FactorImportance(BaseModel):
    """Individual feature contribution to a prediction."""

    factor: str = Field(..., description="Feature name")
    importance: float = Field(..., description="SHAP / model importance score")
    direction: str = Field(..., description="'increasing' or 'decreasing' drought risk")


class HorizonPrediction(BaseModel):
    """Single forecast horizon output."""

    score: float = Field(..., ge=0, le=100, description="Drought risk score (0-100)")
    drought_class: DroughtClass
    confidence: float = Field(..., ge=0, le=1, description="Model confidence (0-1)")
    probabilities: dict[str, float] = Field(
        default_factory=dict,
        description="Per-class probability {NONE, WATCH, WARNING, ALERT, EMERGENCY}",
    )


class PredictionRequest(BaseModel):
    """Input to the drought risk prediction endpoint."""

    region_id: str = Field(..., description="Target region identifier")
    features: dict[str, float] = Field(
        ..., description="Input feature vector keyed by feature name"
    )

    @field_validator("features")
    @classmethod
    def features_not_empty(cls, v: dict) -> dict:
        if not v:
            raise ValueError("features dict must not be empty")
        return v

    class Config:
        json_schema_extra = {
            "example": {
                "region_id": "MH_DIST_001",
                "features": {
                    "ndvi_anomaly": -1.4,
                    "spi_1m": -0.8,
                    "spi_3m": -1.6,
                    "spi_6m": -1.9,
                    "soil_moisture_anomaly": -0.9,
                    "lst_anomaly": 2.1,
                    "reservoir_fill_pct": 24.0,
                    "gwt_anomaly": -0.8,
                    "rainfall_departure_pct": -35.0,
                    "prev_year_ndvi_anomaly": -0.7,
                    "month_sin": 0.5,
                    "month_cos": 0.866,
                },
            }
        }


class PredictionResponse(BaseModel):
    """Full drought risk prediction response with multi-horizon forecasts."""

    region_id: str
    prediction_date: date
    horizon_30d: HorizonPrediction
    horizon_90d: HorizonPrediction
    driving_factors: list[FactorImportance] = Field(
        ..., description="Top features driving this prediction (descending importance)"
    )
