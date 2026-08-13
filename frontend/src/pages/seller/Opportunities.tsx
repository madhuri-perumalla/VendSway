import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { TrendingUp, MapPin, Calendar, Package, Sparkles, ArrowRight, AlertCircle, Loader2, Send } from 'lucide-react';
import api from '@/lib/api';

interface Opportunity {
  id: string;
  title: string;
  type: 'DEMAND' | 'CATALOG_GAP' | 'FESTIVAL';
  region: string;
  category: string;
  reason: string;
  recommendedAction: string;
  demandScore?: number;
  gap?: number;
  festival?: string;
  festivalDate?: string;
  createdAt: string;
}

interface SellerProfile {
  id: string;
  businessName: string;
  categories: string[];
  location: string;
  regionId?: string;
}

const Opportunities: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [sellerProfile, setSellerProfile] = useState<SellerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [showAiAssistant, setShowAiAssistant] = useState(false);

  const SELLER_ID_KEY = 'sellerIdForProducts';

  useEffect(() => {
    fetchSellerProfile();
    fetchOpportunities();
  }, []);

  const fetchSellerProfile = async () => {
    try {
      const sellerId = localStorage.getItem(SELLER_ID_KEY);
      if (!sellerId) return;

      const response = await api.get(`/sellers/${sellerId}`);
      setSellerProfile(response.data.data);
    } catch (err) {
      console.error('Failed to fetch seller profile:', err);
    }
  };

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      const sellerId = localStorage.getItem(SELLER_ID_KEY);
      if (!sellerId) {
        setError('No seller ID found. Please complete your application first.');
        return;
      }

      // Check if seller is approved before showing opportunities
      try {
        const appResponse = await api.get(`/sellers/applications/status?email=${user?.email || ''}`);
        if (appResponse.data.data?.status !== 'APPROVED') {
          setError('Your seller application must be approved before you can view opportunities.');
          return;
        }
      } catch (err) {
        console.error('Failed to check seller status:', err);
      }

      // Try to get opportunities from the commerce agent
      try {
        const response = await api.get(`/commerce-agent/opportunities/${sellerId}`);
        if (response.data.data && response.data.data.length > 0) {
          setOpportunities(response.data.data);
        } else {
          // If no opportunities from agent, generate from regional intelligence
          await generateOpportunitiesFromIntelligence();
        }
      } catch (err) {
        console.error('Failed to fetch opportunities from agent:', err);
        // Fallback to regional intelligence
        await generateOpportunitiesFromIntelligence();
      }
    } catch (err) {
      setError('Failed to load opportunities');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateOpportunitiesFromIntelligence = async () => {
    try {
      // Get regional intelligence data
      const regionsResponse = await api.get('/intelligence/regions');
      const regions = regionsResponse.data.data || [];

      // Get demand signals
      const demandResponse = await api.get('/demand/signals');
      const demandSignals = demandResponse.data.data || [];

      // Get catalog gaps
      const gapsResponse = await api.get('/gaps');
      const catalogGaps = gapsResponse.data.data || [];

      // Get festivals
      const festivalsResponse = await api.get('/intelligence/festivals');
      const festivals = festivalsResponse.data.data || [];

      // Generate relevant opportunities based on seller profile
      const generatedOpportunities: Opportunity[] = [];

      if (sellerProfile?.categories) {
        // Demand-based opportunities
        demandSignals.forEach((signal: any) => {
          if (sellerProfile.categories?.includes(signal.category)) {
            generatedOpportunities.push({
              id: `demand-${signal.id}`,
              title: `High Demand: ${signal.category}`,
              type: 'DEMAND',
              region: signal.regionName || 'Multiple Regions',
              category: signal.category,
              reason: `Demand score of ${signal.demandScore} detected for ${signal.category} in ${signal.regionName || 'your region'}`,
              recommendedAction: `Add more ${signal.category} products to your catalog to meet demand`,
              demandScore: signal.demandScore,
              createdAt: new Date().toISOString(),
            });
          }
        });

        // Catalog gap opportunities
        catalogGaps.forEach((gap: any) => {
          if (sellerProfile.categories?.includes(gap.category) && gap.gap > 0) {
            generatedOpportunities.push({
              id: `gap-${gap.id}`,
              title: `Catalog Gap: ${gap.productName || gap.category}`,
              type: 'CATALOG_GAP',
              region: gap.regionName || 'Multiple Regions',
              category: gap.category,
              reason: `Catalog gap of ${gap.gap} units detected for ${gap.category} in ${gap.regionName || 'your region'}`,
              recommendedAction: `Add ${gap.category} products to fill this catalog gap`,
              gap: gap.gap,
              createdAt: new Date().toISOString(),
            });
          }
        });

        // Festival-based opportunities
        festivals.forEach((festival: any) => {
          if (sellerProfile.categories?.some((cat: string) => 
            cat.toLowerCase().includes('traditional') || 
            cat.toLowerCase().includes('wear') ||
            cat.toLowerCase().includes('saree')
          )) {
            generatedOpportunities.push({
              id: `festival-${festival.id}`,
              title: `Festival Opportunity: ${festival.name}`,
              type: 'FESTIVAL',
              region: festival.regionName || 'Multiple Regions',
              category: 'Traditional Wear',
              reason: `${festival.name} festival approaching with high fashion relevance`,
              recommendedAction: `Prepare a ${festival.name}-focused product collection`,
              festival: festival.name,
              festivalDate: festival.date,
              createdAt: new Date().toISOString(),
            });
          }
        });
      }

      setOpportunities(generatedOpportunities);
    } catch (err) {
      console.error('Failed to generate opportunities from intelligence:', err);
    }
  };

  const handleAiQuery = async () => {
    if (!aiQuery.trim()) return;

    setAiLoading(true);
    setAiResponse(null);

    try {
      // In a real implementation, this would call an AI service
      // For now, we'll generate contextual responses based on available data
      const response = await generateAiResponse(aiQuery);
      setAiResponse(response);
    } catch (err) {
      setAiResponse('I apologize, but I encountered an error processing your request.');
    } finally {
      setAiLoading(false);
    }
  };

  const generateAiResponse = async (query: string) => {
    const lowerQuery = query.toLowerCase();

    // Generate responses based on seller profile and available data
    if (lowerQuery.includes('what should i sell') || lowerQuery.includes('recommend')) {
      if (sellerProfile?.categories && sellerProfile.categories.length > 0) {
        return `Based on your current categories (${sellerProfile.categories.join(', ')}), I recommend expanding into related products. For example, if you sell sarees, consider adding matching blouses or traditional jewelry to create complete collections.`;
      } else {
        return `I recommend starting with traditional textiles from your region. Based on market data, handloom sarees and traditional wear have strong demand across multiple regions.`;
      }
    }

    if (lowerQuery.includes('region') || lowerQuery.includes('target')) {
      if (sellerProfile?.location) {
        return `Based on your location (${sellerProfile.location}), I recommend targeting nearby regions first. Start with your immediate geographical area and expand to neighboring states as you grow your catalog.`;
      } else {
        return `I recommend focusing on your home region first, then expanding to regions with high demand for your product categories. Regional intelligence data shows strong demand in traditional textile hubs.`;
      }
    }

    if (lowerQuery.includes('festival') || lowerQuery.includes('upcoming')) {
      return `Based on festival calendar data, I recommend preparing for major regional festivals. Each festival has specific traditional wear requirements - plan your inventory 2-3 months in advance for best results.`;
    }

    if (lowerQuery.includes('demand') || lowerQuery.includes('growing')) {
      if (opportunities.length > 0) {
        const demandOpps = opportunities.filter(o => o.type === 'DEMAND');
        if (demandOpps.length > 0) {
          return `Based on current demand signals, ${demandOpps[0].category} shows strong growth potential. The demand score is ${demandOpps[0].demandScore}, indicating increasing market interest.`;
        }
      }
      return `I recommend monitoring demand signals in your product categories. Regional intelligence data shows seasonal patterns that can help you plan inventory effectively.`;
    }

    return `Based on your seller profile and current marketplace data, I recommend focusing on product quality and regional authenticity. The VendSway intelligence system shows strong demand for genuine traditional products with clear regional provenance.`;
  };

  const getOpportunityIcon = (type: string) => {
    switch (type) {
      case 'DEMAND': return TrendingUp;
      case 'CATALOG_GAP': return Package;
      case 'FESTIVAL': return Calendar;
      default: return Sparkles;
    }
  };

  const getOpportunityColor = (type: string) => {
    switch (type) {
      case 'DEMAND': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'CATALOG_GAP': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'FESTIVAL': return 'bg-purple-50 text-purple-700 border-purple-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const handleAction = (opportunity: Opportunity) => {
    if (opportunity.recommendedAction.toLowerCase().includes('add') || 
        opportunity.recommendedAction.toLowerCase().includes('product')) {
      // Navigate to products with pre-filled category
      navigate('/seller/products');
    } else if (opportunity.recommendedAction.toLowerCase().includes('region')) {
      // Navigate to regional intelligence
      navigate('/admin/regional-intelligence-new');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#8B7AB8]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-[#2D2A26] mb-2">Regional Opportunities</h1>
          <p className="text-[#6B6660]">Growth opportunities tailored to your business</p>
        </div>
        <button
          onClick={() => setShowAiAssistant(!showAiAssistant)}
          className="flex items-center gap-2 px-4 py-2 bg-[#8B7AB8] text-white rounded-lg hover:bg-[#7A69A7] transition-all font-medium"
        >
          <Sparkles className="w-4 h-4" />
          AI Growth Assistant
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 mt-0.5" />
            <p className="text-sm text-rose-600">{error}</p>
          </div>
        </div>
      )}

      {/* AI Assistant */}
      {showAiAssistant && (
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[#2D2A26] mb-4">AI Growth Assistant</h3>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {['What should I sell?', 'Which region should I target?', 'What should I prepare for upcoming festivals?', 'Which of my products have growing demand?'].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => setAiQuery(suggestion)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-sm hover:bg-slate-200 transition-all"
                >
                  {suggestion}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                placeholder="Ask for personalized recommendations..."
                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B7AB8]"
                onKeyPress={(e) => e.key === 'Enter' && handleAiQuery()}
              />
              <button
                onClick={handleAiQuery}
                disabled={aiLoading || !aiQuery.trim()}
                className="px-4 py-2 bg-[#8B7AB8] text-white rounded-lg hover:bg-[#7A69A7] transition-all disabled:opacity-50"
              >
                {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
            {aiResponse && (
              <div className="p-4 bg-[#E8E3F5] border border-[#8B7AB8] rounded-lg">
                <p className="text-sm text-[#2D2A26]">{aiResponse}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Opportunities List */}
      <div className="space-y-4">
        {opportunities.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-lg p-12 text-center">
            <TrendingUp className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-semibold text-[#2D2A26] mb-2">No opportunities detected yet</h3>
            <p className="text-[#6B6660]">
              {sellerProfile?.categories && sellerProfile.categories.length > 0
                ? 'We\'re analyzing market data for your categories. Check back soon for personalized opportunities.'
                : 'Add products to your catalog to receive personalized growth opportunities.'}
            </p>
          </div>
        ) : (
          opportunities.map((opportunity) => {
            const Icon = getOpportunityIcon(opportunity.type);
            return (
              <div key={opportunity.id} className="bg-white border border-slate-200 rounded-lg p-6 hover:border-[#8B7AB8] transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`p-3 rounded-lg ${getOpportunityColor(opportunity.type)}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-[#2D2A26]">{opportunity.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getOpportunityColor(opportunity.type)}`}>
                          {opportunity.type.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-[#6B6660] mb-3">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {opportunity.region}
                        </div>
                        <div className="flex items-center gap-1">
                          <Package className="w-4 h-4" />
                          {opportunity.category}
                        </div>
                        {opportunity.festival && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {opportunity.festival}
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-[#2D2A26] mb-2">{opportunity.reason}</p>
                      <p className="text-sm text-[#8B7AB8] font-medium">{opportunity.recommendedAction}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAction(opportunity)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#8B7AB8] text-white rounded-lg hover:bg-[#7A69A7] transition-all text-sm font-medium"
                  >
                    {opportunity.recommendedAction.includes('Add') ? 'Add Product' : 'View Details'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Opportunities;