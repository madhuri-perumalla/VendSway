// ============================================================================
// RECOMMENDATION ENGINE
// ============================================================================
// Generates explainable recommendations based on data

import { Recommendation } from './types';

class RecommendationEngine {
  /**
   * Generate recommendations based on context
   */
  generateRecommendations(context: {
    demandScore: number;
    festivalRelevance: number;
    inventoryHealth: number;
    marketOpportunity: number;
    sellerSuitability: number;
    competitionScore: number;
    visibilityScore?: number;
    category?: string;
    region?: string;
  }): Recommendation[] {
    const recommendations: Recommendation[] = [];

    // Demand-based recommendations
    if (context.demandScore > 80) {
      recommendations.push({
        type: 'INVENTORY',
        title: 'Increase Inventory',
        description: `Demand is high (${context.demandScore}/100). Stock additional inventory to meet customer demand.`,
        reasoning: `Demand score of ${context.demandScore} indicates strong customer interest. Increasing inventory will prevent stockouts and maximize revenue.`,
        confidence: 85,
        priority: 'HIGH',
        actionItems: [
          'Increase inventory by 30%',
          'Prioritize high-demand products',
          'Ensure supply chain readiness',
        ],
        expectedOutcome: '15-25% increase in sales, reduced stockouts',
      });
    }

    // Festival-based recommendations
    if (context.festivalRelevance > 70) {
      recommendations.push({
        type: 'MARKETING',
        title: 'Launch Festival Campaign',
        description: 'Festival season is approaching. Launch targeted marketing campaigns to maximize sales.',
        reasoning: `Festival relevance score of ${context.festivalRelevance} indicates upcoming festival season. This is a prime opportunity for targeted marketing.`,
        confidence: 90,
        priority: 'HIGH',
        actionItems: [
          'Create festival-specific product bundles',
          'Launch social media campaign',
          'Send festival promotions to customers',
          'Adjust inventory for festival demand',
        ],
        expectedOutcome: '30-40% increase in festival-period sales',
      });
    }

    // Inventory health recommendations
    if (context.inventoryHealth < 50) {
      recommendations.push({
        type: 'INVENTORY',
        title: 'Improve Inventory Management',
        description: `Inventory health is low (${context.inventoryHealth}/100). Address stock imbalances to optimize operations.`,
        reasoning: `Inventory health score of ${context.inventoryHealth} indicates either stockouts or overstock. Both conditions negatively impact profitability.`,
        confidence: 80,
        priority: 'URGENT',
        actionItems: [
          'Conduct full inventory audit',
          'Address low-stock items immediately',
          'Plan clearance for overstock items',
          'Implement automated reorder points',
        ],
        expectedOutcome: 'Improved cash flow, reduced storage costs, higher customer satisfaction',
      });
    }

    // Market opportunity recommendations
    if (context.marketOpportunity > 75) {
      recommendations.push({
        type: 'EXPANSION',
        title: 'Capitalize on Market Opportunity',
        description: `High market opportunity detected (${context.marketOpportunity}/100). Expand presence to capture demand.`,
        reasoning: `Market opportunity score of ${context.marketOpportunity} indicates unmet demand in the market. Expansion now will yield first-mover advantage.`,
        confidence: 85,
        priority: 'HIGH',
        actionItems: [
          'Onboard new sellers in high-opportunity regions',
          'Expand product catalog in gap categories',
          'Target marketing to high-demand regions',
          'Offer incentives for new sellers',
        ],
        expectedOutcome: '20-30% increase in market share, higher revenue',
      });
    }

    // Seller suitability recommendations
    if (context.sellerSuitability < 60) {
      recommendations.push({
        type: 'SELLER',
        title: 'Improve Seller Quality',
        description: `Seller suitability score is moderate (${context.sellerSuitability}/100). Focus on seller verification and training.`,
        reasoning: `Seller suitability score of ${context.sellerSuitability} indicates room for improvement in seller quality. Better sellers lead to better products and higher customer satisfaction.`,
        confidence: 75,
        priority: 'MEDIUM',
        actionItems: [
          'Prioritize GI-certified sellers',
          'Provide seller training programs',
          'Improve seller verification process',
          'Offer quality incentives',
        ],
        expectedOutcome: 'Higher product quality, increased customer trust, better reviews',
      });
    }

    // Competition-based recommendations
    if (context.competitionScore > 70) {
      recommendations.push({
        type: 'STRATEGY',
        title: 'Leverage Low Competition',
        description: `Low competition detected (${context.competitionScore}/100). Aggressive expansion recommended.`,
        reasoning: `Competition score of ${context.competitionScore} indicates favorable market conditions with fewer competitors. This is an ideal time for market expansion.`,
        confidence: 80,
        priority: 'HIGH',
        actionItems: [
          'Rapidly onboard new sellers',
          'Expand product variety',
          'Competitive pricing strategy',
          'Aggressive marketing campaigns',
        ],
        expectedOutcome: 'Quick market share gain, stronger brand presence',
      });
    }

    // Visibility recommendations
    if (context.visibilityScore && context.visibilityScore < 60) {
      recommendations.push({
        type: 'VISIBILITY',
        title: 'Improve Product Visibility',
        description: `Product visibility is low (${context.visibilityScore}/100). Improve product listings to increase discoverability.`,
        reasoning: `Visibility score of ${context.visibilityScore} indicates products are not easily discoverable. Better visibility leads to higher sales.`,
        confidence: 85,
        priority: 'MEDIUM',
        actionItems: [
          'Improve product images',
          'Enhance product descriptions',
          'Add relevant keywords',
          'Complete all product fields',
        ],
        expectedOutcome: '20-30% increase in product views, higher conversion rates',
      });
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  /**
   * Generate explanation for a specific metric
   */
  generateExplanation(metric: string, value: number, context?: any): string {
    const explanations: Record<string, (val: number, ctx?: any) => string> = {
      demandScore: (val) => {
        if (val > 80) return `Demand is strong at ${val}/100, indicating high customer interest and sales potential.`;
        if (val > 60) return `Demand is moderate at ${val}/100, showing steady customer interest.`;
        return `Demand is low at ${val}/100, suggesting need for marketing or product adjustments.`;
      },
      festivalRelevance: (val) => {
        if (val > 70) return `Festival season is highly relevant at ${val}/100. This is a prime selling opportunity.`;
        if (val > 40) return `Festival relevance is moderate at ${val}/100. Consider festival-specific promotions.`;
        return `Festival relevance is low at ${val}/100. Focus on non-festival marketing strategies.`;
      },
      inventoryHealth: (val) => {
        if (val > 70) return `Inventory health is good at ${val}/100. Stock levels are well-balanced.`;
        if (val > 50) return `Inventory health is moderate at ${val}/100. Some attention to stock levels may be needed.`;
        return `Inventory health is poor at ${val}/100. Immediate action required to address stock imbalances.`;
      },
      marketOpportunity: (val) => {
        if (val > 75) return `High market opportunity at ${val}/100. Ideal conditions for expansion and growth.`;
        if (val > 50) return `Moderate market opportunity at ${val}/100. Careful expansion recommended.`;
        return `Low market opportunity at ${val}/100. Focus on improving existing operations.`;
      },
      sellerSuitability: (val) => {
        if (val > 70) return `Seller quality is high at ${val}/100. Sellers are well-qualified and reliable.`;
        if (val > 50) return `Seller quality is moderate at ${val}/100. Some seller improvement may be beneficial.`;
        return `Seller quality needs improvement at ${val}/100. Focus on seller verification and training.`;
      },
      competitionScore: (val) => {
        if (val > 70) return `Low competition at ${val}/100. Favorable conditions for market entry.`;
        if (val > 40) return `Moderate competition at ${val}/100. Differentiation strategy important.`;
        return `High competition at ${val}/100. Focus on unique value proposition and quality.`;
      },
    };

    return explanations[metric]?.(value, context) || `Metric ${metric} has value ${value}.`;
  }

  /**
   * Generate summary from multiple recommendations
   */
  generateSummary(recommendations: Recommendation[]): string {
    if (recommendations.length === 0) {
      return 'Current market conditions are stable. Continue monitoring for changes.';
    }

    const priorityCount = {
      URGENT: recommendations.filter(r => r.priority === 'URGENT').length,
      HIGH: recommendations.filter(r => r.priority === 'HIGH').length,
      MEDIUM: recommendations.filter(r => r.priority === 'MEDIUM').length,
      LOW: recommendations.filter(r => r.priority === 'LOW').length,
    };

    const parts: string[] = [];

    if (priorityCount.URGENT > 0) {
      parts.push(`${priorityCount.URGENT} urgent recommendation${priorityCount.URGENT > 1 ? 's' : ''} requiring immediate action`);
    }
    if (priorityCount.HIGH > 0) {
      parts.push(`${priorityCount.HIGH} high-priority recommendation${priorityCount.HIGH > 1 ? 's' : ''}`);
    }
    if (priorityCount.MEDIUM > 0) {
      parts.push(`${priorityCount.MEDIUM} medium-priority recommendation${priorityCount.MEDIUM > 1 ? 's' : ''}`);
    }
    if (priorityCount.LOW > 0) {
      parts.push(`${priorityCount.LOW} low-priority recommendation${priorityCount.LOW > 1 ? 's' : ''}`);
    }

    return `Generated ${recommendations.length} recommendation${recommendations.length > 1 ? 's' : ''}: ${parts.join(', ')}.`;
  }
}

export default new RecommendationEngine();