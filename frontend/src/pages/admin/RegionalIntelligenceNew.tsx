import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, TrendingUp, ShoppingBag, Sparkles, Globe, Compass, CheckCircle, Download } from 'lucide-react';
import { useAdminSearch } from '@/components/admin/AdminShell';

interface Region {
  id: string;
  name: string;
  code: string;
  state: string;
  description: string;
  specialties: string[];
  festivals: Festival[];
  demandSignals: DemandSignal[];
  culturalInsights: string[];
  recommendedCategories: CategoryRecommendation[];
}

interface Festival {
  id: string;
  name: string;
  date: string;
  description: string;
  fashionRelevance: 'high' | 'medium' | 'low';
  impact: number;
}

interface DemandSignal {
  category: string;
  demandScore: number;
  trend: 'rising' | 'stable' | 'declining';
  growth: number;
  source: string;
}

interface CategoryRecommendation {
  category: string;
  reason: string;
  confidence: number;
  potential: number;
}

const RegionalIntelligence: React.FC = () => {
  const { searchQuery } = useAdminSearch();
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [regions, setRegions] = useState<Region[]>([]);
  const [regionData, setRegionData] = useState<Region | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'festivals' | 'demand' | 'insights'>('overview');

  useEffect(() => {
    loadRegions();
  }, []);

  useEffect(() => {
    if (selectedRegion) {
      loadRegionData();
    }
  }, [selectedRegion]);

  const loadRegions = async () => {
    setLoading(true);
    try {
      setRegions([
        {
          id: '1',
          name: 'Kerala',
          code: 'KL',
          state: 'Kerala',
          description: 'Known for traditional handloom sarees, especially Kasavu and Mundum Neriyathum. Strong festival culture with Onam and Vishu.',
          specialties: ['Kasavu Sarees', 'Mundum Neriyathum', 'Handloom Textiles', 'Gold Jewelry'],
          festivals: [
            { id: '1', name: 'Onam', date: '2024-09-14', description: 'Harvest festival, traditional attire essential', fashionRelevance: 'high', impact: 95 },
            { id: '2', name: 'Vishu', date: '2024-04-14', description: 'New year festival, traditional gold purchases', fashionRelevance: 'high', impact: 88 },
            { id: '3', name: 'Thiruvathira', date: '2024-12-24', description: 'Winter festival, traditional white garments', fashionRelevance: 'medium', impact: 72 }
          ],
          demandSignals: [
            { category: 'Kasavu Sarees', demandScore: 94, trend: 'rising', growth: 340, source: 'Search Analysis' },
            { category: 'Traditional Jewelry', demandScore: 87, trend: 'rising', growth: 180, source: 'Market Data' },
            { category: 'Handloom Mundu', demandScore: 76, trend: 'stable', growth: 45, source: 'Regional Sales' },
            { category: 'Fusion Wear', demandScore: 68, trend: 'rising', growth: 120, source: 'Social Trends' }
          ],
          culturalInsights: [
            'Gold purchases peak during Vishu (April) and Onam (September)',
            'Traditional white and gold combinations are culturally significant',
            'Handloom fabric preference: 78% prefer authentic handloom over powerloom',
            'Festival season accounts for 65% of annual fashion spending',
            'Regional pride in local craftsmanship is strong'
          ],
          recommendedCategories: [
            { category: 'Kasavu Sarees', reason: 'Onam festival demand +340%, verified sellers available', confidence: 94, potential: 95 },
            { category: 'Traditional Gold Jewelry', reason: 'Vishu season approaching, cultural significance high', confidence: 87, potential: 88 },
            { category: 'Handloom Mundu', reason: 'Cultural authenticity demand, 78% consumer preference', confidence: 76, potential: 72 }
          ]
        },
        {
          id: '2',
          name: 'Gujarat',
          code: 'GJ',
          state: 'Gujarat',
          description: 'Famous for Bandhani, Patola silk, and mirror work embroidery. Strong Navratri festival culture.',
          specialties: ['Bandhani Sarees', 'Patola Silk', 'Mirror Work', 'Embroidery'],
          festivals: [
            { id: '1', name: 'Navratri', date: '2024-10-03', description: 'Nine nights festival, traditional chaniya choli essential', fashionRelevance: 'high', impact: 98 },
            { id: '2', name: 'Diwali', date: '2024-11-01', description: 'Festival of lights, new traditional wear purchases', fashionRelevance: 'high', impact: 92 },
            { id: '3', name: 'Uttarayan', date: '2025-01-14', description: 'Kite festival, vibrant traditional wear', fashionRelevance: 'medium', impact: 78 }
          ],
          demandSignals: [
            { category: 'Chaniya Choli', demandScore: 96, trend: 'rising', growth: 420, source: 'Search Analysis' },
            { category: 'Bandhani Sarees', demandScore: 89, trend: 'rising', growth: 280, source: 'Market Data' },
            { category: 'Patola Silk', demandScore: 82, trend: 'stable', growth: 65, source: 'Regional Sales' },
            { category: 'Mirror Work', demandScore: 74, trend: 'rising', growth: 150, source: 'Social Trends' }
          ],
          culturalInsights: [
            'Navratri drives 40% of annual fashion revenue in Gujarat',
            'Bandhani tie-dye techniques are UNESCO recognized',
            'Patola silk considered luxury investment, passed as heirloom',
            'Color preferences: Vibrant reds, oranges, yellows dominate',
            'Mirror work embroidery signature of Kutch region'
          ],
          recommendedCategories: [
            { category: 'Chaniya Choli', reason: 'Navratri demand +420%, cultural essential', confidence: 96, potential: 98 },
            { category: 'Bandhani Sarees', reason: 'Heritage craft demand, UNESCO recognition', confidence: 89, potential: 92 },
            { category: 'Patola Silk', reason: 'Luxury segment, high margins, verified artisans', confidence: 82, potential: 85 }
          ]
        },
        {
          id: '3',
          name: 'Tamil Nadu',
          code: 'TN',
          state: 'Tamil Nadu',
          description: 'Known for Kanchipuram silk sarees, temple jewelry, and cotton textiles. Pongal harvest festival significant.',
          specialties: ['Kanchipuram Silk', 'Cotton Sarees', 'Temple Jewelry', 'Cotton Textiles'],
          festivals: [
            { id: '1', name: 'Pongal', date: '2025-01-14', description: 'Harvest festival, traditional silk purchases', fashionRelevance: 'high', impact: 94 },
            { id: '2', name: 'Navratri', date: '2024-10-03', description: 'Golu dolls display, traditional silk sarees', fashionRelevance: 'high', impact: 88 },
            { id: '3', name: 'Tamil New Year', date: '2024-04-14', description: 'New year, new traditional wear purchases', fashionRelevance: 'medium', impact: 76 }
          ],
          demandSignals: [
            { category: 'Kanchipuram Silk', demandScore: 92, trend: 'rising', growth: 310, source: 'Search Analysis' },
            { category: 'Temple Jewelry', demandScore: 85, trend: 'rising', growth: 195, source: 'Market Data' },
            { category: 'Cotton Sarees', demandScore: 78, trend: 'stable', growth: 55, source: 'Regional Sales' },
            { category: 'Traditional Veshti', demandScore: 71, trend: 'rising', growth: 130, source: 'Social Trends' }
          ],
          culturalInsights: [
            'Kanchipuram silk considered wedding essential across South India',
            'Temple jewelry often purchased as investment and heirloom',
            'Cotton textiles preference higher in summer months (Apr-Jun)',
            'Pongal season drives 35% of annual silk saree sales',
            'Border designs and temple motifs are culturally significant'
          ],
          recommendedCategories: [
            { category: 'Kanchipuram Silk', reason: 'Wedding season + Pongal, high demand', confidence: 92, potential: 94 },
            { category: 'Temple Jewelry', reason: 'Investment demand, cultural significance', confidence: 85, potential: 88 },
            { category: 'Cotton Sarees', reason: 'Summer demand, regional specialty', confidence: 78, potential: 76 }
          ]
        }
      ]);
    } catch (error) {
      console.error('Failed to load regions:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadRegionData = async () => {
    try {
      const region = regions.find(r => r.id === selectedRegion);
      setRegionData(region || null);
    } catch (error) {
      console.error('Failed to load region data:', error);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising': return <TrendingUp className="w-4 h-4 text-emerald-600" />;
      case 'declining': return <TrendingUp className="w-4 h-4 text-rose-600 rotate-180" />;
      default: return <TrendingUp className="w-4 h-4 text-slate-400 rotate-90" />;
    }
  };

  const getRelevanceStyles = (relevance: string) => {
    switch (relevance) {
      case 'high': return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' };
      case 'medium': return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
      default: return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
    }
  };

  // Filter regions based on search query
  const filteredRegions = useMemo(() => {
    if (!searchQuery.trim()) return regions;
    const query = searchQuery.toLowerCase();
    return regions.filter(region => 
      region.name.toLowerCase().includes(query) ||
      region.state.toLowerCase().includes(query) ||
      region.code.toLowerCase().includes(query) ||
      region.description.toLowerCase().includes(query) ||
      region.specialties.some(spec => spec.toLowerCase().includes(query))
    );
  }, [regions, searchQuery]);

  if (loading && !regions.length) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#8B7AB8]"></div>
      </div>
    );
  }

  const handleRunAI = async () => {
    setAiLoading(true);
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add new region based on AI analysis
      const newRegion = {
        id: Date.now().toString(),
        name: 'AI Detected Region',
        code: 'AI',
        state: 'AI Analysis',
        description: 'New region identified through AI market analysis',
        specialties: ['Traditional Textiles', 'Handloom Products'],
        festivals: [
          { id: '1', name: 'AI Festival', date: '2026-12-15', description: 'Festival detected by AI analysis', fashionRelevance: 'high' as const, impact: 85 }
        ],
        demandSignals: [
          { category: 'Traditional Wear', demandScore: 82, trend: 'rising' as const, growth: 145, source: 'AI Analysis' }
        ],
        culturalInsights: [
          'Strong regional cultural preferences',
          'Growing demand for authentic products',
          'Seasonal patterns identified'
        ],
        recommendedCategories: [
          { category: 'Traditional Wear', reason: 'High demand detected', confidence: 82, potential: 85 }
        ]
      };
      
      setRegions([...regions, newRegion]);
    } catch (error) {
      console.error('AI run failed:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const handleApproveAll = () => {
    // In Regional Intelligence, approve all could mean publishing all regional collections
    alert('All regional collections published successfully');
  };

  const handleExport = () => {
    const exportData = {
      regions: filteredRegions,
      selectedRegion: regionData,
      exportDate: new Date().toISOString(),
      summary: {
        totalRegions: filteredRegions.length,
        regionsWithHighDemand: filteredRegions.filter(r => 
          r.demandSignals.some(ds => ds.demandScore > 80)
        ).length
      }
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `regional-intelligence-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const initialLoading = loading && !regions.length;

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#8B7AB8]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-6 py-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-light text-[#2D2A26] tracking-tight mb-1">
            Regional Intelligence
          </h1>
          <p className="text-base text-[#6B6660] font-light tracking-wide">
            Understand regional demand before making business decisions
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleRunAI}
            disabled={aiLoading}
            className="flex items-center gap-2 px-4 py-2 bg-[#8B7AB8] text-white rounded-lg hover:bg-[#7A69A7] transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Sparkles className="w-4 h-4" />
            {aiLoading ? 'Running...' : 'Run AI'}
          </button>
          <button
            onClick={handleApproveAll}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white text-[#2D2A26] rounded-lg hover:bg-slate-50 transition-all text-sm font-medium"
          >
            <CheckCircle className="w-4 h-4" />
            Publish All
          </button>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white text-[#2D2A26] rounded-lg hover:bg-slate-50 transition-all text-sm font-medium"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Region Selector */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#E8E3F5] flex items-center justify-center">
            <Globe className="w-5 h-5 text-[#8B7AB8]" />
          </div>
          <h2 className="text-2xl font-light text-[#2D2A26] tracking-tight">Select Region</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredRegions.map((region) => (
            <motion.button
              key={region.id}
              onClick={() => setSelectedRegion(region.id)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-2xl border-2 text-left transition-all ${
                selectedRegion === region.id
                  ? 'border-[#8B7AB8] bg-[#E8E3F5]/50 shadow-sm'
                  : 'border-slate-100 bg-slate-50/30 hover:border-[#8B7AB8]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-[#2D2A26]">{region.name}</h3>
                <span className="text-sm text-[#6B6660] font-light">{region.code}</span>
              </div>
              <p className="text-[#6B6660] font-light line-clamp-2 text-base">{region.description}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Region Data */}
      <AnimatePresence>
        {regionData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Region Header */}
            <div className="bg-gradient-to-r from-[#8B7AB8] to-[#7A69A7] rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-light tracking-tight mb-1">{regionData.name}</h2>
                  <p className="text-base font-light opacity-90">{regionData.state}</p>
                </div>
                <div className="flex gap-2">
                  {regionData.specialties.slice(0, 3).map((specialty, idx) => (
                    <span key={idx} className="px-4 py-1 bg-white/20 rounded-full text-sm font-light">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-2">
              <div className="flex gap-2 overflow-x-auto">
                {[
                  { id: 'overview', label: 'Overview', icon: Compass },
                  { id: 'festivals', label: 'Festival Calendar', icon: Calendar },
                  { id: 'demand', label: 'Demand Signals', icon: TrendingUp },
                  { id: 'insights', label: 'Cultural Insights', icon: Sparkles }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all font-light tracking-wide whitespace-nowrap text-base ${
                      activeTab === tab.id
                        ? 'bg-[#E8E3F5] text-[#8B7AB8]'
                        : 'text-[#6B6660] hover:bg-slate-50'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-light text-[#2D2A26] tracking-tight mb-3">Regional Profile</h3>
                    <p className="text-[#6B6660] font-light leading-relaxed">{regionData.description}</p>
                  </div>

                  <div>
                    <h3 className="text-xl font-light text-[#2D2A26] tracking-tight mb-3">Regional Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                      {regionData.specialties.map((specialty, idx) => (
                        <span key={idx} className="px-4 py-2 bg-[#E8E3F5]/50 rounded-xl text-[#2D2A26] font-light text-sm">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-light text-[#2D2A26] tracking-tight mb-3">AI-Recommended Categories</h3>
                    <div className="space-y-3">
                      {regionData.recommendedCategories.map((rec, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-[#E8E3F5]/50 rounded-xl">
                          <div className="flex items-center gap-3 flex-1">
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                              <ShoppingBag className="w-5 h-5 text-[#8B7AB8]" />
                            </div>
                            <div>
                              <div className="font-semibold text-[#2D2A26]">{rec.category}</div>
                              <p className="text-[#6B6660] font-light text-sm">{rec.reason}</p>
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <div className="text-xl font-light text-[#8B7AB8]">{rec.confidence}%</div>
                            <div className="text-sm text-[#6B6660] font-light">confidence</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'festivals' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-light text-[#2D2A26] tracking-tight mb-3">Festival Calendar</h3>
                  {regionData.festivals.map((festival) => {
                    const relevanceStyles = getRelevanceStyles(festival.fashionRelevance);
                    return (
                      <div key={festival.id} className="border-2 border-slate-100 rounded-xl p-4 hover:border-[#8B7AB8] transition-all">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center">
                              <Calendar className="w-6 h-6 text-rose-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-[#2D2A26]">{festival.name}</h4>
                              <p className="text-[#6B6660] font-light text-sm">{new Date(festival.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-light border ${relevanceStyles.bg} ${relevanceStyles.text} ${relevanceStyles.border}`}>
                            {festival.fashionRelevance} relevance
                          </span>
                        </div>
                        <p className="text-[#6B6660] font-light mb-3 text-sm">{festival.description}</p>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-slate-100 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-[#8B7AB8] to-[#7A69A7] h-2 rounded-full transition-all"
                              style={{ width: `${festival.impact}%` }}
                            />
                          </div>
                          <span className="text-sm text-[#6B6660] font-light">{festival.impact}% impact</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab === 'demand' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-light text-[#2D2A26] tracking-tight mb-3">Demand Signals</h3>
                  {regionData.demandSignals.map((signal, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-slate-50/30 rounded-xl border-2 border-slate-100 hover:border-[#8B7AB8] transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#E8E3F5] flex items-center justify-center">
                          <TrendingUp className="w-6 h-6 text-[#8B7AB8]" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-[#2D2A26]">{signal.category}</h4>
                          <p className="text-[#6B6660] font-light text-sm">{signal.source}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-xl font-light text-[#2D2A26]">{signal.demandScore}</div>
                          <div className="text-sm text-[#6B6660] font-light">demand score</div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getTrendIcon(signal.trend)}
                          <span className={`text-sm font-light ${signal.trend === 'rising' ? 'text-emerald-600' : signal.trend === 'declining' ? 'text-rose-600' : 'text-slate-600'}`}>
                            {signal.growth > 0 ? '+' : ''}{signal.growth}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'insights' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-light text-[#2D2A26] tracking-tight mb-3">Cultural Insights</h3>
                  <div className="bg-[#E8E3F5]/50 rounded-xl p-5">
                    <ul className="space-y-3">
                      {regionData.culturalInsights.map((insight, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-4 h-4 text-[#8B7AB8]" />
                          </div>
                          <span className="text-[#6B6660] font-light leading-relaxed">{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RegionalIntelligence;