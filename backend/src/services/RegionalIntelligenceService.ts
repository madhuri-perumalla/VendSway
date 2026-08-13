import { RegionRepository } from '../repositories/RegionRepository';
import { NotFoundError } from '../utils/errors';

/**
 * Regional Intelligence service
 * Handles business logic for regional fashion knowledge
 */
export class RegionalIntelligenceService {
  private regionRepository: RegionRepository;

  constructor(regionRepository: RegionRepository) {
    this.regionRepository = regionRepository;
  }

  /**
   * Get all regions for map display
   * @returns Array of regions with coordinates
   */
  async getAllRegions() {
    return this.regionRepository.getRegionsForMap();
  }

  /**
   * Get region details with all related data
   * @param id - Region ID
   * @returns Region with festivals, textiles, GI products, and trends
   */
  async getRegionDetails(id: string) {
    const region = await this.regionRepository.getRegionWithDetails(id);
    if (!region) {
      throw new NotFoundError('Region not found');
    }
    return region;
  }

  /**
   * Get textiles by region
   * @param regionId - Region ID
   * @returns Array of textiles
   */
  async getRegionalTextiles(regionId: string) {
    // Verify region exists
    await this.regionRepository.findByIdOrThrow(regionId);
    return this.regionRepository.getTextilesByRegion(regionId);
  }

  /**
   * Get festivals by region
   * @param regionId - Region ID
   * @returns Array of festivals
   */
  async getRegionalFestivals(regionId: string) {
    // Verify region exists
    await this.regionRepository.findByIdOrThrow(regionId);
    return this.regionRepository.getFestivalsByRegion(regionId);
  }

  /**
   * Get GI products by region
   * @param regionId - Region ID
   * @returns Array of GI products
   */
  async getRegionalGIProducts(regionId: string) {
    // Verify region exists
    await this.regionRepository.findByIdOrThrow(regionId);
    return this.regionRepository.getGIProductsByRegion(regionId);
  }

  /**
   * Get regional trends
   * @param regionId - Region ID
   * @param limit - Number of trends to return
   * @returns Array of regional trends
   */
  async getRegionalTrends(regionId: string, limit: number = 10) {
    // Verify region exists
    await this.regionRepository.findByIdOrThrow(regionId);
    return this.regionRepository.getRegionalTrendsByRegion(regionId, limit);
  }

  /**
   * Search regions by name or code
   * @param query - Search query
   * @returns Array of matching regions
   */
  async searchRegions(query: string) {
    if (!query || query.length < 2) {
      return [];
    }
    return this.regionRepository.searchRegions(query);
  }

  /**
   * Get regional summary for dashboard
   * @param regionId - Region ID
   * @returns Regional summary data
   */
  async getRegionalSummary(regionId: string) {
    const region = await this.regionRepository.findByIdOrThrow(regionId);
    const [textiles, festivals, giProducts, trends] = await Promise.all([
      this.regionRepository.getTextilesByRegion(regionId),
      this.regionRepository.getFestivalsByRegion(regionId),
      this.regionRepository.getGIProductsByRegion(regionId),
      this.regionRepository.getRegionalTrendsByRegion(regionId, 5),
    ]);

    return {
      region: {
        id: region.id,
        name: region.name,
        code: region.code,
        description: region.description,
        centerLat: region.centerLat,
        centerLng: region.centerLng,
      },
      statistics: {
        textileCount: textiles.length,
        festivalCount: festivals.length,
        giProductCount: giProducts.length,
        trendCount: trends.length,
      },
      textiles: textiles.slice(0, 5), // Top 5
      festivals: festivals.slice(0, 5), // Upcoming festivals
      giProducts: giProducts.slice(0, 5), // Top 5
      trends: trends, // Recent trends
    };
  }
}
