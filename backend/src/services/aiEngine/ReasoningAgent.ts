// ============================================================================
// REASONING AGENT
// ============================================================================
// Agentic wrapper for reasoning about observed data
// Responsible for explainable analysis of demand, gaps, and market conditions

import ReasonEngine from './ReasonEngine';
import { ObservationContext, ReasoningContext } from './types';
import LLMIntegrationServiceClass from '../LLMIntegrationService';

export interface ReasoningAgentContext {
  observationContext: ObservationContext;
  focus?: 'demand' | 'gaps' | 'sellers' | 'festivals' | 'comprehensive';
  useLLM?: boolean;
}

export interface ReasoningAgentResult {
  reasoningContext: ReasoningContext;
  scores: {
    regionalRelevance: number;
    demandScore: number;
    festivalRelevance: number;
    inventoryHealth: number;
    sellerSuitability: number;
    marketOpportunity: number;
    competitionScore: number;
  };
  explanation: string;
  confidence: number;
  keyInsights: string[];
  llmEnhanced: boolean;
}

class ReasoningAgent {
  private llmIntegrationService: typeof LLMIntegrationServiceClass;

  constructor() {
    this.llmIntegrationService = LLMIntegrationServiceClass;
  }

  /**
   * Reason about observed data to generate explainable insights
   */
  async reason(context: ReasoningAgentContext): Promise<ReasoningContext> {
    console.log('🧠 REASONING AGENT: Analyzing observed data and generating explainable insights...');
    
    const reasoning = await ReasonEngine.reason(context.observationContext);
    
    console.log(`📝 Reasoning: ${reasoning.reasoning}`);
    console.log(`📊 Market Opportunity Score: ${reasoning.scores.marketOpportunity.toFixed(0)}/100`);
    
    return reasoning;
  }

  /**
   * Get detailed reasoning result with explainable insights and LLM enhancement
   */
  async getDetailedReasoning(context: ReasoningAgentContext): Promise<ReasoningAgentResult> {
    const reasoningContext = await this.reason(context);
    
    const keyInsights = this.generateKeyInsights(reasoningContext);
    
    // Try to enhance with LLM if available
    let llmEnhanced = false;
    let enhancedExplanation = reasoningContext.reasoning;
    
    if (context.useLLM !== false) {
      try {
        const llmAvailable = await this.llmIntegrationService.isLLMAvailable();
        if (llmAvailable) {
          const region = context.observationContext.regions[0]?.name || 'Unknown';
          const category = context.observationContext.demandSignals[0]?.category || 'Unknown';
          
          const enhanced = await this.llmIntegrationService.enhancedReasoning({
            region,
            category,
            demandScore: reasoningContext.scores.demandScore,
            gapScore: reasoningContext.scores.marketOpportunity
          });
          
          enhancedExplanation = enhanced.explanation;
          llmEnhanced = enhanced.llmGenerated;
          console.log('🤖 LLM enhancement applied to reasoning');
        }
      } catch (error) {
        console.log('⚠️  LLM enhancement failed, using deterministic reasoning only');
      }
    }
    
    return {
      reasoningContext,
      scores: reasoningContext.scores,
      explanation: enhancedExplanation,
      confidence: reasoningContext.scores.marketOpportunity / 100,
      keyInsights,
      llmEnhanced
    };
  }

  /**
   * Generate human-readable key insights from reasoning
   */
  private generateKeyInsights(reasoning: ReasoningContext): string[] {
    const insights: string[] = [];
    const { scores } = reasoning;

    if (scores.demandScore > 80) {
      insights.push(`High regional demand detected (${scores.demandScore.toFixed(0)}/100) indicates strong market opportunity`);
    }

    if (scores.marketOpportunity > 75) {
      insights.push(`Strong market opportunity score (${scores.marketOpportunity.toFixed(0)}/100) suggests high potential for commerce activity`);
    }

    if (scores.festivalRelevance > 70) {
      insights.push(`High festival relevance (${scores.festivalRelevance.toFixed(0)}/100) indicates seasonal demand potential`);
    }

    if (scores.inventoryHealth < 50) {
      insights.push(`Low inventory health (${scores.inventoryHealth.toFixed(0)}/100) suggests potential stock issues`);
    }

    if (scores.sellerSuitability > 70) {
      insights.push(`High seller suitability (${scores.sellerSuitability.toFixed(0)}/100) indicates good seller match for opportunities`);
    }

    if (scores.competitionScore > 60) {
      insights.push(`High competition (${scores.competitionScore.toFixed(0)}/100) suggests crowded market segment`);
    }

    if (insights.length === 0) {
      insights.push('Market conditions appear stable with no urgent concerns or exceptional opportunities');
    }

    return insights;
  }
}

export default new ReasoningAgent();
