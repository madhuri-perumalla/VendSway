import { SellerRepository } from '../repositories/SellerRepository';
import { GapRepository } from '../repositories/GapRepository';
import { Seller } from '@prisma/client';

type SellerMatchResult = {
  seller: Seller;
  matchScore: number;
};

/**
 * Seller matching service
 * Implements seller discovery and ranking algorithm
 */
export class SellerMatchingService {
  private sellerRepository: SellerRepository;
  private gapRepository: GapRepository;

  constructor(sellerRepository: SellerRepository, gapRepository: GapRepository) {
    this.sellerRepository = sellerRepository;
    this.gapRepository = gapRepository;
  }

  /**
   * Calculate seller match score for a gap
   * Formula: (GI Relevance × 0.25) + (Category Match × 0.25) + (Region Match × 0.20) + (Production Capacity × 0.15) + (Seller Rating × 0.15)
   * 
   * @param seller - Seller data
   * @param regionId - Target region ID
   * @param category - Target category
   * @param giProductId - Optional GI product ID
   * @returns Match score (0-100)
   */
  calculateSellerMatchScore(
    seller: Seller,
    regionId: string,
    category: string,
    giProductId?: string
  ): number {
    // GI Relevance (25%)
    const giRelevance = this.calculateGIRelevance(seller, giProductId);

    // Category Match (25%)
    const categoryMatch = this.calculateCategoryMatch(seller, category);

    // Region Match (20%)
    const regionMatch = this.calculateRegionMatch(seller, regionId);

    // Production Capacity (15%)
    const capacityScore = this.calculateCapacityScore(seller);

    // Seller Rating (15%)
    const ratingScore = this.calculateRatingScore(seller);

    // Calculate weighted score
    const matchScore =
      giRelevance * 0.25 +
      categoryMatch * 0.25 +
      regionMatch * 0.20 +
      capacityScore * 0.15 +
      ratingScore * 0.15;

    // Clamp to 0-100 range
    return Math.max(0, Math.min(100, Math.round(matchScore)));
  }

  /**
   * Calculate GI relevance score (0-100)
   * @param seller - Seller data
   * @param giProductId - GI product ID
   * @returns GI relevance score
   */
  private calculateGIRelevance(seller: Seller, giProductId?: string): number {
    if (!giProductId) {
      return seller.giTagged ? 100 : 50;
    }

    if (seller.giTagged) {
      return 100;
    }

    return 30;
  }

  /**
   * Calculate category match score (0-100)
   * @param seller - Seller data
   * @param category - Target category
   * @returns Category match score
   */
  private calculateCategoryMatch(seller: Seller, category: string): number {
    if (!category) {
      return 50;
    }

    const normalizedCategory = category.toLowerCase();
    const categories = Array.isArray(seller.categories) ? seller.categories : [];
    const normalizedCategories = categories.map(item => item.toLowerCase());

    if (normalizedCategories.includes(normalizedCategory)) {
      return 100;
    }

    const partialMatch = normalizedCategories.some(item => normalizedCategory.includes(item) || item.includes(normalizedCategory));
    if (partialMatch) {
      return 70;
    }

    return 30;
  }

  /**
   * Calculate region match score (0-100)
   * @param seller - Seller data
   * @param regionId - Target region ID
   * @returns Region match score
   */
  private calculateRegionMatch(seller: Seller, regionId: string): number {
    if (seller.regionId === regionId) {
      return 100; // Perfect match
    }

    // In production, this could check for neighboring regions
    return 30; // Lower score for different regions
  }

  /**
   * Calculate production capacity score (0-100)
   * @param seller - Seller data
   * @returns Capacity score
   */
  private calculateCapacityScore(seller: Seller): number {
    const capacity = seller.productionCapacity || 0;

    // Normalize capacity to 0-100 range
    // Assuming max capacity is 1000 units for demo
    const maxCapacity = 1000;
    return Math.min(100, (capacity / maxCapacity) * 100);
  }

  /**
   * Calculate seller rating score (0-100)
   * @param seller - Seller data
   * @returns Rating score
   */
  private calculateRatingScore(seller: Seller): number {
    const rating = Number(seller.rating ?? 0);
    return (rating / 5) * 100;
  }

