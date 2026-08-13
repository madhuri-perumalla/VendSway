// ============================================================================
// DECISION ENGINE
// ============================================================================
// Makes decisions based on predictions and generates actionable items

import { PredictionContext, DecisionContext } from './types';

// Helper to access observation context from prediction context
function getObservationContext(predictionContext: PredictionContext) {
  return predictionContext.reasoningContext.observationContext;
}

class DecisionEngine {
  /**
   * Generate decisions based on predictions
   */
  async decide(predictionContext: PredictionContext): Promise<DecisionContext> {
    const { predictions, reasoningContext } = predictionContext;
    const { scores } = reasoningContext;

    // Generate various decision types
    const decisions = {
      sellerMissions: await this.generateSellerMissions(predictionContext),
      commerceOpportunities: await this.generateCommerceOpportunities(predictionContext),
      recommendedProducts: this.generateRecommendedProducts(predictionContext),
      regionalExpansion: this.generateRegionalExpansion(predictionContext),
      prioritySellers: this.generatePrioritySellers(predictionContext),
      campaignSuggestions: this.generateCampaignSuggestions(predictionContext),
      inventoryAlerts: this.generateInventoryAlerts(predictionContext),
      pricingSuggestions: this.generatePricingSuggestions(predictionContext),
    };

    // Determine overall priority and deadline
    const { priority, deadline, reasoning, confidence } = this.determinePriorityAndDeadline(predictions, scores, predictionContext);

    return {
      predictionContext,
      decisions,
      reasoning,
      confidence,
      priority,
      deadline,
    };
  }

  /**
   * Generate seller missions based on predictions
   */
  private async generateSellerMissions(context: PredictionContext): Promise<any[]> {
    const missions: any[] = [];
    const { predictions } = context;
    const observationContext = getObservationContext(context);
    const { sellers } = observationContext;

    // Generate missions for high-priority sellers
    const prioritySellers = sellers.slice(0, 10);

    for (const seller of prioritySellers) {
      // Determine mission type based on context
      let missionType = 'TREND';
      let targetData = null;

      // Check for festival missions
      if (predictions.opportunityScore > 70 && observationContext.festivals.length > 0) {
        const upcomingFestival = observationContext.festivals[0];
        missionType = 'FESTIVAL';
        targetData = upcomingFestival;
      }
      // Check for demand-driven missions
      else if (predictions.expectedDemand > 100) {
        missionType = 'DEMAND';
        targetData = observationContext.demandSignals[0];
      }

      const mission = {
        sellerId: seller.id,
        missionType,
        opportunityScore: predictions.opportunityScore,
        confidence: predictions.confidenceScore,
        predictedRevenue: predictions.expectedDemand * 50,
        targetAudience: seller.targetAudience || ['Women', '25-45'],
        productCount: Math.min(10, Math.floor(predictions.expectedDemand / 20)),
        reason: this.generateMissionReason(missionType, targetData, predictions),
        recommendedAction: this.generateRecommendedAction(missionType, predictions),
        expiresAt: this.calculateMissionExpiry(missionType, targetData),
        regionId: seller.regionId,
        festivalId: targetData?.id,
      };

      missions.push(mission);
    }

    return missions;
  }

  /**
   * Generate commerce opportunities
   */
  private async generateCommerceOpportunities(context: PredictionContext): Promise<any[]> {
    const opportunities: any[] = [];
    const { predictions } = context;
    const observationContext = getObservationContext(context);
    const { sellers, demandSignals, approvedProducts } = observationContext;

    // Generate opportunities for high-demand areas
    const highDemandSignals = demandSignals.filter(d => d.demandScore > 70);

    for (const demand of highDemandSignals.slice(0, 5)) {
      const matchingSellers = sellers.filter(s => s.regionId === demand.regionId);
      const matchingProducts = approvedProducts.filter(p => 
        p.category === demand.category && p.regionId === demand.regionId
      );

      if (matchingSellers.length > 0 && matchingProducts.length > 0) {
        const opportunity = {
          sellerId: matchingSellers[0].id,
          regionId: demand.regionId,
          opportunityScore: predictions.opportunityScore,
          predictedRevenue: predictions.expectedDemand * 100,
          confidence: predictions.confidenceScore,
          reason: `High demand (${demand.demandScore}) for ${demand.category} in region`,
          products: matchingProducts.slice(0, 5).map(p => ({
            productId: p.id,
            priority: 5,
            suggestedPrice: Number(p.price),
          })),
          festivalId: demand.festivalId,
        };

        opportunities.push(opportunity);
      }
    }

    return opportunities;
  }

