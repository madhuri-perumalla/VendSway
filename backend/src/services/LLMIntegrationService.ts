/**
 * VendSway LLM Integration Service
 * Integrates the LLM with deterministic business services
 * Note: Deterministic business logic remains in agent services. This service provides LLM enhancement.
 */

import LLMServiceClass from './LLMService';

class LLMIntegrationService {
  private llmService: typeof LLMServiceClass;

  constructor() {
    this.llmService = LLMServiceClass;
  }

  /**
   * Enhanced reasoning with LLM (receives pre-calculated scores from agents)
   */
  async enhancedReasoning(context: {
    region: string;
    category?: string;
    festival?: string;
    demandScore: number;
    gapScore: number;
  }) {
    // Use LLM to generate explanation and reasoning based on pre-calculated scores
    const prompt = `
    Analyze the regional commerce opportunity for ${context.region} ${context.category ? `in ${context.category}` : ''}:
    
    Deterministic Scores:
    - Demand Score: ${context.demandScore}/100
    - Catalog Gap Score: ${context.gapScore}/100
    
    Provide a detailed analysis including:
    1. What these scores mean
    2. Key factors influencing the opportunity
    3. Recommended actions
    4. Confidence in the opportunity
    `;

    try {
      const llmResponse = await this.llmService.generate({
        prompt,
        maxTokens: 512,
        temperature: 0.4
      });

      return {
        demandScore: context.demandScore,
        gapScore: context.gapScore,
        explanation: llmResponse.text,
        llmGenerated: true,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('LLM reasoning failed, falling back to deterministic only:', error);
      return {
        demandScore: context.demandScore,
        gapScore: context.gapScore,
        explanation: `High demand (${context.demandScore}/100) with catalog gap (${context.gapScore}/100) indicates opportunity.`,
        llmGenerated: false,
        timestamp: new Date()
      };
    }
  }

  /**
   * Enhanced seller matching with LLM explanation (receives pre-matched sellers from agents)
   */
  async enhancedSellerMatching(opportunity: {
    region: string;
    category: string;
    sellerRequirements: any;
    sellers: any[];
  }) {
    // Use LLM to generate matching explanation based on pre-matched sellers
    const prompt = `
    Explain the seller matching for ${opportunity.category} in ${opportunity.region}:
    
    Found ${opportunity.sellers.length} matching sellers with requirements: ${JSON.stringify(opportunity.sellerRequirements)}
    
    Provide detailed reasoning for:
    1. Why these sellers match
    2. Regional advantages
    3. Risk factors
    4. Recommendations
    `;

    try {
      const llmResponse = await this.llmService.generate({
        prompt,
        maxTokens: 384,
        temperature: 0.3
      });

      return {
        sellers: opportunity.sellers,
        explanation: llmResponse.text,
        llmGenerated: true,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('LLM seller matching explanation failed:', error);
      return {
        sellers: opportunity.sellers,
        explanation: `Found ${opportunity.sellers.length} sellers matching requirements for ${opportunity.category} in ${opportunity.region}.`,
        llmGenerated: false,
        timestamp: new Date()
      };
    }
  }

  /**
   * Generate seller mission with LLM assistance
   */
  async generateSellerMission(sellerId: string, opportunity: any) {
    const prompt = `
    Generate a personalized seller mission for seller ${sellerId}:
    
    Opportunity: ${JSON.stringify(opportunity)}
    
    Generate a mission with:
    1. Clear objective
    2. Specific action items
    3. Priority level
    4. Reasonable deadline
    5. Expected benefit
    `;

    try {
      const llmResponse = await this.llmService.generate({
        prompt,
        maxTokens: 256,
        temperature: 0.5
      });

      // Parse LLM response and validate
      const mission = this.parseMissionResponse(llmResponse.text);

      return {
        ...mission,
        llmGenerated: true,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('LLM mission generation failed:', error);
      // Fallback to deterministic mission generation
      return {
        sellerId,
        mission: `Add 3 products in ${opportunity.category} category`,
        actionItems: [
          'Create product listings',
          'Submit for approval',
          'Prepare inventory'
        ],
        priority: 'MEDIUM',
        deadline: '30 days',
        llmGenerated: false,
        timestamp: new Date()
      };
    }
  }

  /**
   * Generate explanation for agent decision
   */
  async generateDecisionExplanation(decision: any, context: any) {
    const prompt = `
    Explain the following agent decision:
    
    Decision: ${JSON.stringify(decision)}
    
    Context: ${JSON.stringify(context)}
    
    Provide a clear explanation including:
    1. What the decision means
    2. Key factors that influenced it
    3. Recommendations for stakeholders
    4. Confidence level
    `;

    try {
      const llmResponse = await this.llmService.generate({
        prompt,
        maxTokens: 384,
        temperature: 0.3
      });

      return {
        explanation: llmResponse.text,
        llmGenerated: true,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('LLM explanation generation failed:', error);
      return {
        explanation: `Decision: ${decision.type} with priority ${decision.priority}. Generated based on agent analysis of regional commerce data.`,
        llmGenerated: false,
        timestamp: new Date()
      };
    }
  }

  /**
   * Select tools for agent task using LLM
   */
  async selectToolsForTask(task: string, availableTools: string[], context: any) {
    try {
      const response = await this.llmService.selectTools({
        task,
        availableTools,
        context
      });

      return {
        selectedTools: response.selectedTools,
        toolOrder: response.toolOrder,
        reasoning: response.reasoning,
        confidence: response.confidence,
        llmGenerated: true
      };
    } catch (error) {
      console.error('LLM tool selection failed, using default:', error);
      // Fallback to default tool selection
      return {
        selectedTools: availableTools.slice(0, 3),
        toolOrder: availableTools.slice(0, 3),
        reasoning: 'Default tool selection based on task type',
        confidence: 0.5,
        llmGenerated: false
      };
    }
  }

  /**
   * Parse mission response from LLM
   */
  private parseMissionResponse(text: string): any {
    // Try to extract structured data from LLM response
    // This is a simplified parser - in production use more robust parsing
    const lines = text.split('\n').filter(line => line.trim());
    
    return {
      mission: lines[0] || 'Complete seller onboarding',
      actionItems: lines.slice(1, 4),
      priority: lines.includes('HIGH') ? 'HIGH' : 'MEDIUM',
      deadline: '30 days'
    };
  }

  /**
   * Check if LLM service is available
   */
  async isLLMAvailable(): Promise<boolean> {
    return await this.llmService.isAvailable();
  }
}

export default new LLMIntegrationService();