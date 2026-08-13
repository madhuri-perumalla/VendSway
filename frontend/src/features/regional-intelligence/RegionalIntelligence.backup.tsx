// ============================================================================
// REGIONAL INTELLIGENCE PAGE
// ============================================================================
// Main page for regional fashion intelligence

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { regionalIntelligenceService } from '@/services';
import { Region, Festival, Textile, GIProduct, RegionalTrend } from '@/types/domain';
import { Card } from '@/components/shared';
import IndiaMap from './IndiaMap';
import StateDetailPanel from './StateDetailPanel';

const RegionalIntelligence = () => {
  const navigate = useNavigate();
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [textiles, setTextiles] = useState<Textile[]>([]);
  const [giProducts, setGiProducts] = useState<GIProduct[]>([]);
  const [trends, setTrends] = useState<RegionalTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

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
    setIsPanelOpen(true);

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

  const heroRegion = useMemo(() => selectedRegion || regions[0], [selectedRegion, regions]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-primary-600">Regional Intelligence</p>
            <h2 className="mt-1 text-3xl font-semibold text-slate-900">Understand the region behind the demand signal</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Select a state to inspect its textiles, GI products, festivals, and demand context before you move to catalog planning.
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/catalog-gap')}
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
          >
            Analyze Catalog Gap
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card variant="elevated" className="overflow-hidden border border-slate-200 bg-white p-0 shadow-sm">
          <div className="border-b border-slate-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">Interactive India Map</p>
                <h3 className="mt-1 text-xl font-semibold text-slate-900">Tap a state to inspect local commerce signals</h3>
              </div>
            </div>
          </div>
          <div className="p-6">
            <IndiaMap regions={regions} selectedRegion={selectedRegion} onRegionSelect={handleRegionSelect} />
          </div>
        </Card>

        <AnimatePresence>
          {isPanelOpen && heroRegion ? (
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 16 }}>
              <StateDetailPanel
                region={heroRegion}
                festivals={festivals}
                textiles={textiles}
                giProducts={giProducts}
                trends={trends}
                onClose={() => setIsPanelOpen(false)}
              />
            </motion.div>
          ) : (
            <Card variant="elevated" className="border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-slate-500">Selected Region</p>
              <h3 className="mt-1 text-xl font-semibold text-slate-900">{heroRegion?.name || 'Choose a region'}</h3>
              <p className="mt-2 text-sm text-slate-600">{heroRegion?.description || 'Inspect a region to surface its textiles, GI products, festivals, and trend context.'}</p>
            </Card>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RegionalIntelligence;
