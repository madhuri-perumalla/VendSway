// ============================================================================
// REASON ENGINE
// ============================================================================
// Analyzes observed data to generate scores and reasoning

import { ObservationContext, ReasoningContext } from './types';

class ReasonEngine {
  /**
   * Analyze observations and generate reasoning with scores
   */
  async reason(observationContext: ObservationContext): Promise<ReasoningContext> {
    const {
      demandSignals,
      catalogGaps,
      festivals,
      approvedProducts,
      sellers,
      regionalTrends,
      communityDemands,
      inventory,
      sellerPerformance,
    } = observationContext;

    // Calculate various scores
    const scores = {
      regionalRelevance: this.calculateRegionalRelevance(observationContext),
      demandScore: this.calculateDemandScore(demandSignals, regionalTrends),
      festivalRelevance: this.calculateFestivalRelevance(festivals, demandSignals),
      inventoryHealth: this.calculateInventoryHealth(inventory),
      sellerSuitability: this.calculateSellerSuitability(sellers, sellerPerformance),
      marketOpportunity: this.calculateMarketOpportunity(catalogGaps, communityDemands),
      competitionScore: this.calculateCompetitionScore(approvedProducts, sellers),
    };

    // Generate reasoning
    const reasoning = this.generateReasoning(scores, observationContext);

    return {
      observationContext,
      scores,
      reasoning,
    };
  }

  /**
   * Calculate regional relevance score
   */
  private calculateRegionalRelevance(context: ObservationContext): number {
    const { demandSignals, catalogGaps, regionalTrends } = context;
    
    let totalScore = 0;
    let factors = 0;

    // Demand signal relevance
    if (demandSignals.length > 0) {
      const avgDemandScore = demandSignals.reduce((sum, d) => sum + Number(d.demandScore), 0) / demandSignals.length;
      totalScore += avgDemandScore * 0.4;
      factors++;
    }

    // Catalog gap urgency
    if (catalogGaps.length > 0) {
      const avgGap = catalogGaps.reduce((sum, g) => sum + Number(g.gap), 0) / catalogGaps.length;
      totalScore += Math.min(avgGap, 100) * 0.3;
      factors++;
    }

    // Regional trend strength
    if (regionalTrends.length > 0) {
      const avgTrendScore = regionalTrends.reduce((sum, t) => sum + Number(t.trendScore), 0) / regionalTrends.length;
      totalScore += avgTrendScore * 0.3;
      factors++;
    }

    return factors > 0 ? totalScore / factors : 50;
  }

  /**
   * Calculate demand score
   */
  private calculateDemandScore(demandSignals: any[], regionalTrends: any[]): number {
    let score = 0;
    let factors = 0;

    if (demandSignals.length > 0) {
      const avgDemandScore = demandSignals.reduce((sum, d) => sum + Number(d.demandScore), 0) / demandSignals.length;
      score += avgDemandScore * 0.6;
      factors++;
    }

    if (regionalTrends.length > 0) {
      const avgTrendScore = regionalTrends.reduce((sum, t) => sum + Number(t.trendScore), 0) / regionalTrends.length;
      score += avgTrendScore * 0.4;
      factors++;
    }

    return factors > 0 ? score / factors : 50;
  }

