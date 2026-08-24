import asyncio
import logging
import time
from typing import Any, Dict, List, Optional
import httpx
from backend.app.config import get_settings

logger = logging.getLogger("s2_client")

S2_BASE_URL = "https://api.semanticscholar.org/graph/v1"
DEFAULT_FIELDS = "paperId,title,year,venue,citationCount,abstract,tldr,url,authors,fieldsOfStudy,s2FieldsOfStudy,references"


class SemanticScholarClient:
    def __init__(self):
        settings = get_settings()
        self.api_key = settings.S2_API_KEY
        self.headers = {"User-Agent": "ResearchGraphGapFinder/1.0"}
        if self.api_key:
            self.headers["x-api-key"] = self.api_key
            self.min_delay = 0.15  # ~6.6 req/s with key
        else:
            self.min_delay = 1.05  # Safe 1 req/s without key
        self._last_request_time = 0.0

    async def _throttle(self):
        elapsed = time.time() - self._last_request_time
        if elapsed < self.min_delay:
            await asyncio.sleep(self.min_delay - elapsed)
        self._last_request_time = time.time()

    async def search_papers(self, query: str, limit: int = 5) -> List[Dict[str, Any]]:
        """Search papers by keyword or title."""
        await self._throttle()
        url = f"{S2_BASE_URL}/paper/search"
        params = {
            "query": query,
            "limit": limit,
            "fields": DEFAULT_FIELDS,
        }
        
        async with httpx.AsyncClient(timeout=15.0) as client:
            try:
                response = await client.get(url, params=params, headers=self.headers)
                if response.status_code == 200:
                    data = response.json()
                    return data.get("data", [])
                elif response.status_code == 429:
                    logger.warning("Semantic Scholar rate limit hit (429). Retrying after backoff...")
                    await asyncio.sleep(3.0)
                    response = await client.get(url, params=params, headers=self.headers)
                    if response.status_code == 200:
                        return response.json().get("data", [])
                logger.error(f"S2 search failed: HTTP {response.status_code} - {response.text}")
                return []
            except Exception as e:
                logger.error(f"Exception during S2 search: {e}")
                return []

    async def get_paper(self, paper_id: str) -> Optional[Dict[str, Any]]:
        """Get full paper metadata including references."""
        await self._throttle()
        url = f"{S2_BASE_URL}/paper/{paper_id}"
        params = {"fields": DEFAULT_FIELDS}
        
        async with httpx.AsyncClient(timeout=15.0) as client:
            try:
                response = await client.get(url, params=params, headers=self.headers)
                if response.status_code == 200:
                    return response.json()
                elif response.status_code == 429:
                    logger.warning("Semantic Scholar rate limit hit (429). Backing off...")
                    await asyncio.sleep(3.0)
                    response = await client.get(url, params=params, headers=self.headers)
                    if response.status_code == 200:
                        return response.json()
                return None
            except Exception as e:
                logger.error(f"Exception fetching paper {paper_id}: {e}")
                return None

    async def get_batch_papers(self, paper_ids: List[str]) -> List[Dict[str, Any]]:
        """Fetch up to 500 papers in a single batch request."""
        if not paper_ids:
            return []
        await self._throttle()
        url = f"{S2_BASE_URL}/paper/batch"
        params = {"fields": DEFAULT_FIELDS}
        payload = {"ids": paper_ids[:500]}
        
        async with httpx.AsyncClient(timeout=20.0) as client:
            try:
                response = await client.post(url, json=payload, params=params, headers=self.headers)
                if response.status_code == 200:
                    data = response.json()
                    # Filter out None entries for unfound papers
                    return [p for p in data if p is not None]
                return []
            except Exception as e:
                logger.error(f"Exception fetching batch papers: {e}")
                return []


s2_client = SemanticScholarClient()
