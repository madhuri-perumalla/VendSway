import { DemandRepository } from '../repositories/DemandRepository';
import { FashionRelevance, Seasonality } from '@prisma/client';

/**
 * Demand calculation service
 * Implements demand scoring algorithm for regional fashion intelligence
 */
export class DemandCalculationService {
  private demandRepository: DemandRepository;

  constructor(demandRepository: DemandRepository) {
    this.demandRepository = demandRepository;
  }

  /**
   * Calculate demand score for region-category combination
   * Formula: (FestivalRelevance × 0.30) + (RegionalPopularity × 0.20) + (TrendSignal × 0.25) + (HistoricalDemand × 0.25)
   * 
   * @param regionId - Region ID
   * @param category - Product category
   * @param period - Time period (e.g., "Q1 2026")
   * @returns Calculated demand score (0-100)
   */
  async calculateDemandScore(
    regionId: string,
    category: string,
    period: string
  ): Promise<number> {
    // Get festival relevance
    const festivalRelevance = await this.calculateFestivalRelevance(regionId, period);

    // Get regional popularity
    const regionalPopularity = await this.calculateRegionalPopularity(regionId, category);

    // Get trend signal
    const trendSignal = await this.calculateTrendSignal(regionId, category);

    // Get historical demand
    const historicalDemand = await this.calculateHistoricalDemand(regionId, category);

    // Calculate weighted score
    const demandScore =
      festivalRelevance * 0.3 +
      regionalPopularity * 0.2 +
      trendSignal * 0.25 +
      historicalDemand * 0.25;

    // Clamp to 0-100 range
    return Math.max(0, Math.min(100, Math.round(demandScore)));
  }

