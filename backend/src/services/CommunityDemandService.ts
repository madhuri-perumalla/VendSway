// ============================================================================
// COMMUNITY DEMAND SERVICE
// ============================================================================
// Captures and aggregates customer requests from sellers
// Learns from community demand to improve predictions
// Uses internal deterministic AI Reasoning Engine

import { PrismaClient } from '@prisma/client';
import RuleEngine from './aiEngine/RuleEngine';

const prisma = new PrismaClient();

interface CommunityRequest {
  sellerId: string;
  regionId?: string;
  productName: string;
  category?: string;
  budget?: number;
  festival?: string;
  quantity?: number;
  gender?: string;
  comments?: string;
}

interface AggregatedDemand {
  productName: string;
  category: string;
  totalRequests: number;
  totalQuantity: number;
  averageBudget: number;
  regions: string[];
  festivals: string[];
  trendScore: number;
  confidence: number;
  recommendedAction: string;
}

class CommunityDemandService {
  /**
   * Capture community demand from seller
   */
  async captureCommunityDemand(request: CommunityRequest): Promise<any> {
    const communityDemand = await prisma.communityDemand.create({
      data: {
        sellerId: request.sellerId,
        regionId: request.regionId,
        productName: request.productName,
        category: request.category,
        budget: request.budget,
        festival: request.festival,
        quantity: request.quantity,
        gender: request.gender,
        comments: request.comments,
        status: 'PENDING',
        confidenceScore: 50,
      },
    });

    // Trigger aggregation
    await this.aggregateDemand(request.productName, request.category);

    return communityDemand;
  }

  /**
   * Aggregate similar community demands
   */
  private async aggregateDemand(productName: string, category?: string): Promise<void> {
    const similarDemands = await prisma.communityDemand.findMany({
      where: {
        productName: { contains: productName, mode: 'insensitive' },
        ...(category && { category }),
        status: 'PENDING',
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      },
    });

    if (similarDemands.length >= 3) {
      // Update confidence scores for aggregated demands
      await prisma.communityDemand.updateMany({
        where: {
          id: { in: similarDemands.map(d => d.id) },
        },
        data: {
          status: 'AGGREGATED',
          confidenceScore: { increment: 20 },
        },
      });

      // Create or update demand signal
      await this.updateDemandSignal(similarDemands);
    }
  }

  /**
   * Update demand signal based on community demand
   */
  private async updateDemandSignal(demands: any[]): Promise<void> {
    const topRegion = this.getMostFrequent(demands.map(d => d.regionId).filter(Boolean));
    const category = demands[0].category || 'Uncategorized';

    // Check if demand signal exists
    const existingSignal = await prisma.demandSignal.findFirst({
      where: {
        regionId: topRegion,
        category,
        source: 'COMMUNITY',
      },
    });

    if (existingSignal) {
      await prisma.demandSignal.update({
        where: { id: existingSignal.id },
        data: {
          demandScore: { increment: demands.length * 10 },
          updatedAt: new Date(),
        },
      });
    } else {
      await prisma.demandSignal.create({
        data: {
          regionId: topRegion,
          category,
          demandScore: Math.min(demands.length * 15, 100),
          source: 'COMMUNITY',
          seasonality: 'MEDIUM',
          period: 'current',
        },
      });
    }
  }

