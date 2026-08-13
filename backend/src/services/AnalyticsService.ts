import { DemandRepository } from '../repositories/DemandRepository';
import { GapRepository } from '../repositories/GapRepository';
import { SellerRepository } from '../repositories/SellerRepository';
import { ProductRepository } from '../repositories/ProductRepository';

/**
 * Analytics service
 * Handles aggregation queries for dashboard analytics
 */
export class AnalyticsService {
  private demandRepository: DemandRepository;
  private gapRepository: GapRepository;
  private sellerRepository: SellerRepository;
  private productRepository: ProductRepository;

  constructor(
    demandRepository: DemandRepository,
    gapRepository: GapRepository,
    sellerRepository: SellerRepository,
    productRepository: ProductRepository
  ) {
    this.demandRepository = demandRepository;
    this.gapRepository = gapRepository;
    this.sellerRepository = sellerRepository;
    this.productRepository = productRepository;
  }

  /**
   * Get demand analytics
   * @param filters - Optional filters (regionId, category, startDate, endDate)
   * @returns Demand analytics data
   */
  async getDemandAnalytics(filters?: {
    regionId?: string;
    category?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const demandSignals = await this.demandRepository.getDemandSignalsByRegions(
      filters?.regionId ? [filters.regionId] : []
    );

    // Apply category filter if provided
    let filteredSignals = demandSignals;
    if (filters?.category) {
      filteredSignals = demandSignals.filter(s => s.category === filters.category);
    }

    // Apply date range filter if provided
    if (filters?.startDate || filters?.endDate) {
      filteredSignals = filteredSignals.filter(s => {
        const signalDate = new Date(s.createdAt);
        if (filters.startDate && signalDate < filters.startDate) return false;
        if (filters.endDate && signalDate > filters.endDate) return false;
        return true;
      });
    }

    // Calculate aggregations
    const totalSignals = filteredSignals.length;
    const averageDemandScore = totalSignals > 0
      ? filteredSignals.reduce((sum, s) => sum + Number(s.demandScore || 0), 0) / totalSignals
      : 0;

    // Group by region
    const byRegion = filteredSignals.reduce((acc, signal) => {
      if (!acc[signal.regionId]) {
        acc[signal.regionId] = [];
      }
      acc[signal.regionId].push(signal);
      return acc;
    }, {} as Record<string, any[]>);

    const regionAnalytics = Object.entries(byRegion).map(([regionId, signals]) => ({
      regionId,
      signalCount: signals.length,
      averageScore: Math.round(signals.reduce((sum, s) => sum + Number(s.demandScore || 0), 0) / signals.length),
    }));

    // Group by category
    const byCategory = filteredSignals.reduce((acc, signal) => {
      if (!acc[signal.category]) {
        acc[signal.category] = [];
      }
      acc[signal.category].push(signal);
      return acc;
    }, {} as Record<string, any[]>);

    const categoryAnalytics = Object.entries(byCategory).map(([category, signals]) => ({
      category,
      signalCount: signals.length,
      averageScore: Math.round(signals.reduce((sum, s) => sum + Number(s.demandScore || 0), 0) / signals.length),
    }));

    // Trend over time (by period)
    const byPeriod = filteredSignals.reduce((acc, signal) => {
      if (!acc[signal.period]) {
        acc[signal.period] = [];
      }
      acc[signal.period].push(signal);
      return acc;
    }, {} as Record<string, any[]>);

    const trendData = Object.entries(byPeriod)
      .map(([period, signals]) => ({
        period,
        averageScore: Math.round(signals.reduce((sum, s) => sum + Number(s.demandScore || 0), 0) / signals.length),
        signalCount: signals.length,
      }))
      .sort((a, b) => a.period.localeCompare(b.period));

    return {
      summary: {
        totalSignals,
        averageDemandScore: Math.round(averageDemandScore),
        highDemandCount: filteredSignals.filter(s => Number(s.demandScore || 0) > 70).length,
        lowDemandCount: filteredSignals.filter(s => Number(s.demandScore || 0) < 30).length,
      },
      byRegion: regionAnalytics,
      byCategory: categoryAnalytics,
      trend: trendData,
      topDemandSignals: filteredSignals.sort((a, b) => Number(b.demandScore || 0) - Number(a.demandScore || 0)).slice(0, 10),
    };
  }

  /**
   * Get gap analytics
   * @param filters - Optional filters (regionId, priority, startDate, endDate)
   * @returns Gap analytics data
   */
  async getGapAnalytics(filters?: {
    regionId?: string;
    priority?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const gaps = filters?.regionId
      ? await this.gapRepository.getGapsByRegion(filters.regionId)
      : await this.gapRepository.getUnresolvedGaps();

    // Apply priority filter if provided
    let filteredGaps = gaps;
    if (filters?.priority) {
      filteredGaps = gaps.filter(g => g.priority === filters.priority);
    }

    // Apply date range filter if provided
    if (filters?.startDate || filters?.endDate) {
      filteredGaps = filteredGaps.filter(g => {
        const gapDate = new Date(g.identifiedAt);
        if (filters.startDate && gapDate < filters.startDate) return false;
        if (filters.endDate && gapDate > filters.endDate) return false;
        return true;
      });
    }

    // Calculate aggregations
    const totalGaps = filteredGaps.length;
    const totalGapSize = filteredGaps.reduce((sum, g) => sum + g.gap, 0);
    const averageGapSize = totalGaps > 0 ? Math.round(totalGapSize / totalGaps) : 0;

    // Group by priority
    const byPriority = filteredGaps.reduce((acc, gap) => {
      if (!acc[gap.priority]) {
        acc[gap.priority] = [];
      }
      acc[gap.priority].push(gap);
      return acc;
    }, {} as Record<string, any[]>);

    const priorityAnalytics = Object.entries(byPriority).map(([priority, gaps]) => ({
      priority,
      gapCount: gaps.length,
      totalGapSize: gaps.reduce((sum, g) => sum + g.gap, 0),
      averageGapSize: Math.round(gaps.reduce((sum, g) => sum + g.gap, 0) / gaps.length),
    }));

    // Group by region
    const byRegion = filteredGaps.reduce((acc, gap) => {
      if (!acc[gap.regionId]) {
        acc[gap.regionId] = [];
      }
      acc[gap.regionId].push(gap);
      return acc;
    }, {} as Record<string, any[]>);

    const regionAnalytics = Object.entries(byRegion).map(([regionId, gaps]) => ({
      regionId,
      gapCount: gaps.length,
      totalGapSize: gaps.reduce((sum, g) => sum + g.gap, 0),
      averageGapSize: Math.round(gaps.reduce((sum, g) => sum + g.gap, 0) / gaps.length),
    }));

    // Group by category
    const byCategory = filteredGaps.reduce((acc, gap) => {
      if (!acc[gap.category]) {
        acc[gap.category] = [];
      }
      acc[gap.category].push(gap);
      return acc;
    }, {} as Record<string, any[]>);

    const categoryAnalytics = Object.entries(byCategory).map(([category, gaps]) => ({
      category,
      gapCount: gaps.length,
      totalGapSize: gaps.reduce((sum, g) => sum + g.gap, 0),
      averageGapSize: Math.round(gaps.reduce((sum, g) => sum + g.gap, 0) / gaps.length),
    }));

    return {
      summary: {
        totalGaps,
        totalGapSize,
        averageGapSize,
        highPriorityCount: filteredGaps.filter(g => g.priority === 'HIGH').length,
        mediumPriorityCount: filteredGaps.filter(g => g.priority === 'MEDIUM').length,
        lowPriorityCount: filteredGaps.filter(g => g.priority === 'LOW').length,
      },
      byPriority: priorityAnalytics,
      byRegion: regionAnalytics,
      byCategory: categoryAnalytics,
      topGaps: filteredGaps.sort((a, b) => b.gap - a.gap).slice(0, 10),
    };
  }

  /**
   * Get seller analytics
   * @param filters - Optional filters (regionId, status, startDate, endDate)
   * @returns Seller analytics data
   */
  async getSellerAnalytics(filters?: {
    regionId?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    let sellers = filters?.regionId
      ? await this.sellerRepository.getSellersByRegion(filters.regionId)
      : await this.sellerRepository.findAll();

    // Apply status filter if provided
    if (filters?.status) {
      sellers = sellers.filter(s => s.status === filters.status);
    }

    // Apply date range filter if provided
    if (filters?.startDate || filters?.endDate) {
      sellers = sellers.filter(s => {
        const sellerDate = new Date(s.createdAt);
        if (filters.startDate && sellerDate < filters.startDate) return false;
        if (filters.endDate && sellerDate > filters.endDate) return false;
        return true;
      });
    }

    // Calculate aggregations
    const totalSellers = sellers.length;
    const averageRating = totalSellers > 0
      ? sellers.reduce((sum, s) => sum + Number(s.rating || 0), 0) / totalSellers
      : 0;

    // Group by status
    const byStatus = sellers.reduce((acc, seller) => {
      if (!acc[seller.status]) {
        acc[seller.status] = [];
      }
      acc[seller.status].push(seller);
      return acc;
    }, {} as Record<string, any[]>);

    const statusAnalytics = Object.entries(byStatus).map(([status, sellers]) => ({
      status,
      sellerCount: sellers.length,
      averageRating: Math.round(sellers.reduce((sum, s) => sum + Number(s.rating || 0), 0) / sellers.length),
    }));

    // Group by region (skip null regionId)
    const byRegion = sellers.reduce((acc, seller) => {
      if (!seller.regionId) return acc;
      if (!acc[seller.regionId]) {
        acc[seller.regionId] = [];
      }
      acc[seller.regionId].push(seller);
      return acc;
    }, {} as Record<string, any[]>);

    const regionAnalytics = Object.entries(byRegion).map(([regionId, sellers]) => ({
      regionId,
      sellerCount: sellers.length,
      averageRating: Math.round(sellers.reduce((sum, s) => sum + Number(s.rating || 0), 0) / sellers.length),
    }));

    // Get product counts for each seller
    const sellerProductCounts = await Promise.all(
      sellers.map(async (seller) => ({
        sellerId: seller.id,
        productCount: await this.productRepository.getProductCountBySeller(seller.id),
      }))
    );

    const totalProducts = sellerProductCounts.reduce((sum, spc) => sum + spc.productCount, 0);
    const averageProductsPerSeller = totalSellers > 0 ? Math.round(totalProducts / totalSellers) : 0;

    return {
      summary: {
        totalSellers,
        averageRating: Math.round(averageRating),
        totalProducts,
        averageProductsPerSeller,
        approvedCount: sellers.filter(s => String(s.status).toUpperCase() === 'APPROVED').length,
        pendingCount: sellers.filter(s => ['PENDING', 'UNDER_REVIEW'].includes(String(s.status).toUpperCase())).length,
        registeredCount: sellers.filter(s => String(s.status).toUpperCase() === 'REGISTERED').length,
      },
      byStatus: statusAnalytics,
      byRegion: regionAnalytics,
      topSellers: sellers
        .sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0))
        .slice(0, 10),
    };
  }

  /**
   * Get dashboard overview
   * @param regionId - Optional region filter
   * @returns Combined dashboard analytics
   */
  async getDashboardOverview(regionId?: string) {
    const filters = regionId ? { regionId } : undefined;
    const [demandAnalytics, gapAnalytics, sellerAnalytics] = await Promise.all([
      this.getDemandAnalytics(filters),
      this.getGapAnalytics(filters),
      this.getSellerAnalytics(filters),
    ]);

    const allSellers = await this.sellerRepository.findAll();
    const approvedSellers = allSellers.filter((seller: any) => String(seller.status).toUpperCase() === 'APPROVED');
    const approvedProducts = (await Promise.all(
      approvedSellers.map(async (seller: any) => this.productRepository.getProductCountBySeller(seller.id))
    )).reduce((sum, count) => sum + count, 0);

    const catalogCoverage = Math.min(
      100,
      Math.round((approvedProducts / Math.max(1, demandAnalytics.summary.totalSignals * 2)) * 100)
    );
    const gapReduction = Math.min(
      100,
      Math.round((approvedSellers.length / Math.max(1, gapAnalytics.summary.totalGaps)) * 100)
    );

    const regionIds = Array.from(new Set([
      ...demandAnalytics.byRegion.map((entry: any) => entry.regionId),
      ...gapAnalytics.byRegion.map((entry: any) => entry.regionId),
      ...sellerAnalytics.byRegion.map((entry: any) => entry.regionId),
    ]));

    const regionComparison = regionIds.length > 0
      ? await this.getRegionalComparison(regionIds)
      : [];

    return {
      demand: demandAnalytics.summary,
      gaps: gapAnalytics.summary,
      sellers: sellerAnalytics.summary,
      kpis: {
        demandSignals: demandAnalytics.summary.totalSignals,
        catalogGaps: gapAnalytics.summary.totalGaps,
        activeSellers: approvedSellers.length,
        pendingApprovals: approvedProducts,
        approvedSellers: approvedSellers.length,
        approvedProducts,
        catalogCoverage,
        gapReduction,
      },
      trends: {
        demandTrend: demandAnalytics.trend.slice(-5), // Last 5 periods
        topDemandCategories: demandAnalytics.byCategory
          .sort((a, b) => b.averageScore - a.averageScore)
          .slice(0, 5),
        topGapCategories: gapAnalytics.byCategory
          .sort((a, b) => b.totalGapSize - a.totalGapSize)
          .slice(0, 5),
        topRegions: sellerAnalytics.byRegion
          .sort((a, b) => b.sellerCount - a.sellerCount)
          .slice(0, 5),
      },
      regionComparison,
    };
  }

  /**
   * Get regional comparison analytics
   * @param regionIds - Array of region IDs to compare
   * @returns Regional comparison data
   */
  async getRegionalComparison(regionIds: string[]) {
    const regionalData = await Promise.all(
      regionIds.map(async (regionId) => {
        const [demandData, gapData, sellerData] = await Promise.all([
          this.getDemandAnalytics({ regionId }),
          this.getGapAnalytics({ regionId }),
          this.getSellerAnalytics({ regionId }),
        ]);

        return {
          regionId,
          regionName: regionId,
          demand: demandData.summary,
          gaps: gapData.summary,
          sellers: sellerData.summary,
          kpis: {
            approvedSellers: sellerData.summary.approvedCount || 0,
            approvedProducts: sellerData.summary.totalProducts || 0,
            catalogCoverage: Math.min(
              100,
              Math.round((sellerData.summary.totalProducts || 0) / Math.max(1, demandData.summary.totalSignals * 2) * 100)
            ),
            gapReduction: Math.min(
              100,
              Math.round(((sellerData.summary.approvedCount || 0) / Math.max(1, gapData.summary.totalGaps)) * 100)
            ),
          },
        };
      })
    );

    return regionalData;
  }

  /**
   * Get unique categories from demand signals
   * @returns Array of unique categories
   */
  async getUniqueCategories() {
    const demandSignals = await this.demandRepository.getDemandSignalsByRegions([]);
    const categories = new Set(demandSignals.map(s => s.category));
    return Array.from(categories).sort();
  }

  /**
   * Get unique festivals
   * @returns Array of festivals with their IDs
   */
  async getUniqueFestivals() {
    const festivals = await this.demandRepository.getFestivals();
    return festivals.map((f: any) => ({ id: f.id, name: f.name, regionId: f.regionId }));
  }
}
