"""
VendSway LLM Inference Server
FastAPI server for local LLM inference with structured output validation
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
from peft import PeftModel
import json
import os
from config import config

app = FastAPI(title="VendSway LLM Service", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # Backend and frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model state
model = None
tokenizer = None

class GenerateRequest(BaseModel):
    """Request for text generation"""
    prompt: str = Field(..., description="Input prompt for generation")
    max_tokens: int = Field(default=512, ge=1, le=2048, description="Maximum tokens to generate")
    temperature: float = Field(default=0.7, ge=0.0, le=1.0, description="Sampling temperature")
    system_prompt: Optional[str] = Field(default=None, description="Optional system prompt")

class GenerateResponse(BaseModel):
    """Response from text generation"""
    text: str
    tokens_generated: int
    model: str
    latency_ms: float

class ClassifyRequest(BaseModel):
    """Request for intent classification"""
    text: str = Field(..., description="Text to classify")
    categories: List[str] = Field(default=["OPPORTUNITY_DISCOVERY", "SELLER_MATCHING", "DEMAND_ANALYSIS", "CATALOG_GAP", "GENERAL"])

class ClassifyResponse(BaseModel):
    """Response from classification"""
    intent: str
    confidence: float
    model: str

class PlanRequest(BaseModel):
    """Request for agent planning"""
    task: str = Field(..., description="Task description")
    context: Dict[str, Any] = Field(default={}, description="Context information")
    available_tools: List[str] = Field(default=[], description="Available tools")

class PlanResponse(BaseModel):
    """Response from planning"""
    intent: str
    goal: str
    plan: List[str]
    tools: List[str]
    reasoning: str
    confidence: float

class ToolSelectionRequest(BaseModel):
    """Request for tool selection"""
    task: str = Field(..., description="Task description")
    available_tools: List[str] = Field(..., description="Available tools")
    context: Dict[str, Any] = Field(default={}, description="Context information")

class ToolSelectionResponse(BaseModel):
    """Response from tool selection"""
    selected_tools: List[str]
    tool_order: List[str]
    reasoning: str
    confidence: float

class ExplainRequest(BaseModel):
    """Request for explanation generation"""
    decision: Dict[str, Any] = Field(..., description="Decision to explain")
    context: Dict[str, Any] = Field(default={}, description="Context information")

class ExplainResponse(BaseModel):
    """Response from explanation"""
    explanation: str
    key_factors: List[str]
    recommendations: List[str]
    confidence: float

class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    model_loaded: bool
    model_name: Optional[str] = None
    device: str

def load_model():
    """Load the VendSway LLM"""
    global model, tokenizer
    
    print("🔧 Loading VendSway LLM...")
    
    try:
        # Check if fine-tuned model exists
        model_path = os.path.join(config.OUTPUT_DIR, "adapter_model")
        
        if os.path.exists(model_path):
            print(f"📥 Loading fine-tuned model from {model_path}")
            tokenizer = AutoTokenizer.from_pretrained(config.OUTPUT_DIR)
            base_model = AutoModelForCausalLM.from_pretrained(
                config.MODEL_NAME,
                torch_dtype=torch.float16,
                device_map="auto",
                trust_remote_code=True
            )
            model = PeftModel.from_pretrained(base_model, model_path)
        else:
            print(f"📥 Loading base model {config.MODEL_NAME}")
            tokenizer = AutoTokenizer.from_pretrained(
                config.MODEL_NAME,
                trust_remote_code=True
            )
            model = AutoModelForCausalLM.from_pretrained(
                config.MODEL_NAME,
                torch_dtype=torch.float16,
                device_map="auto",
                trust_remote_code=True
            )
        
        if tokenizer.pad_token is None:
            tokenizer.pad_token = tokenizer.eos_token
        
        print("✅ Model loaded successfully")
        return True
    except Exception as e:
        print(f"❌ Failed to load model: {e}")
        return False

@app.on_event("startup")
async def startup_event():
    """Load model on startup"""
    load_model()

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy" if model is not None else "unhealthy",
        model_loaded=model is not None,
        model_name=config.MODEL_NAME if model is not None else None,
        device=config.DEVICE
    )

@app.post("/generate", response_model=GenerateResponse)
async def generate_text(request: GenerateRequest):
    """Generate text using the LLM"""
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    import time
    start_time = time.time()
    
    try:
        # Prepare prompt
        if request.system_prompt:
            messages = [
                {"role": "system", "content": request.system_prompt},
                {"role": "user", "content": request.prompt}
            ]
        else:
            messages = [
                {"role": "system", "content": "You are VendSway AI, a specialized assistant for regional fashion-commerce intelligence."},
                {"role": "user", "content": request.prompt}
            ]
        
        # Format prompt for the model
        text = tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
        
        # Tokenize
        inputs = tokenizer(text, return_tensors="pt").to(model.device)
        
        # Generate
        with torch.no_grad():
            outputs = model.generate(
                **inputs,
                max_new_tokens=request.max_tokens,
                temperature=request.temperature,
                do_sample=True,
                top_p=0.95,
                top_k=50,
                pad_token_id=tokenizer.pad_token_id,
                eos_token_id=tokenizer.eos_token_id
            )
        
        # Decode
        generated_text = tokenizer.decode(outputs[0][inputs['input_ids'].shape[1]:], skip_special_tokens=True)
        
        latency = (time.time() - start_time) * 1000
        
        return GenerateResponse(
            text=generated_text,
            tokens_generated=len(outputs[0][inputs['input_ids'].shape[1]:]),
            model=config.MODEL_NAME,
            latency_ms=latency
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")

@app.post("/classify", response_model=ClassifyResponse)
async def classify_intent(request: ClassifyRequest):
    """Classify the intent of the input text"""
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    # Construct classification prompt
    categories_str = ", ".join(request.categories)
    prompt = f"""Classify the intent of the following text. Choose from these categories: {categories_str}

