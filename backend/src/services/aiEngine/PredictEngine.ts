// ============================================================================
// PREDICT ENGINE
// ============================================================================
// Generates predictions based on reasoning and historical data

import { ReasoningContext, PredictionContext } from './types';

class PredictEngine {
  /**
   * Generate predictions based on reasoning context
   */
  async predict(reasoningContext: ReasoningContext): Promise<PredictionContext> {
    const { observationContext, scores } = reasoningContext;
    const {
      demandSignals,
      festivals,
      approvedProducts,
      inventory,
      historicalTrends,
    } = observationContext;

    // Calculate predictions using deterministic algorithms
    const predictions = {
      expectedDemand: this.predictExpectedDemand(demandSignals, historicalTrends, festivals),
      expectedInventory: this.predictExpectedInventory(inventory, demandSignals),
      sellerGrowth: this.predictSellerGrowth(observationContext, scores),
      productSuccess: this.predictProductSuccess(approvedProducts, scores),
      opportunityScore: this.predictOpportunityScore(scores),
      visibilityScore: this.predictVisibilityScore(observationContext, scores),
      confidenceScore: this.calculateConfidence(scores, observationContext),
    };

    // Generate explanation
    const explanation = this.generateExplanation(predictions, reasoningContext);

    return {
      reasoningContext,
      predictions,
      explanation,
    };
  }

