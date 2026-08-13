// ============================================================================
// COMMERCE AGENT SERVICE
// ============================================================================
// Autonomous Agentic AI Agent for generating commerce opportunities for sellers
// Implements: Observe → Reason → Predict → Decide → Act → Learn loop
// Uses the new Agent Orchestrator for agentic AI workflow

import { PrismaClient } from '@prisma/client';
import AgentOrchestrator from './aiEngine/AgentOrchestrator';
import MarketingGenerator from './aiEngine/MarketingGenerator';

const prisma = new PrismaClient();

interface OpportunityData {
  sellerId: string;
  festivalId?: string;
  regionId: string;
  opportunityScore: number;
  predictedRevenue: number;
  confidence: number;
  reason: string;
  products: Array<{
    productId: string;
    priority: number;
    suggestedPrice?: number;
  }>;
}

class CommerceAgentService {
  /**
   * OBSERVE MODULE
   * Read existing database tables to gather intelligence
   */
  async observe() {
    try {
      const [
        demandSignals,
        catalogGaps,
        festivals,
        regions,
        approvedProducts,
        sellers,
        regionalTrends,
      ] = await Promise.all([
        prisma.demandSignal.findMany({
          where: { demandScore: { gte: 70 } },
          orderBy: { demandScore: 'desc' },
          take: 100,
        }),
        prisma.catalogGap.findMany({
          where: { priority: 'HIGH', resolvedAt: null },
          orderBy: { gap: 'desc' },
          take: 100,
        }),
        prisma.festival.findMany({
          where: { date: { gte: new Date() } },
          orderBy: { date: 'asc' },
          take: 20,
        }),
        prisma.region.findMany(),
        prisma.product.findMany({
          where: { status: 'APPROVED', available: true },
          include: { seller: true, region: true },
          take: 200,
        }),
        prisma.seller.findMany({
          where: { status: 'APPROVED', isActive: true },
          include: { region: true },
          take: 100,
        }),
        prisma.regionalTrend.findMany({
          orderBy: { trendScore: 'desc' },
          take: 50,
        }),
      ]);

      return {
        demandSignals,
        catalogGaps,
        festivals,
        regions,
        approvedProducts,
        sellers,
        regionalTrends,
      };
    } catch (error) {
      console.error('Error in Observe module:', error);
      throw error;
    }
  }

