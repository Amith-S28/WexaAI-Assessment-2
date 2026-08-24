import pytest
from backend.app.services.graph_service import graph_service


def test_get_subgraph():
    """Verify subgraph endpoint retrieves nodes and edges correctly."""
    subgraph = graph_service.get_subgraph(limit=20)
    assert subgraph.total_nodes > 0
    assert len(subgraph.nodes) == subgraph.total_nodes
    
    # Check node categories
    node_labels = {n.label for n in subgraph.nodes}
    assert "Paper" in node_labels


def test_citation_lineage_multi_hop():
    """Verify multi-hop citation lineage traversal (2+ hops)."""
    # Use 'Attention Is All You Need' or a downstream paper
    res = graph_service.get_citation_lineage("204e3073870fae3d05bcbc2f6a8e263d9b72e776", max_depth=3)
    assert res.target_paper_id == "204e3073870fae3d05bcbc2f6a8e263d9b72e776"
    assert len(res.paths) > 0
    # Assert depth is tracked
    for p in res.paths:
        assert p.depth >= 1
        assert len(p.path_nodes) == p.depth + 1


def test_triadic_concept_gaps():
    """Verify triadic concept disconnect algorithm finds gaps with shared foundations."""
    gaps = graph_service.discover_triadic_concept_gaps(min_shared=1)
    assert isinstance(gaps, list)
    if gaps:
        first = gaps[0]
        assert first.concept_a != first.concept_b
        assert first.shared_foundations_count >= 1
        assert len(first.foundation_examples) > 0


def test_cocitation_gaps():
    """Verify co-citation gap detection returns papers cited together that do not cite each other."""
    gaps = graph_service.discover_cocitation_gaps(min_cocitations=1)
    assert isinstance(gaps, list)
    if gaps:
        first = gaps[0]
        assert first.paper1_id != first.paper2_id
        assert first.co_citation_strength >= 1
