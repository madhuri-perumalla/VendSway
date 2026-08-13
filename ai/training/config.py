"""
VendSway LLM Training Configuration
Configuration for fine-tuning Qwen2.5-0.5B-Instruct for regional fashion-commerce intelligence
"""

import os
from dataclasses import dataclass
from typing import Optional

@dataclass
class TrainingConfig:
    # Model configuration
    MODEL_NAME: str = "Qwen/Qwen2.5-0.5B-Instruct"
    MAX_LENGTH: int = 2048
    
    # Dataset configuration
    DATASET_PATH: str = "./dataset/processed/train.jsonl"
    VALIDATION_PATH: str = "./dataset/processed/validation.jsonl"
    
    # Training hyperparameters
    EPOCHS: int = 3
    BATCH_SIZE: int = 4
    GRADIENT_ACCUMULATION_STEPS: int = 1
    LEARNING_RATE: float = 2e-4
    WARMUP_STEPS: int = 100
    MAX_STEPS: Optional[int] = None
    
    # LoRA configuration
    LORA_R: int = 16
    LORA_ALPHA: int = 32
    LORA_DROPOUT: float = 0.05
    LORA_TARGET_MODULES: list = None
    
    # Output configuration
    OUTPUT_DIR: str = "./models/vendsway-llm"
    LOGGING_STEPS: int = 10
    SAVE_STEPS: int = 500
    EVAL_STEPS: int = 100
    
    # Device configuration
    DEVICE: str = "auto"  # auto, cuda, cpu
    QUANTIZATION: bool = False  # Use 4-bit quantization for training
    
    # RAG configuration
    EMBEDDING_MODEL: str = "sentence-transformers/all-MiniLM-L6-v2"
    RAG_TOP_K: int = 5
    
    def __post_init__(self):
        if self.LORA_TARGET_MODULES is None:
            self.LORA_TARGET_MODULES = ["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj"]

# Global configuration instance
config = TrainingConfig()