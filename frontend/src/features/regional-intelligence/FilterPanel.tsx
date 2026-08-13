// ============================================================================
// FILTER PANEL COMPONENT
// ============================================================================
// Filter functionality for regional intelligence

import { Card } from '@/components/shared';
import { Badge } from '@/components/shared';
import { useFilterStore } from '@/store';

const FilterPanel = () => {
  const {
    category,
    giTagged,
    setCategory,
    setGiTagged,
    clearFilters,
    activeFiltersCount,
  } = useFilterStore();

  const categories = [
    'Sarees',
    'Lehengas',
    'Kurtas',
    'Sherwanis',
    'Dupattas',
    'Fabrics',
  ];

  return (
    <Card variant="outlined" className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {activeFiltersCount > 0 && (
          <button
            onClick={clearFilters}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            Clear All ({activeFiltersCount})
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* GI Tagged Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            GI Tagged Only
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setGiTagged(true)}
              className={`px-3 py-1 rounded-full text-sm ${
                giTagged === true
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Yes
            </button>
            <button
              onClick={() => setGiTagged(false)}
              className={`px-3 py-1 rounded-full text-sm ${
                giTagged === false
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              No
            </button>
            <button
              onClick={() => setGiTagged(null)}
              className={`px-3 py-1 rounded-full text-sm ${
                giTagged === null
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(category === cat ? null : cat as any)}
                className={`px-3 py-1 rounded-full text-sm ${
                  category === cat
                    ? 'bg-secondary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-700 mb-2">Active Filters:</p>
            <div className="flex flex-wrap gap-2">
              {giTagged !== null && (
                <Badge variant="primary">
                  GI Tagged: {giTagged ? 'Yes' : 'No'}
                </Badge>
              )}
              {category && (
                <Badge variant="secondary">
                  Category: {category}
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default FilterPanel;
