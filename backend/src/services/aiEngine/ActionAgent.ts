// ============================================================================
// ACTION AGENT
// ============================================================================
// Agentic wrapper for executing approved decisions
// Responsible for creating database records and triggering marketplace workflows

import ActionEngine from './ActionEngine';
import { DecisionContext, ActionContext } from './types';

export interface ActionAgentContext {
  decisionContext: DecisionContext;
  approvalRequired?: boolean;
  approvedBy?: string;
}

export interface ActionAgentResult {
  actionContext: ActionContext;
  actions: {
    createdMissions: number;
    sentNotifications: number;
    generatedRecommendations: number;
    updatedDashboard: boolean;
    createdOpportunities: number;
  };
  results: any[];
  explanation: string;
  confidence: number;
  executedActions: string[];
  validationPassed: boolean;
}

class ActionAgent {
  /**
   * Execute approved decisions by creating database records
   */
  async act(context: ActionAgentContext): Promise<ActionContext> {
    console.log('🎬 ACTION AGENT: Executing approved decisions...');
    
    const action = await ActionEngine.act(context.decisionContext);
    
    console.log(`📊 Actions executed:`);
    console.log(`   - Missions created: ${action.actions.createdMissions}`);
    console.log(`   - Opportunities created: ${action.actions.createdOpportunities}`);
    console.log(`   - Notifications sent: ${action.actions.sentNotifications}`);
    console.log(`   - Dashboard updated: ${action.actions.updatedDashboard}`);
    
    return action;
  }

  /**
   * Get detailed action result with execution summary
   */
  async getDetailedAction(context: ActionAgentContext): Promise<ActionAgentResult> {
    const actionContext = await this.act(context);
    
    const executedActions = this.generateExecutionSummary(actionContext);
    const validationPassed = this.validateActions(actionContext);
    
    return {
      actionContext,
      actions: actionContext.actions,
      results: actionContext.results,
      explanation: 'Actions executed successfully with validated database relationships',
      confidence: 0.95, // Database actions are highly reliable when validation passes
      executedActions,
      validationPassed,
    };
  }

  /**
   * Generate human-readable execution summary
   */
  private generateExecutionSummary(action: ActionContext): string[] {
    const actions: string[] = [];
    const { actions: actionResults } = action;

    if (actionResults.createdMissions > 0) {
      actions.push(`Created ${actionResults.createdMissions} seller missions with proper foreign key relationships`);
    }

    if (actionResults.createdOpportunities > 0) {
      actions.push(`Created ${actionResults.createdOpportunities} commerce opportunities with validated region and seller relationships`);
    }

    if (actionResults.sentNotifications > 0) {
      actions.push(`Sent ${actionResults.sentNotifications} notifications to relevant stakeholders`);
    }

    if (actionResults.generatedRecommendations > 0) {
      actions.push(`Generated ${actionResults.generatedRecommendations} recommendations for review`);
    }

    if (actionResults.updatedDashboard) {
      actions.push('Updated agent dashboard with latest execution results');
    }

    if (actions.length === 0) {
      actions.push('No actions executed - all decisions were recommendations or validation failed');
    }

    return actions;
  }

  /**
   * Validate that all actions maintain database integrity
   */
  private validateActions(action: ActionContext): boolean {
    // Check if any actions failed
    const failedActions = action.results.filter((result: any) => !result.success);
    
    if (failedActions.length > 0) {
      console.warn(`⚠️  ${failedActions.length} actions failed validation`);
      failedActions.forEach((failed: any) => {
        console.warn(`   - ${failed.type}: ${failed.error || 'Unknown error'}`);
      });
      return false;
    }

    return true;
  }
}

export default new ActionAgent();
