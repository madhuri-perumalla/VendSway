// ============================================================================
// COMMERCE AGENT SERVICE
// ============================================================================
// Frontend service for AI Commerce Agent API calls

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface Opportunity {
  id: string;
  festival?: {
    id: string;
    name: string;
    date: string;
  };
  region: {
    id: string;
    name: string;
  };
  opportunityScore: number;
  predictedRevenue: number;
  confidence: number;
  reason: string;
  status: 'PENDING' | 'ACCEPTED' | 'DISMISSED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  acceptedAt?: string;
  dismissedAt?: string;
  expiresAt?: string;
  campaign?: {
    id: string;
    name: string;
    storefrontUrl?: string;
    whatsappCaption?: string;
    instagramCaption?: string;
    facebookCaption?: string;
    bannerImageUrl?: string;
    status: string;
  };
  products: Array<{
    id: string;
    priority: number;
    suggestedPrice?: number;
    product: {
      id: string;
      name: string;
      category: string;
      price: number;
      imageUrl?: string;
      seller: {
        businessName: string;
      };
    };
  }>;
}

export interface CampaignPerformance {
  id: string;
  campaignId: string;
  metricDate: string;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  ctr: number;
  conversionRate: number;
}

export interface AgentRun {
  id: string;
  runType: string;
  status: string;
  startTime: string;
  endTime?: string;
  opportunitiesGenerated: number;
  campaignsCreated: number;
  errorMessage?: string;
}

class CommerceAgentService {
  /**
   * Get opportunities for a specific seller
   */
  async getSellerOpportunities(sellerId: string): Promise<Opportunity[]> {
    const response = await fetch(`${API_BASE_URL}/commerce-agent/opportunities/${sellerId}`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch opportunities');
    }
    
    return data.data;
  }

  /**
   * Accept an opportunity
   */
  async acceptOpportunity(opportunityId: string): Promise<Opportunity> {
    const response = await fetch(`${API_BASE_URL}/commerce-agent/opportunities/${opportunityId}/accept`, {
      method: 'POST',
    });
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to accept opportunity');
    }
    
    return data.data;
  }

  /**
   * Dismiss an opportunity
   */
  async dismissOpportunity(opportunityId: string): Promise<Opportunity> {
    const response = await fetch(`${API_BASE_URL}/commerce-agent/opportunities/${opportunityId}/dismiss`, {
      method: 'POST',
    });
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to dismiss opportunity');
    }
    
    return data.data;
  }

  /**
   * Get campaign performance metrics
   */
  async getCampaignPerformance(campaignId: string): Promise<CampaignPerformance[]> {
    const response = await fetch(`${API_BASE_URL}/commerce-agent/campaigns/${campaignId}/performance`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch campaign performance');
    }
    
    return data.data;
  }

  /**
   * Get agent run history (admin only)
   */
  async getAgentRuns(limit?: number, runType?: string): Promise<AgentRun[]> {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (runType) params.append('runType', runType);
    
    const response = await fetch(`${API_BASE_URL}/commerce-agent/runs?${params}`);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch agent runs');
    }
    
    return data.data;
  }

  /**
   * Run the agent manually (admin only)
   */
  async runAgent(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/commerce-agent/run`, {
      method: 'POST',
    });
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to run agent');
    }
    
    return data.data;
  }
}

export default new CommerceAgentService();
