"""
VendSway Dataset Preparation
Prepares domain-specific instruction dataset for regional fashion-commerce intelligence
"""

import json
import jsonlines
from typing import List, Dict, Any
from pathlib import Path
import random

class DatasetPreparer:
    """Prepares the VendSway instruction dataset"""
    
    def __init__(self, raw_dir: str = "./dataset/raw", output_dir: str = "./dataset/processed"):
        self.raw_dir = Path(raw_dir)
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)
    
    def create_sample_dataset(self) -> List[Dict[str, Any]]:
        """Create a sample dataset for demonstration purposes"""
        
        # Sample training examples for regional fashion-commerce intelligence
        sample_data = [
            {
                "instruction": "Analyze the regional commerce opportunity.",
                "context": {
                    "region": "Andhra Pradesh",
                    "festival": "Pongal",
                    "demandSignals": [
                        {"category": "Handloom Sarees", "demandScore": 87, "trend": "increasing"},
                        {"category": "Traditional Jewelry", "demandScore": 72, "trend": "stable"}
                    ],
                    "catalogGaps": [
                        {"category": "Handloom Sarees", "gapScore": 78, "reason": "Low regional seller availability"},
                        {"category": "Traditional Jewelry", "gapScore": 45, "reason": "Moderate coverage"}
                    ],
                    "sellerCapabilities": [
                        {"seller": "AP Textiles", "categories": ["Handloom Sarees"], "quality": "Premium"},
                        {"seller": "Kalamkari Arts", "categories": ["Handloom Sarees"], "quality": "Premium"}
                    ]
                },
                "response": {
                    "opportunity": "Increase Handloom Saree inventory in Andhra Pradesh for Pongal festival",
                    "reasoning": "High regional demand (87) combined with low catalog coverage (78 gap score) and strong upcoming festival relevance indicates a high-priority catalog opportunity. Multiple premium sellers available in the region.",
                    "recommendedActions": [
                        "Onboard AP Textiles and Kalamkari Arts as priority sellers",
                        "Increase Handloom Saree inventory by 40% before Pongal season",
                        "Create festival-specific marketing campaign"
                    ],
                    "confidence": 0.84,
                    "priority": "HIGH"
                }
            },
            {
                "instruction": "Match sellers to the catalog gap.",
                "context": {
                    "region": "Gujarat",
                    "category": "Patola Silk Sarees",
                    "gapScore": 88,
                    "requiredCapabilities": ["GI certification", "weaving expertise", "regional location"],
                    "availableSellers": [
                        {"name": "R.K. Textiles", "location": "Gujarat", "capabilities": ["weaving"], "certification": "GI"},
                        {"name": "Ahmedabad Silks", "location": "Gujarat", "capabilities": ["weaving", "retail"], "certification": "GI"}
                    ]
                },
                "response": {
                    "matchedSellers": ["R.K. Textiles", "Ahmedabad Silks"],
                    "reasoning": "Both sellers have GI certification and regional location in Gujarat, matching the required capabilities for Patola Silk Sarees. R.K. Textiles scores slightly higher due to specialized weaving expertise.",
                    "sellerScores": {"R.K. Textiles": 0.92, "Ahmedabad Silks": 0.87},
                    "recommendation": "Prioritize R.K. Textiles for initial onboarding, followed by Ahmedabad Silks"
                }
            },
            {
                "instruction": "Generate a seller mission.",
                "context": {
                    "sellerId": "seller_123",
                    "sellerName": "Tamil Nadu Textiles",
                    "region": "Tamil Nadu",
                    "upcomingFestival": "Pongal",
                    "sellerCapabilities": ["Cotton Sarees", "Traditional Weaving"],
                    "marketOpportunities": [
                        {"category": "Cotton Sarees", "demandScore": 91, "seasonality": "high"},
                        {"category": "Traditional Weaving", "demandScore": 78, "seasonality": "medium"}
                    ]
                },
                "response": {
                    "mission": "Add 15 Cotton Saree products before Pongal festival season",
                    "reasoning": "Seller's capabilities (Cotton Sarees, Traditional Weaving) align with high regional demand for Cotton Sarees (91 demand score) during Pongal season. Pongal is 45 days away, providing sufficient time for product creation and approval.",
                    "actionItems": [
                        "Add 8 handloom cotton saree designs",
                        "Add 7 power loom cotton saree designs",
                        "Include traditional Tamil Nadu motifs",
                        "Complete product submissions within 30 days"
                    ],
                    "expectedBenefit": "30% increase in regional sales during Pongal season",
                    "priority": "HIGH",
                    "deadline": "30 days"
                }
            },
            {
                "instruction": "Explain the demand signal.",
                "context": {
                    "region": "Maharashtra",
                    "category": "Paithani Sarees",
                    "demandScore": 85,
                    "festivalImpact": "Ganesh Chaturthi",
                    "historicalTrend": "+120% YoY",
                    "sellerCoverage": "12 active sellers"
                },
                "response": {
                    "explanation": "Paithani Sarees show strong demand in Maharashtra (85/100) driven by Ganesh Chaturthi festival impact. Historical trend shows +120% year-over-year growth during festival season. Current seller coverage (12 active sellers) is insufficient to meet projected demand.",
                    "keyFactors": [
                        "Festival-driven demand surge",
                        "Strong cultural significance",
                        "Limited seller coverage creating supply constraint",
                        "Historical growth indicates sustainable demand"
                    ],
                    "recommendation": "Expand seller network by 50% and increase inventory levels by 40% before festival season"
                }
            },
            {
                "instruction": "Select tools for opportunity analysis.",
                "context": {
                    "task": "Analyze regional fashion opportunity",
                    "availableTools": [
                        "getRegionalDemand",
                        "getCatalogGaps",
                        "getFestivalInformation",
                        "findPotentialSellers",
                        "calculateOpportunityScore"
                    ],
                    "userQuery": "What opportunities exist for handloom products in Andhra Pradesh?"
                },
                "response": {
                    "selectedTools": [
                        "getRegionalDemand",
                        "getCatalogGaps",
                        "getFestivalInformation",
                        "findPotentialSellers"
                    ],
                    "toolOrder": [
                        "getRegionalDemand",
                        "getCatalogGaps",
                        "getFestivalInformation",
                        "findPotentialSellers",
                        "calculateOpportunityScore"
                    ],
                    "reasoning": "To analyze handloom opportunities in Andhra Pradesh, we need demand data first, then catalog gap analysis, festival context for timing, seller availability for execution, and finally opportunity scoring for prioritization.",
                    "plan": [
                        "1. Retrieve regional demand for handloom products in Andhra Pradesh",
                        "2. Identify catalog gaps in handloom category",
                        "3. Check upcoming festivals affecting handloom demand",
                        "4. Find potential sellers in the region",
                        "5. Calculate comprehensive opportunity score"
                    ]
                }
            }
        ]
        
        return sample_data
    
    def format_for_training(self, data: List[Dict[str, Any]]) -> List[str]:
        """Format data for instruction fine-tuning"""
        formatted_data = []
        
        for item in data:
            # Format as instruction-following conversation
            formatted = {
                "messages": [
                    {
                        "role": "system",
                        "content": "You are VendSway AI, a specialized assistant for regional fashion-commerce intelligence. You analyze regional demand, catalog gaps, seller capabilities, and marketplace opportunities. Provide structured, explainable responses with confidence scores."
                    },
                    {
                        "role": "user",
                        "content": f"{item['instruction']}\n\nContext: {json.dumps(item['context'], indent=2)}"
                    },
                    {
                        "role": "assistant",
                        "content": json.dumps(item['response'], indent=2)
                    }
                ]
            }
            formatted_data.append(formatted)
        
        return formatted_data
    
    def save_dataset(self, data: List[str], filename: str):
        """Save dataset to JSONL file"""
        output_path = self.output_dir / filename
        
        with jsonlines.open(output_path, 'w') as writer:
            for item in data:
                writer.write(item)
        
        print(f"✓ Saved {len(data)} examples to {output_path}")
    
    def prepare_datasets(self):
        """Prepare all datasets"""
        print("🔄 Preparing VendSway dataset...")
        
        # Create sample data
        sample_data = self.create_sample_dataset()
        
        # Format for training
        formatted_data = self.format_for_training(sample_data)
        
        # Split into train/validation/test
        random.shuffle(formatted_data)
        
        train_split = int(0.8 * len(formatted_data))
        val_split = int(0.9 * len(formatted_data))
        
        train_data = formatted_data[:train_split]
        val_data = formatted_data[train_split:val_split]
        test_data = formatted_data[val_split:]
        
        # Save datasets
        self.save_dataset(train_data, "train.jsonl")
        self.save_dataset(val_data, "validation.jsonl")
        self.save_dataset(test_data, "test.jsonl")
        
        print(f"✓ Dataset preparation complete:")
        print(f"  - Training: {len(train_data)} examples")
        print(f"  - Validation: {len(val_data)} examples")
        print(f"  - Test: {len(test_data)} examples")

if __name__ == "__main__":
    preparer = DatasetPreparer()
    preparer.prepare_datasets()