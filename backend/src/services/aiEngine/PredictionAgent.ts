// ============================================================================
// PREDICTION AGENT
// ============================================================================
// Agentic wrapper for generating predictions and forecasts
// Responsible for forecasting demand, revenue, and opportunity outcomes

import PredictEngine from './PredictEngine';
import { ReasoningContext, PredictionContext } from './types';

export interface PredictionAgentContext {
  reasoningContext: ReasoningContext;
  predictionHorizon?: 'short' | 'medium' | 'long';
}

export interface PredictionAgentResult {
  predictionContext: PredictionContext;
  predictions: {
    expectedDemand: number;
    expectedInventory: number;
    sellerGrowth: number;
    productSuccess: number;
    opportunityScore: number;
    visibilityScore: number;
    confidenceScore: number;
  };
  explanation: string;
  confidence: number;
  risks: string[];
  opportunities: string[];
}

class PredictionAgent {
  /**
   * Generate predictions based on reasoning and historical patterns
   */
  async predict(context: PredictionAgentContext): Promise<PredictionContext> {
    console.log('🔮 PREDICTION AGENT: Generating forecasts and predictions...');
    
    const prediction = await PredictEngine.predict(context.reasoningContext);
    
    console.log(`📊 Predictions:`);
    console.log(`   - Expected demand: ${prediction.predictions.expectedDemand}`);
    console.log(`   - Expected inventory: ${prediction.predictions.expectedInventory}`);
    console.log(`   - Opportunity score: ${prediction.predictions.opportunityScore.toFixed(0)}`);
    console.log(`   - Confidence: ${prediction.predictions.confidenceScore}%`);
    console.log(`📝 Explanation: ${prediction.explanation}`);
    
    return prediction;
  }

  /**
   * Get detailed prediction with risk and opportunity analysis
   */
  async getDetailedPrediction(context: PredictionAgentContext): Promise<PredictionAgentResult> {
    const predictionContext = await this.predict(context);
    
    const risks = this.assessRisks(predictionContext);
    const opportunities = this.identifyOpportunities(predictionContext);
    
    return {
      predictionContext,
      predictions: predictionContext.predictions,
      explanation: predictionContext.explanation,
      confidence: predictionContext.predictions.confidenceScore / 100,
      risks,
      opportunities,
    };
  }

  /**
   * Assess potential risks based on predictions
   */
  private assessRisks(prediction: PredictionContext): string[] {
    const risks: string[] = [];
    const { predictions } = prediction;

    if (predictions.confidenceScore < 60) {
      risks.push('Low prediction confidence suggests uncertain market conditions');
    }

    if (predictions.expectedInventory > predictions.expectedDemand * 1.5) {
      risks.push('Risk of overstock based on demand-inventory mismatch');
    }

    if (predictions.expectedInventory < predictions.expectedDemand * 0.7) {
      risks.push('Risk of stockout based on demand-inventory mismatch');
    }

    if (predictions.productSuccess < 50) {
      risks.push('Low predicted product success rate indicates challenging market conditions');
    }

    if (risks.length === 0) {
      risks.push('No significant risks identified based on current predictions');
    }

    return risks;
  }

  /**
   * Identify opportunities based on predictions
   */
  private identifyOpportunities(prediction: PredictionContext): string[] {
    const opportunities: string[] = [];
    const { predictions } = prediction;

    if (predictions.opportunityScore > 75) {
      opportunities.push('High opportunity score indicates strong potential for market entry or expansion');
    }

    if (predictions.sellerGrowth > 60) {
      opportunities.push('Predicted seller growth suggests favorable conditions for seller acquisition');
    }

    if (predictions.visibilityScore > 70) {
      opportunities.push('High visibility potential suggests effective marketing opportunities');
    }

    if (predictions.confidenceScore > 80) {
      opportunities.push('High prediction confidence supports confident decision-making');
    }

    if (opportunities.length === 0) {
      opportunities.push('Market conditions appear stable without exceptional opportunities');
    }

    return opportunities;
  }
}

export default new PredictionAgent();
