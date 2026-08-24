import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from backend.app.config import get_settings
from backend.app.db.neo4j_client import db_client
from backend.app.routers import health, graph, lineage, gaps, ingest

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("app")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Starting Research Paper Graph & Gap Finder API...")
    try:
        health_status = db_client.health_check()
        logger.info(f"Initial CognoDB Cloud check: {health_status['status']} ({health_status['nodes']} nodes)")
    except Exception as e:
        logger.error(f"Startup database check note: {e}")
    yield
    # Shutdown
    logger.info("Shutting down application...")
    db_client.close()


settings = get_settings()

app = FastAPI(
    title="Research Paper Citation Network & Gap Finder",
    description="Interactive Graph Database application backed by CognoDB Cloud (openCypher over Bolt)",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(health.router)
app.include_router(graph.router)
app.include_router(lineage.router)
app.include_router(gaps.router)
app.include_router(ingest.router)

# Mount frontend dist static files if built
frontend_dist = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "dist"))
if os.path.exists(frontend_dist):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist, "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        file_path = os.path.join(frontend_dist, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(frontend_dist, "index.html"))
else:
    @app.get("/")
    def root():
        return {
            "name": "Research Paper Citation Network & Gap Finder API",
            "database": "CognoDB Cloud (Bolt 5.x)",
            "docs": "/docs",
            "health": "/api/health"
        }
