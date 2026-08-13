import { PrismaClient, CatalogGap, CatalogItem } from '@prisma/client';
import { BaseRepository } from './BaseRepository';

/**
 * Gap repository
 * Handles data access for catalog gap detection
 */
export class GapRepository extends BaseRepository<
  CatalogGap,
  any,
  any
> {
  constructor(prisma: PrismaClient) {
    super(prisma, 'catalogGap');
  }

  /**
   * Get catalog gaps by region
   * @param regionId - Region ID
   * @returns Array of catalog gaps
   */
  async getGapsByRegion(regionId: string): Promise<CatalogGap[]> {
    return this.prisma.catalogGap.findMany({
      where: { regionId },
      orderBy: { gap: 'desc' },
    });
  }

  /**
   * Get catalog gaps by region and category
   * @param regionId - Region ID
   * @param category - Category
   * @returns Array of catalog gaps
   */
  async getGapsByRegionAndCategory(
    regionId: string,
    category: string
  ): Promise<CatalogGap[]> {
    return this.prisma.catalogGap.findMany({
      where: { regionId, category },
      orderBy: { gap: 'desc' },
    });
  }

  /**
   * Get catalog gaps by priority
   * @param priority - Priority level
   * @param regionId - Optional region ID filter
   * @returns Array of catalog gaps
   */
  async getGapsByPriority(
    priority: string,
    regionId?: string
  ): Promise<CatalogGap[]> {
    return this.prisma.catalogGap.findMany({
      where: {
        priority: priority as any,
        ...(regionId && { regionId }),
      },
      orderBy: { gap: 'desc' },
    });
  }

  /**
   * Get unresolved gaps
   * @param regionId - Optional region ID filter
   * @returns Array of unresolved catalog gaps
   */
  async getUnresolvedGaps(regionId?: string): Promise<CatalogGap[]> {
    return this.prisma.catalogGap.findMany({
      where: {
        resolvedAt: null,
        ...(regionId && { regionId }),
      },
      orderBy: { gap: 'desc' },
    });
  }

  /**
   * Get catalog items by region and category
   * @param regionId - Region ID
   * @param category - Category
   * @returns Array of catalog items
   */
  async getCatalogItemsByRegionAndCategory(
    regionId: string,
    category: string
  ): Promise<CatalogItem[]> {
    return this.prisma.catalogItem.findMany({
      where: { regionId, category },
    });
  }

  /**
   * Get catalog items by region
   * @param regionId - Region ID
   * @returns Array of catalog items
   */
  async getCatalogItemsByRegion(regionId: string): Promise<CatalogItem[]> {
    return this.prisma.catalogItem.findMany({
      where: { regionId },
    });
  }

  /**
   * Create catalog gap
   * @param data - Catalog gap data
   * @returns Created catalog gap
   */
  async createCatalogGap(data: any): Promise<CatalogGap> {
    return this.prisma.catalogGap.create({
      data,
    });
  }

  /**
   * Update catalog gap as resolved
   * @param id - Gap ID
   * @returns Updated catalog gap
   */
  async resolveGap(id: string): Promise<CatalogGap> {
    return this.prisma.catalogGap.update({
      where: { id },
      data: { resolvedAt: new Date() },
    });
  }

  /**
   * Get gap analysis for a region
   * @param regionId - Region ID
   * @returns Gap analysis data
   */
  async getGapAnalysis(regionId: string) {
    const gaps = await this.getGapsByRegion(regionId);
    const unresolvedGaps = await this.getUnresolvedGaps(regionId);

    // Calculate statistics
    const gapsByPriority = gaps.reduce((acc, gap) => {
      if (!acc[gap.priority]) {
        acc[gap.priority] = [];
      }
      acc[gap.priority].push(gap);
      return acc;
    }, {} as Record<string, CatalogGap[]>);

    const totalGap = gaps.reduce((sum, gap) => sum + gap.gap, 0);
    const unresolvedTotalGap = unresolvedGaps.reduce((sum, gap) => sum + gap.gap, 0);

    // Group by category
    const gapsByCategory = gaps.reduce((acc, gap) => {
      if (!acc[gap.category]) {
        acc[gap.category] = [];
      }
      acc[gap.category].push(gap);
      return acc;
    }, {} as Record<string, CatalogGap[]>);

    const categoryAnalysis = Object.entries(gapsByCategory).map(([category, gaps]) => {
      const catGaps = gaps as CatalogGap[];
      return {
        category,
        totalGap: catGaps.reduce((sum, g) => sum + g.gap, 0),
        gapCount: catGaps.length,
        highPriorityCount: catGaps.filter((g) => g.priority === 'HIGH').length,
        unresolvedCount: catGaps.filter((g) => !g.resolvedAt).length,
      };
    });

    return {
      regionId,
      totalGaps: gaps.length,
      unresolvedGaps: unresolvedGaps.length,
      statistics: {
        totalGap,
        unresolvedTotalGap,
        averageGap: gaps.length > 0 ? Math.round(totalGap / gaps.length) : 0,
      },
      priorityBreakdown: {
        HIGH: gapsByPriority.HIGH?.length || 0,
        MEDIUM: gapsByPriority.MEDIUM?.length || 0,
        LOW: gapsByPriority.LOW?.length || 0,
      },
      categoryAnalysis,
      topGaps: gaps.slice(0, 10),
    };
  }

  /**
   * Get gaps with multiple filters
   * @param filters - Filter options
   * @returns Array of catalog gaps
   */
  async getGapsWithFilters(filters: {
    regionId?: string;
    category?: string;
    festivalId?: string;
    priority?: string;
  }): Promise<CatalogGap[]> {
    const where: any = {};
    
    if (filters.regionId) where.regionId = filters.regionId;
    if (filters.category) where.category = filters.category;
    if (filters.festivalId) where.festivalId = filters.festivalId;
    if (filters.priority) where.priority = filters.priority as any;

    return this.prisma.catalogGap.findMany({
      where,
      orderBy: { gap: 'desc' },
    });
  }
}
