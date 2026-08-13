// ============================================================================
// AI REASONING ENGINE
// ============================================================================
// Main orchestrator for the internal AI system
// Implements: Observe → Reason → Predict → Decide → Act → Learn

import ObserveEngine from './ObserveEngine';
import ReasonEngine from './ReasonEngine';
import PredictEngine from './PredictEngine';
import DecisionEngine from './DecisionEngine';
import ActionEngine from './ActionEngine';
import LearningEngine from './LearningEngine';
import RuleEngine from './RuleEngine';
import type { ObservationContext, ReasoningContext, PredictionContext, DecisionContext, ActionContext, LearningContext } from './types';

class AIReasoningEngine {
  private observeEngine: any;
  private reasonEngine: any;
  private predictEngine: any;
  private decisionEngine: any;
  private actionEngine: any;
  private learningEngine: any;
  private ruleEngine: any;

  constructor() {
    this.observeEngine = ObserveEngine;
    this.reasonEngine = ReasonEngine;
    this.predictEngine = PredictEngine;
    this.decisionEngine = DecisionEngine;
    this.actionEngine = ActionEngine;
    this.learningEngine = LearningEngine;
    this.ruleEngine = RuleEngine;
  }

  /**
   * Run the complete ORPDAL cycle
   */
  async runCycle(context?: { regionId?: string; sellerId?: string }): Promise<{
    observation: ObservationContext;
    reasoning: ReasoningContext;
    prediction: PredictionContext;
    decision: DecisionContext;
    action: ActionContext;
    learning: LearningContext;
  }> {
    console.log('🔄 Starting AI Reasoning Engine cycle...');

    // OBSERVE
    console.log('👁️  OBSERVE: Gathering data from database...');
    const observation = await this.observeEngine.observe(context);
    console.log(`✓ Observed ${observation.demandSignals.length} demand signals, ${observation.festivals.length} festivals`);

    // REASON
    console.log('🧠 REASON: Analyzing data and generating scores...');
    const reasoning = await this.reasonEngine.reason(observation);
    console.log(`✓ Reasoning complete. Opportunity score: ${reasoning.scores.marketOpportunity.toFixed(0)}`);

    // PREDICT
    console.log('🔮 PREDICT: Generating predictions...');
    const prediction = await this.predictEngine.predict(reasoning);
    console.log(`✓ Predictions complete. Expected demand: ${prediction.predictions.expectedDemand}, Confidence: ${prediction.predictions.confidenceScore}%`);

    // DECIDE
    console.log('⚖️  DECIDE: Making decisions based on predictions...');
    const decision = await this.decisionEngine.decide(prediction);
    console.log(`✓ Decisions complete. Priority: ${decision.priority}, ${decision.decisions.sellerMissions.length} missions, ${decision.decisions.commerceOpportunities.length} opportunities`);

    // ACT
    console.log('🎬 ACT: Executing decisions...');
    const action = await this.actionEngine.act(decision);
    console.log(`✓ Actions complete. Created ${action.actions.createdMissions} missions, ${action.actions.createdOpportunities} opportunities, ${action.actions.sentNotifications} notifications`);

    // LEARN
    console.log('📚 LEARN: Learning from results...');
    const learning = await this.learningEngine.learn(action);
    console.log(`✓ Learning complete. Updated weights:`, learning.weightUpdates);

    console.log('✅ AI Reasoning Engine cycle complete!');

    return {
      observation,
      reasoning,
      prediction,
      decision,
      action,
      learning,
    };
  }

  /**
   * Run individual engines (for testing or specific use cases)
   */
  async observe(context?: { regionId?: string; sellerId?: string }): Promise<ObservationContext> {
    return this.observeEngine.observe(context);
  }

  async reason(observation: ObservationContext): Promise<ReasoningContext> {
    return this.reasonEngine.reason(observation);
  }

  async predict(reasoning: ReasoningContext): Promise<PredictionContext> {
    return this.predictEngine.predict(reasoning);
  }

  async decide(prediction: PredictionContext): Promise<DecisionContext> {
    return this.decisionEngine.decide(prediction);
  }

  async act(decision: DecisionContext): Promise<ActionContext> {
    return this.actionEngine.act(decision);
  }

  async learn(action: ActionContext): Promise<LearningContext> {
    return this.learningEngine.learn(action);
  }

  /**
   * Evaluate rules against context
   */
  evaluateRules(context: Record<string, any>): string[] {
    return this.ruleEngine.executeRules(context);
  }

  /**
   * Get current learning weights
   */
  getWeights() {
    return this.learningEngine.getWeights();
  }

  /**
   * Get system status
   */
  getStatus() {
    return {
      status: 'ACTIVE',
      engine: 'AIReasoningEngine',
      version: '1.0.0',
      mode: 'DETERMINISTIC',
      dependencies: 'NONE',
      architecture: 'ORPDAL',
      components: {
        observe: 'ACTIVE',
        reason: 'ACTIVE',
        predict: 'ACTIVE',
        decide: 'ACTIVE',
        act: 'ACTIVE',
        learn: 'ACTIVE',
      },
      capabilities: {
        demandPrediction: true,
        contentGeneration: true,
        productRecommendations: true,
        sellerAnalysis: true,
        marketingContent: true,
        opportunityDetection: true,
        inventoryManagement: true,
        pricingSuggestions: true,
      },
      weights: this.learningEngine.getWeights(),
      rules: this.ruleEngine.getAllRules().length,
    };
  }
}

export default new AIReasoningEngine();