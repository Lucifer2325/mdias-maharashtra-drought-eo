"""XGBoost and Ensemble Drought Risk Classifier."""

from __future__ import annotations

import logging
from pathlib import Path
from typing import Any

import numpy as np

logger = logging.getLogger(__name__)

CLASSES = ["NONE", "WATCH", "WARNING", "ALERT", "EMERGENCY"]


class DroughtRiskModel:
    """Wrapper around XGBoost classifier for 5-tier drought severity classification."""

    def __init__(self, model_path: str | None = None) -> None:
        self.model = None
        self.is_trained = False
        self.model_path = model_path
        if model_path and Path(model_path).exists():
            self.load(model_path)

    def load(self, path: str) -> None:
        """Load trained XGBoost booster from file."""
        try:
            import xgboost as xgb
            self.model = xgb.XGBClassifier()
            self.model.load_model(path)
            self.is_trained = True
            logger.info("Loaded XGBoost drought risk model from %s", path)
        except Exception as e:
            logger.warning("Failed to load XGBoost model from %s: %s", path, e)
            self.is_trained = False

    def predict(self, X: np.ndarray) -> tuple[str, float, dict[str, float]]:
        """
        Predict drought class, confidence, and class probability distribution.
        Falls back to rule-based logic if ML weights are not loaded.
        """
        if self.is_trained and self.model is not None:
            probs = self.model.predict_proba(X)[0]
            pred_idx = int(np.argmax(probs))
            pred_class = CLASSES[pred_idx]
            confidence = float(probs[pred_idx])
            prob_dict = {cls: float(p) for cls, p in zip(CLASSES, probs)}
            return pred_class, confidence, prob_dict

        # Fallback to rule-based scoring
        # Features: [ndvi_anomaly, spi_1m, spi_3m, spi_6m, soil_moisture, lst_anomaly, reservoir_fill_pct, gwt_anomaly, sin, cos]
        spi3m = X[0, 2]
        ndvi_anom = X[0, 0]
        soil_m = X[0, 4]
        res_fill = X[0, 6]

        # Composite drought score calculation (0 - 100)
        # Lower SPI, lower NDVI, lower soil moisture, lower reservoir -> higher drought
        score = 0.0
        # SPI contribution (weight 35%)
        if spi3m < -2.0:
            score += 35
        elif spi3m < -1.5:
            score += 28
        elif spi3m < -1.0:
            score += 20
        elif spi3m < -0.5:
            score += 10

        # NDVI Anomaly contribution (weight 25%)
        if ndvi_anom < -0.35:
            score += 25
        elif ndvi_anom < -0.2:
            score += 18
        elif ndvi_anom < -0.1:
            score += 10

        # Soil moisture contribution (weight 20%)
        if soil_m < 0.15:
            score += 20
        elif soil_m < 0.20:
            score += 14
        elif soil_m < 0.25:
            score += 8

        # Reservoir contribution (weight 20%)
        if res_fill < 20:
            score += 20
        elif res_fill < 40:
            score += 12
        elif res_fill < 60:
            score += 6

        if score >= 75:
            cls_name = "ALERT" if score < 90 else "EMERGENCY"
        elif score >= 50:
            cls_name = "WARNING"
        elif score >= 25:
            cls_name = "WATCH"
        else:
            cls_name = "NONE"

        prob_dict = {c: 0.1 for c in CLASSES}
        prob_dict[cls_name] = 0.6
        return cls_name, 0.82, prob_dict
