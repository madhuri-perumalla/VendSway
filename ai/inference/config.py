"""
VendSway LLM Configuration
Configuration for inference server
"""

import os
from pydantic_settings import BaseSettings
from typing import Optional

class AISettings(BaseSettings):
    """AI service configuration"""
    
    # Model configuration
    MODEL_NAME: str = "Qwen/Qwen2.5-0.5B-Instruct"
    MODEL_PATH: str = "./ai/models/vendsway-llm"
    
    # Inference configuration
    MAX_TOKENS: int = 2048
    TEMPERATURE: float = 0.7
    TOP_P: float = 0.95
    TOP_K: int = 50
    
    # Device configuration
    DEVICE: str = "auto"  # auto, cuda, cpu
    
    # RAG configuration
    EMBEDDING_MODEL: str = "sentence-transformers/all-MiniLM-L6-v2"
    RAG_TOP_K: int = 5
    RAG_DATABASE_URL: Optional[str] = None
    
    # Server configuration
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

# Global settings instance
settings = AISettings()