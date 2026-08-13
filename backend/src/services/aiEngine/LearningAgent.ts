// ============================================================================
// LEARNING AGENT
// ============================================================================
// Agentic wrapper for learning from outcomes and improving future decisions
// Responsible for monitoring performance and adjusting agent behavior

import LearningEngine from './LearningEngine';
import { ActionContext, LearningContext } from './types';

export interface LearningAgentContext {
  actionContext: ActionContext;
  learningHorizon?: 'short' | 'medium' | 'long';
}

export interface LearningAgentResult {
  learningContext: LearningContext;
  metrics: {
    missionAcceptanceRate: number;
    missionCompletionRate: number;
    campaignPerformance: number;
    sellerGrowthRate: number;
    opportunitySuccessRate: number;
    productSalesRate: number;
    demandAccuracy: number;
  };
  weightUpdates: {
    demandWeight: number;
    festivalWeight: number;
    inventoryWeight: number;
    sellerWeight: number;
    trendWeight: number;
  };
  insights: string[];
  recommendations: string[];
  confidence: number;
}

class LearningAgent {
  /**
   * Learn from action outcomes and improve future decisions
   */
  async learn(context: LearningAgentContext): Promise<LearningContext> {
    console.log('📚 LEARNING AGENT: Monitoring outcomes and improving future decisions...');
    
    const learning = await LearningEngine.learn(context.actionContext);
    
    console.log(`📊 Learning metrics:`);
    console.log(`   - Mission acceptance rate: ${learning.metrics.missionAcceptanceRate.toFixed(1)}%`);
    console.log(`   - Campaign performance: ${learning.metrics.campaignPerformance.toFixed(1)}%`);
    console.log(`   - Opportunity success rate: ${learning.metrics.opportunitySuccessRate.toFixed(1)}%`);
    console.log(`📝 Weight updates:`, learning.weightUpdates);
    
    return learning;
  }

  /**
   * Get detailed learning result with insights and recommendations
   */
  async getDetailedLearning(context: LearningAgentContext): Promise<LearningAgentResult> {
    const learningContext = await this.learn(context);
    
    const insights = this.generateInsights(learningContext);
    const recommendations = this.generateRecommendations(learningContext);
    
    return {
      learningContext,
      metrics: learningContext.metrics,
      weightUpdates: learningContext.weightUpdates,
      insights,
      recommendations,
      confidence: this.calculateLearningConfidence(learningContext),
    };
  }

  /**
   * Generate human-readable insights from learning metrics
   */
  private generateInsights(learning: LearningContext): string[] {
    const insights: string[] = [];
    const { metrics, weightUpdates } = learning;

    if (metrics.missionAcceptanceRate > 70) {
      insights.push(`High mission acceptance rate (${metrics.missionAcceptanceRate.toFixed(1)}%) indicates seller engagement with AI recommendations`);
    } else if (metrics.missionAcceptanceRate < 40) {
      insights.push(`Low mission acceptance rate (${metrics.missionAcceptanceRate.toFixed(1)}%) suggests misalignment between AI recommendations and seller priorities`);
    }

    if (metrics.campaignPerformance > 75) {
      insights.push(`Strong campaign performance (${metrics.campaignPerformance.toFixed(1)}%) validates opportunity generation strategy`);
    } else if (metrics.campaignPerformance < 50) {
      insights.push(`Weak campaign performance (${metrics.campaignPerformance.toFixed(1)}%) indicates need for opportunity scoring refinement`);
    }

    if (metrics.opportunitySuccessRate > 70) {
      insights.push(`High opportunity success rate (${metrics.opportunitySuccessRate.toFixed(1)}%) confirms accurate demand-gap identification`);
    }

    if (metrics.demandAccuracy > 80) {
      insights.push(`High demand prediction accuracy (${metrics.demandAccuracy.toFixed(1)}%) indicates reliable forecasting`);
    }

    if (weightUpdates.demandWeight > 0.6) {
      insights.push('Increased demand weight suggests demand signals are becoming more predictive');
    }

    if (weightUpdates.festivalWeight > 0.6) {
      insights.push('Increased festival weight suggests seasonal factors are gaining importance');
    }

    if (insights.length === 0) {
      insights.push('Learning metrics indicate stable performance with no significant trends');
    }

    return insights;
  }

  /**
   * Generate recommendations based on learning outcomes
   */
  private generateRecommendations(learning: LearningContext): string[] {
    const recommendations: string[] = [];
    const { metrics, weightUpdates } = learning;

    if (metrics.missionAcceptanceRate < 50) {
      recommendations.push('Review mission generation criteria to better align with seller priorities and capabilities');
    }

    if (metrics.campaignPerformance < 60) {
      recommendations.push('Refine opportunity scoring to focus on higher-potential opportunities');
    }

    if (metrics.opportunitySuccessRate < 65) {
      recommendations.push('Improve seller matching algorithms to increase opportunity relevance');
    }

    if (metrics.demandAccuracy < 70) {
      recommendations.push('Enhance demand signal collection and prediction algorithms');
    }

    if (weightUpdates.sellerWeight > 0.7) {
      recommendations.push('Consider expanding seller discovery efforts in high-opportunity regions');
    }

    if (weightUpdates.trendWeight > 0.7) {
      recommendations.push('Increase focus on regional trend analysis for opportunity generation');
    }

    if (metrics.sellerGrowthRate > 60) {
      recommendations.push('Seller onboarding is effective - consider scaling successful onboarding strategies');
    }

    if (recommendations.length === 0) {
      recommendations.push('Continue current strategy - learning metrics indicate effective agent performance');
    }

    return recommendations;
  }

  /**
   * Calculate confidence in learning outcomes
   */
  private calculateLearningConfidence(learning: LearningContext): number {
    const { metrics } = learning;
    
    // Calculate confidence based on overall performance metrics
    const avgPerformance = (
      metrics.missionAcceptanceRate +
      metrics.campaignPerformance +
      metrics.opportunitySuccessRate +
      metrics.demandAccuracy
    ) / 4;

    return avgPerformance / 100;
  }
}

export default new LearningAgent();
