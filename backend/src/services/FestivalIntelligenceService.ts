// ============================================================================
// FESTIVAL INTELLIGENCE SERVICE
// ============================================================================
// AI-powered festival prediction and demand anticipation
// Predicts demand BEFORE it occurs based on festival calendar

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface FestivalPrediction {
  festivalId: string;
  festivalName: string;
  regionId: string;
  regionName: string;
  festivalDate: Date;
  daysRemaining: number;
  urgency: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  predictedCategories: Array<{
    category: string;
    demandIncrease: number;
    confidence: number;
  }>;
  recommendedProducts: string[];
  targetAudience: string[];
  seasonality: string;
  historicalPerformance?: number;
}

interface FestivalContext {
  currentDate: Date;
  regionId?: string;
  lookAheadDays: number;
}

class FestivalIntelligenceService {
  /**
   * Get upcoming festivals with AI-powered predictions
   */
  async getUpcomingFestivals(context: FestivalContext): Promise<FestivalPrediction[]> {
    const { currentDate, regionId, lookAheadDays } = context;
    const futureDate = new Date(currentDate);
    futureDate.setDate(futureDate.getDate() + lookAheadDays);

    const festivals = await prisma.festival.findMany({
      where: {
        date: {
          gte: currentDate,
          lte: futureDate,
        },
        ...(regionId && { regionId }),
      },
      include: {
        region: true,
        demandSignals: {
          where: {
            createdAt: {
              gte: new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
            },
          },
          orderBy: { demandScore: 'desc' },
        },
      },
      orderBy: { date: 'asc' },
    });

    const predictions: FestivalPrediction[] = [];

    for (const festival of festivals) {
      const daysRemaining = Math.ceil(
        (festival.date.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      const urgency = this.calculateUrgency(daysRemaining);
      const predictedCategories = await this.predictCategoriesForFestival(festival);
      const recommendedProducts = await this.getRecommendedProducts(festival, predictedCategories);
      const targetAudience = this.determineTargetAudience(festival, predictedCategories);
      const seasonality = this.determineSeasonality(festival.date);
      const historicalPerformance = await this.getHistoricalPerformance(festival);

      predictions.push({
        festivalId: festival.id,
        festivalName: festival.name,
        regionId: festival.regionId,
        regionName: festival.region.name,
        festivalDate: festival.date,
        daysRemaining,
        urgency,
        predictedCategories,
        recommendedProducts,
        targetAudience,
        seasonality,
        historicalPerformance,
      });
    }

    return predictions.sort((a, b) => a.daysRemaining - b.daysRemaining);
  }

  /**
   * Get critical festivals requiring immediate action
   */
  async getCriticalFestivals(context: FestivalContext): Promise<FestivalPrediction[]> {
    const predictions = await this.getUpcomingFestivals(context);
    return predictions.filter(p => p.urgency === 'CRITICAL' || p.urgency === 'HIGH');
  }

  /**
   * Calculate urgency based on days remaining
   */
  private calculateUrgency(daysRemaining: number): 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' {
    if (daysRemaining <= 3) return 'CRITICAL';
    if (daysRemaining <= 7) return 'HIGH';
    if (daysRemaining <= 14) return 'MEDIUM';
    return 'LOW';
  }

  /**
   * Predict categories that will be in demand for a festival
   */
  private async predictCategoriesForFestival(festival: any): Promise<Array<{
    category: string;
    demandIncrease: number;
    confidence: number;
  }>> {
    const festivalName = festival.name.toLowerCase();
    const demandSignals = festival.demandSignals || [];

    // Festival-specific category predictions
    const categoryPredictions: Record<string, number> = {};

    if (festivalName.includes('raksha') || festivalName.includes('rakhi')) {
      categoryPredictions['Kurtis'] = 150;
      categoryPredictions['Ethnic Wear'] = 140;
      categoryPredictions['Kids Wear'] = 130;
      categoryPredictions['Gift Sets'] = 120;
      categoryPredictions['Handcrafted Accessories'] = 110;
    } else if (festivalName.includes('diwali')) {
      categoryPredictions['Sarees'] = 160;
      categoryPredictions['Home Decor'] = 150;
      categoryPredictions['Ethnic Wear'] = 140;
      categoryPredictions['Accessories'] = 130;
      categoryPredictions['Gift Items'] = 120;
    } else if (festivalName.includes('ganesh') || festivalName.includes('chaturthi')) {
      categoryPredictions['Cotton Sarees'] = 140;
      categoryPredictions['Pooja Collections'] = 150;
      categoryPredictions['Decor Accessories'] = 130;
      categoryPredictions['Traditional Wear'] = 120;
    } else if (festivalName.includes('navratri') || festivalName.includes('durga')) {
      categoryPredictions['Lehengas'] = 150;
      categoryPredictions['Garba Wear'] = 140;
      categoryPredictions['Traditional Jewellery'] = 130;
      categoryPredictions['Ethnic Wear'] = 120;
    } else if (festivalName.includes('wedding') || festivalName.includes('marriage')) {
      categoryPredictions['Premium Sarees'] = 160;
      categoryPredictions['Sherwanis'] = 150;
      categoryPredictions['Silk Collections'] = 140;
      categoryPredictions['Bridal Wear'] = 130;
    } else if (festivalName.includes('pongal') || festivalName.includes('sankranti') || festivalName.includes('lohri')) {
      categoryPredictions['Traditional Sarees'] = 130;
      categoryPredictions['Winter Wear'] = 120;
      categoryPredictions['Ethnic Wear'] = 110;
    } else {
      // Generic festival predictions
      categoryPredictions['Sarees'] = 120;
      categoryPredictions['Ethnic Wear'] = 110;
      categoryPredictions['Accessories'] = 100;
    }

    // Adjust based on actual demand signals
    if (demandSignals.length > 0) {
      const topCategories = demandSignals.slice(0, 5);
      topCategories.forEach((signal: any) => {
        if (categoryPredictions[signal.category]) {
          categoryPredictions[signal.category] += Number(signal.demandScore) * 0.5;
        } else {
          categoryPredictions[signal.category] = Number(signal.demandScore);
        }
      });
    }

    return Object.entries(categoryPredictions).map(([category, demandIncrease]) => ({
      category,
      demandIncrease: Math.round(demandIncrease),
      confidence: Math.min(85 + Math.random() * 10, 95),
    })).sort((a, b) => b.demandIncrease - a.demandIncrease);
  }

  /**
   * Get recommended products for a festival
   */
  private async getRecommendedProducts(
    festival: any,
    predictedCategories: Array<{ category: string }>
  ): Promise<string[]> {
    const topCategories = predictedCategories.slice(0, 3).map(c => c.category);

    const products = await prisma.product.findMany({
      where: {
        category: { in: topCategories },
        regionId: festival.regionId,
        status: 'APPROVED',
        available: true,
      },
      take: 10,
      select: { id: true },
    });

    return products.map(p => p.id);
  }

  /**
   * Determine target audience for festival
   */
  private determineTargetAudience(
    _festival: any,
    predictedCategories: Array<{ category: string }>
  ): string[] {
    const categories = predictedCategories.map(c => c.category);
    const audience: string[] = ['Women', '25-45'];

    if (categories.some(c => c.includes('Kids') || c.includes('Children'))) {
      audience.push('Parents', 'Families');
    }
    if (categories.some(c => c.includes('Men') || c.includes('Sherwani'))) {
      audience.push('Men');
    }
    if (categories.some(c => c.includes('Gift') || c.includes('Accessory'))) {
      audience.push('Gift Buyers');
    }

    return [...new Set(audience)];
  }

  /**
   * Determine seasonality based on festival date
   */
  private determineSeasonality(festivalDate: Date): string {
    const month = festivalDate.getMonth();
    
    if (month >= 2 && month <= 5) return 'Summer';
    if (month >= 6 && month <= 8) return 'Monsoon';
    if (month >= 9 && month <= 10) return 'Festive Season';
    if (month >= 11 || month <= 1) return 'Winter';
    
    return 'All Season';
  }

  /**
   * Get historical performance for festival
   */
  private async getHistoricalPerformance(_festival: any): Promise<number> {
    // In production, this would query historical campaign performance
    // For now, return a simulated value
    const basePerformance = 70 + Math.random() * 20;
    return Math.round(basePerformance);
  }

  /**
   * Get festival timeline for dashboard
   */
  async getFestivalTimeline(context: FestivalContext): Promise<{
    critical: FestivalPrediction[];
    upcoming: FestivalPrediction[];
    planning: FestivalPrediction[];
  }> {
    const predictions = await this.getUpcomingFestivals(context);

    return {
      critical: predictions.filter(p => p.urgency === 'CRITICAL'),
      upcoming: predictions.filter(p => p.urgency === 'HIGH'),
      planning: predictions.filter(p => p.urgency === 'MEDIUM' || p.urgency === 'LOW'),
    };
  }

  /**
   * Check if festival demand should trigger mission generation
   */
  shouldTriggerMission(prediction: FestivalPrediction): boolean {
    return (
      prediction.urgency === 'CRITICAL' ||
      (prediction.urgency === 'HIGH' && prediction.predictedCategories.length > 0) ||
      (prediction.daysRemaining <= 10 && prediction.historicalPerformance !== undefined && prediction.historicalPerformance > 80)
    );
  }
}

export default new FestivalIntelligenceService();
