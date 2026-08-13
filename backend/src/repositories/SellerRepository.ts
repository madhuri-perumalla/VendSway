import { PrismaClient, Seller } from '@prisma/client';
import { BaseRepository } from './BaseRepository';

/**
 * Seller repository
 * Handles data access for seller discovery and management
 */
export class SellerRepository extends BaseRepository<
  Seller,
  any,
  any
> {
  constructor(prisma: PrismaClient) {
    super(prisma, 'seller');
  }

  /**
   * Get sellers by region
   * @param regionId - Region ID
   * @returns Array of sellers
   */
  async getSellersByRegion(regionId: string): Promise<Seller[]> {
    return this.prisma.seller.findMany({
      where: { regionId },
      orderBy: { rating: 'desc' },
    });
  }

  /**
   * Get sellers by status
   * @param status - Seller status
   * @returns Array of sellers
   */
  async getSellersByStatus(status: string): Promise<Seller[]> {
    return this.prisma.seller.findMany({
      where: { status: status as any },
      orderBy: { rating: 'desc' },
    });
  }

  /**
   * Get sellers by region and category
   * @param regionId - Region ID
   * @param category - Category
   * @returns Array of sellers with matching products
   */
  async getSellersByRegionAndCategory(
    regionId: string,
    category: string
  ): Promise<Seller[]> {
    return this.prisma.seller.findMany({
      where: {
        regionId,
        products: {
          some: { category },
        },
      },
      include: {
        products: {
          where: { category },
        },
      },
      orderBy: { rating: 'desc' },
    });
  }

  /**
   * Get sellers by GI product
   * @param giProductId - GI product ID
   * @returns Array of sellers
   */
  async getSellersByGIProduct(giProductId: string): Promise<Seller[]> {
    return this.prisma.seller.findMany({
      where: {
        products: {
          some: { giProductId },
        },
      },
      include: {
        products: {
          where: { giProductId },
        },
      },
      orderBy: { rating: 'desc' },
    });
  }

  /**
   * Get seller with products
   * @param id - Seller ID
   * @returns Seller with products
   */
  async getSellerWithProducts(id: string): Promise<Seller | null> {
    return this.prisma.seller.findUnique({
      where: { id },
      include: {
        products: true,
        region: true,
      },
    });
  }

  /**
   * Get sellers by category
   * @param category - Category
   * @returns Array of sellers
   */
  async getSellersByCategory(category: string): Promise<Seller[]> {
    return this.prisma.seller.findMany({
      where: {
        products: {
          some: { category },
        },
      },
      include: {
        products: {
          where: { category },
        },
      },
      orderBy: { rating: 'desc' },
    });
  }

  /**
   * Search sellers by name or business name
   * @param query - Search query
   * @returns Array of matching sellers
   */
  async searchSellers(query: string): Promise<Seller[]> {
    return this.prisma.seller.findMany({
      where: {
        OR: [
          { businessName: { contains: query, mode: 'insensitive' } },
          { contactPerson: { contains: query, mode: 'insensitive' } },
        ],
      },
      orderBy: { rating: 'desc' },
    });
  }

  /**
   * Get top rated sellers
   * @param limit - Number of sellers to return
   * @returns Array of top rated sellers
   */
  async getTopRatedSellers(limit: number = 10): Promise<Seller[]> {
    return this.prisma.seller.findMany({
      where: { status: 'APPROVED' },
      orderBy: { rating: 'desc' },
      take: limit,
    });
  }

  /**
   * Get sellers by production capacity range
   * @param minCapacity - Minimum capacity
   * @param maxCapacity - Maximum capacity
   * @returns Array of sellers
   */
  async getSellersByCapacityRange(
    minCapacity: number,
    maxCapacity: number
  ): Promise<Seller[]> {
    return this.prisma.seller.findMany({
      where: {
        productionCapacity: {
          gte: minCapacity,
          lte: maxCapacity,
        },
      },
      orderBy: { productionCapacity: 'desc' },
    });
  }

  /**
   * Update seller status
   * @param id - Seller ID
   * @param status - New status
   * @returns Updated seller
   */
  async updateSellerStatus(id: string, status: string): Promise<Seller> {
    return this.prisma.seller.update({
      where: { id },
      data: { status: status as any },
    });
  }

  /**
   * Get seller statistics
   * @returns Seller statistics
   */
  async getSellerStatistics() {
    const total = await this.prisma.seller.count();
    const approved = await this.prisma.seller.count({ where: { status: 'APPROVED' } });
    const pending = await this.prisma.seller.count({ where: { status: 'PENDING' } });
    const rejected = await this.prisma.seller.count({ where: { status: 'REJECTED' } });

    const avgRating = await this.prisma.seller.aggregate({
      where: { status: 'APPROVED' },
      _avg: { rating: true },
    });

    return {
      total,
      approved,
      pending,
      rejected,
      averageRating: avgRating._avg.rating || 0,
    };
  }
}
