from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache
from typing import Optional


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    COGNODB_URI: str = "bolt+s://db-9ff2fc64.bravo.databases.cognodb.com"
    COGNODB_USER: str = "cognodb"
    COGNODB_PASSWORD: str = ""
    S2_API_KEY: Optional[str] = None
    
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    ENVIRONMENT: str = "development"
    LOG_LEVEL: str = "INFO"
    
    # DB Pool Configuration (optimised for < 512MB RAM)
    NEO4J_MAX_CONNECTION_POOL_SIZE: int = 10
    NEO4J_CONNECTION_ACQUISITION_TIMEOUT: float = 10.0
    NEO4J_MAX_TRANSACTION_RETRY_TIME: float = 15.0



@lru_cache()
def get_settings() -> Settings:
    return Settings()
