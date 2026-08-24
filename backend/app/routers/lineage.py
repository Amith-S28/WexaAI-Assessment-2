from fastapi import APIRouter, Query, HTTPException
from backend.app.services.graph_service import graph_service
from backend.app.models.schemas import LineageResponse

router = APIRouter(prefix="/api/lineage", tags=["Citation Lineage"])


@router.get("/{paper_id}", response_model=LineageResponse)
def get_lineage(
    paper_id: str,
    max_depth: int = Query(4, ge=1, le=5, description="Maximum traversal depth"),
    min_citations: int = Query(0, ge=0, description="Minimum ancestor citations")
):
    """Traces multi-hop ancestral citation lineages (1 to 4 hops)."""
    try:
        return graph_service.get_citation_lineage(
            paper_id=paper_id,
            max_depth=max_depth,
            min_citations=min_citations
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lineage traversal failed: {str(e)}")
