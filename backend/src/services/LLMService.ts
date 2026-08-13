/**
 * VendSway LLM Service
 * Service for communicating with the Python AI inference server
 */

import axios from 'axios';

export interface LLMGenerateRequest {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
}

export interface LLMGenerateResponse {
  text: string;
  tokensGenerated: number;
  model: string;
  latencyMs: number;
}

export interface LLMClassifyRequest {
  text: string;
  categories?: string[];
}

export interface LLMClassifyResponse {
  intent: string;
  confidence: number;
  model: string;
}

export interface LLMPlanRequest {
  task: string;
  context: Record<string, any>;
  availableTools: string[];
}

export interface LLMPlanResponse {
  intent: string;
  goal: string;
  plan: string[];
  tools: string[];
  reasoning: string;
  confidence: number;
}

export interface LLMToolSelectionRequest {
  task: string;
  availableTools: string[];
  context?: Record<string, any>;
}

export interface LLMToolSelectionResponse {
  selectedTools: string[];
  toolOrder: string[];
  reasoning: string;
  confidence: number;
}

export interface LLMExplainRequest {
  decision: Record<string, any>;
  context?: Record<string, any>;
}

export interface LLMExplainResponse {
  explanation: string;
  keyFactors: string[];
  recommendations: string[];
  confidence: number;
}

export interface LLMHealthResponse {
  status: string;
  modelLoaded: boolean;
  modelName?: string;
  device: string;
}

class LLMService {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    this.baseUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
    this.timeout = 30000; // 30 seconds
  }

  /**
   * Check if the AI service is healthy
   */
  async healthCheck(): Promise<LLMHealthResponse> {
    try {
      const response = await axios.get<LLMHealthResponse>(
        `${this.baseUrl}/health`,
        { timeout: this.timeout }
      );
      return response.data;
    } catch (error) {
      console.error('LLM service health check failed:', error);
      return {
        status: 'unhealthy',
        modelLoaded: false,
        device: 'unknown'
      };
    }
  }

  /**
   * Generate text using the LLM
   */
  async generate(request: LLMGenerateRequest): Promise<LLMGenerateResponse> {
    try {
      const response = await axios.post<LLMGenerateResponse>(
        `${this.baseUrl}/generate`,
        request,
        { timeout: this.timeout }
      );
      return response.data;
    } catch (error) {
      console.error('LLM generation failed:', error);
      throw new Error('LLM generation service unavailable');
    }
  }

  /**
   * Classify intent using the LLM
   */
  async classify(request: LLMClassifyRequest): Promise<LLMClassifyResponse> {
    try {
      const response = await axios.post<LLMClassifyResponse>(
        `${this.baseUrl}/classify`,
        request,
        { timeout: this.timeout }
      );
      return response.data;
    } catch (error) {
      console.error('LLM classification failed:', error);
      throw new Error('LLM classification service unavailable');
    }
  }

  /**
   * Generate agent plan using the LLM
   */
  async generatePlan(request: LLMPlanRequest): Promise<LLMPlanResponse> {
    try {
      const response = await axios.post<LLMPlanResponse>(
        `${this.baseUrl}/plan`,
        request,
        { timeout: this.timeout }
      );
      return response.data;
    } catch (error) {
      console.error('LLM plan generation failed:', error);
      throw new Error('LLM plan generation service unavailable');
    }
  }

  /**
   * Select tools using the LLM
   */
  async selectTools(request: LLMToolSelectionRequest): Promise<LLMToolSelectionResponse> {
    try {
      const response = await axios.post<LLMToolSelectionResponse>(
        `${this.baseUrl}/tool-selection`,
        request,
        { timeout: this.timeout }
      );
      return response.data;
    } catch (error) {
      console.error('LLM tool selection failed:', error);
      throw new Error('LLM tool selection service unavailable');
    }
  }

  /**
   * Generate explanation using the LLM
   */
  async generateExplanation(request: LLMExplainRequest): Promise<LLMExplainResponse> {
    try {
      const response = await axios.post<LLMExplainResponse>(
        `${this.baseUrl}/explain`,
        request,
        { timeout: this.timeout }
      );
      return response.data;
    } catch (error) {
      console.error('LLM explanation generation failed:', error);
      throw new Error('LLM explanation generation service unavailable');
    }
  }

  /**
   * Check if LLM is available and healthy
   */
  async isAvailable(): Promise<boolean> {
    const health = await this.healthCheck();
    return health.status === 'healthy' && health.modelLoaded;
  }
}

export default new LLMService();