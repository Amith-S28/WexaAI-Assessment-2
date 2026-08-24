from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class AuthorBase(BaseModel):
    id: str
    name: str
    url: Optional[str] = None
    paper_count: Optional[int] = 0
    citation_count: Optional[int] = 0


class ConceptBase(BaseModel):
    id: str
    name: str
    field: Optional[str] = "Computer Science"


class PaperBase(BaseModel):
    id: str
    title: str
    year: Optional[int] = None
    venue: Optional[str] = None
    citation_count: Optional[int] = 0
    abstract: Optional[str] = None
    tldr: Optional[str] = None
    url: Optional[str] = None
    doi: Optional[str] = None
    authors: List[AuthorBase] = []
    concepts: List[ConceptBase] = []
    references: List[str] = []  # IDs of papers this paper cites


class GraphNode(BaseModel):
    id: str
    label: str  # "Paper", "Author", "Concept"
    title: str
    subtitle: Optional[str] = None
    group: str
    properties: Dict[str, Any] = {}


class GraphEdge(BaseModel):
    id: str
    source: str
    target: str
    type: str  # "CITES", "AUTHORED_BY", "COVERS_CONCEPT"
    properties: Dict[str, Any] = {}


class SubgraphResponse(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]
    total_nodes: int
    total_edges: int


class LineagePath(BaseModel):
    depth: int
    ancestor_id: str
    ancestor_title: str
    ancestor_year: Optional[int] = None
    ancestor_citations: int
    path_nodes: List[str]
    path_edges: List[Dict[str, str]]


class LineageResponse(BaseModel):
    target_paper_id: str
    target_paper_title: str
    paths: List[LineagePath]
    subgraph: SubgraphResponse


class TriadicGap(BaseModel):
    concept_a: str
    concept_b: str
    shared_foundations_count: int
    foundation_examples: List[str]
    domain1_papers: List[str]
    domain2_papers: List[str]
    opportunity_score: float
    description: str


class CoCitationGap(BaseModel):
    paper1_id: str
    paper1_title: str
    paper1_year: Optional[int]
    paper2_id: str
    paper2_title: str
    paper2_year: Optional[int]
    co_citation_strength: int
    co_citing_examples: List[str]
    opportunity_score: float
    description: str


class GapDiscoveryResponse(BaseModel):
    triadic_concept_gaps: List[TriadicGap]
    co_citation_gaps: List[CoCitationGap]


class BridgePaper(BaseModel):
    id: str
    title: str
    year: Optional[int]
    citation_count: int
    bridge_frequency: int
    connected_domains: List[str]


class IngestSearchRequest(BaseModel):
    query: str = Field(..., description="Topic keyword, author, or paper title to search and import")
    limit: int = Field(default=5, ge=1, le=20, description="Max papers to fetch and ingest")
    include_references: bool = Field(default=True, description="Whether to ingest 1-hop references")


class IngestResponse(BaseModel):
    success: bool
    imported_papers: int
    imported_authors: int
    imported_concepts: int
    imported_citations: int
    message: str
