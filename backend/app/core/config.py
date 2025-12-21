from typing import List, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "your-secret-key-change-in-production"
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

    # Database URLs
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "shikkhasathi"
    POSTGRES_PASSWORD: str = "password"
    POSTGRES_DB: str = "shikkhasathi"
    POSTGRES_PORT: str = "5432"
    
    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
    
    # MongoDB
    MONGODB_URL: str = "mongodb://localhost:27017"
    MONGODB_DB_NAME: str = "shikkhasathi"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    
    # OpenAI API (for fallback)
    OPENAI_API_KEY: str = ""
    
    # Pinecone (legacy - now using ChromaDB)
    PINECONE_API_KEY: str = ""
    PINECONE_ENVIRONMENT: str = ""
    PINECONE_INDEX_NAME: str = "shikkhasathi-embeddings"
    
    # Voice Services (legacy - for fallback)
    ELEVENLABS_API_KEY: str = ""
    ELEVENLABS_VOICE_ID: str = "21m00Tcm4TlvDq8ikWAM"  # Default voice ID
    
    # Local AI Configuration
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "llama2"
    
    # Local Voice Services Configuration
    USE_LOCAL_VOICE_SERVICES: bool = True
    VOICE_API_FALLBACK: bool = False
    
    # Local Whisper Configuration
    WHISPER_MODEL_SIZE: str = "base"  # tiny, base, small, medium, large
    WHISPER_DEVICE: str = "auto"  # auto, cpu, cuda
    
    # Local TTS Configuration
    TTS_ENGINE: str = "coqui"  # coqui, espeak, festival
    TTS_VOICE_EN: str = "ljspeech"
    TTS_VOICE_BN: str = "custom-bengali"
    
    # Performance Settings
    MAX_CONCURRENT_VOICE_REQUESTS: int = 3
    VOICE_CACHE_SIZE: int = 100
    
    # Password Hashing Fallback (for development/testing)
    FORCE_PASSWORD_FALLBACK: bool = False

    model_config = {"env_file": ".env"}


settings = Settings()