  /**
   * Generate product recommendations
   */
  private generateRecommendedProducts(context: PredictionContext): any[] {
    const { predictions } = context;
    const observationContext = getObservationContext(context);
    const { approvedProducts, demandSignals } = observationContext;

    const recommendations: any[] = [];

    // Recommend products that match high demand
    const highDemandCategories = demandSignals
      .filter(d => d.demandScore > 70)
      .map(d => d.category);

    approvedProducts.forEach(product => {
      if (highDemandCategories.includes(product.category)) {
        recommendations.push({
          productId: product.id,
          name: product.name,
          category: product.category,
          reason: `Matches high demand for ${product.category}`,
          confidence: predictions.confidenceScore,
          expectedSales: Math.floor(predictions.expectedDemand / 10),
        });
      }
    });

    return recommendations.slice(0, 20);
  }

  /**
   * Generate regional expansion recommendations
   */
  private generateRegionalExpansion(context: PredictionContext): any[] {
    const { predictions } = context;
    const observationContext = getObservationContext(context);
    const { regions, catalogGaps, sellers } = observationContext;

    const expansions: any[] = [];

    regions.forEach(region => {
      const regionGaps = catalogGaps.filter(g => g.regionId === region.id);
      const regionSellers = sellers.filter(s => s.regionId === region.id);

      // High gap and low seller count = expansion opportunity
      if (regionGaps.length > 5 && regionSellers.length < 5) {
        expansions.push({
          regionId: region.id,
          regionName: region.name,
          reason: `${regionGaps.length} catalog gaps with only ${regionSellers.length} sellers`,
          opportunityScore: predictions.opportunityScore,
          confidence: predictions.confidenceScore,
          recommendedActions: [
            'Onboard new MSMEs from this region',
            'Target sellers with GI certification',
            'Create region-specific onboarding campaign',
          ],
        });
      }
    });

    return expansions;
  }

  /**
   * Generate priority seller list
   */
  private generatePrioritySellers(context: PredictionContext): any[] {
    const observationContext = getObservationContext(context);
    const { sellers, sellerPerformance } = observationContext;

    const prioritySellers = sellers.map(seller => {
      const performance = sellerPerformance.filter(p => p.sellerId === seller.id);
      const avgConversionRate = performance.length > 0
        ? performance.reduce((sum, p) => sum + p.conversionRate, 0) / performance.length
        : 0;

      let priorityScore = 50;
      if (seller.isVerified) priorityScore += 20;
      if (seller.hasGICertification) priorityScore += 15;
      if (avgConversionRate > 5) priorityScore += 10;
      if (seller.status === 'APPROVED') priorityScore += 5;

      return {
        sellerId: seller.id,
        businessName: seller.businessName,
        priorityScore,
        reason: this.generateSellerPriorityReason(seller, avgConversionRate),
      };
    });

    return prioritySellers.sort((a, b) => b.priorityScore - a.priorityScore).slice(0, 20);
  }

