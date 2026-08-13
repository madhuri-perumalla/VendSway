"""
VendSway Tool System
Controlled tool registry for agent operations with validation and audit logging
"""

from typing import Dict, Any, List, Optional, Callable
from pydantic import BaseModel, Field
import json
from datetime import datetime

class ToolInput(BaseModel):
    """Tool input schema"""
    data: Dict[str, Any]

class ToolOutput(BaseModel):
    """Tool output schema"""
    success: bool
    data: Any
    error: Optional[str] = None
    execution_time_ms: float

class Tool:
    """Represents a tool that agents can use"""
    
    def __init__(
        self,
        name: str,
        description: str,
        input_schema: Dict[str, Any],
        output_schema: Dict[str, Any],
        requires_auth: bool = True,
        validation: Optional[Callable] = None
    ):
        self.name = name
        self.description = description
        self.input_schema = input_schema
        self.output_schema = output_schema
        self.requires_auth = requires_auth
        self.validation = validation
        self.execution_count = 0
        self.last_executed = None
    
    def execute(self, input_data: Dict[str, Any], user_id: Optional[str] = None) -> ToolOutput:
        """Execute the tool with validation and logging"""
        start_time = datetime.now()
        
        try:
            # Validate input
            if self.validation:
                self.validation(input_data)
            
            # Check authorization
            if self.requires_auth and not user_id:
                return ToolOutput(
                    success=False,
                    data=None,
                    error="Authentication required",
                    execution_time_ms=0
                )
            
            # Execute tool logic (to be implemented by subclasses)
            result = self._execute_logic(input_data, user_id)
            
            execution_time = (datetime.now() - start_time).total_seconds() * 1000
            self.execution_count += 1
            self.last_executed = datetime.now()
            
            return ToolOutput(
                success=True,
                data=result,
                execution_time_ms=execution_time
            )
        
        except Exception as e:
            execution_time = (datetime.now() - start_time).total_seconds() * 1000
            return ToolOutput(
                success=False,
                data=None,
                error=str(e),
                execution_time_ms=execution_time
            )
    
    def _execute_logic(self, input_data: Dict[str, Any], user_id: Optional[str]) -> Any:
        """Override this method in subclasses"""
        raise NotImplementedError("Tool logic must be implemented by subclass")

