// ============================================================================
// ACTION ENGINE
// ============================================================================
// Executes decisions by creating database records and notifications

import { DecisionContext, ActionContext } from './types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class ActionEngine {
  /**
   * Execute decisions by taking actions
   */
  async act(decisionContext: DecisionContext): Promise<ActionContext> {
    const { decisions, priority, deadline } = decisionContext;

    const actions = {
      createdMissions: 0,
      sentNotifications: 0,
      generatedRecommendations: 0,
      updatedDashboard: false,
      createdOpportunities: 0,
    };

    const results: any[] = [];

    try {
      // Create seller missions
      if (decisions.sellerMissions.length > 0) {
        const missionResults = await this.createSellerMissions(decisions.sellerMissions);
        actions.createdMissions = missionResults.length;
        results.push(...missionResults);
      }

      // Create commerce opportunities
      if (decisions.commerceOpportunities.length > 0) {
        const opportunityResults = await this.createCommerceOpportunities(decisions.commerceOpportunities);
        actions.createdOpportunities = opportunityResults.length;
        results.push(...opportunityResults);
      }

      // Generate and send notifications
      if (decisions.inventoryAlerts.length > 0) {
        const notificationResults = await this.sendInventoryNotifications(decisions.inventoryAlerts);
        actions.sentNotifications = notificationResults.length;
        results.push(...notificationResults);
      }

      // Generate recommendations
      if (decisions.recommendedProducts.length > 0) {
        actions.generatedRecommendations = decisions.recommendedProducts.length;
        results.push({ type: 'recommendations', count: decisions.recommendedProducts.length });
      }

      // Update dashboard with latest insights
      await this.updateDashboard(decisionContext);
      actions.updatedDashboard = true;

      results.push({
        type: 'summary',
        priority,
        deadline,
        actions,
        timestamp: new Date(),
      });

    } catch (error) {
      console.error('Error in Action engine:', error);
      throw error;
    }

    return {
      decisionContext,
      actions,
      results,
    };
  }

  /**
   * Create seller missions in database
   */
  private async createSellerMissions(missions: any[]): Promise<any[]> {
    const results: any[] = [];

    for (const mission of missions) {
      try {
        // Check if similar mission already exists
        const existing = await prisma.sellerMission.findFirst({
          where: {
            sellerId: mission.sellerId,
            missionType: mission.missionType,
            status: { in: ['PENDING', 'ACCEPTED', 'ACTIVE'] },
            expiresAt: { gt: new Date() },
          },
        });

        if (!existing) {
          const created = await prisma.sellerMission.create({
            data: {
              sellerId: mission.sellerId,
              missionType: mission.missionType,
              opportunityScore: mission.opportunityScore,
              confidence: mission.confidence,
              predictedRevenue: mission.predictedRevenue,
              targetAudience: mission.targetAudience,
              targetAgeRange: mission.targetAgeRange,
              productCount: mission.productCount,
              reason: mission.reason,
              recommendedAction: mission.recommendedAction,
              expiresAt: mission.expiresAt,
              regionId: mission.regionId,
              festivalId: mission.festivalId,
              status: 'PENDING',
            },
          });
          results.push({ type: 'mission', id: created.id, success: true });
        } else {
          results.push({ type: 'mission', reason: 'Already exists', success: false });
        }
      } catch (error) {
        console.error('Error creating mission:', error);
        results.push({ type: 'mission', error, success: false });
      }
    }

    return results;
  }

  /**
   * Create commerce opportunities in database
   */
  private async createCommerceOpportunities(opportunities: any[]): Promise<any[]> {
    const results: any[] = [];

    for (const opp of opportunities) {
      try {
        // Check if similar opportunity exists
        const existing = await prisma.opportunity.findFirst({
          where: {
            sellerId: opp.sellerId,
            regionId: opp.regionId,
            festivalId: opp.festivalId || null,
            status: { in: ['PENDING', 'ACCEPTED', 'ACTIVE'] },
          },
        });

        if (!existing) {
          const created = await prisma.opportunity.create({
            data: {
              sellerId: opp.sellerId,
              regionId: opp.regionId,
              festivalId: opp.festivalId,
              opportunityScore: opp.opportunityScore,
              predictedRevenue: opp.predictedRevenue,
              confidence: opp.confidence,
              reason: opp.reason,
              status: 'PENDING',
              products: {
                create: opp.products,
              },
            },
          });
          results.push({ type: 'opportunity', id: created.id, success: true });
        } else {
          results.push({ type: 'opportunity', reason: 'Already exists', success: false });
        }
      } catch (error) {
        console.error('Error creating opportunity:', error);
        results.push({ type: 'opportunity', error, success: false });
      }
    }

    return results;
  }

  /**
   * Send inventory notifications
   */
  private async sendInventoryNotifications(alerts: any[]): Promise<any[]> {
    const results: any[] = [];

    for (const alert of alerts) {
      try {
        const notification = await prisma.notification.create({
          data: {
            userId: alert.sellerId,
            type: alert.type === 'LOW_STOCK' ? ('INVENTORY_LOW' as any) : ('INVENTORY_HIGH' as any),
            title: alert.type === 'LOW_STOCK' ? 'Low Stock Alert' : 'Overstock Alert',
            message: alert.reason,
            priority: alert.priority as any,
            metadata: {
              productId: alert.productId,
              currentStock: alert.currentStock,
              recommendedStock: alert.recommendedStock,
            } as any,
          },
        });
        results.push({ type: 'notification', id: notification.id, success: true });
      } catch (error) {
        console.error('Error creating notification:', error);
        results.push({ type: 'notification', error, success: false });
      }
    }

    return results;
  }

  /**
   * Update dashboard with latest insights
   */
  private async updateDashboard(decisionContext: DecisionContext): Promise<void> {
    try {
      // Store latest AI run summary
      await prisma.agentRun.create({
        data: {
          runType: 'ORPDAL_CYCLE',
          status: 'COMPLETED' as any,
          startTime: new Date(Date.now() - 60000), // Started 1 minute ago
          endTime: new Date(),
          additionalData: JSON.stringify({
            opportunityCount: decisionContext.decisions.commerceOpportunities.length,
            missionCount: decisionContext.decisions.sellerMissions.length,
            alertCount: decisionContext.decisions.inventoryAlerts.length,
          }),
          opportunitiesGenerated: decisionContext.decisions.commerceOpportunities.length,
          campaignsCreated: 0, // Campaigns are created by CommerceAgentService, not ActionEngine
          errorMessage: null,
        },
      });
    } catch (error) {
      console.error('Error updating dashboard:', error);
    }
  }
}

export default new ActionEngine();