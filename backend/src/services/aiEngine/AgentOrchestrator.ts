// ============================================================================
// AGENT ORCHESTRATOR
// ============================================================================
// Central coordinator for the Agentic Commerce Intelligence Engine
// Manages the ORPDAL agent cycle and provides human-in-the-loop controls

import ObserveAgent from './ObserveAgent';
import ReasoningAgent from './ReasoningAgent';
import PredictionAgent from './PredictionAgent';
import DecisionAgent from './DecisionAgent';
import ActionAgent from './ActionAgent';
import LearningAgent from './LearningAgent';

export interface AgentExecution {
  agentName: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startTime: Date;
  endTime?: Date;
  duration?: number;
  input?: any;
  output?: any;
  error?: string;
  confidence?: number;
}

export interface AgentRunContext {
  runId: string;
  regionId?: string;
  sellerId?: string;
  autonomyLevel: 'recommend' | 'require_approval' | 'auto_execute';
  userId?: string;
}

export interface AgentRunResult {
  runId: string;
  status: 'running' | 'completed' | 'failed' | 'awaiting_approval';
  startTime: Date;
  endTime?: Date;
  duration?: number;
  agentExecutions: AgentExecution[];
  summary: {
    opportunitiesGenerated: number;
    sellerMissionsGenerated: number;
    notificationsSent: number;
    decisionsMade: number;
    actionsExecuted: number;
    confidence: number;
  };
  decisions: any[];
  actions: any[];
  learning: any;
  error?: string;
}

