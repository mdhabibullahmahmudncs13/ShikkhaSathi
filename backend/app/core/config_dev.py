from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings
import os


class DevSettings(BaseSettings):
    model_config = {"extra": "ignore"}  # Ignore extra fields from .env
    
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "dev-secret-key-for-testing-only"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    
    # CORS origins
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",  # React dev server
        "http://localhost:5173",  # Vite dev server
        "http://localhost:5174",  # Vite dev server (alternative port)
        "http://localhost:8080",  # Alternative frontend port
    ]

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip().rstrip('/') for i in v.split(",")]
        elif isinstance(v, list):
            return [str(origin).rstrip('/') for origin in v]
        elif isinstance(v, str):
            return [v.rstrip('/')]
        raise ValueError(v)

    # SQLite Database for development
    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        db_path = os.path.join(os.path.dirname(__file__), "..", "..", "dev_database.db")
        return f"sqlite:///{db_path}"
    
    # Mock MongoDB (we'll use file-based storage for development)
    MONGODB_URL: str = "mock://localhost:27017"
    MONGODB_DB_NAME: str = "shikkhasathi_dev"
    
    # Mock Redis (we'll use in-memory storage for development)
    REDIS_URL: str = "mock://localhost:6379"
    
    # API Keys (optional for development)
    OPENAI_API_KEY: str = ""
    PINECONE_API_KEY: str = ""
    PINECONE_ENVIRONMENT: str = ""
    PINECONE_INDEX_NAME: str = "shikkhasathi-embeddings"
    ELEVENLABS_API_KEY: str = ""
    ELEVENLABS_VOICE_ID: str = "21m00Tcm4TlvDq8ikWAM"
    
    # Local AI Configuration
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "llama2"
    
    # Local Voice Services Configuration
    USE_LOCAL_VOICE_SERVICES: bool = True
    VOICE_API_FALLBACK: bool = False
    
    # Development mode flags
    DEVELOPMENT_MODE: bool = True
    USE_MOCK_DATABASES: bool = True
    
    model_config = {"env_file": ".env"}


dev_settings = DevSettings()