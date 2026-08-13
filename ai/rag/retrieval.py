"""
VendSway RAG System
Retrieval-Augmented Generation for domain knowledge grounding
"""

from sentence_transformers import SentenceTransformer
import numpy as np
from typing import List, Dict, Any, Optional
import json
from pathlib import Path

class VendSwayRAG:
    """RAG system for VendSway domain knowledge"""
    
    def __init__(self, embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2"):
        print(f"🔧 Loading embedding model: {embedding_model}")
        self.embedding_model = SentenceTransformer(embedding_model)
        self.knowledge_base = self._load_knowledge_base()
        print(f"✓ Loaded {len(self.knowledge_base)} knowledge documents")
    
    def _load_knowledge_base(self) -> List[Dict[str, Any]]:
        """Load domain knowledge base"""
        # Sample knowledge base for demonstration
        knowledge = [
            {
                "id": "kb_001",
                "content": "Indian regional fashion varies significantly by state. For example, Kerala is known for Kasavu sarees and Mundu, while Gujarat is famous for Patola silk sarees and Bandhani. Understanding regional preferences is crucial for marketplace success.",
                "category": "regional_fashion",
                "region": "all",
                "source": "vendsway_knowledge"
            },
            {
                "id": "kb_002",
                "content": "Geographical Indication (GI) tagged products are protected under Indian law. Examples include Kanchipuram sarees (Tamil Nadu), Banarasi sarees (Uttar Pradesh), and Pashmina shawls (Jammu & Kashmir). GI certification indicates authenticity and regional origin.",
                "category": "gi_products",
                "region": "all",
                "source": "vendsway_knowledge"
            },
            {
                "id": "kb_003",
                "content": "Festival-driven demand is a key driver in Indian fashion commerce. Major festivals like Diwali, Pongal, Onam, Durga Puja, and Eid create seasonal demand patterns. Sellers should plan inventory 4-6 weeks before major regional festivals.",
                "category": "festivals",
                "region": "all",
                "source": "vendsway_knowledge"
            },
            {
                "id": "kb_004",
                "content": "Handloom textiles are classified by weaving technique and region. Famous varieties include: Ikat (Odisha, Gujarat), Jamdani (West Bengal, Bangladesh), Kanjeevaram (Tamil Nadu), and Chanderi (Madhya Pradesh). Each requires specific seller capabilities.",
                "category": "textiles",
                "region": "all",
                "source": "vendsway_knowledge"
            },
            {
                "id": "kb_005",
                "content": "Catalog gap analysis compares regional demand signals with marketplace inventory. A gap score above 70 indicates a significant opportunity, while scores below 30 suggest adequate coverage. Gap analysis should consider seasonal variations and festival timing.",
                "category": "catalog_gaps",
                "region": "all",
                "source": "vendsway_knowledge"
            },
            {
                "id": "kb_006",
                "content": "Seller matching algorithms consider multiple factors: geographic proximity, product category alignment, quality certifications (GI, handloom marks), historical performance, and production capacity. Regional sellers typically have 15-20% higher acceptance rates for regional opportunities.",
                "category": "seller_matching",
                "region": "all",
                "source": "vendsway_knowledge"
            },
            {
                "id": "kb_007",
                "content": "Demand signals are calculated from multiple data points: search volume trends, social media mentions, festival calendar proximity, seasonal patterns, and competitor analysis. Demand scores are weighted: 40% current demand, 30% trend momentum, 20% festival relevance, 10% historical patterns.",
                "category": "demand_analysis",
                "region": "all",
                "source": "vendsway_knowledge"
            },
            {
                "id": "kb_008",
                "content": "Seller missions are AI-generated growth tasks personalized for each seller. Missions are generated based on: regional opportunities, seller capabilities, product gaps, festival timing, and seller performance history. Typical mission completion rates range from 40-60%.",
                "category": "seller_missions",
                "region": "all",
                "source": "vendsway_knowledge"
            }
        ]
        
        return knowledge
    
    def embed_documents(self):
        """Generate embeddings for knowledge base"""
        print("🔧 Generating embeddings for knowledge base...")
        
        texts = [doc["content"] for doc in self.knowledge_base]
        embeddings = self.embedding_model.encode(texts, show_progress_bar=True)
        
        for i, doc in enumerate(self.knowledge_base):
            doc["embedding"] = embeddings[i].tolist()
        
        print(f"✓ Generated embeddings for {len(self.knowledge_base)} documents")
    
    def retrieve(self, query: str, top_k: int = 3, category: Optional[str] = None) -> List[Dict[str, Any]]:
        """Retrieve relevant knowledge documents"""
        # Generate query embedding
        query_embedding = self.embedding_model.encode([query])[0]
        
        # Calculate similarities
        similarities = []
        for doc in self.knowledge_base:
            if category is None or doc["category"] == category:
                doc_embedding = np.array(doc["embedding"])
                similarity = np.dot(query_embedding, doc_embedding) / (
                    np.linalg.norm(query_embedding) * np.linalg.norm(doc_embedding)
                )
                similarities.append((similarity, doc))
        
        # Sort by similarity and return top_k
        similarities.sort(key=lambda x: x[0], reverse=True)
        top_docs = [doc for similarity, doc in similarities[:top_k]]
        
        return top_docs
    
    def augment_prompt(self, query: str, context: str = "") -> str:
        """Augment prompt with retrieved knowledge"""
        if context:
            return f"""Use the following context to answer the question:

Context:
{context}

Question: {query}

Answer:"""
        else:
            return query

if __name__ == "__main__":
    rag = VendSwayRAG()
    rag.embed_documents()
    
    # Test retrieval
    results = rag.retrieve("How should sellers plan for festivals?", top_k=2)
    print("\n🔍 Retrieved documents:")
    for i, doc in enumerate(results, 1):
        print(f"{i}. {doc['category']}: {doc['content'][:100]}...")