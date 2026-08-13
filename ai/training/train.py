"""
VendSway LLM Training Script
Fine-tunes Qwen2.5-0.5B-Instruct using LoRA for regional fashion-commerce intelligence
"""

import os
import torch
from transformers import (
    AutoTokenizer,
    AutoModelForCausalLM,
    TrainingArguments,
    Trainer,
    DataCollatorForLanguageModeling
)
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training
from datasets import load_dataset
from config import config
import jsonlines
from typing import List, Dict, Any

class VendSwayTrainer:
    """Trains the VendSway LLM"""
    
    def __init__(self):
        self.device = self._get_device()
        print(f"🔧 Using device: {self.device}")
    
    def _get_device(self) -> str:
        """Determine the appropriate device"""
        if config.DEVICE == "cuda" and torch.cuda.is_available():
            return "cuda"
        elif config.DEVICE == "cpu":
            return "cpu"
        else:
            return "cuda" if torch.cuda.is_available() else "cpu"
    
    def load_model_and_tokenizer(self):
        """Load the base model and tokenizer"""
        print(f"📥 Loading model: {config.MODEL_NAME}")
        
        # Load tokenizer
        tokenizer = AutoTokenizer.from_pretrained(
            config.MODEL_NAME,
            trust_remote_code=True,
            padding_side="right"
        )
        
        # Set pad token if not present
        if tokenizer.pad_token is None:
            tokenizer.pad_token = tokenizer.eos_token
        
        # Load model
        model = AutoModelForCausalLM.from_pretrained(
            config.MODEL_NAME,
            trust_remote_code=True,
            torch_dtype=torch.float16 if self.device == "cuda" else torch.float32,
            device_map="auto" if self.device == "cuda" else None,
            quantization_config=None  # Add bitsandbytes config if needed
        )
        
        # Prepare model for k-bit training if quantization is enabled
        if config.QUANTIZATION:
            model = prepare_model_for_kbit_training(model)
        
        # Apply LoRA
        lora_config = LoraConfig(
            r=config.LORA_R,
            lora_alpha=config.LORA_ALPHA,
            lora_dropout=config.LORA_DROPOUT,
            target_modules=config.LORA_TARGET_MODULES,
            bias="none",
            task_type="CAUSAL_LM"
        )
        
        model = get_peft_model(model, lora_config)
        model.print_trainable_parameters()
        
        return model, tokenizer
    
    def load_dataset(self) -> Dict[str, Any]:
        """Load and prepare the training dataset"""
        print(f"📚 Loading dataset from {config.DATASET_PATH}")
        
        # Load JSONL file
        data = []
        with jsonlines.open(config.DATASET_PATH) as reader:
            for item in reader:
                data.append(item)
        
        # Process into format expected by model
        def tokenize_function(examples):
            return tokenizer(
                json.dumps(examples),
                truncation=True,
                max_length=config.MAX_LENGTH,
                padding="max_length"
            )
        
        # Create dataset (simplified - in production use HuggingFace datasets)
        from datasets import Dataset
        dataset = Dataset.from_list(data)
        tokenized_dataset = dataset.map(tokenize_function, batched=False)
        
        return tokenized_dataset
    
    def train(self):
        """Execute the training pipeline"""
        print("🚀 Starting VendSway LLM training...")
        
        # Load model and tokenizer
        model, tokenizer = self.load_model_and_tokenizer()
        
        # Load dataset
        dataset = self.load_dataset()
        
        # Training arguments
        training_args = TrainingArguments(
            output_dir=config.OUTPUT_DIR,
            num_train_epochs=config.EPOCHS,
            per_device_train_batch_size=config.BATCH_SIZE,
            gradient_accumulation_steps=config.GRADIENT_ACCUMULATION_STEPS,
            learning_rate=config.LEARNING_RATE,
            warmup_steps=config.WARMUP_STEPS,
            max_steps=config.MAX_STEPS,
            logging_steps=config.LOGGING_STEPS,
            save_steps=config.SAVE_STEPS,
            eval_steps=config.EVAL_STEPS,
            save_total_limit=3,
            load_best_model_at_end=True,
            fp16=self.device == "cuda",
            gradient_checkpointing=True,
            optim="adamw_torch",
            ddp_find_unused_parameters=False,
            report_to="none",  # Disable wandb/mlflow for now
        )
        
        # Data collator
        data_collator = DataCollatorForLanguageModeling(
            tokenizer=tokenizer,
            mlm=False,
            pad_to_multiple_of=8
        )
        
        # Initialize trainer
        trainer = Trainer(
            model=model,
            args=training_args,
            train_dataset=dataset,
            data_collator=data_collator,
            tokenizer=tokenizer,
        )
        
        # Train
        print("🏋️  Starting training...")
        trainer.train()
        
        # Save final model
        print(f"💾 Saving model to {config.OUTPUT_DIR}")
        trainer.save_model(config.OUTPUT_DIR)
        tokenizer.save_pretrained(config.OUTPUT_DIR)
        
        print("✅ Training complete!")
        return trainer

if __name__ == "__main__":
    trainer = VendSwayTrainer()
    trainer.train()