// ============================================================================
// AI REASONING ENGINE TYPES
// ============================================================================
// Type definitions for the internal AI Reasoning Engine

export interface ObservationContext {
  demandSignals: any[];
  catalogGaps: any[];
  festivals: any[];
  regions: any[];
  approvedProducts: any[];
  sellers: any[];
  regionalTrends: any[];
  communityDemands: any[];
  inventory: any[];
  sellerPerformance: any[];
  historicalTrends: any[];
}

export interface ReasoningContext {
  observationContext: ObservationContext;
  scores: {
    regionalRelevance: number;
    demandScore: number;
    festivalRelevance: number;
    inventoryHealth: number;
    sellerSuitability: number;
    marketOpportunity: number;
    competitionScore: number;
  };
  reasoning: string;
}

export interface PredictionContext {
  reasoningContext: ReasoningContext;
  predictions: {
    expectedDemand: number;
    expectedInventory: number;
    sellerGrowth: number;
    productSuccess: number;
    opportunityScore: number;
    visibilityScore: number;
    confidenceScore: number;
  };
  explanation: string;
}

export interface DecisionContext {
  predictionContext: PredictionContext;
  decisions: {
    sellerMissions: any[];
    commerceOpportunities: any[];
    recommendedProducts: any[];
    regionalExpansion: any[];
    prioritySellers: any[];
    campaignSuggestions: any[];
    inventoryAlerts: any[];
    pricingSuggestions: any[];
  };
  reasoning: string;
  confidence: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  deadline?: Date;
}

export interface ActionContext {
  decisionContext: DecisionContext;
  actions: {
    createdMissions: number;
    sentNotifications: number;
    generatedRecommendations: number;
    updatedDashboard: boolean;
    createdOpportunities: number;
  };
  results: any[];
}

export interface LearningContext {
  actionContext: ActionContext;
  metrics: {
    missionAcceptanceRate: number;
    missionCompletionRate: number;
    campaignPerformance: number;
    sellerGrowthRate: number;
    opportunitySuccessRate: number;
    productSalesRate: number;
    demandAccuracy: number;
  };
  weightUpdates: {
    demandWeight: number;
    festivalWeight: number;
    inventoryWeight: number;
    sellerWeight: number;
    trendWeight: number;
  };
}

export interface RuleCondition {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'contains';
  value: any;
}

export interface Rule {
  id: string;
  name: string;
  conditions: RuleCondition[];
  actions: string[];
  priority: number;
  category: string;
}

export interface Recommendation {
  type: string;
  title: string;
  description: string;
  reasoning: string;
  confidence: number;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  actionItems: string[];
  expectedOutcome: string;
  deadline?: Date;
}

export interface MarketingContent {
  platform: 'whatsapp' | 'instagram' | 'facebook' | 'email';
  content: string;
  subject?: string;
  hashtags?: string[];
  targetAudience: string[];
  context: {
    festival?: string;
    region: string;
    category: string;
    products: any[];
  };
}

export interface VisibilityScore {
  overall: number;
  components: {
    productCompleteness: number;
    ratings: number;
    inventoryHealth: number;
    demandMatch: number;
    catalogQuality: number;
    sellerVerification: number;
  };
  strengths: string[];
  weaknesses: string[];
  improvementSteps: Array<{
    step: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    expectedImpact: number;
  }>;
}

export interface BusinessSummary {
  period: string;
  totalRevenue: number;
  growthRate: number;
  topProducts: any[];
  bottomProducts: any[];
  growthOpportunities: string[];
  weakAreas: string[];
  expansionAdvice: string[];
  marketingIdeas: string[];
  inventoryAdvice: string[];
  summary: string;
}