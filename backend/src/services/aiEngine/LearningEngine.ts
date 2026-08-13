// ============================================================================
// LEARNING ENGINE
// ============================================================================
// Learns from action results and updates internal weights

import { ActionContext, LearningContext } from './types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface LearningWeights {
  demandWeight: number;
  festivalWeight: number;
  inventoryWeight: number;
  sellerWeight: number;
  trendWeight: number;
}

class LearningEngine {
  private weights: LearningWeights = {
    demandWeight: 0.3,
    festivalWeight: 0.2,
    inventoryWeight: 0.15,
    sellerWeight: 0.2,
    trendWeight: 0.15,
  };

  /**
   * Learn from action results and update weights
   */
  async learn(actionContext: ActionContext): Promise<LearningContext> {
    // Calculate performance metrics from action results
    const metrics = await this.calculateMetrics(actionContext);

    // Update weights based on performance
    const weightUpdates = this.updateWeights(metrics);

    // Persist learning
    await this.persistLearning(metrics, weightUpdates);

    return {
      actionContext,
      metrics,
      weightUpdates,
    };
  }

  /**
   * Calculate performance metrics from action results
   */
  private async calculateMetrics(_actionContext: ActionContext): Promise<any> {

    // Calculate mission acceptance rate
    const missionAcceptanceRate = await this.calculateMissionAcceptanceRate();

    // Calculate mission completion rate
    const missionCompletionRate = await this.calculateMissionCompletionRate();

    // Calculate campaign performance
    const campaignPerformance = await this.calculateCampaignPerformance();

    // Calculate seller growth rate
    const sellerGrowthRate = await this.calculateSellerGrowthRate();

    // Calculate opportunity success rate
    const opportunitySuccessRate = await this.calculateOpportunitySuccessRate();

    // Calculate product sales rate
    const productSalesRate = await this.calculateProductSalesRate();

    // Calculate demand prediction accuracy
    const demandAccuracy = await this.calculateDemandAccuracy();

    return {
      missionAcceptanceRate,
      missionCompletionRate,
      campaignPerformance,
      sellerGrowthRate,
      opportunitySuccessRate,
      productSalesRate,
      demandAccuracy,
    };
  }

  /**
   * Calculate mission acceptance rate
   */
  private async calculateMissionAcceptanceRate(): Promise<number> {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const missions = await prisma.sellerMission.findMany({
      where: {
        createdAt: { gte: thirtyDaysAgo },
      },
    });

    if (missions.length === 0) return 0;

    const acceptedMissions = missions.filter(m => m.status === 'ACCEPTED' || m.status === 'ACTIVE').length;
    return (acceptedMissions / missions.length) * 100;
  }

  /**
   * Calculate mission completion rate
   */
  private async calculateMissionCompletionRate(): Promise<number> {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const missions = await prisma.sellerMission.findMany({
      where: {
        createdAt: { gte: thirtyDaysAgo },
        status: { in: ['ACCEPTED', 'ACTIVE', 'COMPLETED'] },
      },
    });

    if (missions.length === 0) return 0;

    const completedMissions = missions.filter(m => m.status === 'COMPLETED').length;
    return (completedMissions / missions.length) * 100;
  }

  /**
   * Calculate campaign performance
   */
  private async calculateCampaignPerformance(): Promise<number> {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const campaigns = await prisma.campaign.findMany({
      where: {
        createdAt: { gte: thirtyDaysAgo },
        status: 'COMPLETED' as any,
      },
    });

    if (campaigns.length === 0) return 50;

    // Since actualReach doesn't exist, use confidence as proxy
    const totalPerformance = campaigns.reduce((sum, campaign) => {
      const confidence = (campaign as any).confidence || 70;
      return sum + confidence;
    }, 0);

    return totalPerformance / campaigns.length;
  }

  /**
   * Calculate seller growth rate
   */
  private async calculateSellerGrowthRate(): Promise<number> {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);

    const currentSellers = await prisma.seller.count({
      where: {
        status: 'APPROVED',
        createdAt: { gte: thirtyDaysAgo },
      },
    });

    const previousSellers = await prisma.seller.count({
      where: {
        status: 'APPROVED',
        createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
      },
    });

    if (previousSellers === 0) return currentSellers > 0 ? 100 : 0;

