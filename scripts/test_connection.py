import sys
import os
import logging

# Ensure project root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.app.config import get_settings
from backend.app.db.neo4j_client import db_client
from backend.app.db.schema import init_schema

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("test_connection")


def main():
    settings = get_settings()
    logger.info("=== CognoDB Cloud Connection Test ===")
    logger.info(f"Target URI : {settings.COGNODB_URI}")
    logger.info(f"Username   : {settings.COGNODB_USER}")
    
    health = db_client.health_check()
    logger.info(f"Health Status: {health}")
    
    if health["status"] == "healthy":
        logger.info("Connection verification SUCCEEDED! Latency: %s ms", health["latency_ms"])
        logger.info("Current Graph State: %d nodes, %d relationships", health["nodes"], health["relationships"])
        
        # Test basic openCypher execution
        res = db_client.execute_read("RETURN 'CognoDB is online!' AS message")
        logger.info(f"Sample Query Output: {res}")
        
        # Initialize schema
        init_schema()
        logger.info("=== All Connectivity & Schema Gates PASSED ===")
        sys.exit(0)
    else:
        logger.error("Connection verification FAILED: %s", health["error"])
        sys.exit(1)


if __name__ == "__main__":
    main()
