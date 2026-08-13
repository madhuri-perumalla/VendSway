import { PrismaClient, DemandSignal, Festival, RegionalTrend } from '@prisma/client';
import { BaseRepository } from './BaseRepository';

/**
 * Demand repository
 * Handles data access for demand signals and calculations
 */
export class DemandRepository extends BaseRepository<
  DemandSignal,
  any,
  any
> {
  constructor(prisma: PrismaClient) {
    super(prisma, 'demandSignal');
  }

  /**
   * Get demand signals by region
   * @param regionId - Region ID
   * @returns Array of demand signals
   */
  async getDemandSignalsByRegion(regionId: string): Promise<DemandSignal[]> {
    return this.prisma.demandSignal.findMany({
      where: { regionId },
      orderBy: { period: 'desc' },
    });
  }

  /**
   * Get demand signals by region and category
   * @param regionId - Region ID
   * @param category - Category
   * @returns Array of demand signals
   */
  async getDemandSignalsByRegionAndCategory(
    regionId: string,
    category: string
  ): Promise<DemandSignal[]> {
    return this.prisma.demandSignal.findMany({
      where: { regionId, category },
      orderBy: { period: 'desc' },
    });
  }

  /**
   * Get demand signals by festival
   * @param festivalId - Festival ID
   * @returns Array of demand signals
   */
  async getDemandSignalsByFestival(festivalId: string): Promise<DemandSignal[]> {
    return this.prisma.demandSignal.findMany({
      where: { festivalId },
      orderBy: { period: 'desc' },
    });
  }

  /**
   * Get latest demand signal for region-category combination
   * @param regionId - Region ID
   * @param category - Category
   * @returns Latest demand signal or null
   */
  async getLatestDemandSignal(
    regionId: string,
    category: string
  ): Promise<DemandSignal | null> {
    return this.prisma.demandSignal.findFirst({
      where: { regionId, category },
      orderBy: { period: 'desc' },
    });
  }

  /**
   * Get festivals by region for demand calculation
   * @param regionId - Region ID
   * @returns Array of festivals
   */
  async getFestivalsByRegion(regionId: string): Promise<Festival[]> {
    return this.prisma.festival.findMany({
      where: { regionId },
      orderBy: { date: 'asc' },
    });
  }

  /**
   * Get regional trends for demand calculation
   * @param regionId - Region ID
   * @param category - Category
   * @returns Array of regional trends
   */
  async getRegionalTrends(
    regionId: string,
    category: string
  ): Promise<RegionalTrend[]> {
    return this.prisma.regionalTrend.findMany({
      where: { regionId, category },
      orderBy: { period: 'desc' },
      take: 5,
    });
  }

  /**
   * Create demand signal
   * @param data - Demand signal data
   * @returns Created demand signal
   */
  async createDemandSignal(data: any): Promise<DemandSignal> {
    return this.prisma.demandSignal.create({
      data,
    });
  }

  /**
   * Get demand signals for multiple regions
   * @param regionIds - Array of region IDs
   * @returns Array of demand signals
   */
  async getDemandSignalsByRegions(regionIds: string[]): Promise<DemandSignal[]> {
    return this.prisma.demandSignal.findMany({
      where: { regionId: { in: regionIds } },
      orderBy: { demandScore: 'desc' },
    });
  }

  /**
   * Get high demand signals (score > 70)
   * @param regionId - Optional region ID filter
   * @returns Array of high demand signals
   */
  async getHighDemandSignals(regionId?: string): Promise<DemandSignal[]> {
    return this.prisma.demandSignal.findMany({
      where: {
        demandScore: { gt: 70 },
        ...(regionId && { regionId }),
      },
      orderBy: { demandScore: 'desc' },
    });
  }

  /**
   * Get all festivals
   * @returns Array of festivals
   */
  async getFestivals(): Promise<Festival[]> {
    return this.prisma.festival.findMany({
      orderBy: { date: 'asc' },
    });
  }
}
