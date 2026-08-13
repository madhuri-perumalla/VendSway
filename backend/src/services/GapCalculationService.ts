import { GapRepository } from '../repositories/GapRepository';
import { DemandRepository } from '../repositories/DemandRepository';
import { GapPriority } from '@prisma/client';

/**
 * Gap calculation service
 * Implements catalog gap detection and priority calculation
 */
export class GapCalculationService {
  private gapRepository: GapRepository;
  private demandRepository: DemandRepository;

  constructor(gapRepository: GapRepository, demandRepository: DemandRepository) {
    this.gapRepository = gapRepository;
    this.demandRepository = demandRepository;
  }

  /**
   * Calculate catalog gap for region-category combination
   * Gap = Demand - Available Catalog Items
   * Priority = Based on gap size and demand score
   * 
   * @param regionId - Region ID
   * @param category - Category
   * @param period - Time period
   * @returns Calculated gap data
   */
  async calculateCatalogGap(
    regionId: string,
    category: string,
    _period: string
  ): Promise<{
    gap: number;
    demand: number;
    available: number;
    priority: GapPriority;
    demandScore: number;
  }> {
    // Get demand signal
    const demandSignal = await this.demandRepository.getLatestDemandSignal(
      regionId,
      category
    );

    if (!demandSignal) {
      // No demand data, assume low demand
      return {
        gap: 0,
        demand: 0,
        available: 0,
        priority: GapPriority.LOW,
        demandScore: 0,
      };
    }

    // Get catalog items
    const catalogItems = await this.gapRepository.getCatalogItemsByRegionAndCategory(
      regionId,
      category
    );

    // Calculate available quantity
    const available = catalogItems.reduce((sum, item) => sum + item.availableQuantity, 0);

    // Calculate demand (use demand score as proxy for demand quantity)
    // In production, this would use actual demand data
    const demand = Math.round(Number(demandSignal.demandScore) * 5); // Scale factor for demo

    // Calculate gap
    const gap = Math.max(0, demand - available);

    // Calculate priority based on gap and demand score
    const priority = this.calculatePriority(gap, Number(demandSignal.demandScore));

    return {
      gap,
      demand,
      available,
      priority,
      demandScore: Number(demandSignal.demandScore),
    };
  }

  /**
   * Calculate priority based on gap size and demand score
   * @param gap - Gap size
   * @param demandScore - Demand score (0-100)
   * @returns Priority level
   */
  private calculatePriority(gap: number, demandScore: number): GapPriority {
    // High priority: Large gap (>200) OR High demand (>80) with medium gap (>50)
    if (gap > 200 || (demandScore > 80 && gap > 50)) {
      return GapPriority.HIGH;
    }

    // Medium priority: Medium gap (50-200) OR Medium demand (50-80) with small gap (>20)
    if (gap > 50 || (demandScore > 50 && gap > 20)) {
      return GapPriority.MEDIUM;
    }

    // Low priority: Small gap or low demand
    return GapPriority.LOW;
  }

  /**
   * Calculate and store catalog gap
   * @param regionId - Region ID
   * @param category - Category
   * @param period - Time period
   * @param festivalId - Optional festival ID
   * @returns Created catalog gap
   */
  async calculateAndStoreGap(
    regionId: string,
    category: string,
    period: string,
    festivalId?: string
  ) {
    const gapData = await this.calculateCatalogGap(regionId, category, period);

    // Check if gap already exists
    const existingGaps = await this.gapRepository.getGapsByRegionAndCategory(
      regionId,
      category
    );

    // If gap exists and is resolved, create new one. Otherwise, update.
    if (existingGaps.length > 0) {
      const latestGap = existingGaps[0];
      if (latestGap.resolvedAt) {
        // Create new gap
        return this.gapRepository.createCatalogGap({
          regionId,
          category,
          festivalId,
          demand: gapData.demand,
          available: gapData.available,
          gap: gapData.gap,
          priority: gapData.priority,
          identifiedAt: new Date(),
        });
      } else {
        // Update existing gap
        return this.gapRepository.update(latestGap.id, {
          demand: gapData.demand,
          available: gapData.available,
          gap: gapData.gap,
          priority: gapData.priority,
          identifiedAt: new Date(),
        });
      }
    }

    // Create new gap
    return this.gapRepository.createCatalogGap({
      regionId,
      category,
      festivalId,
      demand: gapData.demand,
      available: gapData.available,
      gap: gapData.gap,
      priority: gapData.priority,
      identifiedAt: new Date(),
    });
  }