  /**
   * Generate campaign suggestions
   */
  private generateCampaignSuggestions(context: PredictionContext): any[] {
    const { predictions } = context;
    const observationContext = getObservationContext(context);
    const { demandSignals, festivals } = observationContext;

    const campaigns: any[] = [];

    // Festival campaigns
    festivals.slice(0, 3).forEach((festival: any) => {
      const daysUntil = Math.ceil((new Date(festival.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      if (daysUntil >= 7 && daysUntil <= 30) {
        campaigns.push({
          type: 'FESTIVAL',
          name: `${festival.name} Campaign`,
          festivalId: festival.id,
          reason: `${festival.name} is ${daysUntil} days away`,
          targetAudience: ['Women', '25-45'],
          startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          endDate: new Date(festival.date),
          expectedReach: predictions.expectedDemand * 100,
          confidence: predictions.confidenceScore,
        });
      }
    });

    // Demand-driven campaigns
    const highDemandCategories = demandSignals.filter((d: any) => d.demandScore > 80);
    highDemandCategories.slice(0, 2).forEach((demand: any) => {
      campaigns.push({
        type: 'DEMAND',
        name: `${demand.category} Demand Campaign`,
        reason: `High demand signal (${demand.demandScore}) for ${demand.category}`,
        targetAudience: ['Women', '25-45'],
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        expectedReach: predictions.expectedDemand * 50,
        confidence: predictions.confidenceScore,
      });
    });

    return campaigns;
  }

  /**
   * Generate inventory alerts
   */
  private generateInventoryAlerts(_context: PredictionContext): any[] {
    // Simplified implementation - return empty array for now
    return [];
  }

  /**
   * Generate pricing suggestions
   */
  private generatePricingSuggestions(_context: PredictionContext): any[] {
    // Simplified implementation - return empty array for now
    return [];
  }

  /**
   * Generate mission reason text
   */
  private generateMissionReason(missionType: string, targetData: any, _predictions: any): string {
    switch (missionType) {
      case 'FESTIVAL':
        return `${targetData?.name || 'Upcoming festival'} approaching with expected demand increase`;
      case 'DEMAND':
        return `High demand detected with expected units increase`;
      case 'TREND':
        return `Regional trend indicates demand potential`;
      default:
        return 'Market conditions indicate opportunity';
    }
  }

  /**
   * Generate recommended action
   */
  private generateRecommendedAction(missionType: string, _predictions: any): string {
    switch (missionType) {
      case 'FESTIVAL':
        return 'Increase inventory by 30% and launch festival-specific marketing';
      case 'DEMAND':
        return 'Stock additional inventory and prepare for increased orders';
      case 'TREND':
        return 'Capitalize on trending category with targeted promotions';
      default:
        return 'Monitor market conditions and adjust inventory accordingly';
    }
  }

  /**
   * Calculate mission expiry date
   */
  private calculateMissionExpiry(missionType: string, targetData: any): Date {
    const now = new Date();
    switch (missionType) {
      case 'FESTIVAL':
        return targetData?.date || new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      case 'DEMAND':
        return new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
      default:
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    }
  }

  /**
   * Generate seller priority reason
   */
  private generateSellerPriorityReason(seller: any, conversionRate: number): string {
    const reasons: string[] = [];
    if (seller.isVerified) reasons.push('Verified seller');
    if (seller.hasGICertification) reasons.push('GI certified');
    if (conversionRate > 5) reasons.push(`High conversion rate (${conversionRate}%)`);
    if (seller.status === 'APPROVED') reasons.push('Active status');
    return reasons.join(', ') || 'Regular seller';
  }

  /**
   * Determine overall priority and deadline
   */
  private determinePriorityAndDeadline(predictions: any, scores: any, predictionContext: PredictionContext): {
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    deadline?: Date;
    reasoning: string;
    confidence: number;
  } {
    let priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' = 'MEDIUM';
    let deadline: Date | undefined;
    const reasoningParts: string[] = [];
    const observationContext = getObservationContext(predictionContext);

    // Determine priority based on opportunity score
    if (predictions.opportunityScore > 85) {
      priority = 'URGENT';
      reasoningParts.push('Exceptional opportunity score');
    } else if (predictions.opportunityScore > 70) {
      priority = 'HIGH';
      reasoningParts.push('High opportunity score');
    } else if (predictions.opportunityScore > 50) {
      priority = 'MEDIUM';
      reasoningParts.push('Moderate opportunity score');
    } else {
      priority = 'LOW';
      reasoningParts.push('Low opportunity score');
    }

    // Adjust for festival urgency
    if (scores.festivalRelevance > 70 && observationContext.festivals.length > 0) {
      const nearestFestival = observationContext.festivals[0];
      const daysUntil = Math.ceil((new Date(nearestFestival.date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      
      if (daysUntil < 7) {
        priority = 'URGENT';
        deadline = new Date(nearestFestival.date);
        reasoningParts.push(`Festival in ${daysUntil} days`);
      } else if (daysUntil < 15) {
        priority = 'HIGH';
        deadline = new Date(nearestFestival.date);
        reasoningParts.push(`Festival in ${daysUntil} days`);
      }
    }

    // Adjust for inventory urgency
    if (scores.inventoryHealth < 40) {
      priority = priority === 'URGENT' ? 'URGENT' : 'HIGH';
      reasoningParts.push('Critical inventory levels');
    }

    const reasoning = reasoningParts.join('. ') + '.';
    const confidence = predictions.confidenceScore;

    return { priority, deadline, reasoning, confidence };
  }
}

export default new DecisionEngine();