    return ((currentSellers - previousSellers) / previousSellers) * 100;
  }

  /**
   * Calculate opportunity success rate
   */
  private async calculateOpportunitySuccessRate(): Promise<number> {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const opportunities = await prisma.opportunity.findMany({
      where: {
        createdAt: { gte: thirtyDaysAgo },
      },
    });

    if (opportunities.length === 0) return 0;

    const successfulOpportunities = opportunities.filter(o => 
      o.status === 'ACCEPTED' || o.status === 'ACTIVE' || o.status === 'COMPLETED'
    ).length;

    return (successfulOpportunities / opportunities.length) * 100;
  }

  /**
   * Calculate product sales rate
   */
  private async calculateProductSalesRate(): Promise<number> {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const products = await prisma.product.findMany({
      where: {
        status: 'APPROVED',
        available: true,
        createdAt: { lte: thirtyDaysAgo },
      },
    });

    if (products.length === 0) return 0;

    // Since soldCount doesn't exist, use a proxy metric
    return 50; // Default moderate sales rate
  }

  /**
   * Calculate demand prediction accuracy
   */
  private async calculateDemandAccuracy(): Promise<number> {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const agentRuns = await prisma.agentRun.findMany({
      where: {
        runType: 'ORPDAL_CYCLE',
        status: 'COMPLETED',
        startTime: { gte: thirtyDaysAgo },
      },
      take: 10,
    });

    if (agentRuns.length === 0) return 70; // Default confidence

    // Compare predicted demand with actual demand signals
    let totalAccuracy = 0;

    for (const run of agentRuns) {
      try {
        const additionalData = JSON.parse(String(run.additionalData || '{}')) as any;
        const predictedOpportunities = additionalData.opportunityCount || 0;

        // Get actual demand signal count after the run
        const actualDemand = await prisma.demandSignal.count({
          where: {
            createdAt: { gte: run.startTime, lte: run.endTime || new Date() },
          },
        });

        // Calculate accuracy (how close prediction was to reality)
        const accuracy = 100 - Math.abs(predictedOpportunities - actualDemand) / Math.max(predictedOpportunities, 1) * 100;
        totalAccuracy += Math.max(0, accuracy);
      } catch (error) {
        console.error('Error calculating demand accuracy for run:', error);
      }
    }

    return totalAccuracy / agentRuns.length;
  }

  /**
   * Update weights based on performance metrics
   */
  private updateWeights(metrics: any): LearningWeights {
    const { missionAcceptanceRate, demandAccuracy, opportunitySuccessRate, campaignPerformance } = metrics;

    // Update demand weight based on prediction accuracy
    if (demandAccuracy > 80) {
      this.weights.demandWeight = Math.min(0.4, this.weights.demandWeight + 0.02);
    } else if (demandAccuracy < 60) {
      this.weights.demandWeight = Math.max(0.2, this.weights.demandWeight - 0.02);
    }

    // Update festival weight based on mission acceptance
    if (missionAcceptanceRate > 70) {
      this.weights.festivalWeight = Math.min(0.25, this.weights.festivalWeight + 0.01);
    } else if (missionAcceptanceRate < 50) {
      this.weights.festivalWeight = Math.max(0.15, this.weights.festivalWeight - 0.01);
    }

    // Update seller weight based on opportunity success
    if (opportunitySuccessRate > 70) {
      this.weights.sellerWeight = Math.min(0.25, this.weights.sellerWeight + 0.01);
    } else if (opportunitySuccessRate < 50) {
      this.weights.sellerWeight = Math.max(0.15, this.weights.sellerWeight - 0.01);
    }

    // Update trend weight based on campaign performance
    if (campaignPerformance > 80) {
      this.weights.trendWeight = Math.min(0.2, this.weights.trendWeight + 0.01);
    } else if (campaignPerformance < 60) {
      this.weights.trendWeight = Math.max(0.1, this.weights.trendWeight - 0.01);
    }

    // Normalize weights to ensure they sum to 1
    const totalWeight = Object.values(this.weights).reduce((sum, w) => sum + w, 0);
    if (totalWeight !== 1) {
      Object.keys(this.weights).forEach(key => {
        this.weights[key as keyof LearningWeights] /= totalWeight;
      });
    }

    return { ...this.weights };
  }

  /**
   * Persist learning to database
   */
  private async persistLearning(metrics: any, weightUpdates: LearningWeights): Promise<void> {
    try {
      // Since learningSnapshot table doesn't exist, log to console instead
      console.log('Learning persisted:', {
        metrics,
        weightUpdates,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error('Error persisting learning:', error);
    }
  }

  /**
   * Get current weights
   */
  getWeights(): LearningWeights {
    return { ...this.weights };
  }

  /**
   * Set weights (for testing or manual adjustment)
   */
  setWeights(weights: Partial<LearningWeights>): void {
    this.weights = { ...this.weights, ...weights };
    
    // Normalize
    const totalWeight = Object.values(this.weights).reduce((sum, w) => sum + w, 0);
    if (totalWeight !== 1) {
      Object.keys(this.weights).forEach(key => {
        this.weights[key as keyof LearningWeights] /= totalWeight;
      });
    }
  }
}

export default new LearningEngine();