  /**
   * Predict expected demand using weighted scoring and trend analysis
   */
  private predictExpectedDemand(demandSignals: any[], historicalTrends: any[], festivals: any[]): number {
    if (demandSignals.length === 0) return 100;

    // Base demand from current signals
    const currentDemand = demandSignals.reduce((sum, d) => sum + Number(d.demandScore), 0) / demandSignals.length;

    // Trend factor from historical data
    let trendFactor = 1;
    if (historicalTrends.length > 0) {
      const avgGrowthRate = historicalTrends.reduce((sum, t) => sum + (t.growthRate || 0), 0) / historicalTrends.length;
      trendFactor = 1 + (avgGrowthRate / 100);
    }

    // Festival multiplier
    let festivalMultiplier = 1;
    const now = new Date();
    festivals.forEach(festival => {
      const festivalDate = new Date(festival.date);
      const daysUntil = Math.ceil((festivalDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysUntil >= 0 && daysUntil <= 30) {
        // Festival boost increases as date approaches
        const boost = 1 + ((30 - daysUntil) / 30) * 0.5; // 1.0 to 1.5 multiplier
        festivalMultiplier = Math.max(festivalMultiplier, boost);
      }
    });

    // Calculate final prediction
    const predictedDemand = currentDemand * trendFactor * festivalMultiplier;

    return Math.round(predictedDemand);
  }

  /**
   * Predict expected inventory levels
   */
  private predictExpectedInventory(inventory: any[], demandSignals: any[]): number {
    if (inventory.length === 0) return 0;

    const currentInventory = inventory.reduce((sum, item) => sum + (item.stock || 0), 0);
    
    // Inventory depletion based on demand
    const avgDemand = demandSignals.length > 0 
      ? demandSignals.reduce((sum, d) => sum + Number(d.demandScore), 0) / demandSignals.length 
      : 50;

    // Predict inventory after 30 days
    const depletionRate = avgDemand / 100; // Percentage depletion per day
    const predictedInventory = currentInventory * (1 - depletionRate * 30);

    return Math.max(0, Math.round(predictedInventory));
  }

  /**
   * Predict seller growth rate
   */
  private predictSellerGrowth(context: any, scores: any): number {
    const { sellers, sellerPerformance } = context;

    if (sellers.length === 0) return 0;

    // Base growth from market opportunity
    let growthRate = scores.marketOpportunity * 0.2;

    // Adjust based on historical performance
    if (sellerPerformance.length > 0) {
      const avgConversionRate = sellerPerformance.reduce((sum: number, p: any) => sum + p.conversionRate, 0) / sellerPerformance.length;
      growthRate += avgConversionRate * 2;
    }

    // Adjust based on seller quality
    const verifiedSellers = sellers.filter((s: any) => s.isVerified).length;
    const verificationBonus = (verifiedSellers / sellers.length) * 10;
    growthRate += verificationBonus;

    return Math.round(Math.max(0, Math.min(100, growthRate)));
  }

  /**
   * Predict product success rate
   */
  private predictProductSuccess(products: any[], scores: any): number {
    if (products.length === 0) return 50;

    let totalSuccess = 0;

    products.forEach(product => {
      let success = 50;

      // Product completeness factors
      if (product.images && product.images.length > 0) success += 10;
      if (product.description && product.description.length > 50) success += 10;
      if (product.price && Number(product.price) > 0) success += 5;
      if (product.stock && product.stock > 0) success += 10;

      // Market factors
      success += scores.demandScore * 0.15;
      success += scores.marketOpportunity * 0.1;

      totalSuccess += success;
    });

    return Math.round(totalSuccess / products.length);
  }

  /**
   * Predict overall opportunity score
   */
  private predictOpportunityScore(scores: any): number {
    // Weighted combination of all scores
    const opportunityScore = 
      (scores.demandScore * 0.3) +
      (scores.festivalRelevance * 0.2) +
      (scores.marketOpportunity * 0.2) +
      (scores.sellerSuitability * 0.15) +
      (scores.competitionScore * 0.15);

    return Math.round(Math.min(100, opportunityScore));
  }

  /**
   * Predict visibility score
   */
  private predictVisibilityScore(context: any, scores: any): number {
    const { approvedProducts, sellers } = context;

    let visibility = 50;

    // Product quality contribution
    if (approvedProducts.length > 0) {
      const completeProducts = approvedProducts.filter((p: any) => 
        p.images && p.images.length > 0 && p.description
      ).length;
      visibility += (completeProducts / approvedProducts.length) * 20;
    }

    // Seller verification contribution
    if (sellers.length > 0) {
      const verifiedSellers = sellers.filter((s: any) => s.isVerified).length;
      visibility += (verifiedSellers / sellers.length) * 15;
    }

    // Demand match contribution
    visibility += scores.demandScore * 0.15;

    return Math.round(Math.min(100, visibility));
  }

  /**
   * Calculate confidence score based on data quality and consistency
   */
  private calculateConfidence(scores: any, context: any): number {
    let confidence = 50;

    // Data availability boosts confidence
    if (context.demandSignals.length > 10) confidence += 10;
    if (context.historicalTrends.length > 5) confidence += 10;
    if (context.approvedProducts.length > 20) confidence += 5;

    // Score consistency boosts confidence
    const scoreVariance = this.calculateVariance([
      scores.demandScore,
      scores.marketOpportunity,
      scores.sellerSuitability,
    ]);
    
    if (scoreVariance < 30) confidence += 10; // Consistent scores
    else if (scoreVariance > 50) confidence -= 10; // Inconsistent scores

    // Market stability
    if (scores.competitionScore > 60) confidence += 5;

    return Math.round(Math.max(30, Math.min(95, confidence)));
  }

  /**
   * Calculate variance of an array of numbers
   */
  private calculateVariance(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    
    const mean = numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
    const squaredDiffs = numbers.map(n => Math.pow(n - mean, 2));
    return squaredDiffs.reduce((sum, d) => sum + d, 0) / numbers.length;
  }

  /**
   * Generate explanation for predictions
   */
  private generateExplanation(predictions: any, reasoningContext: any): string {
    const explanations: string[] = [];

    // Demand explanation
    const demandChange = predictions.expectedDemand > 100 ? 'increased' : 'decreased';
    const demandPercent = Math.abs(predictions.expectedDemand - 100).toFixed(0);
    explanations.push(`Demand expected to ${demandChange} by ${demandPercent}%`);

    // Festival explanation
    if (reasoningContext.scores.festivalRelevance > 60) {
      explanations.push('Festival season impact considered');
    }

    // Inventory explanation
    if (predictions.expectedInventory < 50) {
      explanations.push('Inventory may run low based on current demand');
    }

    // Opportunity explanation
    if (predictions.opportunityScore > 70) {
      explanations.push(`High opportunity score (${predictions.opportunityScore}/100)`);
    }

    // Confidence explanation
    explanations.push(`Prediction confidence: ${predictions.confidenceScore}%`);

    return explanations.join('. ') + '.';
  }
}

export default new PredictEngine();