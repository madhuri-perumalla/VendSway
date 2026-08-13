// ============================================================================
// STATE DETAIL PANEL COMPONENT
// ============================================================================
// Responsive side panel for state details

import { motion } from 'framer-motion';
import { Region, Festival, Textile, GIProduct, RegionalTrend } from '@/types/domain';
import { Card, Badge } from '@/components/shared';
import { formatNumber } from '@/utils';

interface StateDetailPanelProps {
  region: Region;
  festivals: Festival[];
  textiles: Textile[];
  giProducts: GIProduct[];
  trends: RegionalTrend[];
  onClose: () => void;
}

const StateDetailPanel = ({
  region,
  festivals,
  textiles,
  giProducts,
  trends,
  onClose,
}: StateDetailPanelProps) => {
  return (
    <Card variant="elevated" className="sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{region.name}</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="space-y-6">
        {/* State Overview */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Overview</h3>
          <p className="text-gray-600 text-sm">{region.description}</p>
        </div>

        {/* Regional Textiles */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Regional Textiles</h3>
          <div className="space-y-2">
            {textiles.map((textile) => (
              <motion.div
                key={textile.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{textile.name}</p>
                  <p className="text-sm text-gray-600">{textile.description}</p>
                </div>
                {textile.giTagged && (
                  <Badge variant="success">GI Tagged</Badge>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* GI Products */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">GI Products</h3>
          <div className="space-y-2">
            {giProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 bg-primary-50 rounded-lg border border-primary-100"
              >
                <p className="font-medium text-gray-900">{product.name}</p>
                <p className="text-sm text-gray-600">{product.category}</p>
                <p className="text-xs text-gray-500 mt-1">Reg: {product.registrationNumber}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Major Festivals */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Major Festivals</h3>
          <div className="space-y-2">
            {festivals.map((festival) => (
              <motion.div
                key={festival.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-3 bg-secondary-50 rounded-lg border border-secondary-100"
              >
                <p className="font-medium text-gray-900">{festival.name}</p>
                <p className="text-sm text-gray-600">{festival.date}</p>
                <p className="text-xs text-gray-500 mt-1">{festival.fashionRelevance}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Textile Clusters */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Textile Clusters</h3>
          <div className="grid grid-cols-2 gap-2">
            {textiles.map((textile) => (
              <motion.div
                key={textile.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-2 bg-gray-100 rounded-lg text-center"
              >
                <p className="text-sm font-medium text-gray-900">{textile.name}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Fashion Traditions */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Fashion Traditions</h3>
          <div className="flex flex-wrap gap-2">
            {textiles.map((textile) => (
              <Badge key={textile.id} variant="primary">
                {textile.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Regional Highlights */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Regional Highlights</h3>
          <div className="space-y-2">
            {trends.map((trend) => (
              <motion.div
                key={trend.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-success-50 rounded-lg border border-success-100"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-900">{trend.category}</p>
                  <Badge variant="info">{trend.period}</Badge>
                </div>
                <p className="text-sm text-gray-600 mt-1">{trend.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-gray-500">Trend Score:</span>
                  <span className="text-sm font-semibold text-success-600">
                    {formatNumber(trend.trendScore)}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-primary-600">{textiles.length}</p>
              <p className="text-sm text-gray-600">Textiles</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-secondary-600">{giProducts.length}</p>
              <p className="text-sm text-gray-600">GI Products</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-success-600">{festivals.length}</p>
              <p className="text-sm text-gray-600">Festivals</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-warning-600">{trends.length}</p>
              <p className="text-sm text-gray-600">Trends</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StateDetailPanel;
