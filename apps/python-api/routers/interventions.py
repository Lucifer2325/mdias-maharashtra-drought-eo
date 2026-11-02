"""Watershed restoration intervention candidate prioritization router."""

from __future__ import annotations

from typing import List
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/interventions", tags=["interventions"])


class InterventionCandidate(BaseModel):
    id: str
    region_id: str
    type: str  # CHECK_DAM, FARM_POND, PERCOLATION_TANK, etc.
    status: str
    latitude: float
    longitude: float
    catchment_area_ha: float
    estimated_storage_m3: float
    slope_percent: float
    strahler_order: int
    priority_score: float
    benefited_households: int


@router.get("/candidates/{region_id}", response_model=List[InterventionCandidate])
async def list_candidates(
    region_id: str,
    min_priority: float = 0.0,
) -> List[InterventionCandidate]:
    """Retrieve AI-identified candidate locations for rainwater harvesting interventions."""
    candidates = [
        InterventionCandidate(
            id="site-001",
            region_id=region_id,
            type="CHECK_DAM",
            status="CANDIDATE",
            latitude=18.2561,
            longitude=76.0452,
            catchment_area_ha=142.8,
            estimated_storage_m3=18500.0,
            slope_percent=3.4,
            strahler_order=3,
            priority_score=94.5,
            benefited_households=85,
        ),
        InterventionCandidate(
            id="site-002",
            region_id=region_id,
            type="PERCOLATION_TANK",
            status="VERIFIED",
            latitude=18.8412,
            longitude=75.2934,
            catchment_area_ha=265.0,
            estimated_storage_m3=35000.0,
            slope_percent=2.1,
            strahler_order=2,
            priority_score=91.2,
            benefited_households=160,
        ),
        InterventionCandidate(
            id="site-003",
            region_id=region_id,
            type="FARM_POND",
            status="APPROVED",
            latitude=18.2514,
            longitude=76.5021,
            catchment_area_ha=45.2,
            estimated_storage_m3=6200.0,
            slope_percent=1.8,
            strahler_order=1,
            priority_score=88.0,
            benefited_households=28,
        ),
    ]

    return [c for c in candidates if c.priority_score >= min_priority]
