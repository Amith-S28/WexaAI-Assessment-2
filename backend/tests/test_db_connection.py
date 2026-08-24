import pytest
from backend.app.db.neo4j_client import db_client


def test_cognoDB_health_check():
    """Verify CognoDB health check returns healthy status and valid metrics."""
    health = db_client.health_check()
    assert health["status"] == "healthy"
    assert health["database"] == "CognoDB Cloud"
    assert health["latency_ms"] >= 0
    assert health["nodes"] > 0
    assert health["relationships"] > 0


def test_parameterized_query_execution():
    """Verify that parameterized openCypher queries execute safely without string injection."""
    query = "MATCH (p:Paper) WHERE p.citation_count >= $min_cit RETURN count(p) AS c"
    res = db_client.execute_read(query, {"min_cit": 1000})
    assert len(res) == 1
    assert res[0]["c"] > 0
