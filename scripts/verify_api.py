import httpx
import sys

BASE_URL = "http://127.0.0.1:8000"

def test_endpoints():
    print("=== Testing FastAPI Endpoints ===")
    
    # 1. Health
    res = httpx.get(f"{BASE_URL}/api/health", timeout=15.0)
    assert res.status_code == 200, f"Health check failed: {res.text}"
    health_data = res.json()
    print(f"[PASS] /api/health : Status={health_data['status']}, Latency={health_data['latency_ms']}ms, Nodes={health_data['nodes']}, Edges={health_data['relationships']}")
    
    # 2. Subgraph
    res = httpx.get(f"{BASE_URL}/api/graph/subgraph?limit=25", timeout=15.0)
    assert res.status_code == 200, f"Subgraph failed: {res.text}"
    subgraph_data = res.json()
    print(f"[PASS] /api/graph/subgraph : Returned {subgraph_data['total_nodes']} nodes and {subgraph_data['total_edges']} edges")
    
    # 3. Lineage (Attention Is All You Need)
    target_id = "204e3073870fae3d05bcbc2f6a8e263d9b72e776"
    res = httpx.get(f"{BASE_URL}/api/lineage/{target_id}?max_depth=3", timeout=15.0)
    assert res.status_code == 200, f"Lineage failed: {res.text}"
    lineage_data = res.json()
    print(f"[PASS] /api/lineage/{target_id[:8]}... : Found {len(lineage_data['paths'])} upstream paths")
    
    # 4. Gaps (All)
    res = httpx.get(f"{BASE_URL}/api/gaps/all?min_shared=1&min_cocitations=1", timeout=15.0)
    assert res.status_code == 200, f"Gaps failed: {res.text}"
    gaps_data = res.json()
    print(f"[PASS] /api/gaps/all : Found {len(gaps_data['triadic_concept_gaps'])} triadic concept gaps and {len(gaps_data['co_citation_gaps'])} co-citation gaps")
    
    # 5. Bridges
    res = httpx.get(f"{BASE_URL}/api/gaps/bridges?concept_a=Natural+Language+Processing&concept_b=Computer+Vision", timeout=15.0)
    assert res.status_code == 200, f"Bridges failed: {res.text}"
    bridges_data = res.json()
    print(f"[PASS] /api/gaps/bridges : Found {len(bridges_data)} bridge papers connecting NLP & CV")
    
    # 6. SPA Root
    res = httpx.get(f"{BASE_URL}/", timeout=15.0)
    assert res.status_code == 200, f"Root SPA failed: {res.text}"
    assert "<!doctype html>" in res.text.lower(), "Root didn't return HTML"
    print("[PASS] / (SPA Root) : Serves compiled React production bundle successfully")

    print("\nALL API & FRONTEND INTEGRATION TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    try:
        test_endpoints()
    except Exception as e:
        print(f"[FAIL] Verification failed: {e}")
        sys.exit(1)
