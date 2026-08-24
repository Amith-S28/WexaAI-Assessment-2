from typing import Optional
from fastapi import APIRouter, Query
from backend.app.services.graph_service import graph_service
from backend.app.models.schemas import SubgraphResponse

router = APIRouter(prefix="/api/graph", tags=["Graph Explorer"])


@router.get("/subgraph", response_model=SubgraphResponse)
def get_subgraph(
    search: Optional[str] = Query(None, description="Search term for paper title"),
    limit: int = Query(60, ge=5, le=300, description="Max papers to fetch"),
    min_citations: int = Query(0, ge=0, description="Minimum citations filter")
):
    """Fetches a subgraph of papers, authors, concepts, and relationships."""
    return graph_service.get_subgraph(search=search, limit=limit, min_citations=min_citations)
