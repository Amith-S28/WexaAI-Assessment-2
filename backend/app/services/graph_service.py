import logging
from typing import Any, Dict, List, Optional
from backend.app.db.neo4j_client import db_client
from backend.app.models.schemas import (
    GraphNode,
    GraphEdge,
    SubgraphResponse,
    LineagePath,
    LineageResponse,
    TriadicGap,
    CoCitationGap,
    GapDiscoveryResponse,
    BridgePaper,
)

logger = logging.getLogger("graph_service")


class GraphService:
    def upsert_papers_batch(self, raw_papers: List[Dict[str, Any]]) -> Dict[str, int]:
        """
        Upserts papers, authors, concepts, and relationships in CognoDB using parameterized UNWIND batches.
        """
        papers_data = []
        authors_data = []
        concepts_data = []
        authored_by_data = []
        covers_concept_data = []
        cites_data = []

        for p in raw_papers:
            pid = p.get("paperId") or p.get("id")
            if not pid:
                continue

            # Paper record
            title = p.get("title") or "Untitled"
            year = p.get("year")
            venue = p.get("venue") or ""
            citation_count = p.get("citationCount") or 0
            abstract = p.get("abstract") or ""
            
            tldr_raw = p.get("tldr")
            tldr = tldr_raw.get("text") if isinstance(tldr_raw, dict) else (tldr_raw or "")
            url = p.get("url") or ""

            papers_data.append({
                "id": str(pid),
                "title": str(title),
                "year": int(year) if year is not None else 0,
                "venue": str(venue),
                "citation_count": int(citation_count),
                "abstract": str(abstract)[:2000],  # bounded to save memory
                "tldr": str(tldr)[:500],
                "url": str(url)
            })

            # Authors
            for a in p.get("authors") or []:
                aid = a.get("authorId") or a.get("id")
                aname = a.get("name")
                if aid and aname:
                    authors_data.append({
                        "id": str(aid),
                        "name": str(aname),
                        "url": a.get("url") or "",
                        "paper_count": a.get("paperCount") or 0,
                        "citation_count": a.get("citationCount") or 0
                    })
                    authored_by_data.append({
                        "paper_id": str(pid),
                        "author_id": str(aid)
                    })

            # Concepts / Fields of Study
            raw_fields = p.get("s2FieldsOfStudy") or []
            if raw_fields:
                for f in raw_fields:
                    cat = f.get("category")
                    if cat:
                        cid = cat.strip().lower().replace(" ", "_")
                        concepts_data.append({
                            "id": cid,
                            "name": cat.strip(),
                            "field": "General"
                        })
                        covers_concept_data.append({
                            "paper_id": str(pid),
                            "concept_id": cid
                        })
            else:
                for field in p.get("fieldsOfStudy") or []:
                    if field:
                        cid = field.strip().lower().replace(" ", "_")
                        concepts_data.append({
                            "id": cid,
                            "name": field.strip(),
                            "field": "General"
                        })
                        covers_concept_data.append({
                            "paper_id": str(pid),
                            "concept_id": cid
                        })

            # References (Citations)
            for ref in p.get("references") or []:
                ref_id = ref.get("paperId") if isinstance(ref, dict) else ref
                if ref_id:
                    cites_data.append({
                        "source_id": str(pid),
                        "target_id": str(ref_id),
                        "is_influential": ref.get("isInfluential", False) if isinstance(ref, dict) else False,
                        "intent": ",".join(ref.get("intents", [])) if isinstance(ref, dict) and ref.get("intents") else ""
                    })

        # 1. Upsert Papers
        if papers_data:
            q_papers = """
            UNWIND $batch AS item
            MERGE (p:Paper {id: item.id})
            ON CREATE SET 
                p.title = item.title,
                p.year = item.year,
                p.venue = item.venue,
                p.citation_count = item.citation_count,
                p.abstract = item.abstract,
                p.tldr = item.tldr,
                p.url = item.url
            ON MATCH SET
                p.citation_count = CASE WHEN item.citation_count > p.citation_count THEN item.citation_count ELSE p.citation_count END,
                p.abstract = CASE WHEN p.abstract IS NULL OR p.abstract = '' THEN item.abstract ELSE p.abstract END,
                p.tldr = CASE WHEN p.tldr IS NULL OR p.tldr = '' THEN item.tldr ELSE p.tldr END
            """
            db_client.execute_write(q_papers, {"batch": papers_data})

        # 2. Upsert Authors
        if authors_data:
            q_authors = """
            UNWIND $batch AS item
            MERGE (a:Author {id: item.id})
            ON CREATE SET 
                a.name = item.name,
                a.url = item.url,
                a.paper_count = item.paper_count,
                a.citation_count = item.citation_count
            """
            db_client.execute_write(q_authors, {"batch": authors_data})

        # 3. Upsert Concepts
        if concepts_data:
            q_concepts = """
            UNWIND $batch AS item
            MERGE (c:Concept {id: item.id})
            ON CREATE SET 
                c.name = item.name,
                c.field = item.field
            """
            db_client.execute_write(q_concepts, {"batch": concepts_data})

        # 4. Upsert AUTHORED_BY edges
        if authored_by_data:
            q_authored_by = """
            UNWIND $batch AS item
            MATCH (p:Paper {id: item.paper_id})
            MATCH (a:Author {id: item.author_id})
            MERGE (p)-[:AUTHORED_BY]->(a)
            """
            db_client.execute_write(q_authored_by, {"batch": authored_by_data})

        # 5. Upsert COVERS_CONCEPT edges
        if covers_concept_data:
            q_covers = """
            UNWIND $batch AS item
            MATCH (p:Paper {id: item.paper_id})
            MATCH (c:Concept {id: item.concept_id})
            MERGE (p)-[:COVERS_CONCEPT]->(c)
            """
            db_client.execute_write(q_covers, {"batch": covers_concept_data})

        # 6. Upsert CITES edges (only where both nodes exist in the graph)
        if cites_data:
            q_cites = """
            UNWIND $batch AS item
            MATCH (p1:Paper {id: item.source_id})
            MATCH (p2:Paper {id: item.target_id})
            MERGE (p1)-[r:CITES]->(p2)
            ON CREATE SET r.is_influential = item.is_influential, r.intent = item.intent
            """
            db_client.execute_write(q_cites, {"batch": cites_data})

        logger.info(f"Upserted batch: {len(papers_data)} papers, {len(authors_data)} authors, {len(concepts_data)} concepts, {len(cites_data)} citation links.")
        return {
            "papers": len(papers_data),
            "authors": len(authors_data),
            "concepts": len(concepts_data),
            "citations": len(cites_data)
        }

    def get_subgraph(self, search: Optional[str] = None, limit: int = 100, min_citations: int = 0) -> SubgraphResponse:
        """Fetches a subgraph of nodes and relationships for interactive visualization."""
        nodes_dict: Dict[str, GraphNode] = {}
        edges_list: List[GraphEdge] = []

        params: Dict[str, Any] = {
            "search": f"(?i).*{search}.*" if search else ".*",
            "limit": limit,
            "min_citations": min_citations
        }

        # Query papers matching search
        q_papers = """
        MATCH (p:Paper)
        WHERE (p.title =~ $search OR $search = '.*') AND p.citation_count >= $min_citations
        WITH p ORDER BY p.citation_count DESC LIMIT $limit
        OPTIONAL MATCH (p)-[:AUTHORED_BY]->(a:Author)
        OPTIONAL MATCH (p)-[:COVERS_CONCEPT]->(c:Concept)
        RETURN p, collect(DISTINCT a) AS authors, collect(DISTINCT c) AS concepts
        """
        records = db_client.execute_read(q_papers, params)

        paper_ids = []
        for r in records:
            p = r["p"]
            pid = str(p["id"])
            paper_ids.append(pid)

            if pid not in nodes_dict:
                nodes_dict[pid] = GraphNode(
                    id=pid,
                    label="Paper",
                    title=p.get("title", "Untitled"),
                    subtitle=f"{p.get('year', '')} • {p.get('venue', '')} • {p.get('citation_count', 0)} citations",
                    group="paper",
                    properties={
                        "year": p.get("year"),
                        "citation_count": p.get("citation_count", 0),
                        "abstract": p.get("abstract", ""),
                        "tldr": p.get("tldr", ""),
                        "url": p.get("url", ""),
                    }
                )

            # Authors
            for a in r.get("authors") or []:
                if not a:
                    continue
                aid = str(a["id"])
                if aid not in nodes_dict:
                    nodes_dict[aid] = GraphNode(
                        id=aid,
                        label="Author",
                        title=a.get("name", "Unknown Author"),
                        subtitle="Author",
                        group="author",
                        properties={"url": a.get("url", "")}
                    )
                edges_list.append(GraphEdge(
                    id=f"auth_{pid}_{aid}",
                    source=pid,
                    target=aid,
                    type="AUTHORED_BY"
                ))

            # Concepts
            for c in r.get("concepts") or []:
                if not c:
                    continue
                cid = str(c["id"])
                if cid not in nodes_dict:
                    nodes_dict[cid] = GraphNode(
                        id=cid,
                        label="Concept",
                        title=c.get("name", "Concept"),
                        subtitle="Field of Study",
                        group="concept",
                        properties={"field": c.get("field", "General")}
                    )
                edges_list.append(GraphEdge(
                    id=f"conc_{pid}_{cid}",
                    source=pid,
                    target=cid,
                    type="COVERS_CONCEPT"
                ))

        # Query CITES relationships among the collected papers
        if paper_ids:
            q_citations = """
            MATCH (p1:Paper)-[r:CITES]->(p2:Paper)
            WHERE p1.id IN $paper_ids AND p2.id IN $paper_ids
            RETURN p1.id AS source, p2.id AS target, r.is_influential AS is_influential
            """
            citation_records = db_client.execute_read(q_citations, {"paper_ids": paper_ids})
            for cr in citation_records:
                edges_list.append(GraphEdge(
                    id=f"cite_{cr['source']}_{cr['target']}",
                    source=str(cr["source"]),
                    target=str(cr["target"]),
                    type="CITES",
                    properties={"is_influential": cr.get("is_influential", False)}
                ))

        return SubgraphResponse(
            nodes=list(nodes_dict.values()),
            edges=edges_list,
            total_nodes=len(nodes_dict),
            total_edges=len(edges_list)
        )

    def get_citation_lineage(self, paper_id: str, max_depth: int = 4, min_citations: int = 0) -> LineageResponse:
        """Traces multi-hop ancestral citation lineages (1 to 4 hops)."""
        # Fetch target paper
        q_target = "MATCH (p:Paper {id: $paper_id}) RETURN p"
        target_res = db_client.execute_read(q_target, {"paper_id": paper_id})
        target_title = target_res[0]["p"].get("title", "Unknown") if target_res else "Target Paper"

        # Multi-hop traversal query
        q_lineage = """
        MATCH path = (origin:Paper {id: $paper_id})-[:CITES*1..4]->(ancestor:Paper)
        WHERE ancestor.id <> $paper_id AND ancestor.citation_count >= $min_citations
        WITH path, length(path) AS depth, ancestor
        ORDER BY depth ASC, ancestor.citation_count DESC
        LIMIT 40
        RETURN [n in nodes(path) | {id: n.id, title: n.title, year: n.year, citation_count: n.citation_count, abstract: n.abstract, tldr: n.tldr, group: 'paper'}] AS path_nodes,
               depth,
               ancestor.id AS ancestor_id,
               ancestor.title AS ancestor_title,
               ancestor.year AS ancestor_year,
               ancestor.citation_count AS ancestor_citations
        """
        paths_data = db_client.execute_read(q_lineage, {"paper_id": paper_id, "min_citations": min_citations})

        nodes_dict: Dict[str, GraphNode] = {}
        edges_list: List[GraphEdge] = []
        lineage_paths: List[LineagePath] = []

        for p_row in paths_data:
            path_nodes = p_row["path_nodes"]
            node_ids = [n["id"] for n in path_nodes]
            
            # Build edges along the path
            path_edges = []
            for i in range(len(path_nodes) - 1):
                src = path_nodes[i]["id"]
                tgt = path_nodes[i+1]["id"]
                edge_id = f"lineage_{src}_{tgt}"
                path_edges.append({"source": src, "target": tgt})
                
                edges_list.append(GraphEdge(
                    id=edge_id,
                    source=src,
                    target=tgt,
                    type="CITES"
                ))

            # Store nodes
            for n in path_nodes:
                nid = n["id"]
                if nid not in nodes_dict:
                    nodes_dict[nid] = GraphNode(
                        id=nid,
                        label="Paper",
                        title=n.get("title", "Untitled"),
                        subtitle=f"{n.get('year', '')} • {n.get('citation_count', 0)} citations",
                        group="paper",
                        properties={
                            "year": n.get("year"),
                            "citation_count": n.get("citation_count", 0),
                            "tldr": n.get("tldr", "")
                        }
                    )

            lineage_paths.append(LineagePath(
                depth=p_row["depth"],
                ancestor_id=p_row["ancestor_id"],
                ancestor_title=p_row["ancestor_title"],
                ancestor_year=p_row["ancestor_year"],
                ancestor_citations=p_row["ancestor_citations"] or 0,
                path_nodes=node_ids,
                path_edges=path_edges
            ))

        # Deduplicate edges
        unique_edges = {e.id: e for e in edges_list}.values()

        return LineageResponse(
            target_paper_id=paper_id,
            target_paper_title=target_title,
            paths=lineage_paths,
            subgraph=SubgraphResponse(
                nodes=list(nodes_dict.values()),
                edges=list(unique_edges),
                total_nodes=len(nodes_dict),
                total_edges=len(unique_edges)
            )
        )

    def discover_triadic_concept_gaps(self, min_shared: int = 1) -> List[TriadicGap]:
        """
        Discovers pairs of concepts that share foundational citation literature
        but have ZERO direct joint publications.
        """
        query = """
        MATCH (c1:Concept)<-[:COVERS_CONCEPT]-(p1:Paper)-[:CITES]->(foundation:Paper)<-[:CITES]-(p2:Paper)-[:COVERS_CONCEPT]->(c2:Concept)
        WHERE c1.id < c2.id
          AND NOT EXISTS {
            MATCH (bp:Paper)
            WHERE (bp)-[:COVERS_CONCEPT]->(c1)
              AND (bp)-[:COVERS_CONCEPT]->(c2)
          }
        WITH c1, c2, 
             count(DISTINCT foundation) AS shared_foundations, 
             collect(DISTINCT foundation.title)[0..3] AS foundation_examples,
             collect(DISTINCT p1.title)[0..2] AS domain1_papers,
             collect(DISTINCT p2.title)[0..2] AS domain2_papers
        WHERE shared_foundations >= $min_shared
        RETURN c1.name AS concept_a, 
               c2.name AS concept_b, 
               shared_foundations, 
               foundation_examples,
               domain1_papers,
               domain2_papers
        ORDER BY shared_foundations DESC
        LIMIT 20
        """
        records = db_client.execute_read(query, {"min_shared": min_shared})
        results = []
        for r in records:
            shared_count = r["shared_foundations"]
            # Opportunity score: heuristic based on shared foundation strength
            score = round(min(1.0, 0.4 + (shared_count * 0.15)), 2)
            results.append(TriadicGap(
                concept_a=r["concept_a"],
                concept_b=r["concept_b"],
                shared_foundations_count=shared_count,
                foundation_examples=r.get("foundation_examples") or [],
                domain1_papers=r.get("domain1_papers") or [],
                domain2_papers=r.get("domain2_papers") or [],
                opportunity_score=score,
                description=f"High potential interdisciplinary gap: '{r['concept_a']}' and '{r['concept_b']}' share {shared_count} foundational references but lack any co-published literature."
            ))
        return results

    def discover_cocitation_gaps(self, min_cocitations: int = 1) -> List[CoCitationGap]:
        """
        Discovers pairs of papers that are frequently co-cited by common literature
        but have NEVER cited each other directly.
        """
        query = """
        MATCH (citing:Paper)-[:CITES]->(p1:Paper)
        MATCH (citing)-[:CITES]->(p2:Paper)
        WHERE p1.id < p2.id 
          AND NOT (p1)-[:CITES]-(p2)
        WITH p1, p2, count(DISTINCT citing) AS co_citation_strength, collect(DISTINCT citing.title)[0..3] AS co_citing_examples
        WHERE co_citation_strength >= $min_cocitations
        RETURN p1.id AS paper1_id, p1.title AS paper1_title, p1.year AS paper1_year,
               p2.id AS paper2_id, p2.title AS paper2_title, p2.year AS paper2_year,
               co_citation_strength,
               co_citing_examples
        ORDER BY co_citation_strength DESC
        LIMIT 20
        """
        records = db_client.execute_read(query, {"min_cocitations": min_cocitations})
        results = []
        for r in records:
            strength = r["co_citation_strength"]
            score = round(min(1.0, 0.5 + (strength * 0.1)), 2)
            results.append(CoCitationGap(
                paper1_id=r["paper1_id"],
                paper1_title=r["paper1_title"],
                paper1_year=r.get("paper1_year"),
                paper2_id=r["paper2_id"],
                paper2_title=r["paper2_title"],
                paper2_year=r.get("paper2_year"),
                co_citation_strength=strength,
                co_citing_examples=r.get("co_citing_examples") or [],
                opportunity_score=score,
                description=f"Strong co-citation cluster: Cited together {strength} times, yet these authors did not directly reference each other."
            ))
        return results

    def find_bridge_papers(self, concept_a: str, concept_b: str) -> List[BridgePaper]:
        """Finds intermediate papers that bridge two concepts across citation paths."""
        query = """
        MATCH (cA:Concept)<-[:COVERS_CONCEPT]-(pA:Paper)
        WHERE cA.name =~ ('(?i)' + $concept_a)
        MATCH (cB:Concept)<-[:COVERS_CONCEPT]-(pB:Paper)
        WHERE cB.name =~ ('(?i)' + $concept_b) AND pA <> pB
        MATCH path = shortestPath((pA)-[:CITES*1..4]-(pB))
        UNWIND nodes(path) AS bridgeNode
        WITH bridgeNode, count(DISTINCT path) AS bridge_frequency
        WHERE bridgeNode:Paper
        RETURN bridgeNode.id AS id, 
               bridgeNode.title AS title, 
               bridgeNode.year AS year, 
               bridgeNode.citation_count AS citation_count,
               bridge_frequency
        ORDER BY bridge_frequency DESC, bridgeNode.citation_count DESC
        LIMIT 10
        """
        records = db_client.execute_read(query, {"concept_a": concept_a, "concept_b": concept_b})
        return [
            BridgePaper(
                id=r["id"],
                title=r.get("title", "Untitled"),
                year=r.get("year"),
                citation_count=r.get("citation_count", 0),
                bridge_frequency=r.get("bridge_frequency", 1),
                connected_domains=[concept_a, concept_b]
            )
            for r in records
        ]


graph_service = GraphService()
