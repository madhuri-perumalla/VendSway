import { PrismaClient, Product } from '@prisma/client';
import { BaseRepository } from './BaseRepository';

/**
 * Product repository
 * Handles data access for seller products
 */
export class ProductRepository extends BaseRepository<
  Product,
  any,
  any
> {
  constructor(prisma: PrismaClient) {
    super(prisma, 'product');
  }

  /**
   * Get products by seller
   * @param sellerId - Seller ID
   * @returns Array of products
   */
  async getProductsBySeller(sellerId: string): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: { sellerId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get products by seller and category
   * @param sellerId - Seller ID
   * @param category - Category
   * @returns Array of products
   */
  async getProductsBySellerAndCategory(
    sellerId: string,
    category: string
  ): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: { sellerId, category },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get products by region
   * @param regionId - Region ID
   * @returns Array of products
   */
  async getProductsByRegion(regionId: string): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: { regionId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get products by GI product
   * @param giProductId - GI product ID
   * @returns Array of products
   */
  async getProductsByGIProduct(giProductId: string): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: { giProductId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get active products by seller
   * @param sellerId - Seller ID
   * @returns Array of active products
   */
  async getActiveProductsBySeller(sellerId: string): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: { sellerId, available: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Search products by seller
   * @param sellerId - Seller ID
   * @param query - Search query
   * @returns Array of matching products
   */
  async searchProductsBySeller(sellerId: string, query: string): Promise<Product[]> {
    return this.prisma.product.findMany({
      where: {
        sellerId,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Update product
   * @param id - Product ID
   * @param updateData - Data to update
   * @returns Updated product
   */
  async updateProduct(id: string, updateData: any): Promise<Product> {
    return this.prisma.product.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
    });
  }

  /**
   * Deactivate product
   * @param id - Product ID
   * @returns Updated product
   */
  async deactivateProduct(id: string): Promise<Product> {
    return this.prisma.product.update({
      where: { id },
      data: { available: false, updatedAt: new Date() },
    });
  }

  /**
   * Activate product
   * @param id - Product ID
   * @returns Updated product
   */
  async activateProduct(id: string): Promise<Product> {
    return this.prisma.product.update({
      where: { id },
      data: { available: true, updatedAt: new Date() },
    });
  }

  /**
   * Get product count by seller
   * @param sellerId - Seller ID
   * @returns Product count
   */
  async getProductCountBySeller(sellerId: string): Promise<number> {
    return this.prisma.product.count({
      where: { sellerId },
    });
  }

  /**
   * Get product statistics for seller
   * @param sellerId - Seller ID
   * @returns Product statistics
   */
  async getProductStatistics(sellerId: string) {
    const total = await this.prisma.product.count({ where: { sellerId } });
    const active = await this.prisma.product.count({ where: { sellerId, available: true } });
    const inactive = await this.prisma.product.count({ where: { sellerId, available: false } });

    const products = await this.prisma.product.findMany({
      where: { sellerId },
      select: { price: true },
    });

    const totalValue = products.reduce((sum, p) => sum + Number(p.price || 0), 0);

    return {
      total,
      active,
      inactive,
      totalValue,
      averagePrice: products.length > 0 ? totalValue / products.length : 0,
    };
  }
}
