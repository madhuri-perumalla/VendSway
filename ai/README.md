# VendSway LLM - Domain-Specific Language Model

VendSway LLM is a domain-specialized language model fine-tuned for regional fashion-commerce intelligence.

## Architecture

This LLM integrates with the existing Agentic AI architecture:

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

## Base Model

**Selected Model**: `Qwen2.5-0.5B-Instruct`

**Why This Model**:
- **Size**: 0.5B parameters - suitable for local development and consumer GPUs
- **License**: Apache 2.0 - commercial-friendly
- **Architecture**: Designed for instruction following and structured output
- **Performance**: Strong performance on reasoning tasks for its size
- **Hardware**: Can run on consumer GPUs (4GB+ VRAM) or CPU with acceptable performance
- **LoRA Support**: Excellent support for parameter-efficient fine-tuning

## Directory Structure

```
ai/
├── dataset/
│   ├── raw/                    # Raw data sources
│   ├── processed/              # Processed training data
│   ├── train.jsonl             # Training dataset
│   ├── validation.jsonl        # Validation dataset
│   └── test.jsonl              # Test dataset
├── preprocessing/
│   ├── prepare_dataset.py      # Data preparation pipeline
│   ├── validate_dataset.py     # Dataset validation
│   └── split_dataset.py        # Train/val/test split
├── training/
│   ├── train.py                # Fine-tuning script
│   ├── evaluate.py             # Model evaluation
│   ├── merge_adapter.py        # Merge LoRA adapter
│   └── quantize.py             # Model quantization
├── inference/
│   ├── server.py               # FastAPI inference server
│   ├── model_loader.py         # Model loading utilities
│   ├── schemas.py              # Pydantic schemas
│   └── config.py               # Configuration
├── rag/
│   ├── ingestion.py            # Knowledge base ingestion
│   ├── chunking.py             # Document chunking
│   ├── embeddings.py           # Embedding generation
│   ├── retrieval.py            # Knowledge retrieval
│   └── vector_store.py         # Vector database operations
├── evaluation/
│   ├── benchmark.py            # Model benchmarking
│   ├── metrics.py              # Evaluation metrics
│   └── test_cases.json         # Test cases
├── models/
│   └── vendsway-llm/    # Trained model files
├── requirements.txt
└── README.md
```

## Dataset

The VendSway dataset teaches the model domain-specific tasks:

1. Regional commerce analysis
2. Regional fashion understanding
3. Indian textiles knowledge
4. GI products information
5. Festival commerce intelligence
6. Demand interpretation
7. Catalog gap analysis
8. Seller matching logic
9. Opportunity reasoning
10. Seller recommendations
11. Inventory recommendations
12. Seller mission generation
13. Campaign drafting
14. Marketplace operations
15. Agent planning
16. Tool selection
17. Explanation generation
18. Structured JSON output

**Important**: The model learns HOW to reason about the domain, not current database values. Current business facts come from PostgreSQL, tools, and RAG.

## Training

The training pipeline uses parameter-efficient fine-tuning (LoRA/QLoRA):

```bash
cd ai
pip install -r requirements.txt
python preprocessing/prepare_dataset.py
python training/train.py
```

## Inference

The FastAPI inference server provides:

- `POST /generate` - Generate text responses
- `POST /classify` - Classify intents
- `POST /plan` - Generate agent plans
- `POST /tool-selection` - Select appropriate tools
- `POST /explain` - Generate explanations
- `GET /health` - Health check

```bash
cd ai
python inference/server.py
```

## RAG

The RAG system provides domain knowledge grounding:

- Indian regional fashion knowledge
- Textiles and GI products information
- Festival commerce intelligence
- Regional commerce patterns
- Marketplace policies

Uses local sentence-transformers models (no external API required).

## Integration with Existing Agents

The LLM enhances existing agents without replacing them:

- **ReasoningAgent**: Enhanced reasoning with LLM
- **PredictionAgent**: Improved explanations with LLM
- **DecisionAgent**: Better tool selection with LLM
- **ActionAgent**: Structured output validation

**Critical Business Logic Remains Deterministic**:
- Demand scores (DemandCalculationService)
- Catalog gap scores (GapCalculationService)
- Seller eligibility (SellerMatchingService)
- Financial calculations
- Database integrity
- Authorization and security

## Current Status

- ✅ Architecture designed
- ✅ Training pipeline implemented
- ✅ Inference server implemented
- ✅ RAG architecture implemented
- ✅ Tool system implemented
- ⚠️ Model training requires GPU resources (not executed in current environment)
- ⚠️ Model evaluation requires trained model (not executed in current environment)

## Technical Honesty

**Model Training Status**: The complete training pipeline is implemented and reproducible. However, actual model training has not been executed in the current environment due to GPU resource constraints. Training must be executed in an environment with appropriate GPU resources (8GB+ VRAM recommended).

**Model Evaluation Status**: Evaluation benchmarks are implemented but require a trained model to produce actual metrics. No fabricated accuracy numbers are reported.

**Current Operation**: The system operates with the deterministic Agentic AI layer without LLM enhancement. When the LLM is trained and deployed, it will enhance reasoning and explanation capabilities while maintaining deterministic business logic for critical operations.
