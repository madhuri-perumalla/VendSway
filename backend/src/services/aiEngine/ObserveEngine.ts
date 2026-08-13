// ============================================================================
// OBSERVE ENGINE
// ============================================================================
// Gathers data from database for AI reasoning

import { PrismaClient } from '@prisma/client';
import { ObservationContext } from './types';

const prisma = new PrismaClient();

class ObserveEngine {
  /**
   * Gather all relevant data from database
   */
  async observe(context?: { regionId?: string; sellerId?: string }): Promise<ObservationContext> {
    try {
      const [
        demandSignals,
        catalogGaps,
        festivals,
        regions,
        approvedProducts,
        sellers,
        regionalTrends,
      ] = await Promise.all([
        this.getDemandSignals(context?.regionId),
        this.getCatalogGaps(context?.regionId),
        this.getFestivals(),
        this.getRegions(),
        this.getApprovedProducts(context?.regionId, context?.sellerId),
        this.getSellers(context?.regionId),
        this.getRegionalTrends(context?.regionId),
      ]);

      return {
        demandSignals,
        catalogGaps,
        festivals,
        regions,
        approvedProducts,
        sellers,
        regionalTrends,
        communityDemands: [],
        inventory: [],
        sellerPerformance: [],
        historicalTrends: [],
      };
    } catch (error) {
      console.error('Error in Observe engine:', error);
      throw error;
    }
  }

  /**
   * Get demand signals
   */
  private async getDemandSignals(regionId?: string) {
    return prisma.demandSignal.findMany({
      where: {
        ...(regionId && { regionId }),
        demandScore: { gte: 50 },
      },
      orderBy: { demandScore: 'desc' },
      take: 100,
      include: { region: true, festival: true },
    });
  }

  /**
   * Get catalog gaps
   */
  private async getCatalogGaps(regionId?: string) {
    return prisma.catalogGap.findMany({
      where: {
        ...(regionId && { regionId }),
        resolvedAt: null,
      },
      orderBy: { gap: 'desc' },
      take: 100,
      include: { region: true },
    });
  }

  /**
   * Get upcoming festivals
   */
  private async getFestivals() {
    const now = new Date();
    const threeMonthsLater = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
    
    return prisma.festival.findMany({
      where: {
        date: {
          gte: now,
          lte: threeMonthsLater,
        },
      },
      orderBy: { date: 'asc' },
      take: 20,
      include: { region: true },
    });
  }

  /**
   * Get all regions
   */
  private async getRegions() {
    return prisma.region.findMany({
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Get approved products
   */
  private async getApprovedProducts(regionId?: string, sellerId?: string) {
    return prisma.product.findMany({
      where: {
        status: 'APPROVED',
        available: true,
        ...(regionId && { regionId }),
        ...(sellerId && { sellerId }),
      },
      include: { seller: true, region: true },
      take: 200,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get active sellers
   */
  private async getSellers(regionId?: string) {
    return prisma.seller.findMany({
      where: {
        status: 'APPROVED',
        isActive: true,
        ...(regionId && { regionId }),
      },
      include: { region: true },
      take: 100,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get regional trends
   */
  private async getRegionalTrends(regionId?: string) {
    return prisma.regionalTrend.findMany({
      where: {
        ...(regionId && { regionId }),
      },
      orderBy: { trendScore: 'desc' },
      take: 50,
      include: { region: true },
    });
  }
}

export default new ObserveEngine();