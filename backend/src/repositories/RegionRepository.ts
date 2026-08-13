import { PrismaClient, Region, Festival, Textile, GIProduct, RegionalTrend } from '@prisma/client';
import { BaseRepository } from './BaseRepository';

/**
 * Region repository
 * Handles data access for regional fashion intelligence
 */
export class RegionRepository extends BaseRepository<
  Region,
  any,
  any
> {
  constructor(prisma: PrismaClient) {
    super(prisma, 'region');
  }

  /**
   * Get region with all related data
   * @param id - Region ID
   * @returns Region with relations
   */
  async getRegionWithDetails(id: string): Promise<Region | null> {
    return this.prisma.region.findUnique({
      where: { id },
      include: {
        festivals: {
          orderBy: { date: 'asc' },
        },
        textiles: {
          orderBy: { name: 'asc' },
        },
        giProducts: {
          orderBy: { name: 'asc' },
        },
        regionalTrends: {
          orderBy: { period: 'desc' },
          take: 10,
        },
      },
    });
  }

  /**
   * Get all regions with basic info for map display
   * @returns Array of regions with coordinates
   */
  async getRegionsForMap(): Promise<Region[]> {
    return this.prisma.region.findMany({
      select: {
        id: true,
        name: true,
        code: true,
        centerLat: true,
        centerLng: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Get textiles by region
   * @param regionId - Region ID
   * @returns Array of textiles
   */
  async getTextilesByRegion(regionId: string): Promise<Textile[]> {
    return this.prisma.textile.findMany({
      where: { regionId },
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Get festivals by region
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
   * Get GI products by region
   * @param regionId - Region ID
   * @returns Array of GI products
   */
  async getGIProductsByRegion(regionId: string): Promise<GIProduct[]> {
    return this.prisma.gIProduct.findMany({
      where: { regionId },
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Get regional trends by region
   * @param regionId - Region ID
   * @param limit - Number of trends to return
   * @returns Array of regional trends
   */
  async getRegionalTrendsByRegion(regionId: string, limit: number = 10): Promise<RegionalTrend[]> {
    return this.prisma.regionalTrend.findMany({
      where: { regionId },
      orderBy: { period: 'desc' },
      take: limit,
    });
  }

  /**
   * Search regions by name or code
   * @param query - Search query
   * @returns Array of matching regions
   */
  async searchRegions(query: string): Promise<Region[]> {
    return this.prisma.region.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { code: { contains: query, mode: 'insensitive' } },
        ],
      },
      orderBy: { name: 'asc' },
    });
  }
}
