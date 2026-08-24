import logging
from fastapi import APIRouter, HTTPException
from backend.app.services.s2_client import s2_client
from backend.app.services.graph_service import graph_service
from backend.app.models.schemas import IngestSearchRequest, IngestResponse
from scripts.seed_data import load_seed_data

logger = logging.getLogger("ingest_router")
router = APIRouter(prefix="/api/ingest", tags=["Data Ingestion"])


@router.post("/search", response_model=IngestResponse)
async def ingest_from_search(req: IngestSearchRequest):
    """
    Searches Semantic Scholar for papers by keyword/title, fetches their references,
    and batch-upserts them into CognoDB.
    """
    logger.info(f"Ingesting papers from Semantic Scholar query: '{req.query}' (limit={req.limit})")
    
    # 1. Search primary papers
    papers = await s2_client.search_papers(query=req.query, limit=req.limit)
    if not papers:
        return IngestResponse(
            success=False,
            imported_papers=0,
            imported_authors=0,
            imported_concepts=0,
            imported_citations=0,
            message="No papers found matching the query or Semantic Scholar API rate limited."
        )

    # 2. Optionally fetch 1-hop references for top papers
    all_papers_to_ingest = list(papers)
    if req.include_references:
        ref_ids = []
        for p in papers:
            for ref in p.get("references") or []:
                ref_id = ref.get("paperId") if isinstance(ref, dict) else ref
                if ref_id:
                    ref_ids.append(ref_id)
        
        # Batch fetch references (limit to 30 to avoid throttling)
        unique_refs = list(set(ref_ids))[:30]
        if unique_refs:
            ref_papers = await s2_client.get_batch_papers(unique_refs)
            all_papers_to_ingest.extend(ref_papers)

    # 3. Batch upsert into CognoDB
    stats = graph_service.upsert_papers_batch(all_papers_to_ingest)

    return IngestResponse(
        success=True,
        imported_papers=stats["papers"],
        imported_authors=stats["authors"],
        imported_concepts=stats["concepts"],
        imported_citations=stats["citations"],
        message=f"Successfully imported {stats['papers']} papers and {stats['citations']} citation links into CognoDB."
    )


@router.post("/seed", response_model=IngestResponse)
def reseed_database():
    """Reloads the curated landmark AI/ML seed dataset."""
    try:
        load_seed_data()
        return IngestResponse(
            success=True,
            imported_papers=22,
            imported_authors=90,
            imported_concepts=84,
            imported_citations=51,
            message="Curated landmark AI/ML seed dataset loaded successfully."
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to reseed database: {str(e)}")