  /**
   * Batch calculate gaps for multiple regions and categories
   * @param regionIds - Array of region IDs
   * @param categories - Array of categories
   * @param period - Time period
   * @returns Array of created/updated gaps
   */
  async batchCalculateGaps(
    regionIds: string[],
    categories: string[],
    period: string
  ) {
    const results = [];

    for (const regionId of regionIds) {
      for (const category of categories) {
        try {
          const gap = await this.calculateAndStoreGap(regionId, category, period);
          results.push(gap);
        } catch (error) {
          console.error(`Failed to calculate gap for region ${regionId}, category ${category}:`, error);
        }
      }
    }

    return results;
  }

  /**
   * Get missing categories for a region
   * @param regionId - Region ID
   * @returns Array of missing categories
   */
  async getMissingCategories(regionId: string): Promise<string[]> {
    const gaps = await this.gapRepository.getUnresolvedGaps(regionId);
    const missingCategories = gaps
      .filter((gap) => gap.gap > 0)
      .map((gap) => gap.category);

    // Remove duplicates
    return [...new Set(missingCategories)];
  }

  /**
   * Get demand shortage summary for a region
   * @param regionId - Region ID
   * @returns Demand shortage summary
   */
  async getDemandShortageSummary(regionId: string) {
    const gaps = await this.gapRepository.getUnresolvedGaps(regionId);

    const totalShortage = gaps.reduce((sum, gap) => sum + gap.gap, 0);
    const highPriorityShortage = gaps
      .filter((gap) => gap.priority === GapPriority.HIGH)
      .reduce((sum, gap) => sum + gap.gap, 0);
    const mediumPriorityShortage = gaps
      .filter((gap) => gap.priority === GapPriority.MEDIUM)
      .reduce((sum, gap) => sum + gap.gap, 0);
    const lowPriorityShortage = gaps
      .filter((gap) => gap.priority === GapPriority.LOW)
      .reduce((sum, gap) => sum + gap.gap, 0);

    return {
      regionId,
      totalShortage,
      highPriorityShortage,
      mediumPriorityShortage,
      lowPriorityShortage,
      gapCount: gaps.length,
      highPriorityCount: gaps.filter((gap) => gap.priority === GapPriority.HIGH).length,
      mediumPriorityCount: gaps.filter((gap) => gap.priority === GapPriority.MEDIUM).length,
      lowPriorityCount: gaps.filter((gap) => gap.priority === GapPriority.LOW).length,
    };
  }

  /**
   * Resolve a catalog gap
   * @param gapId - Gap ID
   * @returns Updated gap
   */
  async resolveGap(gapId: string) {
    return this.gapRepository.resolveGap(gapId);
  }

  /**
   * Get gap analysis for a region
   * @param regionId - Region ID
   * @returns Gap analysis data
   */
  async getGapAnalysis(regionId: string) {
    return this.gapRepository.getGapAnalysis(regionId);
  }

  /**
   * Get top priority gaps across all regions
   * @param limit - Number of gaps to return
   * @returns Array of high priority gaps
   */
  async getTopPriorityGaps(limit: number = 20) {
    const highPriorityGaps = await this.gapRepository.getGapsByPriority('HIGH');
    return highPriorityGaps.slice(0, limit);
  }
}