  /**
   * Calculate festival relevance score
   */
  private calculateFestivalRelevance(festivals: any[], demandSignals: any[]): number {
    if (festivals.length === 0) return 0;

    const now = new Date();
    let totalRelevance = 0;

    festivals.forEach(festival => {
      const festivalDate = new Date(festival.date);
      const daysUntil = Math.ceil((festivalDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      // Higher relevance for festivals 7-30 days away
      if (daysUntil >= 7 && daysUntil <= 30) {
        const relevance = 100 - ((daysUntil - 7) / 23) * 30; // 70-100 range
        totalRelevance += relevance;
      } else if (daysUntil < 7) {
        totalRelevance += 100; // Very high relevance if festival is imminent
      }
    });

    // Adjust for demand signals related to festivals
    const festivalDemandCount = demandSignals.filter(d => d.festivalId).length;
    if (festivalDemandCount > 0) {
      totalRelevance += (festivalDemandCount / demandSignals.length) * 20;
    }

    return Math.min(totalRelevance / festivals.length, 100);
  }

  /**
   * Calculate inventory health score
   */
  private calculateInventoryHealth(inventory: any[]): number {
    if (inventory.length === 0) return 50;

    let totalHealth = 0;
    let productsWithLowStock = 0;
    let productsWithHighStock = 0;

    inventory.forEach(item => {
      const stock = item.stock || 0;
      if (stock < 10) {
        productsWithLowStock++;
      } else if (stock > 100) {
        productsWithHighStock++;
      }
    });

    const totalProducts = inventory.length;
    const lowStockRatio = productsWithLowStock / totalProducts;
    const highStockRatio = productsWithHighStock / totalProducts;

    // Healthy inventory has balanced stock levels
    totalHealth = 100 - (lowStockRatio * 50) - (highStockRatio * 20);

    return Math.max(0, Math.min(100, totalHealth));
  }

  /**
   * Calculate seller suitability score
   */
  private calculateSellerSuitability(sellers: any[], sellerPerformance: any[]): number {
    if (sellers.length === 0) return 50;

    let totalSuitability = 0;

    sellers.forEach(seller => {
      let suitability = 50;

      // Check seller status
      if (seller.status === 'APPROVED' && seller.isActive) {
        suitability += 20;
      }

      // Check verification
      if (seller.isVerified) {
        suitability += 15;
      }

      // Check GI certification
      if (seller.hasGICertification) {
        suitability += 10;
      }

      // Check performance
      const performance = sellerPerformance.filter(p => p.sellerId === seller.id);
      if (performance.length > 0) {
        const avgConversionRate = performance.reduce((sum, p) => sum + p.conversionRate, 0) / performance.length;
        suitability += Math.min(avgConversionRate, 10);
      }

      totalSuitability += suitability;
    });

    return totalSuitability / sellers.length;
  }

  /**
   * Calculate market opportunity score
   */
  private calculateMarketOpportunity(catalogGaps: any[], communityDemands: any[]): number {
    let opportunity = 0;
    let factors = 0;

    // Catalog gaps indicate unmet demand
    if (catalogGaps.length > 0) {
      const totalGap = catalogGaps.reduce((sum, g) => sum + Number(g.gap), 0);
      opportunity += Math.min(totalGap / 10, 100);
      factors++;
    }

    // Community demands indicate customer interest
    if (communityDemands.length > 0) {
      const avgConfidence = communityDemands.reduce((sum, d) => sum + d.confidenceScore, 0) / communityDemands.length;
      opportunity += avgConfidence;
      factors++;
    }

    return factors > 0 ? opportunity / factors : 50;
  }

  /**
   * Calculate competition score
   */
  private calculateCompetitionScore(approvedProducts: any[], sellers: any[]): number {
    if (approvedProducts.length === 0) return 50;

    const productCount = approvedProducts.length;
    const sellerCount = sellers.length;

    // Calculate product density (products per seller)
    const productDensity = sellerCount > 0 ? productCount / sellerCount : 0;

    // Higher competition = more products per seller
    // Lower score = higher competition (we want low competition areas)
    let competitionScore = 100 - Math.min(productDensity * 2, 80);

    return Math.max(20, competitionScore);
  }

  /**
   * Generate reasoning text based on scores
   */
  private generateReasoning(scores: any, context: ObservationContext): string {
    const reasons: string[] = [];

    // Demand analysis
    if (scores.demandScore > 70) {
      reasons.push(`Demand is strong (${scores.demandScore.toFixed(0)}/100)`);
    } else if (scores.demandScore > 50) {
      reasons.push(`Demand is moderate (${scores.demandScore.toFixed(0)}/100)`);
    } else {
      reasons.push(`Demand is weak (${scores.demandScore.toFixed(0)}/100)`);
    }

    // Festival analysis
    if (scores.festivalRelevance > 70) {
      const upcomingFestivals = context.festivals.slice(0, 2);
      if (upcomingFestivals.length > 0) {
        const daysUntil = Math.ceil((new Date(upcomingFestivals[0].date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        reasons.push(`${upcomingFestivals[0].name} is ${daysUntil} days away`);
      }
    }

    // Inventory analysis
    if (scores.inventoryHealth < 50) {
      reasons.push(`Inventory needs attention (${scores.inventoryHealth.toFixed(0)}/100)`);
    }

    // Market opportunity
    if (scores.marketOpportunity > 70) {
      reasons.push(`High market opportunity detected (${scores.marketOpportunity.toFixed(0)}/100)`);
    }

    // Competition
    if (scores.competitionScore > 70) {
      reasons.push(`Low competition in region (${scores.competitionScore.toFixed(0)}/100)`);
    }

    return reasons.length > 0 ? reasons.join('. ') + '.' : 'Market conditions are stable.';
  }
}

export default new ReasonEngine();