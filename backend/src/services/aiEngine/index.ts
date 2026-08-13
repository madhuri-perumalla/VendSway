// ============================================================================
// AGENTIC COMMERCE INTELLIGENCE ENGINE
// ============================================================================
// Main export point for the Agentic AI system
// Exports both the new Agent Orchestrator and legacy engines for backward compatibility

// New Agentic AI Components
export { default as AgentOrchestrator } from './AgentOrchestrator';
export { default as ObserveAgent } from './ObserveAgent';
export { default as ReasoningAgent } from './ReasoningAgent';
export { default as PredictionAgent } from './PredictionAgent';
export { default as DecisionAgent } from './DecisionAgent';
export { default as ActionAgent } from './ActionAgent';
export { default as LearningAgent } from './LearningAgent';

// Legacy AI Reasoning Engine (maintained for backward compatibility)
export { default as AIReasoningEngine } from './AIReasoningEngine';
export { default as ObserveEngine } from './ObserveEngine';
export { default as ReasonEngine } from './ReasonEngine';
export { default as PredictEngine } from './PredictEngine';
export { default as DecisionEngine } from './DecisionEngine';
export { default as ActionEngine } from './ActionEngine';
export { default as LearningEngine } from './LearningEngine';
export { default as RuleEngine } from './RuleEngine';

// Supporting components
export { default as MarketingGenerator } from './MarketingGenerator';

// Types
export * from './types';

// Default export points to the new Agent Orchestrator for new code
export { default } from './AgentOrchestrator';