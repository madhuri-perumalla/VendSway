// ============================================================================
// REGIONAL COMMERCE INTELLIGENCE CENTER
// ============================================================================
// Enterprise AI-powered intelligence dashboard for regional demand analysis

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { regionalIntelligenceService } from '@/services';
import { Region, Festival, Textile, GIProduct, RegionalTrend } from '@/types/domain';
import IndiaMap from './IndiaMap';

const RegionalIntelligence = () => {
  const navigate = useNavigate();
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [textiles, setTextiles] = useState<Textile[]>([]);
  const [giProducts, setGiProducts] = useState<GIProduct[]>([]);
  const [trends, setTrends] = useState<RegionalTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [heatmapLayers, setHeatmapLayers] = useState({
    demand: true,
    festival: false,
    msme: false,
    catalogGap: false,
  });

  useEffect(() => {
    const loadRegions = async () => {
      setLoading(true);
      try {
        const response = await regionalIntelligenceService.getRegions();
        setRegions(response.data || []);
      } catch (error) {
        console.error('Failed to load regions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRegions();
  }, []);

  const handleRegionSelect = async (region: Region) => {
    setSelectedRegion(region);

    try {
      const [festivalsRes, textilesRes, giProductsRes, trendsRes] = await Promise.all([
        regionalIntelligenceService.getFestivalsByRegion(region.id),
        regionalIntelligenceService.getTextilesByRegion(region.id),
        regionalIntelligenceService.getGIProductsByRegion(region.id),
        regionalIntelligenceService.getRegionalTrendsByRegion(region.id),
      ]);

      setFestivals(festivalsRes.data || []);
      setTextiles(textilesRes.data || []);
      setGiProducts(giProductsRes.data || []);
      setTrends(trendsRes.data || []);
    } catch (error) {
      console.error('Failed to load region details:', error);
    }
  };

  // Calculate metrics
  const totalDemandSignals = regions.reduce((sum, r) => sum + ((r as any).demandScore || 0), 0);
  const hotspots = regions.filter(r => ((r as any).demandScore || 0) > 70).length;
  const upcomingFestivals = festivals.filter(f => new Date(f.date) > new Date()).length;
  const catalogOpportunity = selectedRegion ? Math.round(((selectedRegion as any).opportunityScore || 0) * 100) : 0;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-900 border-t-transparent" />
          <p className="mt-4 text-sm text-gray-600">Loading Intelligence...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-8 py-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Regional Intelligence</h1>
              <p className="mt-2 max-w-3xl text-sm font-medium text-gray-600 leading-relaxed">
                Understand regional demand, cultural signals, MSME ecosystem, and catalog opportunities before planning inventory.
              </p>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="font-medium text-gray-900">Live Intelligence</span>
              </div>
              <div className="text-gray-500">
                Last Updated: {new Date().toLocaleTimeString()}
              </div>
              <div className="rounded-lg bg-gray-100 px-3 py-1.5 font-medium text-gray-900">
                {regions.length} Active Regions
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Row - Professional Cards like other pages */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}
              className="rounded-xl border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-white p-5 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/50 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="rounded-lg bg-blue-100 p-2.5">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <span className="text-xs font-bold text-green-600">↑ 12%</span>
              </div>
              <p className="text-sm font-bold text-gray-500 mb-1">Regional Demand Signals</p>
              <p className="text-2xl font-bold text-blue-600 mb-1">{totalDemandSignals}</p>
              <p className="text-xs font-medium text-gray-500">Aggregated demand score</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="rounded-xl border-2 border-orange-100 bg-gradient-to-br from-orange-50 to-white p-5 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-100/50 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="rounded-lg bg-orange-100 p-2.5">
                  <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  </svg>
                </div>
                <span className="text-xs font-bold text-orange-600">⚡ Hot</span>
              </div>
              <p className="text-sm font-bold text-gray-500 mb-1">Today's Hotspots</p>
              <p className="text-2xl font-bold text-orange-600 mb-1">{hotspots}</p>
              <p className="text-xs font-medium text-gray-500">Regions with high demand</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="rounded-xl border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-white p-5 hover:border-purple-200 hover:shadow-lg hover:shadow-purple-100/50 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="rounded-lg bg-purple-100 p-2.5">
                  <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <p className="text-sm font-bold text-gray-500 mb-1">Upcoming Festivals</p>
              <p className="text-2xl font-bold text-purple-600 mb-1">{upcomingFestivals}</p>
              <p className="text-xs font-medium text-gray-500">Next 60 days</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="rounded-xl border-2 border-green-100 bg-gradient-to-br from-green-50 to-white p-5 hover:border-green-200 hover:shadow-lg hover:shadow-green-100/50 transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="rounded-lg bg-green-100 p-2.5">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className="text-xs font-bold text-green-600">✓ Ready</span>
              </div>
              <p className="text-sm font-bold text-gray-500 mb-1">Catalog Opportunity</p>
              <p className="text-2xl font-bold text-green-600 mb-1">{catalogOpportunity}%</p>
              <p className="text-xs font-medium text-gray-500">Selected region score</p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
          {/* Left: Map */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
            <div className="border-b border-gray-200 p-5 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Interactive India Map</h3>
                <p className="mt-0.5 text-xs font-medium text-gray-500">Click any state to view intelligence</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  Reset
                </button>
                <button className="rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800 transition-colors">
                  Find Highest Opportunity
                </button>
              </div>
            </div>

            {/* Heatmap Layer Controls */}
            <div className="border-b border-gray-100 px-5 py-3 flex items-center gap-3 bg-gray-50">
              <span className="text-xs font-medium text-gray-700">Layers:</span>
              {[
                { id: 'demand', label: 'Demand', active: heatmapLayers.demand },
                { id: 'festival', label: 'Festival', active: heatmapLayers.festival },
                { id: 'msme', label: 'MSME', active: heatmapLayers.msme },
                { id: 'catalogGap', label: 'Gaps', active: heatmapLayers.catalogGap },
              ].map(layer => (
                <button key={layer.id}
                  onClick={() => setHeatmapLayers({ ...heatmapLayers, [layer.id]: !layer.active })}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                    layer.active 
                      ? 'bg-gray-900 text-white' 
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}>
                  {layer.label}
                </button>
              ))}
            </div>

            <div className="p-6 bg-gray-50">
              <IndiaMap 
                regions={regions} 
                selectedRegion={selectedRegion} 
                onRegionSelect={handleRegionSelect} 
              />
            </div>
          </motion.div>

          {/* Right: Selected Region Intelligence */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <AnimatePresence mode="wait">
              {selectedRegion ? (
                <motion.div key="selected" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="space-y-4">
                  {/* Region Header */}
                  <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{selectedRegion.name}</h3>
                        <p className="text-xs text-gray-500 mt-0.5">{selectedRegion.description}</p>
                      </div>
                      <button onClick={() => setSelectedRegion(null)}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                        ✕
                      </button>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-gray-50 p-3">
                        <p className="text-xs font-bold text-gray-500">Demand Score</p>
                        <p className="mt-1 text-xl font-bold text-gray-900">{(selectedRegion as any).demandScore || 0}</p>
                      </div>
                      <div className="rounded-lg bg-gray-50 p-3">
                        <p className="text-xs font-bold text-gray-500">Opportunity</p>
                        <p className="mt-1 text-xl font-bold text-gray-900">
                          {Math.round(((selectedRegion as any).opportunityScore || 0) * 100)}%
                        </p>
                      </div>
                      <div className="rounded-lg bg-gray-50 p-3">
                        <p className="text-xs font-bold text-gray-500">Festival Ready</p>
                        <p className="mt-1 text-xl font-bold text-gray-900">{festivals.length}</p>
                      </div>
                      <div className="rounded-lg bg-gray-50 p-3">
                        <p className="text-xs font-bold text-gray-500">GI Products</p>
                        <p className="mt-1 text-xl font-bold text-gray-900">{giProducts.length}</p>
                      </div>
                    </div>
                  </div>

                  {/* Textiles */}
                  {textiles.length > 0 && (
                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Regional Textiles</h4>
                      <div className="space-y-2">
                        {textiles.slice(0, 5).map((textile, i) => (
                          <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                            <span className="text-sm text-gray-700">{textile.name}</span>
                            <span className="text-xs font-medium text-gray-500">{(textile as any).category || 'Textile'}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Trends */}
                  {trends.length > 0 && (
                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Customer Trends</h4>
                      <div className="space-y-2">
                        {trends.slice(0, 3).map((trend, i) => (
                          <div key={i} className="rounded-lg bg-gray-50 p-3">
                            <p className="text-sm font-medium text-gray-900">{(trend as any).trendName || 'Trend'}</p>
                            <p className="text-xs text-gray-600 mt-1">{trend.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <button onClick={() => navigate('/admin/catalog-gap')}
                    className="w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-medium text-white hover:bg-gray-800 transition-colors">
                    Analyze Catalog Gap →
                  </button>
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="rounded-xl border-2 border-dashed border-gray-300 bg-white p-12 text-center">
                  <div className="text-5xl mb-4">🗺️</div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Select a region</h3>
                  <p className="text-xs text-gray-500 max-w-xs mx-auto">
                    Click any state on the map to view AI-powered regional intelligence
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Regional Insights Grid */}
        {selectedRegion && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Regional Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Textiles Card */}
              <div className="rounded-lg border border-gray-200 bg-white p-5 hover:border-gray-300 hover:shadow-sm transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="rounded-lg bg-purple-50 p-2">
                    <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">Textiles</p>
                </div>
                <p className="text-2xl font-semibold text-gray-900 mb-1">{textiles.length}</p>
                <p className="text-xs text-gray-500">Traditional crafts</p>
              </div>

              {/* GI Products Card */}
              <div className="rounded-lg border border-gray-200 bg-white p-5 hover:border-gray-300 hover:shadow-sm transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="rounded-lg bg-green-50 p-2">
                    <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">GI Products</p>
                </div>
                <p className="text-2xl font-semibold text-gray-900 mb-1">{giProducts.length}</p>
                <p className="text-xs text-gray-500">Certified authentic</p>
              </div>

              {/* Festivals Card */}
              <div className="rounded-lg border border-gray-200 bg-white p-5 hover:border-gray-300 hover:shadow-sm transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="rounded-lg bg-orange-50 p-2">
                    <svg className="w-4 h-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">Festivals</p>
                </div>
                <p className="text-2xl font-semibold text-gray-900 mb-1">{festivals.length}</p>
                <p className="text-xs text-gray-500">Cultural events</p>
              </div>

              {/* Customer Trends Card */}
              <div className="rounded-lg border border-gray-200 bg-white p-5 hover:border-gray-300 hover:shadow-sm transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="rounded-lg bg-blue-50 p-2">
                    <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">Trends</p>
                </div>
                <p className="text-2xl font-semibold text-gray-900 mb-1">{trends.length}</p>
                <p className="text-xs text-gray-500">Active patterns</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* AI Summary Section */}
        {selectedRegion && festivals.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="mt-8 rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-blue-100 p-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">AI Regional Summary</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Our Opportunity Engine predicts increasing demand for <strong>{textiles[0]?.name || 'regional textiles'}</strong> over the next 21 days 
                  {festivals[0] && ` because ${festivals[0].name} is approaching on ${new Date(festivals[0].date).toLocaleDateString()}`}. 
                  Consider onboarding {giProducts.length} GI-certified sellers and expanding the {(textiles[0] as any)?.category || 'textile'} catalog in this region.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Regional Event Timeline */}
        {selectedRegion && festivals.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Regional Event Timeline</h2>
            <div className="rounded-xl border border-gray-200 bg-white p-6 overflow-x-auto">
              <div className="flex gap-4 min-w-max pb-4">
                {festivals.slice(0, 6).map((festival, i) => (
                  <div key={i} className="flex flex-col items-center w-40">
                    <div className="rounded-lg bg-purple-100 p-3 mb-3">
                      <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 text-center mb-1">{festival.name}</p>
                    <p className="text-xs text-gray-500 text-center">{new Date(festival.date).toLocaleDateString()}</p>
                    <div className="mt-3 h-px w-full bg-gray-200" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Recommended Actions */}
        {selectedRegion && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="mt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Recommended Actions</h2>
            <div className="rounded-xl border border-gray-200 bg-white p-6">
              <div className="space-y-3">
                {[
                  { action: `Expand ${(textiles[0] as any)?.category || 'textile'} inventory`, priority: 'High', status: 'Pending' },
                  { action: `Invite ${giProducts.length} GI-certified sellers`, priority: 'Medium', status: 'Ready' },
                  { action: `Launch ${festivals[0]?.name || 'Festival'} collection`, priority: 'High', status: 'Pending' },
                  { action: 'Notify sellers about upcoming demand', priority: 'Medium', status: 'Ready' },
                  { action: 'Update regional storefront', priority: 'Low', status: 'Scheduled' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900" />
                      <span className="text-sm text-gray-900">{item.action}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        item.priority === 'High' ? 'bg-red-100 text-red-700' :
                        item.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {item.priority}
                      </span>
                      <span className="text-xs text-gray-500">{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default RegionalIntelligence;
