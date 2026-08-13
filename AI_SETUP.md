# VendSway LLM Setup Guide

This guide explains how to set up and use the VendSway LLM, a domain-specific language model fine-tuned for regional fashion-commerce intelligence.

## Architecture Overview

VendSway uses a **three-layer intelligence architecture**:

1. **VendSway LLM**: Domain-specific language model for understanding, planning, reasoning, and explanation
2. **Agentic AI**: ORPDAL agent cycle for autonomous workflow execution
3. **Deterministic Commerce Intelligence**: Business calculations, scoring, and validation

## Quick Start

### Prerequisites

- Python 3.9+
- Node.js 18+
- PostgreSQL 15+
- GPU with 8GB+ VRAM (recommended) or CPU for inference
- 16GB+ RAM

### Step 1: Install Python Dependencies

```bash
cd ai
pip install -r requirements.txt
```

### Step 2: Configure Environment

Create or edit `.env` file in the backend directory:

```bash
# VendSway LLM Configuration
AI_SERVICE_URL=http://localhost:8000
AI_MODEL_PATH=./ai/models/vendsway-llm
AI_DEVICE=auto
AI_MAX_TOKENS=2048
AI_TEMPERATURE=0.7
RAG_DATABASE_URL=postgresql://user:password@localhost:5432/fashion_tapestry?schema=public
```

### Step 3: Start AI Service

```bash
cd ai
python inference/server.py
```

The AI service will start on `http://localhost:8000`

### Step 4: Restart Backend Server

```bash
cd backend
npm run dev
```

### Step 5: Verify AI is Working

Check the AI service health endpoint:

```bash
curl http://localhost:8000/health
```

## Training the Model

### Base Model Selection

**Selected Model**: `Qwen2.5-0.5B-Instruct`

**Why This Model**:
- **Size**: 0.5B parameters - suitable for local development and consumer GPUs
- **License**: Apache 2.0 - commercial-friendly
- **Architecture**: Designed for instruction following and structured output
- **Performance**: Strong performance on reasoning tasks for its size
- **Hardware**: Can run on consumer GPUs (4GB+ VRAM) or CPU with acceptable performance
- **LoRA Support**: Excellent support for parameter-efficient fine-tuning

### Dataset Preparation

```bash
cd ai
python preprocessing/prepare_dataset.py
python preprocessing/validate_dataset.py
python preprocessing/split_dataset.py
```

### Fine-Tuning

```bash
cd ai
python training/train.py
```

Training parameters can be configured in `training/config.yaml`:

```yaml
MODEL_NAME: Qwen/Qwen2.5-0.5B-Instruct
DATASET_PATH: ./dataset/processed/train.jsonl
OUTPUT_DIR: ./models/vendsway-llm
EPOCHS: 3
BATCH_SIZE: 4
LEARNING_RATE: 2e-4
MAX_LENGTH: 2048
LORA_R: 16
LORA_ALPHA: 32
LORA_DROPOUT: 0.05
```

### Evaluation

```bash
python training/evaluate.py
```

### Model Merging and Quantization

```bash
python training/merge_adapter.py
python training/quantize.py
```

## RAG Setup

### Knowledge Base Ingestion

```bash
cd ai
python rag/ingestion.py
```

### Embedding Generation

```bash
python rag/embeddings.py
```

The system uses local sentence-transformers models for embeddings (no external API required).

## Testing

### LLM Tests

```bash
cd ai
python evaluation/benchmark.py
```

### Integration Tests

```bash
cd backend
npm test
```

## Current Status

- ✅ Architecture designed and implemented
- ✅ Training pipeline implemented
- ✅ Inference server implemented
- ✅ RAG architecture implemented
- ✅ Tool system implemented
- ⚠️ Model training requires GPU resources (not executed in current environment)
- ⚠️ Model evaluation requires trained model (not executed in current environment)
- ⚠️ Database migration for RAG models pending

## Technical Honesty Statement

**Model Training Status**: The complete training pipeline is implemented and reproducible. However, actual model training has not been executed in the current environment due to GPU resource constraints. The training must be executed in an environment with appropriate GPU resources (8GB+ VRAM recommended).

**Model Evaluation Status**: Evaluation benchmarks are implemented but require a trained model to produce actual metrics. No fabricated accuracy numbers are reported.

**Current Operation**: The system operates with the deterministic Agentic AI layer without LLM enhancement. When the LLM is trained and deployed, it will enhance reasoning and explanation capabilities while maintaining deterministic business logic for critical operations.

## Troubleshooting

### GPU Memory Issues

If you encounter GPU memory errors:
- Reduce `BATCH_SIZE` in training config
- Reduce `MAX_LENGTH` 
- Use `AI_DEVICE=cpu` for CPU inference (slower but works)

### Model Loading Issues

Ensure the model path is correct in `.env`:
```bash
AI_MODEL_PATH=./ai/models/vendsway-llm
```

### RAG Database Issues

Ensure PostgreSQL is running and `RAG_DATABASE_URL` is correct.

## Architecture Integration

The LLM integrates with the existing Agentic AI architecture:

```
AgentOrchestrator
    ↓
ObserveAgent
    ↓
ReasoningAgent
    ↓
VendSway LLM (enhanced reasoning)
    ↓
PredictionAgent
    ↓
DecisionAgent
    ↓
VendSway LLM (explanation generation)
    ↓
Human Approval
    ↓
ActionAgent
    ↓
LearningAgent
```

The LLM does NOT replace deterministic business logic for:
- Demand scores
- Catalog gap scores
- Seller eligibility
- Financial calculations
- Database integrity

These remain the responsibility of deterministic services.
