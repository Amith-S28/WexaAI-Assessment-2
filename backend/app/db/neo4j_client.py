import logging
import time
from typing import Any, Dict, List, Optional
from neo4j import GraphDatabase, Driver
from backend.app.config import get_settings

logger = logging.getLogger("cognodb")


class Neo4jClient:
    _instance: Optional["Neo4jClient"] = None
    _driver: Optional[Driver] = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(Neo4jClient, cls).__new__(cls)
        return cls._instance

    def connect(self) -> Driver:
        if self._driver is None:
            settings = get_settings()
            logger.info(f"Connecting to CognoDB at {settings.COGNODB_URI} as user '{settings.COGNODB_USER}'")
            try:
                self._driver = GraphDatabase.driver(
                    settings.COGNODB_URI,
                    auth=(settings.COGNODB_USER, settings.COGNODB_PASSWORD),
                    max_connection_pool_size=settings.NEO4J_MAX_CONNECTION_POOL_SIZE,
                    connection_acquisition_timeout=25.0,
                    max_transaction_retry_time=15.0,
                    max_connection_lifetime=300,
                    keep_alive=True,
                )
                self._driver.verify_connectivity()
                logger.info("Successfully connected and authenticated with CognoDB Cloud.")
            except Exception as e:
                logger.error(f"Failed to connect to CognoDB Cloud: {e}")
                self._driver = None
                raise e
        return self._driver

    def close(self):
        if self._driver is not None:
            logger.info("Closing CognoDB driver connection pool...")
            try:
                self._driver.close()
            except Exception:
                pass
            self._driver = None

    def execute_read(self, query: str, parameters: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        """Executes a read-only Cypher query with parameterization."""
        driver = self.connect()
        parameters = parameters or {}
        with driver.session() as session:
            result = session.run(query, parameters)
            return [record.data() for record in result]

    def execute_write(self, query: str, parameters: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        """Executes a write Cypher query within a session."""
        driver = self.connect()
        parameters = parameters or {}
        with driver.session() as session:
            result = session.run(query, parameters)
            return [record.data() for record in result]

    def health_check(self) -> Dict[str, Any]:
        """Runs a lightweight ping and returns latency, status, node & edge counts."""
        start_time = time.time()
        try:
            driver = self.connect()
            with driver.session() as session:
                session.run("RETURN 1 AS ping").consume()
                latency_ms = round((time.time() - start_time) * 1000, 2)
                
                node_rec = session.run("MATCH (n) RETURN count(n) AS nodeCount").single()
                edge_rec = session.run("MATCH ()-[r]->() RETURN count(r) AS edgeCount").single()
                paper_rec = session.run("MATCH (p:Paper) RETURN count(p) AS paperCount").single()
                
                node_count = node_rec["nodeCount"] if node_rec else 0
                edge_count = edge_rec["edgeCount"] if edge_rec else 0
                paper_count = paper_rec["paperCount"] if paper_rec else 0

                return {
                    "status": "healthy",
                    "latency_ms": latency_ms,
                    "papers": paper_count,
                    "nodes": node_count,
                    "relationships": edge_count,
                    "database": "CognoDB Cloud",
                    "error": None
                }
        except Exception as e:
            latency_ms = round((time.time() - start_time) * 1000, 2)
            logger.error(f"CognoDB health check error: {e}")
            return {
                "status": "unhealthy",
                "latency_ms": latency_ms,
                "papers": 0,
                "nodes": 0,
                "relationships": 0,
                "database": "CognoDB Cloud",
                "error": str(e)
            }


db_client = Neo4jClient()