  /**
   * Get aggregated community demands
   */
  async getAggregatedDemands(regionId?: string): Promise<AggregatedDemand[]> {
    const demands = await prisma.communityDemand.findMany({
      where: {
        ...(regionId && { regionId }),
        status: { in: ['AGGREGATED', 'PENDING'] },
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
      include: {
        region: true,
      },
    });

    // Group by product name
    const grouped = new Map<string, any[]>();
    demands.forEach(demand => {
      const key = demand.productName.toLowerCase();
      if (!grouped.has(key)) {
        grouped.set(key, []);
      }
      grouped.get(key)!.push(demand);
    });

    const aggregated: AggregatedDemand[] = [];

    for (const [productName, group] of grouped.entries()) {
      const totalRequests = group.length;
      const totalQuantity = group.reduce((sum, d) => sum + (d.quantity || 1), 0);
      const averageBudget = group.reduce((sum, d) => sum + (d.budget || 0), 0) / totalRequests;
      const regions = [...new Set(group.map(d => d.region?.name).filter(Boolean))];
      const festivals = [...new Set(group.map(d => d.festival).filter(Boolean))];
      const category = group[0].category || 'Uncategorized';
      const trendScore = Math.min(totalRequests * 5 + totalQuantity, 100);
      const confidence = Math.min(50 + totalRequests * 5, 95);

      // Use AI to determine recommended action
      const recommendedAction = await this.getRecommendedAction({
        productName,
        category,
        totalRequests,
        trendScore,
        regions,
        festivals,
      });

      aggregated.push({
        productName,
        category,
        totalRequests,
        totalQuantity,
        averageBudget: Math.round(averageBudget),
        regions,
        festivals,
        trendScore,
        confidence,
        recommendedAction,
      });
    }

    return aggregated.sort((a, b) => b.trendScore - a.trendScore);
  }

  /**
   * Get most frequent value from array
   */
  private getMostFrequent(arr: string[]): string {
    const frequency = new Map<string, number>();
    arr.forEach(item => {
      frequency.set(item, (frequency.get(item) || 0) + 1);
    });
    return Array.from(frequency.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] || '';
  }

  /**
   * Get recommended action for aggregated demand using rule engine
   */
  private async getRecommendedAction(context: any): Promise<string> {
    const ruleEngine = RuleEngine;
    
    // Create context for rule evaluation
    const ruleContext = {
      trendScore: context.trendScore,
      totalRequests: context.totalRequests,
      festivals: context.festivals.length,
      productName: context.productName,
      category: context.category,
    };

    // Evaluate rules to determine action
    const actions = ruleEngine.executeRules(ruleContext);
    
    if (actions.length > 0) {
      // Map rule actions to business actions
      if (actions.includes('onboard_sellers')) return 'Onboard new MSMEs';
      if (actions.includes('create_festival_campaign')) return 'Create festival collection';
      if (actions.includes('increase_inventory')) return 'Increase inventory';
      if (actions.includes('generate_seller_mission')) return 'Generate seller mission';
    }

    // Fallback to deterministic logic
    return this.getFallbackAction(context);
  }

  /**
   * Fallback action recommendation
   */
  private getFallbackAction(context: any): string {
    if (context.trendScore > 70) return 'Onboard new MSMEs';
    if (context.festivals.length > 0) return 'Generate seller mission';
    if (context.totalRequests > 5) return 'Increase inventory';
    return 'Monitor trend';
  }

  /**
   * Get community demand heatmap data
   */
  async getDemandHeatmap(): Promise<{
    region: string;
    demandCount: number;
    topCategories: string[];
  }[]> {
    const demands = await prisma.communityDemand.groupBy({
      by: ['regionId'],
      where: {
        status: { in: ['AGGREGATED', 'PENDING'] },
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
      _count: {
        id: true,
      },
    });

    const heatmap = [];

    for (const item of demands) {
      if (!item.regionId) continue;

      const region = await prisma.region.findUnique({
        where: { id: item.regionId },
      });

      if (!region) continue;

      const categoryDemands = await prisma.communityDemand.findMany({
        where: {
          regionId: item.regionId,
          status: { in: ['AGGREGATED', 'PENDING'] },
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
        },
        select: { category: true },
      });

      const topCategories = this.getMostFrequent(
        categoryDemands.map(d => d.category).filter((c): c is string => Boolean(c))
      ).split(',').slice(0, 3);

      heatmap.push({
        region: region.name,
        demandCount: item._count.id,
        topCategories,
      });
    }

    return heatmap.sort((a, b) => b.demandCount - a.demandCount);
  }

  /**
   * Get emerging trends from community demand
   */
  async getEmergingTrends(): Promise<Array<{
    productName: string;
    category: string;
    growthRate: number;
    prediction: string;
  }>> {
    const currentDemands = await prisma.communityDemand.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    });

    const previousDemands = await prisma.communityDemand.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
    });

    const trends = new Map<string, { current: number; previous: number; category: string }>();

    currentDemands.forEach(d => {
      const key = d.productName.toLowerCase();
      if (!trends.has(key)) {
        trends.set(key, { current: 0, previous: 0, category: d.category || 'Uncategorized' });
      }
      trends.get(key)!.current++;
    });

    previousDemands.forEach(d => {
      const key = d.productName.toLowerCase();
      if (trends.has(key)) {
        trends.get(key)!.previous++;
      }
    });

    const emergingTrends = [];

    for (const [productName, data] of trends.entries()) {
      if (data.current < 3) continue; // Skip low volume

      const growthRate = data.previous === 0 ? 100 : ((data.current - data.previous) / data.previous) * 100;
      
      if (growthRate > 50) {
        const prediction = await this.getTrendPrediction({
          productName,
          category: data.category,
          growthRate,
          currentVolume: data.current,
        });

        emergingTrends.push({
          productName,
          category: data.category,
          growthRate: Math.round(growthRate),
          prediction,
        });
      }
    }

    return emergingTrends.sort((a, b) => b.growthRate - a.growthRate).slice(0, 10);
  }

  /**
   * Get trend prediction using deterministic algorithms
   */
  private async getTrendPrediction(context: any): Promise<string> {
    const { productName, growthRate } = context;
    
    // Use deterministic logic for trend prediction
    if (growthRate > 50) {
      return `Demand for ${productName} is growing rapidly (${growthRate}% growth). Strong upward trend expected to continue.`;
    } else if (growthRate > 20) {
      return `Demand for ${productName} is growing steadily (${growthRate}% growth). Positive trend likely to continue.`;
    } else if (growthRate > 0) {
      return `Demand for ${productName} is showing moderate growth (${growthRate}%). Monitor for sustained interest.`;
    } else if (growthRate > -20) {
      return `Demand for ${productName} is stable with slight variation. Current volume indicates consistent interest.`;
    } else {
      return `Demand for ${productName} is declining. Consider strategic inventory adjustments.`;
    }
  }

  /**
   * Mark community demand as fulfilled
   */
  async markAsFulfilled(demandId: string): Promise<void> {
    await prisma.communityDemand.update({
      where: { id: demandId },
      data: { status: 'FULFILLED' },
    });
  }
}

export default new CommunityDemandService();
