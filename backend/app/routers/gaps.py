from typing import List
from fastapi import APIRouter, Query
from backend.app.services.graph_service import graph_service
from backend.app.models.schemas import TriadicGap, CoCitationGap, BridgePaper, GapDiscoveryResponse

router = APIRouter(prefix="/api/gaps", tags=["Research Gaps & Bridges"])


@router.get("/all", response_model=GapDiscoveryResponse)
def get_all_gaps(
    min_shared: int = Query(1, ge=1, description="Min shared foundations for triadic gaps"),
    min_cocitations: int = Query(1, ge=1, description="Min co-citations for paper gaps")
):
    """Returns both Triadic Concept Gaps and Co-Citation Gaps."""
    triadic = graph_service.discover_triadic_concept_gaps(min_shared=min_shared)
    cocitation = graph_service.discover_cocitation_gaps(min_cocitations=min_cocitations)
    return GapDiscoveryResponse(
        triadic_concept_gaps=triadic,
        co_citation_gaps=cocitation
    )


@router.get("/triadic", response_model=List[TriadicGap])
def get_triadic_gaps(
    min_shared: int = Query(1, ge=1, description="Min shared foundations")
):
    """Discovers concept pairs that share foundations but zero joint literature."""
    return graph_service.discover_triadic_concept_gaps(min_shared=min_shared)


@router.get("/co-citation", response_model=List[CoCitationGap])
def get_cocitation_gaps(
    min_cocitations: int = Query(1, ge=1, description="Min co-citations")
):
    """Discovers frequently co-cited papers that do not cite each other."""
    return graph_service.discover_cocitation_gaps(min_cocitations=min_cocitations)


@router.get("/bridges", response_model=List[BridgePaper])
def get_bridge_papers(
    concept_a: str = Query(..., description="First concept name"),
    concept_b: str = Query(..., description="Second concept name")
):
    """Finds bottleneck papers on shortest paths between two concept areas."""
    return graph_service.find_bridge_papers(concept_a=concept_a, concept_b=concept_b)
