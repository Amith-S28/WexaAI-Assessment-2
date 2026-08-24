import logging
from backend.app.db.neo4j_client import db_client

logger = logging.getLogger("cognodb")

SCHEMA_STATEMENTS = [
    # Paper uniqueness constraint & indexes
    "CREATE CONSTRAINT paper_id_unique IF NOT EXISTS FOR (p:Paper) REQUIRE p.id IS UNIQUE",
    "CREATE INDEX paper_title_idx IF NOT EXISTS FOR (p:Paper) ON (p.title)",
    "CREATE INDEX paper_year_idx IF NOT EXISTS FOR (p:Paper) ON (p.year)",
    
    # Author uniqueness constraint & indexes
    "CREATE CONSTRAINT author_id_unique IF NOT EXISTS FOR (a:Author) REQUIRE a.id IS UNIQUE",
    "CREATE INDEX author_name_idx IF NOT EXISTS FOR (a:Author) ON (a.name)",
    
    # Concept uniqueness constraint & indexes
    "CREATE CONSTRAINT concept_id_unique IF NOT EXISTS FOR (c:Concept) REQUIRE c.id IS UNIQUE",
    "CREATE INDEX concept_name_idx IF NOT EXISTS FOR (c:Concept) ON (c.name)",
]


def init_schema():
    """Initializes constraints and indexes on CognoDB Cloud."""
    logger.info("Initializing schema constraints and indexes on CognoDB Cloud...")
    driver = db_client.connect()
    
    with driver.session() as session:
        for stmt in SCHEMA_STATEMENTS:
            try:
                session.run(stmt)
                logger.info(f"Executed: {stmt}")
            except Exception as e:
                # Some openCypher dialects might use slightly different constraint syntax; fallback safely
                logger.warning(f"Note on schema statement '{stmt}': {e}")
    
    logger.info("Schema initialization routine finished.")


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    init_schema()
