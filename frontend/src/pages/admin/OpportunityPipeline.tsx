import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle, Clock, AlertCircle, TrendingUp, Package, MapPin, Eye, Sparkles, Filter, Target, Zap, Download } from 'lucide-react';
import { useAdminSearch } from '@/components/admin/AdminShell';

type PipelineStage = 'detected' | 'validated' | 'seller_matched' | 'admin_review' | 'published';

interface Opportunity {
  id: string;
  title: string;
  category: string;
  region: string;
  stage: PipelineStage;
  demandScore: number;
  confidence: number;
  estimatedRevenue: number;
  createdAt: string;
  updatedAt: string;
  reason: string;
  sellerMatch?: {
    id: string;
    name: string;
    verificationScore: number;
    location: string;
  };
  aiReasoning: string[];
  priority: 'high' | 'medium' | 'low';
}

const OpportunityPipeline: React.FC = () => {
  const { searchQuery } = useAdminSearch();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [selectedStage, setSelectedStage] = useState<PipelineStage | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);

  useEffect(() => {
    loadOpportunities();
  }, []);

  const loadOpportunities = async () => {
    setLoading(true);
    try {
      setOpportunities([
        {
          id: '1',
          title: 'Kalamkari Sarees Collection',
          category: 'Sarees',
          region: 'Andhra Pradesh',
          stage: 'admin_review',
          demandScore: 94,
          confidence: 87,
          estimatedRevenue: 240000,
          createdAt: '2024-08-01',
          updatedAt: '2024-08-03',
          reason: 'High festival demand, verified sellers available',
          sellerMatch: {
            id: 's1',
            name: 'R.K. Textiles',
            verificationScore: 92,
            location: 'Hyderabad'
          },
          aiReasoning: [
            'Demand signal: 94% score in Andhra Pradesh',
            'Festival demand: Diwali season approaching (+340%)',
            'Seller match: R.K. Textiles (92% verification)',
            'Catalog gap: Zero current Kalamkari listings',
            'Regional authenticity: GI certification confirmed'
          ],
          priority: 'high'
        },
        {
          id: '2',
          title: 'Banarasi Silk Expansion',
          category: 'Sarees',
          region: 'Uttar Pradesh',
          stage: 'seller_matched',
          demandScore: 88,
          confidence: 82,
          estimatedRevenue: 180000,
          createdAt: '2024-07-28',
          updatedAt: '2024-08-02',
          reason: 'Regional demand increasing, premium segment',
          sellerMatch: {
            id: 's2',
            name: 'Banarasi Weavers Co.',
            verificationScore: 88,
            location: 'Varanasi'
          },
          aiReasoning: [
            'Demand signal: 88% score in Uttar Pradesh',
            'Wedding season demand: +280% expected',
            'Seller match: Banarasi Weavers Co. (88% verification)',
            'Premium segment: High margin potential',
            'Brand heritage: UNESCO recognition value'
          ],
          priority: 'high'
        },
        {
          id: '3',
          title: 'Chanderi Fusion Wear',
          category: 'Fusion Wear',
          region: 'Madhya Pradesh',
          stage: 'validated',
          demandScore: 76,
          confidence: 78,
          estimatedRevenue: 120000,
          createdAt: '2024-07-25',
          updatedAt: '2024-08-01',
          reason: 'Growing demand for traditional-modern fusion',
          aiReasoning: [
            'Demand signal: 76% score in Madhya Pradesh',
            'Fusion trend: +150% in urban markets',
            'Market gap: Limited fusion options available',
            'Youth appeal: 67% prefer modern traditional',
            'Production capacity: Verified with 3 sellers'
          ],
          priority: 'medium'
        },
        {
          id: '4',
          title: 'Patola Silk Launch',
          category: 'Sarees',
          region: 'Gujarat',
          stage: 'detected',
          demandScore: 82,
          confidence: 75,
          estimatedRevenue: 150000,
          createdAt: '2024-08-03',
          updatedAt: '2024-08-03',
          reason: 'Navratri festival demand identified',
          aiReasoning: [
            'Demand signal: 82% score in Gujarat',
            'Navratri demand: +420% forecast',
            'Cultural significance: Essential festival wear',
            'Scarcity value: Limited verified artisans',
            'Price premium: Luxury segment positioning'
          ],
          priority: 'high'
        },
        {
          id: '5',
          title: 'Kasavu Mundum Neriyathum',
          category: 'Traditional Wear',
          region: 'Kerala',
          stage: 'published',
          demandScore: 96,
          confidence: 94,
          estimatedRevenue: 280000,
          createdAt: '2024-07-20',
          updatedAt: '2024-08-01',
          reason: 'Onam festival collection successfully launched',
          sellerMatch: {
            id: 's3',
            name: 'Kerala Handloom Guild',
            verificationScore: 95,
            location: 'Kochi'
          },
          aiReasoning: [
            'Demand signal: 96% score in Kerala',
            'Onam demand: +340% achieved',
            'Seller match: Kerala Handloom Guild (95% verification)',
            'Catalog filled: 45 products listed',
            'Performance: 89% sell-through rate'
          ],
          priority: 'high'
        },
        {
          id: '6',
          title: 'Phulkari Dupatta Collection',
          category: 'Dupattas',
          region: 'Punjab',
          stage: 'validated',
          demandScore: 71,
          confidence: 68,
          estimatedRevenue: 95000,
          createdAt: '2024-07-30',
          updatedAt: '2024-08-02',
          reason: 'Regional specialty with growing national demand',
          aiReasoning: [
            'Demand signal: 71% score in Punjab',
            'National trend: +180% cross-region interest',
            'Cultural export: Pan-Indian appeal',
            'Production scale: 5 verified sellers',
            'Price point: Mid-range affordability'
          ],
          priority: 'medium'
        }
      ]);
    } catch (error) {
      console.error('Failed to load opportunities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStageTransition = (opportunityId: string, newStage: PipelineStage) => {
    setOpportunities(opportunities.map(op => 
      op.id === opportunityId 
        ? { ...op, stage: newStage, updatedAt: new Date().toISOString().split('T')[0] }
        : op
    ));
  };

  const getStageStyles = (stage: PipelineStage) => {
    switch (stage) {
      case 'detected': return { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200', icon: AlertCircle };
      case 'validated': return { bg: 'bg-[#E8E3F5]', text: 'text-[#8B7AB8]', border: 'border-[#8B7AB8]', icon: CheckCircle };
      case 'seller_matched': return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: CheckCircle };
      case 'admin_review': return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', icon: Eye };
      case 'published': return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle };
      default: return { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', icon: Clock };
    }
  };

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'high': return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' };
      case 'medium': return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
      case 'low': return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
      default: return { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' };
    }
  };

  const stages: { id: PipelineStage; label: string; count: number }[] = [
    { id: 'detected', label: 'Detected', count: opportunities.filter(o => o.stage === 'detected').length },
    { id: 'validated', label: 'Validated', count: opportunities.filter(o => o.stage === 'validated').length },
    { id: 'seller_matched', label: 'Seller Matched', count: opportunities.filter(o => o.stage === 'seller_matched').length },
    { id: 'admin_review', label: 'Admin Review', count: opportunities.filter(o => o.stage === 'admin_review').length },
    { id: 'published', label: 'Published', count: opportunities.filter(o => o.stage === 'published').length }
  ];

  const filteredOpportunities = useMemo(() => {
    let filtered = selectedStage === 'all' 
      ? opportunities 
      : opportunities.filter(o => o.stage === selectedStage);
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(opportunity => 
        opportunity.title.toLowerCase().includes(query) ||
        opportunity.category.toLowerCase().includes(query) ||
        opportunity.region.toLowerCase().includes(query) ||
        opportunity.reason.toLowerCase().includes(query) ||
        opportunity.aiReasoning.some(reason => reason.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  }, [opportunities, selectedStage, searchQuery]);

  if (loading) {
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
      
      // Add new opportunity based on AI analysis
      const newOpportunity = {
        id: Date.now().toString(),
        title: 'AI-Generated Opportunity',
        category: 'Traditional Textiles',
        region: 'AI Analysis Region',
        stage: 'detected' as PipelineStage,
        demandScore: 88,
        confidence: 85,
        estimatedRevenue: 150000,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        reason: 'High market demand detected through AI analysis',
        aiReasoning: [
          'Market demand analysis completed',
          'Regional patterns identified',
          'Competitor gap detected',
          'Revenue potential calculated'
        ],
        priority: 'high' as const
      };
      
      setOpportunities([...opportunities, newOpportunity]);
    } catch (error) {
      console.error('AI run failed:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const handleApproveAll = () => {
    // Move all detected opportunities to published
    setOpportunities(opportunities.map(op => 
      op.stage === 'detected' ? { ...op, stage: 'published' as PipelineStage } : op
    ));
  };

  const handleExport = () => {
    const exportData = {
      opportunities: filteredOpportunities,
      selectedStage,
      exportDate: new Date().toISOString(),
      summary: {
        totalOpportunities: filteredOpportunities.length,
        publishedOpportunities: filteredOpportunities.filter(o => o.stage === 'published').length,
        totalEstimatedRevenue: filteredOpportunities.reduce((sum, o) => sum + o.estimatedRevenue, 0)
      }
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `opportunity-pipeline-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
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
            Opportunity Pipeline
          </h1>
          <p className="text-[#6B6660] font-light tracking-wide">
            Track opportunities from detection to publication
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[#6B6660] font-light">
            <TrendingUp className="w-4 h-4" />
            <span>{opportunities.filter(o => o.stage === 'published').length} published this month</span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleRunAI}
              disabled={aiLoading}
              className="flex items-center gap-2 px-4 py-2 bg-[#8B7AB8] text-white rounded-lg hover:bg-[#7A69A7] transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Target className="w-4 h-4" />
              {aiLoading ? 'Running...' : 'Run AI'}
            </button>
            <button
              onClick={handleApproveAll}
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white text-[#2D2A26] rounded-lg hover:bg-slate-50 transition-all text-sm font-medium"
            >
              <CheckCircle className="w-4 h-4" />
              Approve All
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
      </div>

      {/* Pipeline Stages */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E8E3F5] flex items-center justify-center">
              <Filter className="w-5 h-5 text-[#8B7AB8]" />
            </div>
            <h2 className="text-xl font-light text-[#2D2A26] tracking-tight">Pipeline Stages</h2>
          </div>
          <button
            onClick={() => setSelectedStage('all')}
            className={`px-4 py-2 rounded-xl text-base font-light transition-all ${
              selectedStage === 'all' 
                ? 'bg-[#8B7AB8] text-white' 
                : 'bg-slate-100 text-[#6B6660] hover:bg-slate-200'
            }`}
          >
            All ({opportunities.length})
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {stages.map((stage, idx) => {
            const stageStyles = getStageStyles(stage.id);
            const StageIcon = stageStyles.icon;
            return (
              <div key={stage.id} className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => setSelectedStage(stage.id)}
                  className={`px-4 py-3 rounded-xl border-2 text-left transition-all min-w-[140px] ${
                    selectedStage === stage.id 
                      ? 'border-[#8B7AB8] bg-[#E8E3F5]/50 shadow-sm' 
                      : 'border-slate-100 bg-slate-50/30 hover:border-[#8B7AB8]'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 rounded-lg bg-white flex items-center justify-center">
                      <StageIcon className="w-3 h-3 text-[#8B7AB8]" />
                    </div>
                    <span className="font-semibold text-[#2D2A26] text-base">{stage.label}</span>
                  </div>
                  <div className="text-2xl font-light text-[#8B7AB8]">{stage.count}</div>
                </button>
                {idx < stages.length - 1 && <ArrowRight className="w-4 h-4 text-slate-300 flex-shrink-0" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* Opportunities List */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-light text-[#2D2A26] tracking-tight">
            {selectedStage === 'all' ? 'All Opportunities' : stages.find(s => s.id === selectedStage)?.label}
          </h2>
          <span className="text-base text-[#6B6660] font-light">
            {filteredOpportunities.length} opportunities
          </span>
        </div>

        <div className="space-y-4">
          {filteredOpportunities.map((opportunity) => {
            const stageStyles = getStageStyles(opportunity.stage);
            const priorityStyles = getPriorityStyles(opportunity.priority);
            return (
              <motion.div
                key={opportunity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-2 border-slate-100 rounded-xl p-5 hover:border-[#8B7AB8] transition-all cursor-pointer"
                onClick={() => setSelectedOpportunity(opportunity)}
              >
                <div className="flex items-start justify-between gap-5">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-[#E8E3F5] flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6 text-[#8B7AB8]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-[#2D2A26]">{opportunity.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-base font-light border ${stageStyles.bg} ${stageStyles.text} ${stageStyles.border}`}>
                          {opportunity.stage.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-base font-light ${priorityStyles.bg} ${priorityStyles.text} ${priorityStyles.border}`}>
                          {opportunity.priority}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-[#6B6660] font-light mb-3 text-base">
                        <span className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {opportunity.region}
                        </span>
                        <span className="flex items-center gap-2">
                          <Package className="w-4 h-4" />
                          {opportunity.category}
                        </span>
                        <span className="flex items-center gap-2">
                          <Target className="w-4 h-4" />
                          {opportunity.demandScore}% demand
                        </span>
                      </div>
                      <p className="text-[#6B6660] font-light text-base">{opportunity.reason}</p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="text-xl font-light text-[#2D2A26] mb-1">₹{(opportunity.estimatedRevenue / 1000).toFixed(0)}K</div>
                    <div className="text-base text-[#6B6660] font-light mb-1">est. revenue</div>
                    <div className="text-base font-light text-[#8B7AB8]">{opportunity.confidence}% conf.</div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Opportunity Detail Modal */}
      <AnimatePresence>
        {selectedOpportunity && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-6"
            onClick={() => setSelectedOpportunity(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-light text-[#2D2A26] tracking-tight mb-2">
                    {selectedOpportunity.title}
                  </h2>
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-2 rounded-full text-base font-light border ${getStageStyles(selectedOpportunity.stage).bg} ${getStageStyles(selectedOpportunity.stage).text} ${getStageStyles(selectedOpportunity.stage).border}`}>
                      {selectedOpportunity.stage.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="text-[#6B6660] font-light">
                      Updated {new Date(selectedOpportunity.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedOpportunity(null)}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-all"
                >
                  <AlertCircle className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-[#E8E3F5]/50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-light text-[#8B7AB8] mb-1">{selectedOpportunity.demandScore}%</div>
                  <div className="text-base text-[#6B6660] font-light">Demand Score</div>
                </div>
                <div className="bg-[#EDE9F7]/50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-light text-[#8B7AB8] mb-1">{selectedOpportunity.confidence}%</div>
                  <div className="text-base text-[#6B6660] font-light">Confidence</div>
                </div>
                <div className="bg-[#DFD9F0]/50 rounded-xl p-4 text-center">
                  <div className="text-2xl font-light text-[#8B7AB8] mb-1">₹{(selectedOpportunity.estimatedRevenue / 1000).toFixed(0)}K</div>
                  <div className="text-base text-[#6B6660] font-light">Est. Revenue</div>
                </div>
              </div>

              {/* AI Reasoning */}
              <div className="bg-[#E8E3F5]/50 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-[#8B7AB8]" />
                  </div>
                  <span className="text-base font-semibold text-[#8B7AB8] tracking-wide">AI REASONING</span>
                </div>
                <ul className="space-y-2">
                  {selectedOpportunity.aiReasoning.map((reason, idx) => (
                    <li key={idx} className="text-[#6B6660] font-light flex items-start gap-2 text-base">
                      <Zap className="w-4 h-4 text-[#8B7AB8] mt-0.5 flex-shrink-0" />
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Seller Match */}
              {selectedOpportunity.sellerMatch && (
                <div className="border-2 border-slate-100 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-[#E8E3F5] flex items-center justify-center">
                      <Package className="w-4 h-4 text-[#8B7AB8]" />
                    </div>
                    <span className="text-base font-semibold text-[#8B7AB8] tracking-wide">SELLER MATCH</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-[#2D2A26]">{selectedOpportunity.sellerMatch.name}</div>
                      <div className="text-[#6B6660] font-light text-base">{selectedOpportunity.sellerMatch.location}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-light text-[#8B7AB8]">{selectedOpportunity.sellerMatch.verificationScore}%</div>
                      <div className="text-base text-[#6B6660] font-light">verification</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                {selectedOpportunity.stage === 'detected' && (
                  <button
                    onClick={() => {
                      handleStageTransition(selectedOpportunity.id, 'validated');
                      setSelectedOpportunity(null);
                    }}
                    className="flex-1 py-3 bg-gradient-to-r from-[#8B7AB8] to-[#7A69A7] text-white font-light rounded-xl hover:shadow-md transition-all tracking-wide text-base"
                  >
                    Validate Opportunity
                  </button>
                )}
                {selectedOpportunity.stage === 'validated' && (
                  <button
                    onClick={() => {
                      handleStageTransition(selectedOpportunity.id, 'seller_matched');
                      setSelectedOpportunity(null);
                    }}
                    className="flex-1 py-3 bg-gradient-to-r from-[#8B7AB8] to-[#7A69A7] text-white font-light rounded-xl hover:shadow-md transition-all tracking-wide text-base"
                  >
                    Find Sellers
                  </button>
                )}
                {selectedOpportunity.stage === 'seller_matched' && (
                  <button
                    onClick={() => {
                      handleStageTransition(selectedOpportunity.id, 'admin_review');
                      setSelectedOpportunity(null);
                    }}
                    className="flex-1 py-3 bg-gradient-to-r from-[#8B7AB8] to-[#7A69A7] text-white font-light rounded-xl hover:shadow-md transition-all tracking-wide text-base"
                  >
                    Send to Review
                  </button>
                )}
                {selectedOpportunity.stage === 'admin_review' && (
                  <>
                    <button
                      onClick={() => {
                        handleStageTransition(selectedOpportunity.id, 'published');
                        setSelectedOpportunity(null);
                      }}
                      className="flex-1 py-3 bg-gradient-to-r from-[#8B7AB8] to-[#7A69A7] text-white font-light rounded-xl hover:shadow-md transition-all tracking-wide text-base"
                    >
                      Approve & Publish
                    </button>
                    <button
                      onClick={() => {
                        handleStageTransition(selectedOpportunity.id, 'validated');
                        setSelectedOpportunity(null);
                      }}
                      className="px-5 py-3 border-2 border-slate-200 text-[#6B6660] font-light rounded-xl hover:bg-slate-50 transition-all tracking-wide text-base"
                    >
                      Request Changes
                    </button>
                  </>
                )}
                {selectedOpportunity.stage === 'published' && (
                  <div className="flex-1 py-3 bg-emerald-50 text-emerald-700 font-light rounded-xl text-center tracking-wide text-base flex items-center justify-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Successfully Published
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OpportunityPipeline;