  /**
   * Calculate festival relevance score (0-100)
   * @param regionId - Region ID
   * @param period - Time period
   * @returns Festival relevance score
   */
  private async calculateFestivalRelevance(
    regionId: string,
    period: string
  ): Promise<number> {
    const festivals = await this.demandRepository.getFestivalsByRegion(regionId);

    if (festivals.length === 0) {
      return 10; // Base score if no festivals
    }

    // Check if there's a festival in the current period
    const currentPeriodFestival = festivals.find((festival) => {
      const festivalDate = new Date(festival.date);
      const festivalPeriod = this.getPeriodFromDate(festivalDate);
      return festivalPeriod === period;
    });

    if (currentPeriodFestival) {
      // Return score based on fashion relevance
      switch (currentPeriodFestival.fashionRelevance) {
        case FashionRelevance.HIGH:
          return 100;
        case FashionRelevance.MEDIUM:
          return 60;
        case FashionRelevance.LOW:
          return 30;
        default:
          return 10;
      }
    }

    // Check for nearby festivals (within 30 days)
    const nearbyFestival = festivals.find((festival) => {
      const festivalDate = new Date(festival.date);
      const now = new Date();
      const diffDays = Math.abs((festivalDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays <= 30;
    });

    if (nearbyFestival) {
      switch (nearbyFestival.fashionRelevance) {
        case FashionRelevance.HIGH:
          return 70;
        case FashionRelevance.MEDIUM:
          return 40;
        case FashionRelevance.LOW:
          return 20;
        default:
          return 10;
      }
    }

    return 10; // Base score
  }

  /**
   * Calculate regional popularity score (0-100)
   * @param regionId - Region ID
   * @param category - Category
   * @returns Regional popularity score
   */
  private async calculateRegionalPopularity(
    regionId: string,
    category: string
  ): Promise<number> {
    const trends = await this.demandRepository.getRegionalTrends(regionId, category);

    if (trends.length === 0) {
      return 50; // Neutral score if no trend data
    }

    // Use the latest trend score
    const latestTrend = trends[0];
    const trendScore = parseFloat(latestTrend.trendScore.toString());

    // Normalize to 0-100 range (assuming trendScore is 0-100)
    return Math.max(0, Math.min(100, trendScore));
  }

  /**
   * Calculate trend signal score (0-100)
   * @param regionId - Region ID
   * @param category - Category
   * @returns Trend signal score
   */
  private async calculateTrendSignal(
    regionId: string,
    category: string
  ): Promise<number> {
    const trends = await this.demandRepository.getRegionalTrends(regionId, category);

    if (trends.length === 0) {
      return 50; // Neutral score if no trend data
    }

    const latestTrend = trends[0];
    const trendScore = parseFloat(latestTrend.trendScore.toString());

    // Factor in seasonality
    let seasonalityMultiplier = 1;
    switch (latestTrend.seasonality) {
      case Seasonality.HIGH:
        seasonalityMultiplier = 1.2;
        break;
      case Seasonality.MEDIUM:
        seasonalityMultiplier = 1.0;
        break;
      case Seasonality.LOW:
        seasonalityMultiplier = 0.8;
        break;
    }

    const trendSignal = trendScore * seasonalityMultiplier;
    return Math.max(0, Math.min(100, trendSignal));
  }

  /**
   * Calculate historical demand score (0-100)
   * @param regionId - Region ID
   * @param category - Category
   * @returns Historical demand score
   */
  private async calculateHistoricalDemand(
    regionId: string,
    category: string
  ): Promise<number> {
    const historicalSignals = await this.demandRepository.getDemandSignalsByRegionAndCategory(
      regionId,
      category
    );

    if (historicalSignals.length === 0) {
      return 50; // Neutral score if no historical data
    }

    // Use the most recent historical demand score
    const latestSignal = historicalSignals[0];
    return Math.max(0, Math.min(100, Number(latestSignal.demandScore)));
  }

  /**
   * Calculate and store demand signal
   * @param regionId - Region ID
   * @param category - Category
   * @param period - Time period
   * @param source - Data source
   * @returns Created demand signal
   */
  async calculateAndStoreDemandSignal(
    regionId: string,
    category: string,
    period: string,
    source: string = 'Intelligence Engine'
  ) {
    const demandScore = await this.calculateDemandScore(regionId, category, period);

    // Determine seasonality based on period (simplified)
    const seasonality = this.determineSeasonality(period);

    const demandSignal = await this.demandRepository.createDemandSignal({
      regionId,
      category,
      demandScore,
      seasonality,
      source,
      period,
    });

    return demandSignal;
  }

  /**
   * Batch calculate demand signals for multiple regions and categories
   * @param regionIds - Array of region IDs
   * @param categories - Array of categories
   * @param period - Time period
   * @param source - Data source
   * @returns Array of created demand signals
   */
  async batchCalculateDemandSignals(
    regionIds: string[],
    categories: string[],
    period: string,
    source: string = 'Intelligence Engine'
  ) {
    const results = [];

    for (const regionId of regionIds) {
      for (const category of categories) {
        try {
          const signal = await this.calculateAndStoreDemandSignal(
            regionId,
            category,
            period,
            source
          );
          results.push(signal);
        } catch (error) {
          console.error(`Failed to calculate demand for region ${regionId}, category ${category}:`, error);
        }
      }
    }

    return results;
  }

  /**
   * Get period from date (simplified)
   * @param date - Date object
   * @returns Period string (e.g., "Q1 2026")
   */
  private getPeriodFromDate(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const quarter = Math.ceil(month / 3);
    return `Q${quarter} ${year}`;
  }

  /**
   * Determine seasonality from period (simplified)
   * @param period - Period string
   * @returns Seasonality enum value
   */
  private determineSeasonality(period: string): Seasonality {
    // Simplified logic - in production, this would be more sophisticated
    const quarter = period.split(' ')[0];
    if (quarter === 'Q1' || quarter === 'Q4') {
      return Seasonality.HIGH; // Festival seasons
    }
    return Seasonality.MEDIUM;
  }

  /**
   * Get demand analysis for a region
   * @param regionId - Region ID
   * @returns Demand analysis data
   */
  async getDemandAnalysis(regionId: string) {
    const demandSignals = await this.demandRepository.getDemandSignalsByRegion(regionId);
    const highDemandSignals = await this.demandRepository.getHighDemandSignals(regionId);

    // Calculate statistics
    const scores = demandSignals.map((s) => Number(s.demandScore));
    const averageScore =
      scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    const maxScore = scores.length > 0 ? Math.max(...scores) : 0;
    const minScore = scores.length > 0 ? Math.min(...scores) : 0;

    // Group by category
    const categoryGroups = demandSignals.reduce((acc, signal) => {
      if (!acc[signal.category]) {
        acc[signal.category] = [];
      }
      acc[signal.category].push(signal);
      return acc;
    }, {} as Record<string, any[]>);

    const categoryAnalysis = Object.entries(categoryGroups).map(([category, signals]) => {
      const catScores = signals.map((s) => Number(s.demandScore));
      return {
        category,
        averageScore: catScores.reduce((a, b) => a + b, 0) / catScores.length,
        signalCount: signals.length,
        latestScore: Number(signals[0].demandScore),
      };
    });

    return {
      regionId,
      totalSignals: demandSignals.length,
      highDemandCount: highDemandSignals.length,
      statistics: {
        averageScore: Math.round(averageScore),
        maxScore,
        minScore,
      },
      categoryAnalysis,
      topDemandSignals: highDemandSignals.slice(0, 5),
    };
  }
}
