// ============================================================================
// VISIBILITY ADVVISOR
// ============================================================================
// Analyzes and provides recommendations for product visibility

import { VisibilityScore } from './types';

class VisibilityAdvisor {
  /**
   * Calculate visibility score for a product
   */
  calculateVisibilityScore(product: {
    images?: string[];
    description?: string;
    title?: string;
    category?: string;
    stock?: number;
    available?: boolean;
    seller?: {
      isVerified?: boolean;
      hasGICertification?: boolean;
      rating?: number;
    };
  }): VisibilityScore {
    const components = {
      productCompleteness: this.calculateProductCompleteness(product),
      ratings: this.calculateRatingScore(product),
      inventoryHealth: this.calculateInventoryScore(product),
      demandMatch: this.calculateDemandMatchScore(product),
      catalogQuality: this.calculateCatalogQualityScore(product),
      sellerVerification: this.calculateSellerVerificationScore(product),
    };

    // Calculate overall score (weighted average)
    const overall = 
      (components.productCompleteness * 0.25) +
      (components.ratings * 0.15) +
      (components.inventoryHealth * 0.15) +
      (components.demandMatch * 0.15) +
      (components.catalogQuality * 0.15) +
      (components.sellerVerification * 0.15);

    const { strengths, weaknesses, improvementSteps } = this.generateInsights(components, product);

    return {
      overall: Math.round(overall),
      components,
      strengths,
      weaknesses,
      improvementSteps,
    };
  }

  /**
   * Calculate product completeness score
   */
  private calculateProductCompleteness(product: any): number {
    let score = 0;
    let maxScore = 0;

    // Images
    maxScore += 25;
    if (product.images && product.images.length > 0) {
      score += Math.min(25, product.images.length * 8);
    }

    // Description
    maxScore += 25;
    if (product.description && product.description.length > 50) {
      score += 25;
    } else if (product.description && product.description.length > 20) {
      score += 15;
    }

    // Title
    maxScore += 25;
    if (product.title && product.title.length > 10) {
      score += 25;
    } else if (product.title && product.title.length > 5) {
      score += 15;
    }

    // Category
    maxScore += 25;
    if (product.category) {
      score += 25;
    }

    return maxScore > 0 ? (score / maxScore) * 100 : 0;
  }

  /**
   * Calculate rating score
   */
  private calculateRatingScore(product: any): number {
    const rating = product.seller?.rating || 0;
    return Math.min(100, rating * 20); // 5 stars = 100
  }

  /**
   * Calculate inventory score
   */
  private calculateInventoryScore(_product: any): number {
    // Default inventory score since product data structure varies
    return 70;
  }

  /**
   * Calculate demand match score (simplified)
   */
  private calculateDemandMatchScore(_product: any): number {
    // This would typically match against demand signals
    // For now, return a default score
    return 70;
  }

  /**
   * Calculate catalog quality score
   */
  private calculateCatalogQualityScore(_product: any): number {
    // Default catalog quality score
    return 65;
  }

  /**
   * Calculate seller verification score
   */
  private calculateSellerVerificationScore(product: any): number {
    let score = 0;

    if (product.seller?.isVerified) score += 50;
    if (product.seller?.hasGICertification) score += 50;

    return score;
  }

  /**
   * Generate insights based on component scores
   */
  private generateInsights(components: any, product: any): {
    strengths: string[];
    weaknesses: string[];
    improvementSteps: Array<{ step: string; priority: 'LOW' | 'MEDIUM' | 'HIGH'; expectedImpact: number }>;
  } {
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const improvementSteps: Array<{ step: string; priority: 'LOW' | 'MEDIUM' | 'HIGH'; expectedImpact: number }> = [];

    // Product completeness
    if (components.productCompleteness > 80) {
      strengths.push('Excellent product completeness with detailed information');
    } else if (components.productCompleteness < 50) {
      weaknesses.push('Product information is incomplete');
      improvementSteps.push({
        step: 'Add high-quality product images (4-6 images recommended)',
        priority: 'HIGH',
        expectedImpact: 20,
      });
      improvementSteps.push({
        step: 'Write detailed product description (50+ words)',
        priority: 'HIGH',
        expectedImpact: 15,
      });
    }

    // Ratings
    if (components.ratings > 80) {
      strengths.push('Excellent seller ratings indicate customer trust');
    } else if (components.ratings < 50) {
      weaknesses.push('Low seller ratings may affect customer trust');
      improvementSteps.push({
        step: 'Focus on improving product quality and customer service',
        priority: 'MEDIUM',
        expectedImpact: 10,
      });
    }

    // Inventory
    if (components.inventoryHealth > 80) {
      strengths.push('Healthy inventory levels ensure product availability');
    } else if (components.inventoryHealth < 50) {
      weaknesses.push('Inventory issues may affect sales');
      improvementSteps.push({
        step: components.inventoryHealth === 0 ? 'Restock product immediately' : 'Increase inventory levels',
        priority: 'HIGH',
        expectedImpact: 25,
      });
    }

    // Seller verification
    if (components.sellerVerification > 80) {
      strengths.push('Verified seller with GI certification builds trust');
    } else if (components.sellerVerification < 50) {
      weaknesses.push('Seller verification status affects credibility');
      improvementSteps.push({
        step: 'Complete seller verification process',
        priority: 'HIGH',
        expectedImpact: 15,
      });
      if (!product.seller?.hasGICertification) {
        improvementSteps.push({
          step: 'Obtain GI certification for traditional products',
          priority: 'MEDIUM',
          expectedImpact: 10,
        });
      }
    }

    // Catalog quality
    if (components.catalogQuality < 60) {
      weaknesses.push('Catalog quality needs improvement');
      improvementSteps.push({
        step: 'Ensure all product fields are complete',
        priority: 'MEDIUM',
        expectedImpact: 10,
      });
    }

    return { strengths, weaknesses, improvementSteps };
  }

  /**
   * Generate visibility summary for multiple products
   */
  generateVisibilitySummary(products: any[]): {
    averageScore: number;
    highVisibility: number;
    mediumVisibility: number;
    lowVisibility: number;
    topIssues: string[];
  } {
    if (products.length === 0) {
      return {
        averageScore: 0,
        highVisibility: 0,
        mediumVisibility: 0,
        lowVisibility: 0,
        topIssues: [],
      };
    }

    const scores = products.map(p => this.calculateVisibilityScore(p));
    const averageScore = scores.reduce((sum, s) => sum + s.overall, 0) / scores.length;

    const highVisibility = scores.filter(s => s.overall > 75).length;
    const mediumVisibility = scores.filter(s => s.overall >= 50 && s.overall <= 75).length;
    const lowVisibility = scores.filter(s => s.overall < 50).length;

    // Identify top issues
    const issueCount: Record<string, number> = {};
    scores.forEach(score => {
      score.weaknesses.forEach(weakness => {
        issueCount[weakness] = (issueCount[weakness] || 0) + 1;
      });
    });

    const topIssues = Object.entries(issueCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([issue, count]) => `${issue} (${count} products)`);

    return {
      averageScore: Math.round(averageScore),
      highVisibility,
      mediumVisibility,
      lowVisibility,
      topIssues,
    };
  }
}

export default new VisibilityAdvisor();