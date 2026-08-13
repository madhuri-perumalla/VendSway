// ============================================================================
// BUSINESS ADVISOR
// ============================================================================
// Generates business insights and summaries from data

import { BusinessSummary } from './types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class BusinessAdvisor {
  /**
   * Generate business summary for a seller or overall platform
   */
  async generateBusinessSummary(context?: {
    sellerId?: string;
    regionId?: string;
    period?: 'week' | 'month' | 'quarter';
  }): Promise<BusinessSummary> {
    const period = context?.period || 'month';

    // Gather business data
    const [
      totalRevenue,
      previousRevenue,
      topProducts,
      bottomProducts,
      sellerGrowth,
      productCount,
    ] = await Promise.all([
      this.getTotalRevenue(context),
      this.getPreviousRevenue(context),
      this.getTopProducts(context),
      this.getBottomProducts(context),
      this.getSellerGrowth(context),
      this.getProductCount(context),
    ]);

    // Calculate growth rate
    const growthRate = previousRevenue > 0 
      ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 
      : 0;

    // Generate insights
    const growthOpportunities = this.identifyGrowthOpportunities(topProducts, sellerGrowth);
    const weakAreas = this.identifyWeakAreas(bottomProducts, productCount);
    const expansionAdvice = this.generateExpansionAdvice(context, sellerGrowth);
    const marketingIdeas = this.generateMarketingIdeas(topProducts, period);
    const inventoryAdvice = this.generateInventoryAdvice(topProducts, bottomProducts);

    const summary = this.generateSummaryText(totalRevenue, growthRate, period);

    return {
      period,
      totalRevenue,
      growthRate,
      topProducts,
      bottomProducts,
      growthOpportunities,
      weakAreas,
      expansionAdvice,
      marketingIdeas,
      inventoryAdvice,
      summary,
    };
  }

  /**
   * Get total revenue for period
   */
  private async getTotalRevenue(context: any): Promise<number> {
    // This would typically calculate from orders
    // For now, return a simulated value based on products
    const products = await prisma.product.findMany({
      where: {
        ...(context?.sellerId && { sellerId: context.sellerId }),
        ...(context?.regionId && { regionId: context.regionId }),
        status: 'APPROVED',
        available: true,
      },
    });

    // Simulate revenue based on product count and price
    return products.reduce((sum, p) => {
      return sum + (Number(p.price) * 2); // Assume 2 sales per product
    }, 0);
  }

  /**
   * Get previous period revenue for comparison
   */
  private async getPreviousRevenue(context: any): Promise<number> {
    // Similar logic as getTotalRevenue but for previous period
    const products = await prisma.product.findMany({
      where: {
        ...(context?.sellerId && { sellerId: context.sellerId }),
        ...(context?.regionId && { regionId: context.regionId }),
        status: 'APPROVED',
        available: true,
      },
    });

    return products.reduce((sum, p) => {
      return sum + (Number(p.price) * 1.5); // Assume 1.5 sales per product in previous period
    }, 0);
  }

  /**
   * Get top performing products
   */
  private async getTopProducts(context: any): Promise<any[]> {
    const products = await prisma.product.findMany({
      where: {
        ...(context?.sellerId && { sellerId: context.sellerId }),
        ...(context?.regionId && { regionId: context.regionId }),
        status: 'APPROVED',
        available: true,
      },
      include: { seller: true, region: true },
      orderBy: { price: 'desc' },
      take: 5,
    });

    return products.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category || 'Uncategorized',
      revenue: Number(p.price) * 10, // Simulated sales
      sales: 10, // Simulated sales count
      rating: p.seller?.rating || 0,
    }));
  }

  /**
   * Get bottom performing products
   */
  private async getBottomProducts(context: any): Promise<any[]> {
    const products = await prisma.product.findMany({
      where: {
        ...(context?.sellerId && { sellerId: context.sellerId }),
        ...(context?.regionId && { regionId: context.regionId }),
        status: 'APPROVED',
        available: true,
      },
      include: { seller: true, region: true },
      orderBy: { price: 'asc' },
      take: 5,
    });

    return products.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category || 'Uncategorized',
      revenue: Number(p.price) * 2, // Simulated sales
      sales: 2, // Simulated sales count
      rating: p.seller?.rating || 0,
    }));
  }

  /**
   * Get seller growth rate
   */
  private async getSellerGrowth(context: any): Promise<number> {
    const currentSellers = await prisma.seller.count({
      where: {
        ...(context?.regionId && { regionId: context.regionId }),
        status: 'APPROVED',
      },
    });

    // Calculate growth based on total sellers
    return currentSellers > 0 ? currentSellers * 2 : 0; // Simplified growth calculation
  }

  /**
   * Get product count
   */
  private async getProductCount(context?: any): Promise<number> {
    return prisma.product.count({
      where: {
        ...(context?.sellerId && { sellerId: context.sellerId }),
        ...(context?.regionId && { regionId: context.regionId }),
        status: 'APPROVED',
        available: true,
      },
    });
  }

  /**
   * Identify growth opportunities
   */
  private identifyGrowthOpportunities(topProducts: any[], sellerGrowth: number): string[] {
    const opportunities: string[] = [];

    if (topProducts.length > 0) {
      const topCategory = topProducts[0].category;
      opportunities.push(`Expand ${topCategory} category - top performer with ₹${topProducts[0].revenue.toFixed(0)} revenue`);
    }

    if (sellerGrowth > 20) {
      opportunities.push('Strong seller growth indicates market expansion potential');
    }

    if (topProducts.length > 2) {
      const avgRevenue = topProducts.reduce((sum: number, p: any) => sum + p.revenue, 0) / topProducts.length;
      opportunities.push(`Diversify product range - top products average ₹${avgRevenue.toFixed(0)} revenue`);
    }

    if (opportunities.length === 0) {
      opportunities.push('Focus on product quality and marketing to drive growth');
    }

    return opportunities;
  }

  /**
   * Identify weak areas
   */
  private identifyWeakAreas(bottomProducts: any[], productCount: number): string[] {
    const weakAreas: string[] = [];

    if (bottomProducts.length > 0) {
      const lowRevenueProducts = bottomProducts.filter((p: any) => p.revenue < 100).length;
      if (lowRevenueProducts > 0) {
        weakAreas.push(`${lowRevenueProducts} products with low revenue need attention`);
      }
    }

    if (productCount < 10) {
      weakAreas.push('Limited product catalog may be restricting growth');
    }

    if (bottomProducts.length > 2) {
      const lowRatingProducts = bottomProducts.filter((p: any) => p.rating < 3).length;
      if (lowRatingProducts > 0) {
        weakAreas.push(`${lowRatingProducts} products with low ratings require quality improvement`);
      }
    }

    if (weakAreas.length === 0) {
      weakAreas.push('Continue monitoring product performance for optimization opportunities');
    }

    return weakAreas;
  }

  /**
   * Generate expansion advice
   */
  private generateExpansionAdvice(context: any, sellerGrowth: number): string[] {
    const advice: string[] = [];

    if (sellerGrowth > 15) {
      advice.push('Consider expanding to neighboring regions given strong seller growth');
    }

    if (!context?.regionId) {
      advice.push('Analyze regional performance data to identify expansion opportunities');
    }

    advice.push('Focus on regions with high catalog gaps for strategic expansion');
    advice.push('Consider GI-certified sellers for premium market expansion');

    return advice;
  }

  /**
   * Generate marketing ideas
   */
  private generateMarketingIdeas(topProducts: any[], period: string): string[] {
    const ideas: string[] = [];

    if (topProducts.length > 0) {
      ideas.push(`Feature ${topProducts[0].name} in marketing campaigns - top performer`);
    }

    if (period === 'month') {
      ideas.push('Launch monthly promotional campaigns for slow-moving products');
    }

    ideas.push('Implement customer referral programs to drive organic growth');
    ideas.push('Utilize social media platforms for product showcases');
    ideas.push('Create bundled product offers to increase average order value');

    return ideas;
  }

  /**
   * Generate inventory advice
   */
  private generateInventoryAdvice(topProducts: any[], bottomProducts: any[]): string[] {
    const advice: string[] = [];

    if (topProducts.length > 0) {
      advice.push(`Increase inventory for ${topProducts[0].name} - strong sales performance`);
    }

    if (bottomProducts.length > 0) {
      const zeroSalesProducts = bottomProducts.filter(p => p.sales === 0);
      if (zeroSalesProducts.length > 0) {
        advice.push('Consider clearance or promotional pricing for zero-sales products');
      }
    }

    advice.push('Implement just-in-time inventory management for cost optimization');
    advice.push('Monitor seasonal demand patterns for inventory planning');

    return advice;
  }

  /**
   * Generate summary text
   */
  private generateSummaryText(totalRevenue: number, growthRate: number, period: string): string {
    const growthText = growthRate > 0 ? 'grew' : 'declined';
    const growthPercent = Math.abs(growthRate).toFixed(1);
    
    return `Business performance for the current ${period}: Total revenue of ₹${totalRevenue.toFixed(0)}, ${growthText} by ${growthPercent}% compared to previous period. ${growthRate > 10 ? 'Strong positive momentum indicates effective strategies.' : growthRate > 0 ? 'Steady growth shows progress.' : 'Decline requires attention and strategic adjustment.'}`;
  }
}

export default new BusinessAdvisor();