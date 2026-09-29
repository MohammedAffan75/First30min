from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # LLM
    LLM_PROVIDER: str = "ollama"
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "llama3"
    OPENAI_API_KEY: str = ""
    ANTHROPIC_API_KEY: str = ""

    # App
    SECRET_KEY: str = "changeme-use-a-long-random-string-here"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080  # 7 days

    DATABASE_URL: str = "sqlite:///./first30.db"
    CORS_ORIGINS: str = "http://localhost:5173"

    @property
    def cors_origins_list(self) -> List[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",")]

    class Config:
        env_file = ".env"


settings = Settings()