class ToolRegistry:
    """Registry of available tools"""
    
    def __init__(self):
        self.tools: Dict[str, Tool] = {}
        self._register_default_tools()
    
    def _register_default_tools(self):
        """Register default VendSway tools"""
        
        # Register tools
        self.register_tool(
            name="getRegionalDemand",
            description="Retrieve regional demand signals for analysis",
            input_schema={
                "type": "object",
                "properties": {
                    "region": {"type": "string"},
                    "category": {"type": "string", "optional": True}
                }
            },
            output_schema={
                "type": "object",
                "properties": {
                    "demandSignals": {"type": "array"},
                    "averageScore": {"type": "number"}
                }
            }
        )
        
        self.register_tool(
            name="getCatalogGaps",
            description="Retrieve catalog gap information for analysis",
            input_schema={
                "type": "object",
                "properties": {
                    "region": {"type": "string"},
                    "category": {"type": "string", "optional": True}
                }
            },
            output_schema={
                "type": "object",
                "properties": {
                    "gaps": {"type": "array"},
                    "averageGapScore": {"type": "number"}
                }
            }
        )
        
        self.register_tool(
            name="getFestivalInformation",
            description="Retrieve festival information for timing analysis",
            input_schema={
                "type": "object",
                "properties": {
                    "region": {"type": "string"},
                    "festival": {"type": "string", "optional": True}
                }
            },
            output_schema={
                "type": "object",
                "properties": {
                    "festivals": {"type": "array"},
                    "upcomingFestivals": {"type": "array"}
                }
            }
        )
        
        self.register_tool(
            name="getTextileInformation",
            description="Retrieve textile information for regional fashion context",
            input_schema={
                "type": "object",
                "properties": {
                    "region": {"type": "string"},
                    "textile": {"type": "string", "optional": True}
                }
            },
            output_schema={
                "type": "object",
                "properties": {
                    "textiles": {"type": "array"},
                    "regionalSpecialties": {"type": "array"}
                }
            }
        )
        
        self.register_tool(
            name="getGIProducts",
            description="Retrieve Geographical Indication tagged products",
            input_schema={
                "type": "object",
                "properties": {
                    "region": {"type": "string"},
                    "category": {"type": "string", "optional": True}
                }
            },
            output_schema={
                "type": "object",
                "properties": {
                    "giProducts": {"type": "array"},
                    "certificationStatus": {"type": "string"}
                }
            }
        )
        
        self.register_tool(
            name="getRegionalTrends",
            description="Retrieve regional trend information",
            input_schema={
                "type": "object",
                "properties": {
                    "region": {"type": "string"},
                    "category": {"type": "string", "optional": True}
                }
            },
            output_schema={
                "type": "object",
                "properties": {
                    "trends": {"type": "array"},
                    "trendingProducts": {"type": "array"}
                }
            }
        )
        
        self.register_tool(
            name="findPotentialSellers",
            description="Find potential sellers for opportunities",
            input_schema={
                "type": "object",
                "properties": {
                    "region": {"type": "string"},
                    "category": {"type": "string"},
                    "minQuality": {"type": "number", "optional": True}
                }
            },
            output_schema={
                "type": "object",
                "properties": {
                    "sellers": {"type": "array"},
                    "matchCount": {"type": "number"}
                }
            }
        )
        
        self.register_tool(
            name="getSellerCapabilities",
            description="Retrieve seller capabilities for matching",
            input_schema={
                "type": "object",
                "properties": {
                    "sellerId": {"type": "string"}
                }
            },
            output_schema={
                "type": "object",
                "properties": {
                    "capabilities": {"type": "array"},
                    "qualityScore": {"type": "number"},
                    "categories": {"type": "array"}
                }
            }
        )
        
        self.register_tool(
            name="calculateDemandScore",
            description="Calculate demand score using deterministic business logic",
            input_schema={
                "type": "object",
                "properties": {
                    "region": {"type": "string"},
                    "category": {"type": "string"},
                    "festival": {"type": "string", "optional": True}
                }
            },
            output_schema={
                "type": "object",
                "properties": {
                    "demandScore": {"type": "number"},
                    "components": {"type": "object"}
                }
            }
        )
        
        self.register_tool(
            name="calculateGapScore",
            description="Calculate catalog gap score using deterministic business logic",
            input_schema={
                "type": "object",
                "properties": {
                    "region": {"type": "string"},
                    "category": {"type": "string"}
                }
            },
            output_schema={
                "type": "object",
                "properties": {
                    "gapScore": {"type": "number"},
                    "gapAnalysis": {"type": "object"}
                }
            }
        )
        
        self.register_tool(
            name="calculateOpportunityScore",
            description="Calculate opportunity score using deterministic business logic",
            input_schema={
                "type": "object",
                "properties": {
                    "demandScore": {"type": "number"},
                    "gapScore": {"type": "number"},
                    "festivalRelevance": {"type": "number"},
                    "sellerAvailability": {"type": "number"}
                }
            },
            output_schema={
                "type": "object",
                "properties": {
                    "opportunityScore": {"type": "number"},
                    "components": {"type": "object"}
                }
            }
        )
        
        self.register_tool(
            name="matchSeller",
            description="Match seller to opportunity using deterministic business logic",
            input_schema={
                "type": "object",
                "properties": {
                    "sellerId": {"type": "string"},
                    "opportunityId": {"type": "string"}
                }
            },
            output_schema={
                "type": "object",
                "properties": {
                    "matchScore": {"type": "number"},
                    "matchReasoning": {"type": "string"},
                    "recommendation": {"type": "string"}
                }
            }
        )
        
        self.register_tool(
            name="generateSellerMission",
            description="Generate seller mission (LLM-assisted)",
            input_schema={
                "type": "object",
                "properties": {
                    "sellerId": {"type": "string"},
                    "opportunityId": {"type": "string", "optional": True}
                }
            },
            output_schema={
                "type": "object",
                "properties": {
                    "mission": {"type": "string"},
                    "actionItems": {"type": "array"},
                    "priority": {"type": "string"},
                    "deadline": {"type": "string"}
                }
            }
        )
        
        self.register_tool(
            name="generateRecommendation",
            description="Generate recommendation (LLM-assisted)",
            input_schema={
                "type": "object",
                "properties": {
                    "type": {"type": "string"},
                    "context": {"type": "object"}
                }
            },
            output_schema={
                "type": "object",
                "properties": {
                    "recommendation": {"type": "string"},
                    "reasoning": {"type": "string"},
                    "confidence": {"type": "number"}
                }
            }
        )
        
        self.register_tool(
            name="generateCampaignDraft",
            description="Generate campaign draft (LLM-assisted)",
            input_schema={
                "type": "object",
                "properties": {
                    "opportunityId": {"type": "string"},
                    "campaignType": {"type": "string"}
                }
            },
            output_schema={
                "type": "object",
                "properties": {
                    "campaignDraft": {"type": "string"},
                    "channels": {"type": "array"},
                    "content": {"type": "object"}
                }
            }
        )
        
        self.register_tool(
            name="getCampaignPerformance",
            description="Retrieve campaign performance metrics",
            input_schema={
                "type": "object",
                "properties": {
                    "campaignId": {"type": "string"}
                }
            },
            output_schema={
                "type": "object",
                "properties": {
                    "performance": {"type": "object"},
                    "metrics": {"type": "object"}
                }
            }
        )
        
        self.register_tool(
            name="retrieveKnowledge",
            description="Retrieve domain knowledge from RAG system",
            input_schema={
                "type": "object",
                "properties": {
                    "query": {"type": "string"},
                    "category": {"type": "string", "optional": True},
                    "topK": {"type": "number", "optional": True}
                }
            },
            output_schema={
                "type": "object",
                "properties": {
                    "documents": {"type": "array"},
                    "relevanceScores": {"type": "array"}
                }
            }
        )
    
    def register_tool(
        self,
        name: str,
        description: str,
        input_schema: Dict[str, Any],
        output_schema: Dict[str, Any],
        requires_auth: bool = True,
        validation: Optional[Callable] = None
    ):
        """Register a new tool"""
        tool = Tool(
            name=name,
            description=description,
            input_schema=input_schema,
            output_schema=output_schema,
            requires_auth=requires_auth,
            validation=validation
        )
        self.tools[name] = tool
        print(f"✓ Registered tool: {name}")
    
    def get_tool(self, name: str) -> Optional[Tool]:
        """Get a tool by name"""
        return self.tools.get(name)
    
    def list_tools(self) -> List[str]:
        """List all available tool names"""
        return list(self.tools.keys())
    
    def get_tool_info(self, name: str) -> Optional[Dict[str, Any]]:
        """Get tool information"""
        tool = self.get_tool(name)
        if tool:
            return {
                "name": tool.name,
                "description": tool.description,
                "input_schema": tool.input_schema,
                "output_schema": tool.output_schema,
                "requires_auth": tool.requires_auth,
                "execution_count": tool.execution_count,
                "last_executed": tool.last_executed.isoformat() if tool.last_executed else None
            }
        return None

# Global tool registry instance
tool_registry = ToolRegistry()