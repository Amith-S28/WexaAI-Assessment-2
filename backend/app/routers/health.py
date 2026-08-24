from fastapi import APIRouter
from backend.app.db.neo4j_client import db_client

router = APIRouter(prefix="/api/health", tags=["Health"])


@router.get("")
def check_health():
    """Returns database connection status, latency, and live graph metrics."""
    return db_client.health_check()