Text: {request.text}

Respond with JSON format:
{{
  "intent": "CATEGORY_NAME",
  "confidence": 0.0-1.0
}}"""
    
    response = await generate_text(GenerateRequest(prompt=prompt, max_tokens=100, temperature=0.3))
    
    try:
        # Extract JSON from response
        result = json.loads(response.text)
        return ClassifyResponse(
            intent=result.get("intent", "GENERAL"),
            confidence=result.get("confidence", 0.5),
            model=config.MODEL_NAME
        )
    except json.JSONDecodeError:
        # Fallback
        return ClassifyResponse(
            intent="GENERAL",
            confidence=0.5,
            model=config.MODEL_NAME
        )

@app.post("/plan", response_model=PlanResponse)
async def generate_plan(request: PlanRequest):
    """Generate an agent plan for the given task"""
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    # Construct planning prompt
    tools_str = ", ".join(request.available_tools)
    prompt = f"""You are VendSway AI, an agent planning assistant for regional fashion-commerce intelligence.

Task: {request.task}

Context: {json.dumps(request.context, indent=2)}

Available tools: {tools_str}

Generate a structured plan with:
1. Intent classification
2. Goal statement
3. Step-by-step plan
4. Required tools in order
5. Reasoning
6. Confidence score

Respond with JSON format:
{{
  "intent": "INTENT",
  "goal": "Clear goal statement",
  "plan": ["step1", "step2", "step3"],
  "tools": ["tool1", "tool2"],
  "reasoning": "detailed reasoning",
  "confidence": 0.0-1.0
}}"""
    
    response = await generate_text(GenerateRequest(prompt=prompt, max_tokens=512, temperature=0.5))
    
    try:
        result = json.loads(response.text)
        return PlanResponse(
            intent=result.get("intent", "UNKNOWN"),
            goal=result.get("goal", ""),
            plan=result.get("plan", []),
            tools=result.get("tools", []),
            reasoning=result.get("reasoning", ""),
            confidence=result.get("confidence", 0.5)
        )
    except json.JSONDecodeError:
        return PlanResponse(
            intent="UNKNOWN",
            goal="Unable to generate plan",
            plan=[],
            tools=[],
            reasoning="JSON parsing failed",
            confidence=0.0
        )

@app.post("/tool-selection", response_model=ToolSelectionResponse)
async def select_tools(request: ToolSelectionRequest):
    """Select appropriate tools for the given task"""
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    # Construct tool selection prompt
    tools_str = ", ".join(request.available_tools)
    prompt = f"""You are VendSway AI, a tool selection assistant for regional fashion-commerce intelligence.

Task: {request.task}

Context: {json.dumps(request.context, indent=2)}

Available tools: {tools_str}

Select the most appropriate tools and determine their execution order.

Respond with JSON format:
{{
  "selected_tools": ["tool1", "tool2"],
  "tool_order": ["tool1", "tool2"],
  "reasoning": "explanation of tool selection",
  "confidence": 0.0-1.0
}}"""
    
    response = await generate_text(GenerateRequest(prompt=prompt, max_tokens=256, temperature=0.3))
    
    try:
        result = json.loads(response.text)
        return ToolSelectionResponse(
            selected_tools=result.get("selected_tools", []),
            tool_order=result.get("tool_order", []),
            reasoning=result.get("reasoning", ""),
            confidence=result.get("confidence", 0.5)
        )
    except json.JSONDecodeError:
        return ToolSelectionResponse(
            selected_tools=[],
            tool_order=[],
            reasoning="JSON parsing failed",
            confidence=0.0
        )

@app.post("/explain", response_model=ExplainResponse)
async def generate_explanation(request: ExplainRequest):
    """Generate an explanation for a decision"""
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    # Construct explanation prompt
    prompt = f"""You are VendSway AI, an explanation assistant for regional fashion-commerce intelligence.

Decision: {json.dumps(request.decision, indent=2)}

Context: {json.dumps(request.context, indent=2)}

Generate a clear explanation including:
1. What the decision means
2. Key factors that influenced it
3. Recommendations for stakeholders
4. Confidence in the decision

Respond with JSON format:
{{
  "explanation": "clear explanation",
  "key_factors": ["factor1", "factor2"],
  "recommendations": ["recommendation1", "recommendation2"],
  "confidence": 0.0-1.0
}}"""
    
    response = await generate_text(GenerateRequest(prompt=prompt, max_tokens=384, temperature=0.4))
    
    try:
        result = json.loads(response.text)
        return ExplainResponse(
            explanation=result.get("explanation", ""),
            key_factors=result.get("key_factors", []),
            recommendations=result.get("recommendations", []),
            confidence=result.get("confidence", 0.5)
        )
    except json.JSONDecodeError:
        return ExplainResponse(
            explanation="Unable to generate explanation",
            key_factors=[],
            recommendations=[],
            confidence=0.0
        )

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting VendSway LLM Inference Server...")
    uvicorn.run(app, host="0.0.0.0", port=8000)