class AgentOrchestrator {
  /**
   * Execute the complete ORPDAL agent cycle with human-in-the-loop controls
   */
  async executeAgentCycle(context: AgentRunContext): Promise<AgentRunResult> {
    const runId = context.runId;
    const startTime = new Date();
    const agentExecutions: AgentExecution[] = [];

    try {
      console.log('🤖 AGENT ORCHESTRATOR: Starting Agentic Commerce Intelligence Cycle');
      console.log(`📋 Run ID: ${runId}`);
      console.log(`🎯 Autonomy Level: ${context.autonomyLevel}`);

      // ============================================
      // 1. OBSERVE AGENT
      // ============================================
      console.log('👁️  OBSERVE AGENT: Gathering regional commerce data...');
      const observeExecution: AgentExecution = {
        agentName: 'ObserveAgent',
        status: 'running',
        startTime: new Date(),
      };
      agentExecutions.push(observeExecution);

      try {
        const observation = await ObserveAgent.observe({
          regionId: context.regionId,
          sellerId: context.sellerId,
          timestamp: new Date(),
        });
        
        observeExecution.status = 'completed';
        observeExecution.endTime = new Date();
        observeExecution.duration = observeExecution.endTime.getTime() - observeExecution.startTime.getTime();
        observeExecution.output = observation;
        
        console.log(`✓ Observed ${observation.demandSignals.length} demand signals, ${observation.festivals.length} festivals`);
      } catch (error) {
        observeExecution.status = 'failed';
        observeExecution.endTime = new Date();
        observeExecution.error = error instanceof Error ? error.message : 'Unknown error';
        throw error;
      }

      // ============================================
      // 2. REASONING AGENT
      // ============================================
      console.log('🧠 REASONING AGENT: Analyzing data and generating explainable insights...');
      const reasoningExecution: AgentExecution = {
        agentName: 'ReasoningAgent',
        status: 'running',
        startTime: new Date(),
      };
      agentExecutions.push(reasoningExecution);

      try {
        const reasoning = await ReasoningAgent.reason(observeExecution.output);
        
        reasoningExecution.status = 'completed';
        reasoningExecution.endTime = new Date();
        reasoningExecution.duration = reasoningExecution.endTime.getTime() - reasoningExecution.startTime.getTime();
        reasoningExecution.output = reasoning;
        reasoningExecution.confidence = reasoning.scores.marketOpportunity;
        
        console.log(`✓ Reasoning complete. Market opportunity score: ${reasoning.scores.marketOpportunity.toFixed(0)}`);
        console.log(`📝 Reasoning: ${reasoning.reasoning}`);
      } catch (error) {
        reasoningExecution.status = 'failed';
        reasoningExecution.endTime = new Date();
        reasoningExecution.error = error instanceof Error ? error.message : 'Unknown error';
        throw error;
      }

      // ============================================
      // 3. PREDICTION AGENT
      // ============================================
      console.log('🔮 PREDICTION AGENT: Generating forecasts and predictions...');
      const predictionExecution: AgentExecution = {
        agentName: 'PredictionAgent',
        status: 'running',
        startTime: new Date(),
      };
      agentExecutions.push(predictionExecution);

      try {
        const prediction = await PredictionAgent.predict(reasoningExecution.output);
        
        predictionExecution.status = 'completed';
        predictionExecution.endTime = new Date();
        predictionExecution.duration = predictionExecution.endTime.getTime() - predictionExecution.startTime.getTime();
        predictionExecution.output = prediction;
        predictionExecution.confidence = prediction.predictions.confidenceScore;
        
        console.log(`✓ Predictions complete. Expected demand: ${prediction.predictions.expectedDemand}, Confidence: ${prediction.predictions.confidenceScore}%`);
        console.log(`📝 Explanation: ${prediction.explanation}`);
      } catch (error) {
        predictionExecution.status = 'failed';
        predictionExecution.endTime = new Date();
        predictionExecution.error = error instanceof Error ? error.message : 'Unknown error';
        throw error;
      }

      // ============================================
      // 4. DECISION AGENT
      // ============================================
      console.log('⚖️  DECISION AGENT: Making decisions based on predictions...');
      const decisionExecution: AgentExecution = {
        agentName: 'DecisionAgent',
        status: 'running',
        startTime: new Date(),
      };
      agentExecutions.push(decisionExecution);

      try {
        const decision = await DecisionAgent.decide(predictionExecution.output);
        
        decisionExecution.status = 'completed';
        decisionExecution.endTime = new Date();
        decisionExecution.duration = decisionExecution.endTime.getTime() - decisionExecution.startTime.getTime();
        decisionExecution.output = decision;
        decisionExecution.confidence = decision.confidence;
        
        console.log(`✓ Decisions complete. Priority: ${decision.priority}, ${decision.decisions.sellerMissions.length} missions, ${decision.decisions.commerceOpportunities.length} opportunities`);
        console.log(`📝 Decision reasoning: ${decision.reasoning}`);
      } catch (error) {
        decisionExecution.status = 'failed';
        decisionExecution.endTime = new Date();
        decisionExecution.error = error instanceof Error ? error.message : 'Unknown error';
        throw error;
      }

      // ============================================
      // HUMAN-IN-THE-LOOP CHECK
      // ============================================
      if (context.autonomyLevel === 'require_approval') {
        console.log('🤚 HUMAN-IN-THE-LOOP: Awaiting approval for high-impact decisions...');
        
        return {
          runId,
          status: 'awaiting_approval',
          startTime,
          agentExecutions,
          summary: {
            opportunitiesGenerated: 0,
            sellerMissionsGenerated: 0,
            notificationsSent: 0,
            decisionsMade: decisionExecution.output.decisions.sellerMissions.length + decisionExecution.output.decisions.commerceOpportunities.length,
            actionsExecuted: 0,
            confidence: decisionExecution.confidence || 0,
          },
          decisions: decisionExecution.output.decisions,
          actions: [],
          learning: null,
        };
      }

      // ============================================
      // 5. ACTION AGENT
      // ============================================
      console.log('🎬 ACTION AGENT: Executing approved decisions...');
      const actionExecution: AgentExecution = {
        agentName: 'ActionAgent',
        status: 'running',
        startTime: new Date(),
      };
      agentExecutions.push(actionExecution);

      try {
        const action = await ActionAgent.act(decisionExecution.output);
        
        actionExecution.status = 'completed';
        actionExecution.endTime = new Date();
        actionExecution.duration = actionExecution.endTime.getTime() - actionExecution.startTime.getTime();
        actionExecution.output = action;
        
        console.log(`✓ Actions complete. Created ${action.actions.createdMissions} missions, ${action.actions.createdOpportunities} opportunities, ${action.actions.sentNotifications} notifications`);
      } catch (error) {
        actionExecution.status = 'failed';
        actionExecution.endTime = new Date();
        actionExecution.error = error instanceof Error ? error.message : 'Unknown error';
        throw error;
      }

      // ============================================
      // 6. LEARNING AGENT
      // ============================================
      console.log('📚 LEARNING AGENT: Monitoring outcomes and improving future decisions...');
      const learningExecution: AgentExecution = {
        agentName: 'LearningAgent',
        status: 'running',
        startTime: new Date(),
      };
      agentExecutions.push(learningExecution);

      try {
        const learning = await LearningAgent.learn(actionExecution.output);
        
        learningExecution.status = 'completed';
        learningExecution.endTime = new Date();
        learningExecution.duration = learningExecution.endTime.getTime() - learningExecution.startTime.getTime();
        learningExecution.output = learning;
        
        console.log(`✓ Learning complete. Updated weights:`, learning.weightUpdates);
      } catch (error) {
        learningExecution.status = 'failed';
        learningExecution.endTime = new Date();
        learningExecution.error = error instanceof Error ? error.message : 'Unknown error';
        // Learning failures should not block the entire cycle
        console.error('Learning agent failed, but continuing...', error);
      }

      // ============================================
      // COMPLETE AGENT RUN
      // ============================================
      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();

      console.log('✅ AGENT ORCHESTRATOR: Cycle complete!');
      console.log(`⏱️  Total duration: ${duration}ms`);
      console.log(`🎯 Summary: ${actionExecution.output.actions.createdOpportunities} opportunities, ${actionExecution.output.actions.createdMissions} missions, ${actionExecution.output.actions.sentNotifications} notifications`);

      return {
        runId,
        status: 'completed',
        startTime,
        endTime,
        duration,
        agentExecutions,
        summary: {
          opportunitiesGenerated: actionExecution.output.actions.createdOpportunities,
          sellerMissionsGenerated: actionExecution.output.actions.createdMissions,
          notificationsSent: actionExecution.output.actions.sentNotifications,
          decisionsMade: decisionExecution.output.decisions.sellerMissions.length + decisionExecution.output.decisions.commerceOpportunities.length,
          actionsExecuted: actionExecution.output.actions.createdMissions + actionExecution.output.actions.createdOpportunities + actionExecution.output.actions.sentNotifications,
          confidence: decisionExecution.confidence || 0,
        },
        decisions: decisionExecution.output.decisions,
        actions: actionExecution.output.results,
        learning: learningExecution.output,
      };

    } catch (error) {
      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();

      console.error('❌ AGENT ORCHESTRATOR: Cycle failed', error);

      return {
        runId,
        status: 'failed',
        startTime,
        endTime,
        duration,
        agentExecutions,
        summary: {
          opportunitiesGenerated: 0,
          sellerMissionsGenerated: 0,
          notificationsSent: 0,
          decisionsMade: 0,
          actionsExecuted: 0,
          confidence: 0,
        },
        decisions: [],
        actions: [],
        learning: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get agent run history (stub - requires database models)
   */
  async getAgentRuns(_limit = 20) {
    console.log('⚠️  Agent run history requires database models from migration');
    return [];
  }

  /**
   * Get specific agent run details (stub - requires database models)
   */
  async getAgentRun(_runId: string) {
    console.log('⚠️  Agent run details require database models from migration');
    return null;
  }

  /**
   * Approve pending decisions (stub - requires database models)
   */
  async approveDecisions(_runId: string, _userId: string) {
    console.log('⚠️  Decision approval requires database models from migration');
    throw new Error('Decision approval requires database models from migration');
  }
}

export default new AgentOrchestrator();