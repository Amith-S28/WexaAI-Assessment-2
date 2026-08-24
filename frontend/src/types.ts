export interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  latency_ms: number;
  papers?: number;
  nodes: number;
  relationships: number;
  database: string;
  error?: string | null;
}

export interface GraphNodeData {
  id: string;
  label: 'Paper' | 'Author' | 'Concept';
  title: string;
  subtitle?: string;
  group: 'paper' | 'author' | 'concept';
  properties: {
    year?: number;
    venue?: string;
    citation_count?: number;
    abstract?: string;
    tldr?: string;
    url?: string;
    field?: string;
    [key: string]: any;
  };
}

export interface GraphEdgeData {
  id: string;
  source: string;
  target: string;
  type: 'CITES' | 'AUTHORED_BY' | 'COVERS_CONCEPT';
  properties?: {
    is_influential?: boolean;
    intent?: string;
    [key: string]: any;
  };
}

export interface SubgraphResponse {
  nodes: GraphNodeData[];
  edges: GraphEdgeData[];
  total_nodes: number;
  total_edges: number;
}

export interface LineagePath {
  depth: number;
  ancestor_id: string;
  ancestor_title: string;
  ancestor_year?: number;
  ancestor_citations: number;
  path_nodes: string[];
  path_edges: Array<{ source: string; target: string }>;
}

export interface LineageResponse {
  target_paper_id: string;
  target_paper_title: string;
  paths: LineagePath[];
  subgraph: SubgraphResponse;
}

export interface TriadicGap {
  concept_a: string;
  concept_b: string;
  shared_foundations_count: number;
  foundation_examples: string[];
  domain1_papers: string[];
  domain2_papers: string[];
  opportunity_score: number;
  description: string;
}

export interface CoCitationGap {
  paper1_id: string;
  paper1_title: string;
  paper1_year?: number;
  paper2_id: string;
  paper2_title: string;
  paper2_year?: number;
  co_citation_strength: number;
  co_citing_examples: string[];
  opportunity_score: number;
  description: string;
}

export interface GapDiscoveryResponse {
  triadic_concept_gaps: TriadicGap[];
  co_citation_gaps: CoCitationGap[];
}

export interface BridgePaper {
  id: string;
  title: string;
  year?: number;
  citation_count: number;
  bridge_frequency: number;
  connected_domains: string[];
}

export interface IngestResponse {
  success: boolean;
  imported_papers: number;
  imported_authors: number;
  imported_concepts: number;
  imported_citations: number;
  message: string;
}
