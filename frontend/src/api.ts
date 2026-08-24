import type {
  HealthStatus,
  SubgraphResponse,
  LineageResponse,
  GapDiscoveryResponse,
  TriadicGap,
  CoCitationGap,
  BridgePaper,
  IngestResponse
} from './types';

const API_BASE = import.meta.env.VITE_API_URL || '';

export async function fetchHealth(): Promise<HealthStatus> {
  const res = await fetch(`${API_BASE}/api/health`);
  if (!res.ok) throw new Error(`Health check failed: ${res.statusText}`);
  return res.json();
}

export async function fetchSubgraph(
  search?: string,
  limit: number = 150,
  minCitations: number = 0
): Promise<SubgraphResponse> {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  params.append('limit', limit.toString());
  params.append('min_citations', minCitations.toString());

  const res = await fetch(`${API_BASE}/api/graph/subgraph?${params.toString()}`);
  if (!res.ok) throw new Error(`Failed to fetch subgraph: ${res.statusText}`);
  return res.json();
}

export async function fetchLineage(
  paperId: string,
  maxDepth: number = 4,
  minCitations: number = 0
): Promise<LineageResponse> {
  const params = new URLSearchParams({
    max_depth: maxDepth.toString(),
    min_citations: minCitations.toString(),
  });
  const res = await fetch(`${API_BASE}/api/lineage/${paperId}?${params.toString()}`);
  if (!res.ok) throw new Error(`Failed to fetch lineage: ${res.statusText}`);
  return res.json();
}

export async function fetchAllGaps(
  minShared: number = 1,
  minCoCitations: number = 1
): Promise<GapDiscoveryResponse> {
  const params = new URLSearchParams({
    min_shared: minShared.toString(),
    min_cocitations: minCoCitations.toString(),
  });
  const res = await fetch(`${API_BASE}/api/gaps/all?${params.toString()}`);
  if (!res.ok) throw new Error(`Failed to fetch research gaps: ${res.statusText}`);
  return res.json();
}

export async function fetchTriadicGaps(minShared: number = 1): Promise<TriadicGap[]> {
  const res = await fetch(`${API_BASE}/api/gaps/triadic?min_shared=${minShared}`);
  if (!res.ok) throw new Error(`Failed to fetch triadic gaps: ${res.statusText}`);
  return res.json();
}

export async function fetchCoCitationGaps(minCoCitations: number = 1): Promise<CoCitationGap[]> {
  const res = await fetch(`${API_BASE}/api/gaps/co-citation?min_cocitations=${minCoCitations}`);
  if (!res.ok) throw new Error(`Failed to fetch co-citation gaps: ${res.statusText}`);
  return res.json();
}

export async function fetchBridges(conceptA: string, conceptB: string): Promise<BridgePaper[]> {
  const params = new URLSearchParams({ concept_a: conceptA, concept_b: conceptB });
  const res = await fetch(`${API_BASE}/api/gaps/bridges?${params.toString()}`);
  if (!res.ok) throw new Error(`Failed to fetch bridge papers: ${res.statusText}`);
  return res.json();
}

export async function ingestFromSearch(
  query: string,
  limit: number = 5,
  includeReferences: boolean = true
): Promise<IngestResponse> {
  const res = await fetch(`${API_BASE}/api/ingest/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, limit, include_references: includeReferences }),
  });
  if (!res.ok) throw new Error(`Ingestion failed: ${res.statusText}`);
  return res.json();
}

export async function reseedDatabase(): Promise<IngestResponse> {
  const res = await fetch(`${API_BASE}/api/ingest/seed`, { method: 'POST' });
  if (!res.ok) throw new Error(`Reseeding failed: ${res.statusText}`);
  return res.json();
}