  /**
   * REASON MODULE
   * Analyze data to determine opportunities using internal AI engine
   */
  async reason(observedData: any) {
    const opportunities: OpportunityData[] = [];
    const { demandSignals, catalogGaps, festivals, approvedProducts, sellers, regionalTrends } = observedData;

    // Find upcoming festivals
    const upcomingFestivals = festivals.filter((f: any) => {
      const festivalDate = new Date(f.date);
      const daysUntil = Math.ceil((festivalDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return daysUntil >= 7 && daysUntil <= 30; // 7-30 days before festival
    });

    for (const festival of upcomingFestivals) {
      // Find high demand signals for this festival's region
      const festivalDemand = demandSignals.filter((d: any) => 
        d.festivalId === festival.id || d.regionId === festival.regionId
      );

      for (const demand of festivalDemand) {
        // Use internal AI to predict demand using deterministic algorithms
        const historicalData = demandSignals
          .filter((d: any) => d.category === demand.category && d.regionId === demand.regionId)
          .map((d: any) => ({ date: d.createdAt, demand: Number(d.demandScore) }));
        
        // Calculate prediction using deterministic algorithms
        const currentDemand = Number(demand.demandScore);
        const trendGrowth = historicalData.length > 1 
          ? ((historicalData[historicalData.length - 1].demand - historicalData[0].demand) / historicalData[0].demand) * 100 
          : 0;
        
        const festivalDate = new Date(festival.date);
        const daysUntil = Math.ceil((festivalDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        const festivalMultiplier = 1 + ((30 - daysUntil) / 30) * 0.5; // 1.0 to 1.5 multiplier
        
        const predictedDemand = Math.round(currentDemand * (1 + trendGrowth / 100) * festivalMultiplier);
        const confidence = Math.min(95, 60 + Math.abs(trendGrowth) + (30 - daysUntil));
        
        const trendScore = regionalTrends.find((t: any) => 
          t.category === demand.category && t.regionId === demand.regionId
        )?.trendScore || 50;

        // Find sellers in this region with matching audience
        const matchingSellers = sellers.filter((s: any) => 
          s.regionId === demand.regionId || s.regionId === festival.regionId
        );

        for (const seller of matchingSellers) {
          // Find products matching the demand category
          const matchingProducts = approvedProducts.filter((p: any) => 
            p.category === demand.category && 
            (p.regionId === demand.regionId || p.regionId === festival.regionId)
          );

          if (matchingProducts.length > 0) {
            // Calculate opportunity score using deterministic prediction
            const demandScore = Number(demand.demandScore);
            const opportunityScore = (demandScore * 0.4) + (Number(trendScore) * 0.3) + (confidence * 0.3);
            const predictedRevenue = matchingProducts.reduce((sum: number, p: any) => 
              sum + (Number(p.price) * predictedDemand / 10), 
            0);

            if (opportunityScore >= 70) {
              const demandChange = trendGrowth > 0 ? 'increased' : 'decreased';
              const demandPercent = Math.abs(trendGrowth).toFixed(0);
              
              opportunities.push({
                sellerId: seller.id,
                festivalId: festival.id,
                regionId: demand.regionId,
                opportunityScore: Math.round(opportunityScore * 100) / 100,
                predictedRevenue: Math.round(predictedRevenue * 100) / 100,
                confidence: Math.round(confidence * 100) / 100,
                reason: `Demand ${demandChange} by ${demandPercent}% over last period for ${demand.category} during ${festival.name}. Festival multiplier: ${festivalMultiplier.toFixed(2)}x`,
                products: matchingProducts.slice(0, 12).map((p: any, idx: number) => ({
                  productId: p.id,
                  priority: 12 - idx,
                  suggestedPrice: Number(p.price),
                })),
              });
            }
          }
        }
      }
    }

    // Also generate opportunities based on catalog gaps (non-festival)
    for (const gap of catalogGaps.slice(0, 20)) {
      const matchingSellers = sellers.filter((s: any) => s.regionId === gap.regionId);
      const matchingProducts = approvedProducts.filter((p: any) => 
        p.category === gap.category && p.regionId === gap.regionId
      );

      for (const seller of matchingSellers) {
        if (matchingProducts.length > 0 && gap.gap > 50) {
          const opportunityScore = Math.min(50 + (gap.gap / 10), 90);
          const predictedRevenue = matchingProducts.reduce((sum: number, p: any) => 
            sum + (Number(p.price) * 5),
          0);

          opportunities.push({
            sellerId: seller.id,
            regionId: gap.regionId,
            opportunityScore: Math.round(opportunityScore * 100) / 100,
            predictedRevenue: Math.round(predictedRevenue * 100) / 100,
            confidence: 85,
            reason: `Catalog gap of ${gap.gap} units detected for ${gap.category}`,
            products: matchingProducts.slice(0, 8).map((p: any, idx: number) => ({
              productId: p.id,
              priority: 8 - idx,
              suggestedPrice: Number(p.price),
            })),
          });
        }
      }
    }

    // Sort by opportunity score and return top opportunities
    return opportunities
      .sort((a, b) => b.opportunityScore - a.opportunityScore)
      .slice(0, 50);
  }

  /**
   * DECIDE MODULE
   * Generate opportunities in database
   */
  async decide(opportunities: OpportunityData[]) {
    const createdOpportunities = [];

    for (const opp of opportunities) {
      // Check if similar opportunity already exists for this seller
      const existing = await prisma.opportunity.findFirst({
        where: {
          sellerId: opp.sellerId,
          regionId: opp.regionId,
          festivalId: opp.festivalId || null,
          status: { in: ['PENDING', 'ACCEPTED', 'ACTIVE'] },
        },
      });

      if (!existing) {
        const opportunity = await prisma.opportunity.create({
          data: {
            sellerId: opp.sellerId,
            festivalId: opp.festivalId,
            regionId: opp.regionId,
            opportunityScore: opp.opportunityScore,
            predictedRevenue: opp.predictedRevenue,
            confidence: opp.confidence,
            reason: opp.reason,
            status: 'PENDING',
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          },
        });

        // Add products to opportunity
        for (const product of opp.products) {
          await prisma.opportunityProduct.create({
            data: {
              opportunityId: opportunity.id,
              productId: product.productId,
              priority: product.priority,
              suggestedPrice: product.suggestedPrice,
            },
          });
        }

        createdOpportunities.push(opportunity);
      }
    }

    return createdOpportunities;
  }

  /**
   * ACT MODULE
   * Generate campaigns, storefronts, and marketing content using internal AI engine
   */
  async act(opportunities: any[]) {
    const campaigns = [];
    const marketingGenerator = MarketingGenerator;

    for (const opportunity of opportunities) {
      const oppWithProducts = await prisma.opportunity.findUnique({
        where: { id: opportunity.id },
        include: {
          seller: true,
          festival: true,
          region: true,
          products: {
            include: {
              product: {
                include: {
                  seller: true,
                },
              },
            },
          },
        },
      });

      if (!oppWithProducts) continue;

      // Generate campaign data
      const campaignName = oppWithProducts.festival
        ? `${oppWithProducts.festival.name} Collection for ${oppWithProducts.seller.businessName}`
        : `${oppWithProducts.region.name} Collection for ${oppWithProducts.seller.businessName}`;

      // Use internal AI to generate marketing content
      const marketingContext = {
        festival: oppWithProducts.festival?.name,
        region: oppWithProducts.region.name,
        category: oppWithProducts.products[0]?.product?.category || 'Regional Products',
        products: oppWithProducts.products.map((p: any) => ({
          name: p.product.name,
          category: p.product.category
        })),
        targetAudience: oppWithProducts.seller.targetAudience || ['Women', '25-45'],
      };

      const marketingContent = marketingGenerator.generateMarketingContent(marketingContext);
      
      const whatsappCaption = marketingContent.find(c => c.platform === 'whatsapp')?.content || '';
      const instagramCaption = marketingContent.find(c => c.platform === 'instagram')?.content || '';
      const facebookCaption = marketingContent.find(c => c.platform === 'facebook')?.content || '';

      const storefrontUrl = this.generateStorefrontUrl(oppWithProducts);
      const bannerImageUrl = this._generateBannerImageUrl(oppWithProducts);

      const campaign = await prisma.campaign.create({
        data: {
          opportunityId: opportunity.id,
          sellerId: oppWithProducts.sellerId,
          name: campaignName,
          description: oppWithProducts.reason,
          storefrontUrl,
          whatsappCaption,
          instagramCaption,
          facebookCaption,
          bannerImageUrl,
          status: 'READY',
        },
      });

      // Update opportunity status
      await prisma.opportunity.update({
        where: { id: opportunity.id },
        data: { status: 'ACTIVE' },
      });

      campaigns.push(campaign);
    }

    return campaigns;
  }

  /**
   * LEARN MODULE
   * Monitor campaign performance and improve future opportunities
   */
  async learn() {
    const activeCampaigns = await prisma.campaign.findMany({
      where: { status: { in: ['ACTIVE', 'COMPLETED'] } },
      include: {
        opportunity: {
          include: {
            seller: true,
            festival: true,
            region: true,
          },
        },
        performance: {
          orderBy: { metricDate: 'desc' },
          take: 30,
        },
      },
    });

    const learnings = [];

    for (const campaign of activeCampaigns) {
      if (campaign.performance.length === 0) continue;

      const totalImpressions = campaign.performance.reduce((sum, p) => sum + p.impressions, 0);
      const totalClicks = campaign.performance.reduce((sum, p) => sum + p.clicks, 0);
      const totalConversions = campaign.performance.reduce((sum, p) => sum + p.conversions, 0);
      const totalRevenue = campaign.performance.reduce((sum, p) => sum + Number(p.revenue), 0);

      const ctr = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
      const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0;

      // Store learning insights
      const learning = {
        campaignId: campaign.id,
        sellerId: campaign.sellerId,
        festivalId: campaign.opportunity.festivalId,
        regionId: campaign.opportunity.regionId,
        opportunityScore: Number(campaign.opportunity.opportunityScore),
        predictedRevenue: Number(campaign.opportunity.predictedRevenue),
        actualRevenue: totalRevenue,
        ctr,
        conversionRate,
        performance: totalRevenue >= Number(campaign.opportunity.predictedRevenue) * 0.5 ? 'GOOD' : 'POOR',
      };

      learnings.push(learning);

      // Update seller metrics based on performance
      if (campaign.opportunity.seller) {
        await prisma.seller.update({
          where: { id: campaign.opportunity.sellerId },
          data: {
            totalRevenue: { increment: totalRevenue },
            conversionRate: conversionRate,
          },
        });
      }
    }

    return learnings;
  }

  /**
   * Run the complete agent cycle using the new Agentic AI Orchestration
   */
  async runAgent() {
    const runId = await this.logAgentRun('ORPDAL_CYCLE');

    try {
      // Use the new Agent Orchestrator for agentic AI workflow
      const agentOrchestrator = AgentOrchestrator;
      
      // Execute the complete ORPDAL agent cycle with human-in-the-loop controls
      const context = {
        runId,
        autonomyLevel: 'require_approval' as const, // Require approval for high-impact decisions
      };
      
      const result = await agentOrchestrator.executeAgentCycle(context);

      await this.updateAgentRun(runId, result.status === 'awaiting_approval' ? 'AWAITING_APPROVAL' : 'COMPLETED', 
        result.summary.opportunitiesGenerated,
        result.summary.actionsExecuted);

      return {
        success: result.status === 'completed' || result.status === 'awaiting_approval',
        opportunitiesGenerated: result.summary.opportunitiesGenerated,
        campaignsCreated: 0, // Campaigns created separately by CommerceAgentService.act()
        missionsCreated: result.summary.sellerMissionsGenerated,
        notificationsSent: result.summary.notificationsSent,
        agentExecutions: result.agentExecutions.map(e => e.agentName),
        confidence: result.summary.confidence,
        reasoning: result.decisions.length > 0 ? result.decisions[0].reasoning : 'No decisions generated',
        predictions: result.decisions.length > 0 ? result.decisions[0].predictionContext?.predictions : null,
        learning: result.learning?.metrics,
        autonomyLevel: context.autonomyLevel,
        status: result.status,
      };
    } catch (error) {
      await this.updateAgentRun(runId, 'FAILED', 0, 0, error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  /**
   * Get opportunities for a specific seller
   */
  async getSellerOpportunities(sellerId: string) {
    return prisma.opportunity.findMany({
      where: { sellerId },
      include: {
        festival: true,
        region: true,
        campaign: true,
        products: {
          include: {
            product: {
              include: {
                seller: true,
              },
            },
          },
          orderBy: { priority: 'desc' },
        },
      },
      orderBy: { opportunityScore: 'desc' },
    });
  }

  /**
   * Accept an opportunity
   */
  async acceptOpportunity(opportunityId: string) {
    const opportunity = await prisma.opportunity.update({
      where: { id: opportunityId },
      data: {
        status: 'ACCEPTED',
        acceptedAt: new Date(),
      },
    });

    // Launch the campaign
    const campaign = await prisma.campaign.findFirst({
      where: { opportunityId: opportunity.id },
    });
    if (campaign) {
      await prisma.campaign.update({
        where: { id: campaign.id },
        data: {
          status: 'ACTIVE',
          launchedAt: new Date(),
        },
      });
    }

    return opportunity;
  }

  /**
   * Dismiss an opportunity
   */
  async dismissOpportunity(opportunityId: string) {
    return prisma.opportunity.update({
      where: { id: opportunityId },
      data: {
        status: 'DISMISSED',
        dismissedAt: new Date(),
      },
    });
  }

  /**
   * Get campaign performance
   */
  async getCampaignPerformance(campaignId: string) {
    return prisma.campaignPerformance.findMany({
      where: { campaignId },
      orderBy: { metricDate: 'desc' },
    });
  }

  // Helper methods for content generation
  private generateStorefrontUrl(opportunity: any): string {
    const baseUrl = process.env.FRONTEND_URL || 'https://vendsway.com';
    return `${baseUrl}/seller/storefront/${opportunity.id}`;
  }

  private _generateBannerImageUrl(_opportunity: any): string {
    // In production, this would generate an actual banner image
    // For now, return a placeholder
    return `https://images.unsplash.com/photo-1590736969955-71cc94801759?w=1200&h=630&fit=crop`;
  }

  private async logAgentRun(runType: string) {
    const run = await prisma.agentRun.create({
      data: {
        runType,
        status: 'RUNNING',
      },
    });
    return run.id;
  }

  /**
   * Get agent decisions from database (stub - requires database models)
   */
  async getAgentDecisions(_status?: string, _limit = 20) {
    console.log('⚠️  Agent decisions require database models from migration');
    return [];
  }

  /**
   * Get agent actions from database (stub - requires database models)
   */
  async getAgentActions(_status?: string, _limit = 20) {
    console.log('⚠️  Agent actions require database models from migration');
    return [];
  }

  /**
   * Get agent learning feedback from database (stub - requires database models)
   */
  async getAgentLearning(_limit = 20) {
    console.log('⚠️  Agent learning feedback requires database models from migration');
    return [];
  }

  private async updateAgentRun(
    runId: string,
    status: string,
    opportunitiesGenerated = 0,
    campaignsCreated = 0,
    errorMessage?: string
  ) {
    await prisma.agentRun.update({
      where: { id: runId },
      data: {
        status,
        endTime: new Date(),
        opportunitiesGenerated,
        campaignsCreated,
        errorMessage,
      },
    });
  }
}

export default new CommerceAgentService();
