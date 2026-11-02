"""
geo/spi.py – Standardized Precipitation Index (SPI) calculation.

Follows McKee et al. (1993) methodology:
  1. Aggregate rainfall to desired time scale.
  2. Fit a Gamma distribution to historical aggregated series.
  3. Transform to normal distribution via CDF → percent-point.
  4. Return standardized values (SPI).

SPI Interpretation:
  ≥  0.5  : Above normal
  -0.49 to  0.49 : Near normal
  -1.0  to -0.5  : Mild drought (WATCH)
  -1.5  to -1.0  : Moderate drought (WARNING)
  -2.0  to -1.5  : Severe drought (ALERT)
  < -2.0         : Extreme drought (EMERGENCY)
"""

from __future__ import annotations

import logging

import numpy as np
from scipy import stats  # type: ignore
from scipy.special import gammainc  # type: ignore

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Distribution fitting
# ---------------------------------------------------------------------------


def fit_gamma_distribution(rainfall_series: np.ndarray) -> tuple[float, float]:
    """
    Fit a two-parameter Gamma distribution to historical monthly rainfall.

    Zero values are handled by the mixed zero-probability + gamma approach
    recommended in WMO guidelines.

    Parameters
    ----------
    rainfall_series : np.ndarray
        1-D array of aggregated monthly rainfall values (mm).

    Returns
    -------
    (shape, scale) : tuple[float, float]
        Gamma distribution parameters (alpha, beta).

    Raises
    ------
    ValueError if series is too short (< 12 values) or all zeros.
    """
    series = np.asarray(rainfall_series, dtype=np.float64)
    series = series[~np.isnan(series)]

    if series.size < 12:
        raise ValueError(f"Need at least 12 values to fit gamma; got {series.size}")

    # Remove exact zeros for fitting (they violate Gamma support)
    non_zero = series[series > 0]
    if non_zero.size == 0:
        raise ValueError("All rainfall values are zero; cannot fit Gamma distribution")

    shape, loc, scale = stats.gamma.fit(non_zero, floc=0)
    logger.debug("Gamma fit: shape=%.4f, scale=%.4f (n=%d)", shape, scale, non_zero.size)
    return float(shape), float(scale)


# ---------------------------------------------------------------------------
# SPI calculation
# ---------------------------------------------------------------------------


def _rolling_sum(series: np.ndarray, scale: int) -> np.ndarray:
    """Compute rolling sum with NaN for the first (scale-1) positions."""
    result = np.full_like(series, np.nan, dtype=np.float64)
    for i in range(scale - 1, len(series)):
        window = series[i - scale + 1 : i + 1]
        if np.any(np.isnan(window)):
            result[i] = np.nan
        else:
            result[i] = np.sum(window)
    return result


def calculate_spi(rainfall_series: np.ndarray, scale: int = 3) -> np.ndarray:
    """
    Calculate the Standardized Precipitation Index for a given time scale.

    Parameters
    ----------
    rainfall_series : np.ndarray
        Monthly rainfall time-series (mm).  Must have at least ``scale + 12``
        values to estimate a stable distribution.
    scale : int
        Accumulation period in months (1, 3, 6, or 12 are standard).

    Returns
    -------
    np.ndarray
        SPI values aligned with input series.  First (scale-1) values are NaN.
        Negative SPI → drought; positive → wetter than normal.
    """
    series = np.asarray(rainfall_series, dtype=np.float64)
    accumulated = _rolling_sum(series, scale)

    # Use all valid accumulated values as the historical reference
    valid = accumulated[~np.isnan(accumulated)]
    if valid.size < 12:
        logger.warning(
            "Insufficient valid data for SPI-%d fitting (%d values)", scale, valid.size
        )
        return np.full_like(series, np.nan, dtype=np.float64)

    shape, sc = fit_gamma_distribution(valid)
    n_total = valid.size
    n_zeros = np.sum(valid == 0)
    prob_zero = n_zeros / n_total  # probability of zero rainfall

    spi = np.full_like(series, np.nan, dtype=np.float64)

    for i, val in enumerate(accumulated):
        if np.isnan(val):
            continue
        if val == 0:
            # Assign probability = prob_zero/2 (mid-point of zero-probability mass)
            cum_prob = prob_zero / 2.0
        else:
            # H(x) = q + (1 − q) * G(x)  where q = prob_zero
            gamma_cdf = stats.gamma.cdf(val, a=shape, scale=sc)
            cum_prob = prob_zero + (1.0 - prob_zero) * gamma_cdf

        # Clamp to avoid ±∞ from ppf
        cum_prob = np.clip(cum_prob, 1e-9, 1 - 1e-9)
        spi[i] = stats.norm.ppf(cum_prob)

    return spi


# ---------------------------------------------------------------------------
# Classification
# ---------------------------------------------------------------------------


def classify_spi(spi_value: float) -> str:
    """
    Map an SPI value to a drought severity string.

    Parameters
    ----------
    spi_value : float

    Returns
    -------
    str – one of: "NONE", "WATCH", "WARNING", "ALERT", "EMERGENCY"
    """
    if np.isnan(spi_value):
        return "NONE"
    if spi_value >= -0.5:
        return "NONE"
    elif spi_value >= -1.0:
        return "WATCH"
    elif spi_value >= -1.5:
        return "WARNING"
    elif spi_value >= -2.0:
        return "ALERT"
    else:
        return "EMERGENCY"


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------


def multi_scale_spi(
    rainfall_series: np.ndarray,
    scales: list[int] | None = None,
) -> dict[str, np.ndarray]:
    """
    Compute SPI at multiple scales in one call.

    Parameters
    ----------
    rainfall_series : np.ndarray  Monthly rainfall (mm).
    scales : list[int]  Default [1, 3, 6, 12].

    Returns
    -------
    dict mapping f"spi_{s}m" → np.ndarray.
    """
    if scales is None:
        scales = [1, 3, 6, 12]
    return {f"spi_{s}m": calculate_spi(rainfall_series, scale=s) for s in scales}
