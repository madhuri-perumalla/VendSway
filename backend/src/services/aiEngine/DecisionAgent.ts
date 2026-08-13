// ============================================================================
// DECISION AGENT
// ============================================================================
// Agentic wrapper for making decisions based on predictions
// Responsible for converting predictions into actionable decisions with explainable reasoning

import DecisionEngine from './DecisionEngine';
import { PredictionContext, DecisionContext } from './types';
import LLMIntegrationServiceClass from '../LLMIntegrationService';

export interface DecisionAgentContext {
  predictionContext: PredictionContext;
  autonomyLevel?: 'recommend' | 'require_approval' | 'auto_execute';
  maxDecisions?: number;
  useLLM?: boolean;
}

export interface DecisionAgentResult {
  decisionContext: DecisionContext;
  decisions: {
    sellerMissions: any[];
    commerceOpportunities: any[];
    recommendedProducts: any[];
    regionalExpansion: any[];
    prioritySellers: any[];
    campaignSuggestions: any[];
    inventoryAlerts: any[];
    pricingSuggestions: any[];
  };
  reasoning: string;
  confidence: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  recommendedActions: string[];
  approvalRequired: boolean;
  llmEnhanced: boolean;
}

class DecisionAgent {
  private llmIntegrationService: typeof LLMIntegrationServiceClass;

  constructor() {
    this.llmIntegrationService = LLMIntegrationServiceClass;
  }

  /**
   * Make decisions based on predictions and business rules
   */
  async decide(context: DecisionAgentContext): Promise<DecisionContext> {
    console.log('⚖️  DECISION AGENT: Making decisions based on predictions...');
    
    const decision = await DecisionEngine.decide(context.predictionContext);
    
    console.log(`📝 Decision reasoning: ${decision.reasoning}`);
    console.log(`🎯 Priority: ${decision.priority}`);
    console.log(`📊 Decisions:`);
    console.log(`   - Seller missions: ${decision.decisions.sellerMissions.length}`);
    console.log(`   - Commerce opportunities: ${decision.decisions.commerceOpportunities.length}`);
    console.log(`   - Inventory alerts: ${decision.decisions.inventoryAlerts.length}`);
    console.log(`   - Confidence: ${decision.confidence}%`);
    
    return decision;
  }

  /**
   * Get detailed decision with explainable reasoning and action recommendations
   */
  async getDetailedDecision(context: DecisionAgentContext): Promise<DecisionAgentResult> {
    const decisionContext = await this.decide(context);
    
    const recommendedActions = this.generateRecommendedActions(decisionContext);
    const approvalRequired = context.autonomyLevel === 'require_approval' || 
                              decisionContext.priority === 'URGENT' ||
                              decisionContext.confidence < 60;
    
    // Try to enhance with LLM explanation
    let llmEnhanced = false;
    let enhancedReasoning = decisionContext.reasoning;
    
    if (context.useLLM !== false) {
      try {
        const llmAvailable = await this.llmIntegrationService.isLLMAvailable();
        if (llmAvailable) {
          const explanation = await this.llmIntegrationService.generateDecisionExplanation(
            decisionContext,
            context
          );
          enhancedReasoning = explanation.explanation;
          llmEnhanced = explanation.llmGenerated;
          console.log('🤖 LLM enhancement applied to decision explanation');
        }
      } catch (error) {
        console.log('⚠️  LLM enhancement failed, using deterministic reasoning only');
      }
    }
    
    return {
      decisionContext,
      decisions: decisionContext.decisions,
      reasoning: enhancedReasoning,
      confidence: decisionContext.confidence,
      priority: decisionContext.priority,
      recommendedActions,
      approvalRequired,
      llmEnhanced
    };
  }

  /**
   * Generate human-readable recommended actions from decisions
   */
  private generateRecommendedActions(decision: DecisionContext): string[] {
    const actions: string[] = [];
    const { decisions, priority } = decision;

    if (decisions.commerceOpportunities.length > 0) {
      actions.push(`Create ${decisions.commerceOpportunities.length} commerce opportunities for high-demand regions`);
    }

    if (decisions.sellerMissions.length > 0) {
      actions.push(`Generate ${decisions.sellerMissions.length} seller missions for growth activities`);
    }

    if (decisions.inventoryAlerts.length > 0) {
      actions.push(`Address ${decisions.inventoryAlerts.length} inventory alerts for stock optimization`);
    }

    if (decisions.recommendedProducts.length > 0) {
      actions.push(`Consider adding ${decisions.recommendedProducts.length} recommended product categories`);
    }

    if (priority === 'URGENT') {
      actions.push('Execute high-priority actions immediately due to urgent market conditions');
    } else if (priority === 'HIGH') {
      actions.push('Prioritize execution within next 24-48 hours');
    } else if (priority === 'MEDIUM') {
      actions.push('Schedule execution within next week');
    } else {
      actions.push('Monitor and execute as capacity allows');
    }

    if (actions.length === 0) {
      actions.push('Continue monitoring market conditions and maintain current operations');
    }

    return actions;
  }
}

export default new DecisionAgent();
