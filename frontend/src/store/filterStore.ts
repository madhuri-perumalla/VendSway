// ============================================================================
// FILTER STORE
// ============================================================================
// Zustand store for filter state management

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ProductCategory, GapPriority, SellerStatus } from '@/types/shared';

interface FilterState {
  // Region filters
  regionId: string | null;
  setRegionId: (regionId: string | null) => void;
  
  // Category filters
  category: ProductCategory | null;
  setCategory: (category: ProductCategory | null) => void;
  
  // GI Tag filter
  giTagged: boolean | null;
  setGiTagged: (giTagged: boolean | null) => void;
  
  // MSME filter
  msme: boolean | null;
  setMsme: (msme: boolean | null) => void;
  
  // Priority filter
  priority: GapPriority | null;
  setPriority: (priority: GapPriority | null) => void;
  
  // Status filter
  status: SellerStatus | null;
  setStatus: (status: SellerStatus | null) => void;
  
  // Festival filter
  festivalId: string | null;
  setFestivalId: (festivalId: string | null) => void;
  
  // Date range filter
  dateFrom: string | null;
  dateTo: string | null;
  setDateRange: (dateFrom: string | null, dateTo: string | null) => void;
  
  // Search query
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Clear all filters
  clearFilters: () => void;
  
  // Active filters count
  activeFiltersCount: number;
}

export const useFilterStore = create<FilterState>()(
  persist(
    (set, get) => ({
      regionId: null,
      category: null,
      giTagged: null,
      msme: null,
      priority: null,
      status: null,
      festivalId: null,
      dateFrom: null,
      dateTo: null,
      searchQuery: '',
      
      setRegionId: (regionId) => set({ regionId }),
      setCategory: (category) => set({ category }),
      setGiTagged: (giTagged) => set({ giTagged }),
      setMsme: (msme) => set({ msme }),
      setPriority: (priority) => set({ priority }),
      setStatus: (status) => set({ status }),
      setFestivalId: (festivalId) => set({ festivalId }),
      setDateRange: (dateFrom, dateTo) => set({ dateFrom, dateTo }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      
      clearFilters: () => set({
        regionId: null,
        category: null,
        giTagged: null,
        msme: null,
        priority: null,
        status: null,
        festivalId: null,
        dateFrom: null,
        dateTo: null,
        searchQuery: '',
      }),
      
      get activeFiltersCount() {
        const state = get();
        let count = 0;
        if (state.regionId) count++;
        if (state.category) count++;
        if (state.giTagged !== null) count++;
        if (state.msme !== null) count++;
        if (state.priority) count++;
        if (state.status) count++;
        if (state.festivalId) count++;
        if (state.dateFrom || state.dateTo) count++;
        if (state.searchQuery) count++;
        return count;
      },
    }),
    {
      name: 'filter-storage',
    }
  )
);