  /**
   * Find matching sellers for a catalog gap
   * @param regionId - Region ID
   * @param category - Category
   * @param giProductId - Optional GI product ID
   * @param limit - Number of sellers to return
   * @returns Array of sellers with match scores
   */
  async findMatchingSellers(
    regionId: string,
    category: string,
    giProductId?: string,
    limit: number = 10
  ): Promise<SellerMatchResult[]> {
    // Get sellers by region and category
    const sellers = await this.sellerRepository.getSellersByRegionAndCategory(
      regionId,
      category
    );

    // If no sellers found by region, try by category only
    if (sellers.length === 0) {
      const categorySellers = await this.sellerRepository.getSellersByCategory(category);
      return categorySellers.slice(0, limit).map(seller => ({
        seller,
        matchScore: this.calculateSellerMatchScore(seller, regionId, category, giProductId),
      }));
    }

    // Calculate match scores for all sellers
    const sellersWithScores = sellers.map(seller => ({
      seller,
      matchScore: this.calculateSellerMatchScore(seller, regionId, category, giProductId),
    }));

    // Sort by match score (descending)
    sellersWithScores.sort((a, b) => b.matchScore - a.matchScore);

    // Return top matches
    return sellersWithScores.slice(0, limit);
  }

  /**
   * Find sellers for GI product
   * @param giProductId - GI product ID
   * @param limit - Number of sellers to return
   * @returns Array of sellers with match scores
   */
  async findSellersForGIProduct(
    giProductId: string,
    limit: number = 10
  ): Promise<SellerMatchResult[]> {
    const sellers = await this.sellerRepository.getSellersByGIProduct(giProductId);

    const sellersWithScores = sellers.map(seller => ({
      seller,
      matchScore: this.calculateGIRelevance(seller, giProductId),
    }));

    sellersWithScores.sort((a, b) => b.matchScore - a.matchScore);

    return sellersWithScores.slice(0, limit);
  }

  /**
   * Get seller recommendations for a region
   * @param regionId - Region ID
   * @param limit - Number of sellers to return
   * @returns Array of recommended sellers
   */
  async getSellerRecommendations(
    regionId: string,
    limit: number = 10
  ): Promise<SellerMatchResult[]> {
    // Get sellers by region
    const sellers = await this.sellerRepository.getSellersByRegion(regionId);

    // Get gaps for the region to understand demand
    const gaps = await this.gapRepository.getUnresolvedGaps(regionId);

    // If there are gaps, prioritize sellers in gap categories
    if (gaps.length > 0) {
      const topGap = gaps[0];
      const matchingSellers = await this.findMatchingSellers(
        regionId,
        topGap.category,
        undefined,
        limit
      );

      if (matchingSellers.length > 0) {
        return matchingSellers;
      }
    }

    // Return top rated sellers in the region
    const sellersWithScores = sellers.map(seller => ({
      seller,
      matchScore: this.calculateRatingScore(seller),
    }));

    sellersWithScores.sort((a, b) => b.matchScore - a.matchScore);

    return sellersWithScores.slice(0, limit);
  }

  /**
   * Batch match sellers for multiple gaps
   * @param regionId - Region ID
   * @returns Array of gap-seller matches
   */
  async batchMatchSellersForGaps(
    regionId: string
  ): Promise<Array<{ gap: any; matchedSellers: SellerMatchResult[] }>> {
    const gaps = await this.gapRepository.getUnresolvedGaps(regionId);

    const results = [];

    for (const gap of gaps) {
      const matchedSellers = await this.findMatchingSellers(
        regionId,
        gap.category,
        undefined,
        5
      );

      results.push({
        gap,
        matchedSellers,
      });
    }

    return results;
  }

  /**
   * Get seller ranking for a specific gap
   * @param gapId - Gap ID
   * @returns Array of ranked sellers
   */
  async rankSellersForGap(gapId: string) {
    // Get gap details
    const gaps = await this.gapRepository.findAll();
    const gap = gaps.find(g => g.id === gapId);

    if (!gap) {
      throw new Error('Gap not found');
    }

    return this.findMatchingSellers(gap.regionId, gap.category, undefined, 10);
  }
}
