import { useState } from 'react';
import { motion } from 'framer-motion';

interface RegionData {
  id: string;
  name: string;
  sellers: number;
  products: number;
  revenue: number;
  color: string;
}

interface IndiaMapProps {
  onRegionSelect?: (region: RegionData) => void;
  selectedRegion?: string | null;
}

const IndiaMap: React.FC<IndiaMapProps> = ({ onRegionSelect, selectedRegion }) => {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  // Mock region data - in production, this would come from API
  const regions: RegionData[] = [
    { id: 'north', name: 'North India', sellers: 45, products: 320, revenue: 1250000, color: '#8B5CF6' },
    { id: 'south', name: 'South India', sellers: 62, products: 450, revenue: 1800000, color: '#EC4899' },
    { id: 'east', name: 'East India', sellers: 28, products: 180, revenue: 720000, color: '#10B981' },
    { id: 'west', name: 'West India', sellers: 35, products: 240, revenue: 950000, color: '#F59E0B' },
    { id: 'central', name: 'Central India', sellers: 22, products: 150, revenue: 580000, color: '#3B82F6' },
    { id: 'northeast', name: 'North East', sellers: 15, products: 90, revenue: 350000, color: '#EF4444' },
  ];

  const selectedRegionData = regions.find(r => r.id === selectedRegion);
  const hoveredRegionData = regions.find(r => r.id === hoveredRegion);
  const displayData = selectedRegionData || hoveredRegionData;

  // Simplified SVG paths for India regions (stylized for demo)
  const regionPaths: Record<string, string> = {
    north: 'M 200 50 L 350 50 L 380 120 L 320 150 L 180 130 Z',
    south: 'M 200 250 L 350 250 L 380 320 L 320 380 L 180 350 Z',
    east: 'M 380 120 L 450 150 L 450 250 L 380 320 L 320 250 L 320 150 Z',
    west: 'M 50 120 L 180 130 L 180 350 L 50 320 Z',
    central: 'M 180 130 L 320 150 L 320 250 L 180 350 L 120 250 Z',
    northeast: 'M 380 50 L 450 50 L 450 150 L 380 120 Z',
  };

  return (
    <div className="w-full">
      <div className="flex gap-8">
        {/* Map */}
        <div className="flex-1 relative">
          <svg viewBox="0 0 500 400" className="w-full h-auto">
            {regions.map((region) => (
              <motion.g
                key={region.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: regions.indexOf(region) * 0.1 }}
              >
                <path
                  d={regionPaths[region.id]}
                  fill={selectedRegion === region.id ? region.color : '#E5E7EB'}
                  stroke={selectedRegion === region.id ? '#374151' : '#9CA3AF'}
                  strokeWidth={selectedRegion === region.id ? 3 : 2}
                  className="cursor-pointer transition-all duration-300 hover:opacity-80"
                  onMouseEnter={() => setHoveredRegion(region.id)}
                  onMouseLeave={() => setHoveredRegion(null)}
                  onClick={() => onRegionSelect?.(region)}
                  style={{
                    fillOpacity: selectedRegion === region.id ? 1 : hoveredRegion === region.id ? 0.7 : 0.5,
                  }}
                />
                <text
                  x={region.id === 'north' ? 280 : region.id === 'south' ? 280 : region.id === 'east' ? 400 : region.id === 'west' ? 100 : region.id === 'central' ? 220 : 420}
                  y={region.id === 'north' ? 100 : region.id === 'south' ? 300 : region.id === 'east' ? 200 : region.id === 'west' ? 220 : region.id === 'central' ? 250 : 100}
                  className="text-xs font-medium fill-gray-700 pointer-events-none"
                >
                  {region.name}
                </text>
              </motion.g>
            ))}
          </svg>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-3">
            {regions.map((region) => (
              <button
                key={region.id}
                onClick={() => onRegionSelect?.(region)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all ${
                  selectedRegion === region.id
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: region.color }}
                />
                {region.name}
              </button>
            ))}
          </div>
        </div>

        {/* Region Details Panel */}
        {displayData && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-80 bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">{displayData.name}</h3>
            
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
                <p className="text-sm text-gray-600 mb-1">Active Sellers</p>
                <p className="text-2xl font-bold text-purple-600">{displayData.sellers}</p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100">
                <p className="text-sm text-gray-600 mb-1">Total Products</p>
                <p className="text-2xl font-bold text-blue-600">{displayData.products}</p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
                <p className="text-sm text-gray-600 mb-1">Revenue</p>
                <p className="text-2xl font-bold text-green-600">₹{(displayData.revenue / 100000).toFixed(1)}L</p>
              </div>
            </div>

            {selectedRegion && (
              <button
                onClick={() => onRegionSelect?.(null as any)}
                className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Clear Selection
              </button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default IndiaMap;
